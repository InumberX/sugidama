import type { Handle } from 'remix/component'

import { LayoutInner } from '../../../ui/layouts/layout-inner/layout-inner.tsx'
import { LayoutPageWrapper } from '../../../ui/layouts/layout-page-wrapper/layout-page-wrapper.tsx'
import { LayoutPublic } from '../../../ui/layouts/layout-public/layout-public.tsx'
import { PageTitle } from '../../../ui/typographies/page-title/page-title.tsx'
import type { Lang } from '../../../utils/i18n.ts'
import { PAGE_NAMES } from '../../../utils/page-names.ts'
import { Document } from '../../document.tsx'

export type IndexPageProps = {
  lang: Lang
  url: URL
}

// Placeholder until the SG20_100 port (feature/remix3-drinks-list) replaces it.
// It exists now so the header's global menu has a route to link to.
export function IndexPage(handle: Handle<IndexPageProps>) {
  return () => {
    const { lang, url } = handle.props
    const title = PAGE_NAMES[lang].drinks

    return (
      <Document lang={lang} url={url} meta={{ title }}>
        <LayoutPublic lang={lang} url={url}>
          <LayoutPageWrapper>
            <LayoutInner>
              <PageTitle title={title} />
            </LayoutInner>
          </LayoutPageWrapper>
        </LayoutPublic>
      </Document>
    )
  }
}
