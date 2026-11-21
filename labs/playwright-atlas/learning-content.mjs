import { readFile } from 'node:fs/promises';

// Explicit teaching-source mappings only. Never accept a filesystem path from HTTP.
export const lessonIds = ["01-login", "02-search", "03-cart", "04-navigation", "05-validation", "06-locators", "07-async", "08-fixtures", "09-data-factories", "10-authentication-state", "11-api-setup", "12-cleanup", "13-http-errors", "14-slow-dependencies", "15-clock-control", "16-trace-triage", "17-parallel-isolation", "18-browser-projects", "19-ci-artifacts", "20-visual-checks", "21-accessibility", "22-risk-selection", "23-maintenance", "24-incident-capstone"];
export const learningSources = new Map([
  ['/learning/setup.md', './README.md'],
  ['/learning/bridge.md', './bridge/README.md'],
  ['/learning/bridge.ts', './bridge/essentials.ts'],
  ['/learning/roadmap.md', './ROADMAP.md'],
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
    documents: [
      { id: 'setup', title: 'Set up your first session', document: '/learning/setup.md', source: 'README.md' },
      { id: 'bridge', title: 'Your TypeScript bridge', document: '/learning/bridge.md', source: 'bridge/README.md' },
      { id: 'roadmap', title: 'The learning roadmap', document: '/learning/roadmap.md', source: 'ROADMAP.md' },
      ...lessons.map(lesson => ({ id: lesson.id, title: lesson.title, document: lesson.document, source: `lessons/${lesson.id}.md` })),
    ],
  };
}
