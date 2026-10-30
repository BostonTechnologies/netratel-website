import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
export const GET: APIRoute = async ({ site }) => {
 const docs = await getCollection('docs');
 const paths = ['/', '/releases/', ...docs.filter(d => !d.data.draft).map(d => `/${d.id.replace(/\/index$/, '')}/`)];
 return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[...new Set(paths)].map(p => `<url><loc>${new URL(p, site)}</loc></url>`).join('')}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
