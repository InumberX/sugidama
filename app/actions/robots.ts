// Ported from develop: app/routes/robots[.]txt._index
//
// The `robots` action's body. The crawl delays and the sitemap line are
// develop's; anything but an indexable production site disallows everything,
// as the pages' `noindex` does.
import { IS_PRODUCTION, NO_INDEX, SITE_URL } from '../env.ts'

export const robotsTxt = ({
  indexable = IS_PRODUCTION && !NO_INDEX,
}: { indexable?: boolean } = {}): string =>
  [
    'User-agent: CCBot',
    'Crawl-delay: 10',
    'User-agent: Nutch',
    'Crawl-delay: 10',
    'User-agent: baidu',
    'Crawl-delay: 10',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    ...(indexable ? [] : ['User-agent: *', 'Disallow: /']),
    '',
  ].join('\n')

export const robotsResponse = (): Response =>
  new Response(robotsTxt(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=604800',
    },
  })
