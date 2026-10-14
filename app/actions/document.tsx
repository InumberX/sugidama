import type { Handle, RemixNode } from 'remix/component'

import { CACHE_BUSTER } from '../env.ts'
import { LayoutWrapper } from '../ui/layouts/layout-wrapper/layout-wrapper.tsx'
import { type PageMeta, renderMeta, resolveTitle } from './meta.tsx'

export type DocumentProps = {
  children?: RemixNode
  /** Extra head content this page needs beyond the standard metadata. Rendered last in `<head>`. */
  head?: RemixNode
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
}

export function Document(handle: Handle<DocumentProps>) {
  return () => {
    const { children, head, meta = {}, url } = handle.props

    return (
      <html lang="ja">
        <head>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, minimum-scale=1.0, shrink-to-fit=no, viewport-fit=cover"
          />
          <meta name="theme-color" content="#a2beed" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="twitter:site" content="@InumberX" />
          <link
            rel="icon"
            href={`/favicon.ico?${CACHE_BUSTER}`}
            type="image/x-icon"
            sizes="16x16"
          />
          <link
            rel="apple-touch-icon"
            href={`/apple-icon.png?${CACHE_BUSTER}`}
            type="image/png"
            sizes="180x180"
          />
          {/* Declares the `@layer reset, lib, base, rmx, util` order before any
              css(...) rule lands. Root public/ URLs never change on their own,
              hence the cache buster. */}
          <link rel="stylesheet" href={`/static/css/app.css?${CACHE_BUSTER}`} />
          <title>{resolveTitle(meta)}</title>
          {renderMeta(meta, url)}
          {head}
        </head>
        <body>
          <LayoutWrapper>{children}</LayoutWrapper>
        </body>
      </html>
    )
  }
}
