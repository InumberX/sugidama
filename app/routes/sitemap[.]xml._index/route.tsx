import { getSitemap } from '~/utils/sitemap.server'

export async function loader() {
  const sitemap = await getSitemap()

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=7200, stale-while-revalidate=86400',
      'xml-version': '1.0',
      encoding: 'UTF-8',
    },
  })
}
