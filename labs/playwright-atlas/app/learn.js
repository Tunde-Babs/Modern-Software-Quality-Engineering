import { renderLesson } from '/lesson-renderer.js';

const $ = id => document.getElementById(id);
const storageKey = 'atlas-learning-progress-v1';
const stages = { 'not-started': 'Not started', 'in-progress': 'Working on it', practised: 'Practised independently' };
let progress = {};
let storageAvailable = true;
try {
  const stored = JSON.parse(localStorage.getItem(storageKey) ?? '{}');
  if (stored && typeof stored === 'object' && !Array.isArray(stored)) progress = stored;
} catch { /* Invalid progress starts empty; content and tests remain available. */ }
let manifest;
let activeLesson;
let activeDocument;
let selectionController;
let selectionVersion = 0;

async function getText(url, signal) {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Could not load ${url}`);
  return response.text();
}
function stateFor(id) {
  const saved = progress[id];
  return {
    stage: saved && Object.hasOwn(stages, saved.stage) ? saved.stage : 'not-started',
    note: typeof saved?.note === 'string' ? saved.note : '',
  };
}
function renderProgress() {
  const count = manifest.lessons.filter(lesson => stateFor(lesson.id).stage === 'practised').length;
  $('progress-count').textContent = `${count} / ${manifest.lessons.length}`;
  $('track-progress').value = count;
  for (const lesson of manifest.lessons) {
    const link = document.querySelector(`[data-lesson="${lesson.id}"]`);
    link.querySelector('.lab-state').textContent = stages[stateFor(lesson.id).stage];
    if (activeLesson?.id === lesson.id) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
}
function saveProgress() {
  if (!activeLesson) return;
  progress[activeLesson.id] = { stage: $('practice-state').value, note: $('evidence-note').value };
  try {
    localStorage.setItem(storageKey, JSON.stringify(progress));
    storageAvailable = true;
  } catch { storageAvailable = false; }
  $('save-status').textContent = storageAvailable ? 'Saved in this browser.' : 'Browser storage unavailable. Copy your note before leaving; changes are only in memory.';
  renderProgress();
}
function resolveLink(target) {
  if (/^https?:\/\//.test(target)) return target;
  if (/^[a-z][a-z\d+.-]*:/i.test(target) || target.startsWith('//')) return null;
  if (target.startsWith('#')) return null;
  const resolved = new URL(target, `https://lesson.invalid/${activeDocument.source}`).pathname.slice(1);
  const document = manifest.documents.find(entry => entry.source === resolved);
  if (document) return `#${document.id}`;
  if (activeLesson && resolved === `solutions/${activeLesson.id}.spec.ts`) return `#${activeLesson.id}/solution`;
  if (activeLesson && resolved === activeLesson.exercise) return activeLesson.starter;
  if (resolved === 'bridge/essentials.ts') return '/learning/bridge.ts';
  return null;
}
function renderNavigation() {
  for (const [index, lesson] of manifest.lessons.entries()) {
    const li = document.createElement('li'), link = document.createElement('a');
    link.href = `#${lesson.id}`; link.className = 'lab-link'; link.dataset.lesson = lesson.id;
    const number = document.createElement('span'); number.className = 'lab-number'; number.textContent = String(index + 1).padStart(2, '0');
    const text = document.createElement('span'), name = document.createElement('span'), stage = document.createElement('span');
    name.className = 'lab-name'; name.textContent = lesson.title.replace(/^Lab \d+ — /, '');
    stage.className = 'lab-state';
    text.append(name, stage); link.append(number, text); li.append(link); $('lab-list').append(li);
  }
  renderProgress();
}
async function revealSolution() {
  if (!activeLesson) return;
  const lesson = activeLesson, version = selectionVersion;
  $('reveal-solution').disabled = true;
  try {
    const source = await getText(lesson.solution, selectionController.signal);
    if (version !== selectionVersion) return;
    $('solution-code').textContent = source;
    $('solution-panel').hidden = false;
    $('reveal-solution').setAttribute('aria-expanded', 'true');
    $('reveal-solution').textContent = 'Hide worked solution';
  } catch (error) {
    if (error.name !== 'AbortError' && version === selectionVersion) $('interaction-status').textContent = 'Could not load the solution. Try again.';
  } finally { if (version === selectionVersion) $('reveal-solution').disabled = false; }
}
function renderGuide(markdown) {
  if (!activeLesson) return renderLesson(markdown, resolveLink);
  const sections = markdown.split(/(?=^## )/m);
  const primary = new Set(['Problem Statement', 'Tasks', 'Stretch Goals', 'Validation', 'Reflection Questions', 'Next Steps']);
  const main = [], context = [];
  for (const section of sections) {
    const title = /^## (.+)$/m.exec(section)?.[1];
    if (!title) continue;
    (primary.has(title) ? main : context).push(section);
  }
  const content = renderLesson(main.join('\n'), resolveLink);
  const details = document.createElement('details'), summary = document.createElement('summary');
  summary.textContent = 'Prerequisites, setup and full lesson context';
  details.append(summary, renderLesson(context.join('\n'), resolveLink));
  content.append(details);
  return content;
}
async function selectDocument(focus = false) {
  const fragment = location.hash.slice(1) || '01-login';
  const showAnswer = fragment.endsWith('/solution');
  const id = showAnswer ? fragment.slice(0, -'/solution'.length) : fragment;
  const document = manifest.documents.find(entry => entry.id === id);
  if (!document) { location.replace('#01-login'); return; }
  selectionController?.abort();
  selectionController = new AbortController();
  const version = ++selectionVersion;
  activeDocument = document;
  activeLesson = manifest.lessons.find(lesson => lesson.id === id);
  $('workspace-error').hidden = true;
  $('interaction-status').textContent = '';
  $('lesson-title').textContent = document.title;
  $('lesson-objective').textContent = activeLesson?.objective ?? 'A small bridge from exploring the shop to explaining your own browser checks.';
  $('lesson-kicker').textContent = activeLesson ? `LAB ${manifest.lessons.indexOf(activeLesson) + 1} OF 7 · DRAFT COMPANION` : 'GET READY TO PRACTISE · DRAFT COMPANION';
  $('lesson-duration').textContent = activeLesson?.duration ?? (id === 'bridge' ? '20–30 min' : 'Reference');
  $('lesson-content').replaceChildren(); $('lesson-content').setAttribute('aria-busy', 'true');
  $('solution-panel').hidden = true; $('solution-code').textContent = '';
  $('reveal-solution').setAttribute('aria-expanded', 'false'); $('reveal-solution').textContent = 'Reveal worked solution'; $('reveal-solution').disabled = false;
  $('starter-details').open = false; $('starter-code').textContent = 'Loading source…';
  for (const element of ['attempt-tools', 'progress-tools', 'solution-tools']) $(element).hidden = !activeLesson;
  $('support-tools').hidden = !!activeLesson;
  if (activeLesson) {
    $('exercise-file').textContent = activeLesson.exercise;
    $('run-command').textContent = `npm test -- ${id} --headed`;
    $('debug-command').textContent = `npm test -- ${id} --debug`;
    $('solution-command').textContent = `npm run test:solutions -- ${id}`;
    const saved = stateFor(id);
    $('practice-state').value = saved.stage; $('evidence-note').value = saved.note;
    $('save-status').textContent = storageAvailable ? 'Saved only in this browser; no grading.' : 'Browser storage unavailable; notes are only in memory.';
    const index = manifest.lessons.indexOf(activeLesson);
    $('previous-lesson').href = `#${manifest.lessons[index - 1]?.id ?? 'bridge'}`;
    $('previous-lesson').textContent = index ? `← Lab ${index}` : '← TypeScript bridge';
    $('next-lesson').href = `#${manifest.lessons[index + 1]?.id ?? 'roadmap'}`;
    $('next-lesson').textContent = index < 6 ? `Next: Lab ${index + 2} →` : 'Next: learning roadmap →';
  } else {
    $('previous-lesson').href = '#setup'; $('previous-lesson').textContent = '← Setup';
    $('next-lesson').href = '#01-login'; $('next-lesson').textContent = 'Start Lab 1 →';
  }
  renderProgress();
  try {
    const markdown = await getText(document.document, selectionController.signal);
    if (version !== selectionVersion) return;
    $('lesson-content').append(renderGuide(markdown));
    if (showAnswer && activeLesson) {
      await revealSolution();
      if (version === selectionVersion) $('solution-tools').scrollIntoView({ block: 'start' });
    } else if (focus) {
      $('lesson-title').focus({ preventScroll: true });
      $('lesson-title').scrollIntoView({ block: 'start' });
    }
  } catch (error) {
    if (error.name !== 'AbortError' && version === selectionVersion) {
      $('workspace-error').textContent = 'This guide could not load. Check the local server and reload the page to retry.';
      $('workspace-error').hidden = false;
    }
  } finally { if (version === selectionVersion) $('lesson-content').setAttribute('aria-busy', 'false'); }
}
$('practice-state').addEventListener('change', saveProgress);
$('evidence-note').addEventListener('input', saveProgress);
document.querySelector('.skip').addEventListener('click', event => {
  event.preventDefault();
  $('lesson-title').focus({ preventScroll: true });
  $('lesson-title').scrollIntoView({ block: 'start' });
});
$('copy-run').addEventListener('click', async () => {
  const command = $('run-command').textContent;
  try { await navigator.clipboard.writeText(command); $('interaction-status').textContent = 'Command copied. Paste it into Terminal from labs/playwright-atlas.'; }
  catch { $('interaction-status').textContent = `Copy this command into Terminal: ${command}`; }
});
$('starter-details').addEventListener('toggle', async () => {
  if (!$('starter-details').open || !activeLesson) return;
  const version = selectionVersion;
  try {
    const source = await getText(activeLesson.starter, selectionController.signal);
    if (version === selectionVersion) $('starter-code').textContent = source;
  } catch (error) { if (error.name !== 'AbortError' && version === selectionVersion) $('starter-code').textContent = 'Could not load the exercise. Reopen to retry.'; }
});
$('reveal-solution').addEventListener('click', () => {
  if ($('solution-panel').hidden) void revealSolution();
  else {
    $('solution-panel').hidden = true; $('reveal-solution').setAttribute('aria-expanded', 'false'); $('reveal-solution').textContent = 'Reveal worked solution';
  }
});
// An inline answer-key link may already be the current fragment after hiding it.
$('lesson-content').addEventListener('click', event => {
  const anchor = event.target.closest('a');
  const href = anchor?.getAttribute('href');
  if (href?.endsWith('/solution') && location.hash === href) { event.preventDefault(); void revealSolution(); }
});
try {
  const response = await fetch('/learning/manifest.json');
  if (!response.ok) throw new Error('Manifest unavailable');
  manifest = await response.json();
  renderNavigation();
  window.addEventListener('hashchange', () => void selectDocument(true));
  await selectDocument();
} catch {
  $('lesson-title').textContent = 'Your workspace could not load';
  $('workspace-error').textContent = 'Restart the updated local server, then reload this page. Your exercise files are unchanged.';
  $('workspace-error').hidden = false;
}
