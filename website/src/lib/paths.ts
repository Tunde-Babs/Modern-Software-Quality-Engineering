import { loadParts } from './content/loader';

// The canonical Part I curriculum supplies the sequence; no job-readiness claim.
export const learningPaths = [{
  slug: 'qa-foundations', route: '/paths/qa-foundations/', title: 'QA Foundations',
  purpose: 'Build a shared understanding of quality as an engineering responsibility.',
  audience: 'Learners beginning the handbook or moving from testing into quality engineering.',
  evidence: 'Follows all ten chapters of Part I in their canonical curriculum order. Continue into Part II for programming.',
  chapters: loadParts()[0].chapters,
}];
