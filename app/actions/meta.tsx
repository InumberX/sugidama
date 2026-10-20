// Ported from auba-general-view: app/utils/meta.ts (`getMetadata`).
//
// React Router collects `MetaDescriptor[]` and renders them for you. Remix 3
// has no meta API — `Document` owns `<head>` — so this returns the tags
// themselves, and `Document` places them. The site-wide defaults live here; a
// page overrides only what differs.
import type { RemixNode } from 'remix/component'

import { IS_PRODUCTION, NO_INDEX, SITE_NAME, SITE_URL } from '../env.ts'
import { defineMessages, type Lang } from '../utils/i18n.ts'

// develop's SITE_INFO (app/config/consts.ts). The base title is
// `${siteName} | ${titleNote}`, and SITE_NAME stays in it: it is what marks
// staging as "Sugidama(Staging)".
const SITE_INFO = defineMessages({
  ja: {
    titleNote: 'お酒の銘柄、製造元、味わいを紹介',
    description:
      'このサイトでは、管理人がこれまで飲んできた美味しいお酒を独断と偏見で記録しています。銘柄、製造元、味わいの特徴を紹介し、気になるお酒があれば販売サイトもご覧いただけます。',
  },
  en: {
    titleNote: 'Brand, Manufacturer, and Taste of Sake',
    description:
      "This site is a personal archive of drinks I've enjoyed, with notes on makers, flavors, and where to buy them.",
  },
})

export const DEFAULT_OG_IMAGE = '/assets/img/img-ogp.jpg'

export type OgType = 'website' | 'article'
export type TwitterCard = 'summary_large_image' | 'summary' | 'player' | 'app'
export type RobotsDirective = 'noindex' | 'nofollow' | 'noindex, nofollow'

export type PageMeta = {
  /** Page title. Rendered as `<title> | SITE_NAME`; omit for the site's base title. */
  title?: string
  description?: string
  /** Absolute URL, or a path resolved against `SITE_URL`. Defaults to the current URL. */
  canonical?: string
  ogImage?: string
  ogType?: OgType
  twitterCard?: TwitterCard
  robots?: RobotsDirective
  prev?: string
  next?: string
  siteName?: string
}

/**
 * Resolves a URL against `SITE_URL` the way a browser resolves an `href`: an
 * absolute URL passes through, `//host/x` takes the site's scheme, and a path
 * with or without its leading slash lands under the site. Prefixing the string,
 * as before, made `https://site//host/x` and `https://sitex`.
 */
export const absoluteUrl = (pathOrUrl: string): string => new URL(pathOrUrl, `${SITE_URL}/`).href

/** The page's title, or the site's base title; both name the site, overridden or not. */
export const resolveTitle = (meta: PageMeta, lang: Lang): string => {
  const siteName = meta.siteName ?? SITE_NAME
  return meta.title ? `${meta.title} | ${siteName}` : `${siteName} | ${SITE_INFO[lang].titleNote}`
}

/**
 * Every non-title head tag for a page. `Document` renders `<title>` itself from
 * `resolveTitle`, so it is deliberately absent here — two `<title>` elements
 * would otherwise be emitted.
 */
export const renderMeta = (meta: PageMeta, url: URL, lang: Lang): RemixNode => {
  const {
    description = SITE_INFO[lang].description,
    ogType = 'website',
    twitterCard = 'summary_large_image',
    robots,
    prev,
    next,
  } = meta

  const siteName = meta.siteName ?? SITE_NAME
  const title = resolveTitle(meta, lang)
  // The request's own path is appended, never resolved: `//evil.example/x`
  // would otherwise resolve to another site. A page's canonical is the page's
  // own value, so it is resolved like an href.
  const canonicalUrl = meta.canonical ? absoluteUrl(meta.canonical) : `${SITE_URL}${url.pathname}`
  const ogImageUrl = absoluteUrl(meta.ogImage ?? DEFAULT_OG_IMAGE)

  // Anything but production is kept out of the index, matching generalview.
  const robotsContent = !IS_PRODUCTION || NO_INDEX ? 'noindex, nofollow' : robots

  return (
    <>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {/* develop's getMetadata: og:url is the canonical URL, so a share of a
          duplicate URL credits the page it duplicates. */}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:type" content={ogType} />

      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />

      {robotsContent ? <meta name="robots" content={robotsContent} /> : null}
      {prev ? <link rel="prev" href={absoluteUrl(prev)} /> : null}
      {next ? <link rel="next" href={absoluteUrl(next)} /> : null}
    </>
  )
}
