import type { Handle } from 'remix/component'

import { LayoutInner } from '../../../ui/layouts/layout-inner/layout-inner.tsx'
import { LayoutPageWrapper } from '../../../ui/layouts/layout-page-wrapper/layout-page-wrapper.tsx'
import { LayoutPublic } from '../../../ui/layouts/layout-public/layout-public.tsx'
import { PageTitle } from '../../../ui/typographies/page-title/page-title.tsx'
import type { Lang } from '../../../utils/i18n.ts'
import { Document } from '../../document.tsx'

export type ShowPageProps = {
  lang: Lang
  url: URL
  drinkId: string
}

// Placeholder until the SG20_101 port (feature/remix3-drinks-detail) replaces
// it. It exists now so the drink cards have a route to link to.
export function ShowPage(handle: Handle<ShowPageProps>) {
  return () => {
    const { lang, url, drinkId } = handle.props

    return (
      <Document lang={lang} url={url} meta={{ title: drinkId }}>
        <LayoutPublic lang={lang} url={url}>
          <LayoutPageWrapper>
            <LayoutInner>
              <PageTitle title={drinkId} />
            </LayoutInner>
          </LayoutPageWrapper>
        </LayoutPublic>
      </Document>
    )
  }
}
