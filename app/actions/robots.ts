// Ported from develop: app/routes/robots[.]txt._index
//
// The `robots` action's body. The crawl delays and the sitemap line are
// develop's; anything but an indexable production site disallows everything,
// as the pages' `noindex` does. develop added `User-agent: * / Disallow: /`
// after its named groups, but a crawler obeys only the most specific group
// that names it (RFC 9309), so CCBot, Nutch and Baidu kept crawling staging.
// A closed site therefore has the one group.
import { IS_PRODUCTION, NO_INDEX, SITE_URL } from '../env.ts'

export const robotsTxt = ({
  indexable = IS_PRODUCTION && !NO_INDEX,
}: { indexable?: boolean } = {}): string =>
  [
    ...(indexable
      ? [
          'User-agent: CCBot',
          'Crawl-delay: 10',
          'User-agent: Nutch',
          'Crawl-delay: 10',
          'User-agent: baidu',
          'Crawl-delay: 10',
        ]
      : ['User-agent: *', 'Disallow: /']),
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ].join('\n')

export const robotsResponse = (): Response =>
  new Response(robotsTxt(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      // A day everywhere: whether the site is closed changes with a deploy
      // (NO_INDEX), and develop's week for shared caches would keep a launched
      // site disallowed for up to that long.
      'Cache-Control': 'public, max-age=86400',
    },
  })
