import type { Handle } from 'remix/component'

import { LayoutInner } from '../../ui/layouts/layout-inner/layout-inner.tsx'
import { LayoutMain } from '../../ui/layouts/layout-main/layout-main.tsx'
import { LayoutPageWrapper } from '../../ui/layouts/layout-page-wrapper/layout-page-wrapper.tsx'
import type { Lang } from '../../utils/i18n.ts'
import { Document } from '../document.tsx'

export type HomePageProps = {
  lang: Lang
  url: URL
}

// Placeholder until the SG10_100 port (feature/remix3-home) replaces it.
export function HomePage(handle: Handle<HomePageProps>) {
  return () => (
    <Document lang={handle.props.lang} url={handle.props.url}>
      {/* develop's order: Document's LayoutWrapper > LayoutMain (the capped
          column and its white sheet) > LayoutPageWrapper (the page's padding). */}
      <LayoutMain>
        <LayoutPageWrapper>
          <LayoutInner>
            <h1>Sugidama</h1>
          </LayoutInner>
        </LayoutPageWrapper>
      </LayoutMain>
    </Document>
  )
}
