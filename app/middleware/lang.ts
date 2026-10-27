// Resolves the page language from the route's optional `lang` param — the
// `/(:lang)` and `/(:lang/)…` patterns in app/routes.ts — the way develop's
// `getLang()` did: no prefix is Japanese, `/en` is English, anything else is
// not a page.
import { createContextKey, type Middleware } from 'remix/router'

import { HTTP_STATUS } from '../utils/http-status.ts'
import { DEFAULT_LANG, isLang, type Lang } from '../utils/i18n.ts'
import { localRedirect } from './local-redirect.ts'

/** The request's language. Read it as `context.lang`. */
export const LangKey = createContextKey<Lang>()

/**
 * Controller middleware for routes whose pattern carries the optional `lang`
 * param. Not router middleware, which runs before matching and has no params
 * to read; not action middleware, since a controller's `actions` object then
 * loses the type of `context.lang` (see CLAUDE.md, **Languages**).
 *
 * - no prefix: Japanese
 * - `/en/…`: English; a percent-encoded spelling (`/%65n`) is redirected to
 *   `/en/…`, so each page has one URL to be indexed under
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
    // The param is decoded, so `/%6Aa` arrives as `ja` and `/%65n` as `en`.
    // Redirects work from the segment as it appears in the URL.
    const [, rawSegment = '', rest = ''] = /^\/([^/]*)(.*)$/.exec(context.url.pathname) ?? []
    // 302 for GET/HEAD, as develop did; 307 otherwise, so a future POST under a
    // prefix keeps its method and body instead of turning into a GET.
    const status =
      context.method === 'GET' || context.method === 'HEAD'
        ? HTTP_STATUS.FOUND
        : HTTP_STATUS.TEMPORARY_REDIRECT

    if (param === DEFAULT_LANG) {
      return localRedirect(context.url, `${rest || '/'}${context.url.search}`, status)
    }
    if (isLang(param)) {
      if (rawSegment !== param) {
        return localRedirect(context.url, `/${param}${rest}${context.url.search}`, status)
      }
      context.set(LangKey, param, { property: 'lang' })
      return next()
    }
    return new Response('Not Found', { status: HTTP_STATUS.NOT_FOUND })
  }
}
