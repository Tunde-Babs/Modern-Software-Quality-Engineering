import { registry, resourceCollections } from '../lib/content/registry';
import { learningPaths } from '../lib/paths';
export function GET() {
  const routes = ['/', '/handbook/', '/resources/', '/paths/', ...learningPaths.map(path => path.route), ...resourceCollections.map(collection => collection.route), ...[...registry.values()].map(entry => entry.route)].sort();
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(route => `<url><loc>https://msqe.dev${route}</loc></url>`).join('')}</urlset>`, { headers: { 'Content-Type': 'application/xml' } });
}
