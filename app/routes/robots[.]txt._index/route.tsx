import { SITE_URL, NO_INDEX, NODE_ENV } from '~/config/env'

export async function loader() {
  const robots = `User-agent: CCBot
Crawl-delay: 10
User-agent: Nutch
Crawl-delay: 10
User-agent: baidu
Crawl-delay: 10
Sitemap: ${SITE_URL}/sitemap.xml
${
  NODE_ENV !== 'production' || NO_INDEX === 'true'
    ? `User-agent: *
Disallow: /
`
    : ''
}
`

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=604800',
    },
  })
}
