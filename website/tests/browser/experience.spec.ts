import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { loadParts } from '../../src/lib/content/loader';

const samples = ['/', '/handbook/', '/search/', '/resources/', '/paths/qa-foundations/', ...[0, 2, 5, 8, 11].map(index => loadParts()[index].chapters[0].route)];
const sizes = [{ name: 'desktop', width: 1440, height: 1000, zoom: 1 }, { name: 'tablet', width: 768, height: 1024, zoom: 1 }, { name: 'mobile', width: 375, height: 812, zoom: 1 }, { name: '200-percent', width: 1440, height: 1000, zoom: 2 }];
for (const size of sizes) for (const route of samples) {
  test(`${size.name}: ${route}`, async ({ page }) => {
    await page.setViewportSize({ width: size.width, height: size.height });
    await page.goto(route);
    // CSS zoom exercises 200% layout scaling; native browser zoom is separately observed.
    if (size.zoom === 2) await page.evaluate(() => { document.documentElement.style.zoom = '2'; });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await expect(page.locator('h1')).toHaveCount(1);
    await page.keyboard.press('Tab');
    await expect(page.locator('.skip-link')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main-content')).toBeFocused();
    const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    expect(scan.violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => node.target) }))).toEqual([]);
    if (route === '/' || route === '/search/' || (size.name === 'mobile' && route === samples.at(-1))) {
      await page.screenshot({ path: `artifacts/${size.name}-${route === '/' ? 'home' : route === '/search/' ? 'search' : 'chapter'}.png` });
    }
  });
}
async function tabTo(page: Page, selector: string, limit = 220) {
  for (let i = 0; i < limit; i++) {
    if (await page.locator(selector).evaluateAll(elements => elements.some(element => element === document.activeElement))) return;
    await page.keyboard.press('Tab');
  }
  throw new Error(`Keyboard could not reach ${selector}`);
}
test('keyboard-only header, search, results, TOC, chapter and resource navigation', async ({ page }) => {
  await page.goto('/');
  await tabTo(page, '#primary-navigation a[href="/search/"]');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/search\/$/);
  await tabTo(page, '#search-query');
  await page.keyboard.type('Playwright');
  await page.keyboard.press('Enter');
  await expect(page.locator('#search-results a').first()).toBeVisible();
  await tabTo(page, '#search-results a');
  await page.keyboard.press('Enter');
  await expect(page.locator('article.prose')).toBeVisible();
  await page.goto(samples[5]);
  await tabTo(page, 'nav[aria-label="Table of contents"] a');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#/);
  await page.goto(samples[5]);
  await tabTo(page, 'nav[aria-label="Chapter navigation"] a[rel="next"]');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/chapter-02-/);
  await page.goto('/resources/');
  await tabTo(page, '.curriculum a');
  await page.keyboard.press('Enter');
  await expect(page.locator('.resource-context')).toBeVisible();
  await page.goto('/paths/qa-foundations/');
  await tabTo(page, '.curriculum a');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/part-01\/chapter-01-/);
});
test('representative search queries return relevant destinations and handle empty/no results', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('/search/');
  await expect(page.locator('#search-status')).toContainText('Enter a term');
  const cases = [
    ['Playwright', /playwright|browser|automation/i], ['API testing', /api|contract/i],
    ['data quality', /data/i], ['observability', /observability|telemetry/i],
    ['AI quality', /ai|model|llm/i], ['metamorphic testing', /metamorphic|ai|test/i],
    ['security', /security|threat/i], ['performance', /performance|load/i],
    ['quality engineering', /quality|engineering/i], ['"metamorphic testing"', /metamorphic|test|ai/i],
  ] as const;
  const evidence = [];
  for (const [query, expected] of cases) {
    await page.locator('#search-query').fill(query);
    await page.locator('#search-query').press('Enter');
    await expect(page.locator('#search-status')).toContainText('Showing');
    const titles = await page.locator('#search-results a').allTextContents();
    expect(titles.slice(0, 10).some(title => expected.test(title))).toBeTruthy();
    const hrefs = await page.locator('#search-results a').evaluateAll(elements => elements.map(element => element.getAttribute('href')));
    expect(hrefs.every(href => !href?.includes('404') && !href?.startsWith('/search/'))).toBeTruthy();
    evidence.push({ query, status: await page.locator('#search-status').textContent(), titles, hrefs });
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  }
  await page.screenshot({ path: 'artifacts/mobile-search-results.png', fullPage: true });
  const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  expect(scan.violations).toEqual([]);
  await page.locator('#search-query').fill('zzzzmsqenoresult999999');
  await page.locator('#search-query').press('Enter');
  await expect(page.locator('#search-status')).toContainText('No results');
  await expect(page.locator('#search-results li')).toHaveCount(0);
  await page.locator('#search-query').fill('');
  await page.locator('#search-query').press('Enter');
  await expect(page.locator('#search-status')).toContainText('Enter a term');
  expect(requests.every(url => url.startsWith('http://127.0.0.1:4324/'))).toBeTruthy();
  await testInfo.attach('search-evidence', { body: JSON.stringify(evidence, null, 2), contentType: 'application/json' });
});
test('search load failure remains actionable; favicon resolves; resources remain inert', async ({ page }) => {
  await page.route('**/pagefind/**', route => route.abort());
  await page.goto('/search/');
  await page.locator('#search-query').fill('Playwright');
  await page.locator('#search-query').press('Enter');
  await expect(page.locator('#search-status')).toContainText('Search could not load');
  expect((await page.request.get('/favicon.svg')).status()).toBe(200);
  expect((await page.request.get('/favicon.ico')).status()).toBe(200);
  await page.goto('/resources/code/part-02/capstone-quality-engineering-toolkit/docs/');
  await expect(page.locator('.curriculum a')).toHaveCount(5);
  await expect(page.locator('script')).toHaveCount(0);
  const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  expect(scan.violations).toEqual([]);
});
