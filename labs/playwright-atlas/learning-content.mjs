import { readFile } from 'node:fs/promises';

// Explicit teaching-source mappings only. Never accept a filesystem path from HTTP.
export const lessonIds = ["01-login", "02-search", "03-cart", "04-navigation", "05-validation", "06-locators", "07-async", "08-fixtures", "09-data-factories", "10-authentication-state", "11-api-setup", "12-cleanup", "13-http-errors", "14-slow-dependencies", "15-clock-control", "16-trace-triage", "17-parallel-isolation", "18-browser-projects", "19-ci-artifacts", "20-visual-checks", "21-accessibility", "22-risk-selection", "23-maintenance", "24-incident-capstone", "25-api-mocking", "26-advanced-fixtures", "27-page-component-models"];
const sharedSources = ['fixtures/atlas.ts', 'fixtures/advanced.ts', 'fixtures/model-fixtures.ts', 'fixtures/catalog.har', 'models/shop.page.ts', 'models/cart.component.ts', 'models/account.component.ts', 'models/product-card.component.ts'];
export const learningSources = new Map([
  ['/learning/setup.md', './README.md'],
  ['/learning/bridge.md', './bridge/README.md'],
  ['/learning/bridge.ts', './bridge/essentials.ts'],
  ['/learning/roadmap.md', './ROADMAP.md'],
  ['/learning/levels.md', './LEARNING_LEVELS.md'],
  ['/learning/assessment.md', './ASSESSMENT.md'],
  ...sharedSources.map(source => [`/learning/sources/${source}`, `./${source}`]),
  ...lessonIds.flatMap(id => [
    [`/learning/lessons/${id}.md`, `./lessons/${id}.md`],
    [`/learning/exercises/${id}.spec.ts`, `./exercises/${id}.spec.ts`],
    [`/learning/solutions/${id}.spec.ts`, `./solutions/${id}.spec.ts`],
  ]),
]);

export async function learningManifest() {
  const lessons = await Promise.all(lessonIds.map(async id => {
    const markdown = await readFile(new URL(`./lessons/${id}.md`, import.meta.url), 'utf8');
    const title = /^# (.+)$/m.exec(markdown)?.[1];
    const objective = /^## Objectives\s+([\s\S]+?)(?=\n## )/m.exec(markdown)?.[1].trim();
    if (!title || !objective) throw new Error(`Incomplete lesson: ${id}`);
    return { id, title, objective, duration: Number(id.slice(0, 2)) < 8 ? '30–45 min' : '30–60 min', document: `/learning/lessons/${id}.md`, exercise: `exercises/${id}.spec.ts`, starter: `/learning/exercises/${id}.spec.ts`, solution: `/learning/solutions/${id}.spec.ts` };
  }));
  return {
    lessons,
    sources: sharedSources.map(source => ({ source, route: `/learning/sources/${source}` })),
    documents: [
      { id: 'setup', title: 'Set up your first session', document: '/learning/setup.md', source: 'README.md' },
      { id: 'bridge', title: 'Your TypeScript bridge', document: '/learning/bridge.md', source: 'bridge/README.md' },
      { id: 'roadmap', title: 'The learning roadmap', document: '/learning/roadmap.md', source: 'ROADMAP.md' },
      { id: 'levels', title: 'Learning levels and capability map', document: '/learning/levels.md', source: 'LEARNING_LEVELS.md' },
      { id: 'assessment', title: 'Independent advanced-practice assessment', document: '/learning/assessment.md', source: 'ASSESSMENT.md' },
      ...lessons.map(lesson => ({ id: lesson.id, title: lesson.title, document: lesson.document, source: `lessons/${lesson.id}.md` })),
    ],
  };
}
