import type { Handle } from 'remix/component'

import { LayoutInner } from '../../ui/layouts/layout-inner/layout-inner.tsx'
import { LayoutPageWrapper } from '../../ui/layouts/layout-page-wrapper/layout-page-wrapper.tsx'
import { LayoutPublic } from '../../ui/layouts/layout-public/layout-public.tsx'
import type { Lang } from '../../utils/i18n.ts'
import { Document } from '../document.tsx'

export type HomePageProps = {
  lang: Lang
  url: URL
}

// Placeholder until the SG10_100 port (feature/remix3-home) replaces it. As on
// develop's home page, the `<h1>` is in the page body, not the header's logo.
export function HomePage(handle: Handle<HomePageProps>) {
  return () => {
    const { lang, url } = handle.props

    return (
      <Document lang={lang} url={url}>
        <LayoutPublic lang={lang} url={url}>
          <LayoutPageWrapper>
            <LayoutInner>
              <h1>Sugidama</h1>
            </LayoutInner>
          </LayoutPageWrapper>
        </LayoutPublic>
      </Document>
    )
  }
}
