export function GET() {
  const production = import.meta.env.MSQE_INDEXING === 'production';
  return new Response(`User-agent: *\n${production ? 'Allow: /\nDisallow: /search/\n' : 'Disallow: /\n'}Sitemap: https://msqe.dev/sitemap.xml\n`, { headers: { 'Content-Type': 'text/plain' } });
}
