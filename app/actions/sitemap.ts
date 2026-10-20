// Ported from develop: app/routes/sitemap[.]xml._index and app/utils/sitemap.server.ts
//
// The `sitemap` action's body: the home page and the list in both languages,
// then every drink in both. `<lastmod>` is the deploy time (`DEPLOYED_AT`),
// which stands in for develop's Vite build time, and is left out where there
// is no deploy to date (wrangler dev, tests) rather than invented.
import { toVisitorStatus } from '../data/api-client.ts'
import { getDrinks, isDrinkId } from '../data/drinks.ts'
import { DEPLOYED_AT, SITE_URL } from '../env.ts'
import { routes } from '../routes.ts'
import { toDrinkHref, toDrinkId } from '../utils/drink-card.ts'
import { LANGS, toLangParam } from '../utils/i18n.ts'

type Changefreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

export type SitemapEntry = { path: string; priority: number; changefreq: Changefreq }

const XML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
}
const escapeXml = (value: string): string => value.replace(/[&<>"']/g, (c) => XML_ESCAPES[c]!)

export const toSitemapXml = (
  entries: SitemapEntry[],
  lastmod: string | undefined = DEPLOYED_AT
): string =>
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map(({ path, priority, changefreq }) =>
      [
        '  <url>',
        `    <loc>${escapeXml(`${SITE_URL}${path}`)}</loc>`,
        // The schema's order (a sequence: loc, lastmod, changefreq,
        // priority); develop wrote priority second, which validators reject.
        ...(lastmod ? [`    <lastmod>${escapeXml(lastmod)}</lastmod>`] : []),
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        '  </url>',
      ].join('\n')
    ),
    '</urlset>',
    '',
  ].join('\n')

const XML_HEADERS = { 'Content-Type': 'application/xml; charset=UTF-8' }

/**
 * The whole sitemap, or the API's failure. A failure keeps the XML content
 * type: the error page is for people, and a crawler reading a sitemap should
 * get its status, not an HTML page.
 */
export const sitemapResponse = async (): Promise<Response> => {
  // develop's `pageSize: -1`: every drink in one request.
  const drinks = await getDrinks({ page: 1, pageSize: -1 })
  if (!drinks.success) {
    return new Response(null, { status: toVisitorStatus(drinks), headers: XML_HEADERS })
  }

  const pages = LANGS.flatMap((lang): SitemapEntry[] => {
    const langParam = { lang: toLangParam(lang) }
    return [
      { path: routes.home.href(langParam), priority: 1, changefreq: 'weekly' },
      { path: routes.drinks.index.href(langParam), priority: 0.5, changefreq: 'weekly' },
    ]
  })
  // A drink whose id names no page (a slug of `.`) would only list a 404.
  const drinkPages = drinks.data.list
    .filter((drink) => isDrinkId(toDrinkId(drink)))
    .flatMap((drink) =>
      LANGS.map((lang): SitemapEntry => ({
        path: toDrinkHref(drink, lang),
        priority: 0.5,
        changefreq: 'weekly',
      }))
    )
  const entries = [...pages, ...drinkPages]

  return new Response(toSitemapXml(entries), {
    headers: {
      ...XML_HEADERS,
      'Cache-Control': 'public, max-age=3600, s-maxage=7200, stale-while-revalidate=86400',
    },
  })
}
