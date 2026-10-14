import type { Handle } from 'remix/component'

import { LayoutInner } from '../../ui/layouts/layout-inner/layout-inner.tsx'
import { LayoutMain } from '../../ui/layouts/layout-main/layout-main.tsx'
import { LayoutPageWrapper } from '../../ui/layouts/layout-page-wrapper/layout-page-wrapper.tsx'
import { Document } from '../document.tsx'

export type HomePageProps = {
  url: URL
}

// Placeholder until the SG10_100 port (feature/remix3-home) replaces it.
export function HomePage(handle: Handle<HomePageProps>) {
  return () => (
    <Document url={handle.props.url}>
      <LayoutPageWrapper>
        <LayoutMain>
          <LayoutInner>
            <h1>Sugidama</h1>
          </LayoutInner>
        </LayoutMain>
      </LayoutPageWrapper>
    </Document>
  )
}
