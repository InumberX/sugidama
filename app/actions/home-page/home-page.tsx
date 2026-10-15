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

// Placeholder until the SG10_100 port (feature/remix3-home) replaces it. The
// header's logo is the page title here, as on develop's home page.
export function HomePage(handle: Handle<HomePageProps>) {
  return () => {
    const { lang, url } = handle.props

    return (
      <Document lang={lang} url={url}>
        <LayoutPublic lang={lang} url={url} isLogoTitle>
          <LayoutPageWrapper>
            <LayoutInner>
              <p>Sugidama</p>
            </LayoutInner>
          </LayoutPageWrapper>
        </LayoutPublic>
      </Document>
    )
  }
}
