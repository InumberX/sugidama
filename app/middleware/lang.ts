// Resolves the page language from the route's optional `lang` param — the
// `/(:lang)` and `/(:lang/)…` patterns in app/routes.ts — the way develop's
// `getLang()` did: no prefix is Japanese, `/en` is English, anything else is
// not a page.
import { createContextKey, type Middleware } from 'remix/router'

import { DEFAULT_LANG, isLang, type Lang } from '../utils/i18n.ts'
import { localRedirect } from './local-redirect.ts'

/** The request's language. Read it as `context.lang`. */
export const LangKey = createContextKey<Lang>()

/**
 * Controller or action middleware for routes whose pattern carries the
 * optional `lang` param; router middleware runs before matching and has no
 * params to read.
 *
 * - no prefix: Japanese
 * - `/en/…`: English
 * - `/ja/…`: redirected to the same URL without the prefix, as develop did, so
 *   Japanese has one URL per page
 * - anything else (`/fr`, `/nope`): 404 — `/(:lang)` matches any single
 *   segment, so this is also where an unknown top-level path ends up
 */
export const lang = (): Middleware<{ key: typeof LangKey; value: Lang; property: 'lang' }> => {
  return (context, next) => {
    const param = context.params.lang

    if (param === undefined) {
      context.set(LangKey, DEFAULT_LANG, { property: 'lang' })
      return next()
    }
    if (param === DEFAULT_LANG) {
      // Drop the first segment as it appears in the URL rather than a fixed
      // `/ja`: the param is decoded, so `/%6Aa` arrives here too.
      const rest = context.url.pathname.replace(/^\/[^/]*/, '') || '/'
      return localRedirect(context.url, `${rest}${context.url.search}`)
    }
    if (isLang(param)) {
      context.set(LangKey, param, { property: 'lang' })
      return next()
    }
    return new Response('Not Found', { status: 404 })
  }
}
