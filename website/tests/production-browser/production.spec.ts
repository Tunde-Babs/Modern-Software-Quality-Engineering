import { test, expect } from '@playwright/test';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

test('production CSP permits all nine representative searches with local public results', async ({ page, context }, testInfo) => {
  const requests: string[] = [], errors: string[] = [], violations: string[] = [];
  page.on('request', req => requests.push(req.url()));
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  await page.exposeFunction('recordViolation', (value: string) => violations.push(value));
  await page.addInitScript(() => document.addEventListener('securitypolicyviolation', event => {
    (window as unknown as { recordViolation: (value: string) => void }).recordViolation(event.violatedDirective);
  }));
  await page.goto('/');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow');
  await page.goto('/search/');
  const cases = [
    ['Playwright', /playwright|browser|automation/i], ['API testing', /api|contract/i],
    ['data quality', /data/i], ['observability', /observability|telemetry/i],
    ['AI quality', /ai|model|llm/i], ['metamorphic testing', /metamorphic|ai|test/i],
    ['security', /security|threat/i], ['performance', /performance|load/i],
    ['quality engineering', /quality|engineering/i],
  ] as const;
  const evidence = [];
  for (const [query, expected] of cases) {
    await page.locator('#search-query').fill(query);
    await page.locator('#search-query').press('Enter');
    await expect(page.locator('#search-status')).toContainText('Showing');
    const titles = await page.locator('#search-results a').allTextContents();
    expect(titles.some(title => expected.test(title))).toBeTruthy();
    const hrefs = await page.locator('#search-results a').evaluateAll(els => els.map(el => el.getAttribute('href')!));
    for (const href of hrefs) {
      expect(href).toMatch(/^\/(?:handbook|resources|paths)\//);
      const pathname = new URL(href, 'https://msqe.dev').pathname;
      expect(existsSync(resolve('dist', '.' + pathname, 'index.html'))).toBeTruthy();
    }
    evidence.push({ query, status: await page.locator('#search-status').textContent(), titles, hrefs });
  }
  await page.locator('#search-more').click();
  await expect(page.locator('#search-results li')).toHaveCount(20);
  expect(requests.every(url => url.startsWith('http://127.0.0.1:4325/'))).toBeTruthy();
  expect(errors).toEqual([]);
  expect(violations).toEqual([]);
  expect(await context.cookies()).toEqual([]);
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length }))).toEqual({ local: 0, session: 0 });
  await testInfo.attach('production-search-evidence', { body: JSON.stringify({ evidence, thirdPartyRequests: [], errors, violations }, null, 2), contentType: 'application/json' });
});

test('production headers, mobile keyboard navigation, license and static error recovery', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const response = await page.goto('/license/');
  const headers = response!.headers();
  expect(headers['content-security-policy']).toContain("frame-ancestors 'none'");
  expect(headers['x-content-type-options']).toBe('nosniff');
  expect(headers['x-frame-options']).toBe('DENY');
  expect(headers['strict-transport-security']).toBe('max-age=86400');
  await expect(page.locator('main')).toContainText('Copyright © 2026 Babatunde Ajala');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  const missing = await page.goto('/web5d-missing-route/');
  expect(missing!.status()).toBe(404);
  await expect(page.locator('h1')).toHaveText('Page not found');
  for (const route of ['/', '/handbook/', '/resources/', '/search/']) expect((await page.request.get(route)).status()).toBe(200);
  for (const route of ['/favicon.svg', '/favicon.ico', '/robots.txt', '/sitemap.xml']) expect((await page.request.get(route)).status()).toBe(200);
});
