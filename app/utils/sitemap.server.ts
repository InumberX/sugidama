import { LANG } from '~/config/consts'
import { SITE_URL } from '~/config/env'
import { LASTMOD } from '~/config/env'
import { PAGES } from '~/config/paths'
import { getDrinks } from '~/server/api/drinks.server'
import { convertError } from '~/server/api/error.server'

type Sitemap = {
  url: string
  priority: number
  lastmod?: string
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
}

const staticUrls: Sitemap[] = [
  ...Object.values(LANG)
    .map((lang) => {
      return [
        {
          url: PAGES.SG10_100.getUrl({
            lang,
          }),
          priority: 1,
          lastmod: LASTMOD,
          changefreq: 'weekly' as const,
        },
        {
          url: PAGES.SG20_100.getUrl({
            lang,
          }),
          priority: 0.5,
          lastmod: LASTMOD,
          changefreq: 'weekly' as const,
        },
      ]
    })
    .flat(),
]

export const getSitemap = async (): Promise<string> => {
  const urls: Sitemap[] = [...staticUrls]

  const drinksResult = await getDrinks({
    page: 1,
    pageSize: -1,
  })

  if (!drinksResult.success) {
    throw convertError(drinksResult)
  }

  const drinks = drinksResult.data.list

  urls.push(
    ...drinks
      .map((drink) => {
        return [
          ...Object.values(LANG).map((lang) => {
            return {
              url: PAGES.SG20_101.getUrl({
                lang,
                params: {
                  drinkId: drink.slug || drink.topics_id,
                },
              }),
              priority: 0.5,
              lastmod: LASTMOD,
              changefreq: 'weekly' as const,
            }
          }),
        ]
      })
      .flat()
  )

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ url, priority, changefreq, lastmod }) => `  <url>
    <loc>${SITE_URL}${url}</loc>
    <priority>${priority}</priority>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
    ${changefreq ? `<changefreq>${changefreq}</changefreq>` : ''}
  </url>`
  )
  .join('\n')}
</urlset>`

  return sitemap
}
