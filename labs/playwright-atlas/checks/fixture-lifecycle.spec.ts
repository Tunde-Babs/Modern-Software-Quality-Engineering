import { test, expect } from '@playwright/test';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

test('fixture teardown and automatic evidence survive a deliberately failed test body', async ({ request, baseURL }, testInfo) => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const directory = join(root, 'artifacts', 'fixture-failure');
  await mkdir(directory, { recursive: true });
  const owned = join(directory, 'owned.json');
  const report = join(directory, 'report.json');
  const config = join(directory, 'playwright.config.mjs');
  const spec = join(directory, 'intentional.spec.ts');
  await writeFile(config, `export default ${JSON.stringify({ testDir: directory, testMatch: 'intentional.spec.ts', workers: 1, retries: 0, outputDir: join(directory, 'results'), reporter: [['json', { outputFile: report }]], use: { baseURL, browserName: 'chromium', headless: true } })};\n`);
  await writeFile(spec, `import { test } from '../../fixtures/advanced.js';\nimport { writeFile } from 'node:fs/promises';\ntest('controlled fixture failure', async ({ seededShop, workspace }) => {\n  await writeFile(${JSON.stringify(owned)}, JSON.stringify({ id: workspace.id }));\n  throw new Error('INTENTIONAL_FIXTURE_REVIEW_FAILURE');\n});\n`);
  let id: string | undefined;
  try {
    const exitCode = await new Promise<number | null>((resolve, reject) => {
      const child = spawn(process.execPath, ['node_modules/playwright/cli.js', 'test', '--config', config], { cwd: root, stdio: 'pipe' });
      const timer = setTimeout(() => { child.kill('SIGTERM'); reject(new Error('Child fixture demonstration exceeded its deadline')); }, 10000);
      child.stdout.resume(); child.stderr.resume();
      child.on('error', error => { clearTimeout(timer); reject(error); });
      child.on('close', code => { clearTimeout(timer); resolve(code); });
    });
    expect(exitCode).toBe(1);
    const result = JSON.parse(await readFile(report, 'utf8'));
    const results = result.suites.flatMap((suite: { specs: { tests: { results: unknown[] }[] }[] }) => suite.specs.flatMap(spec => spec.tests.flatMap(test => test.results))) as { status: string; error: { message: string }; attachments: { name: string; body?: string; path?: string }[] }[];
    expect(results).toHaveLength(1);
    expect(results[0].status).toBe('failed');
    expect(results[0].error.message).toContain('INTENTIONAL_FIXTURE_REVIEW_FAILURE');
    const evidence = results[0].attachments.find(attachment => attachment.name === 'fixture-scope');
    expect(evidence).toBeTruthy();
    id = JSON.parse(await readFile(owned, 'utf8')).id;
    const content = evidence!.body ? Buffer.from(evidence!.body, 'base64').toString('utf8') : await readFile(evidence!.path!, 'utf8');
    expect(JSON.parse(content)).toMatchObject({ workspace: id, status: 'failed' });
    expect((await request.get(`/api/workspaces/${id}/state`)).status()).toBe(404);
    await testInfo.attach('expected-child-failure', { path: report, contentType: 'application/json' });
  } finally {
    // Fallback cleanup cannot convert a failed absence assertion into a pass.
    if (!id) { try { id = JSON.parse(await readFile(owned, 'utf8')).id; } catch { /* No workspace was created. */ } }
    if (id) await request.delete(`/api/workspaces/${id}`);
  }
});
