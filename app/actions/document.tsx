import { type Handle, type RemixNode, unsafeHTML } from 'remix/component'

import { CACHE_BUSTER, GOOGLE_ANALYTICS_ID } from '../env.ts'
import { useCspNonce } from '../ui/contexts/csp-nonce/csp-nonce.tsx'
import { LayoutWrapper } from '../ui/layouts/layout-wrapper/layout-wrapper.tsx'
import { clientModuleUrl } from '../ui/public/client-module-url.ts'
import type { Lang } from '../utils/i18n.ts'
import { type PageMeta, renderMeta, resolveTitle } from './meta.tsx'

export type DocumentProps = {
  children?: RemixNode
  /** Extra head content this page needs beyond the standard metadata. Rendered last in `<head>`. */
  head?: RemixNode
  /**
   * The page's language, from `context.lang`. Required for the same reason as
   * `url`: an English page that forgot it would still render, as `lang="ja"`.
   */
  lang: Lang
  /**
   * Site-wide metadata with per-page overrides. `url` comes from
   * `context.url` in the action, since a component has no request of its own.
   */
  meta?: PageMeta
  /**
   * Required, not optional. `renderMeta` needs it to build the canonical and
   * og:url values, and every tag it returns — including the `noindex, nofollow`
   * that `meta.tsx` forces outside production — would be dropped along with it.
   * A page that simply forgot to pass it would still render, still typecheck and
   * still pass its tests, while quietly becoming indexable on staging.
   */
  url: URL
  /** Google Analytics id. Defaults to `GOOGLE_ANALYTICS_ID`; tests pass one. */
  analyticsId?: string
  /**
   * Loads the browser runtime, which hydrates the page's `clientEntry`
   * components. Only pages that render one pass it, so every other page stays
   * free of JavaScript of its own.
   */
  hasClientEntries?: boolean
}

/** The browser runtime, compiled by scripts/build-client.ts. */
export const CLIENT_RUNTIME_URL = clientModuleUrl('app/actions/public/entry.ts')

export function Document(handle: Handle<DocumentProps>) {
  const nonce = useCspNonce(handle)

  return () => {
    const {
      analyticsId = GOOGLE_ANALYTICS_ID,
      children,
      hasClientEntries = false,
      head,
      lang,
      meta = {},
      url,
    } = handle.props

    return (
      <html lang={lang}>
        <head>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, minimum-scale=1.0, shrink-to-fit=no, viewport-fit=cover"
          />
          <meta name="theme-color" content="#a2beed" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="twitter:site" content="@InumberX" />
          <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="16x16" />
          <link rel="apple-touch-icon" href="/apple-icon.png" type="image/png" sizes="180x180" />
          {/* Declares the `@layer reset, lib, base, rmx, util` order before any
              css(...) rule lands. Root public/ URLs never change on their own,
              hence the cache buster. */}
          <link rel="stylesheet" href={`/static/css/app.css?${CACHE_BUSTER}`} />
          <title>{resolveTitle(meta, lang)}</title>
          {renderMeta(meta, url, lang)}
          <GoogleAnalytics id={analyticsId} nonce={nonce} />
          {/* A module script is deferred; the nonce lets it through the CSP,
              and 'strict-dynamic' extends that to every module it imports. */}
          {hasClientEntries && (
            <script type="module" nonce={nonce} src={CLIENT_RUNTIME_URL}></script>
          )}
          {head}
        </head>
        <body>
          <LayoutWrapper>{children}</LayoutWrapper>
        </body>
      </html>
    )
  }
}

export type GoogleAnalyticsProps = {
  /** Measurement id. Empty renders nothing, which is the local default. */
  id: string
  /** The request's CSP nonce; both scripts need it under `script-src`. */
  nonce?: string
}

/**
 * The gtag.js loader and its config call, ported from develop's root.tsx.
 * Without client-side navigation every page view is a full load, so gtag's own
 * automatic page_view replaces the per-route `gtag.pageview()` develop sent.
 */
export function GoogleAnalytics(handle: Handle<GoogleAnalyticsProps>) {
  return () => {
    const { id, nonce } = handle.props
    if (!id) return null

    // JSON.stringify quotes the id; escaping `<` keeps a stray `</script>` in
    // configuration from ending the element early.
    const config = JSON.stringify(id).replace(/</g, '\\u003c')

    return (
      <>
        <script
          async
          nonce={nonce}
          src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`}
        ></script>
        <script
          nonce={nonce}
          innerHTML={unsafeHTML(
            `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config',${config});`
          )}
        ></script>
      </>
    )
  }
}
