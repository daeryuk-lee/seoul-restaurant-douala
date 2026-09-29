/** Plan du site avec les équivalences linguistiques (hreflang) de chaque page. */
import type { APIRoute } from 'astro';
import { site } from '../config/site';
import { defaultLocale, localeMeta, locales, pageIds, pathTo } from '../i18n/locales';

const abs = (path: string) => new URL(path, site.url).href;
const priority = { home: '1.0', menu: '0.9', reservation: '0.8', visit: '0.8', legal: '0.2', privacy: '0.2' } as const;

export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = locales.flatMap((locale) =>
    pageIds.map((page) => {
      const alternates = [
        ...locales.map((l) => `    <xhtml:link rel="alternate" hreflang="${localeMeta[l].hreflang}" href="${abs(pathTo(l, page))}"/>`),
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(pathTo(defaultLocale, page))}"/>`,
      ].join('\n');
      return `  <url>\n    <loc>${abs(pathTo(locale, page))}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>${priority[page]}</priority>\n${alternates}\n  </url>`;
    }),
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
