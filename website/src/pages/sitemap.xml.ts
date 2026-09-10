import { registry } from '../lib/content/registry';
export function GET() {
  const routes = ['/', '/handbook/', '/resources/', ...[...registry.values()].map(entry => entry.route)].sort();
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(route => `<url><loc>https://msqe.dev${route}</loc></url>`).join('')}</urlset>`, { headers: { 'Content-Type': 'application/xml' } });
}
