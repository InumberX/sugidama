// Ported from develop: app/routes/($lang)._public._layout/route.tsx
//
// develop's layout route, which every public page rendered inside. Remix 3 has
// no nested route outlets, so each public page renders this itself inside
// `Document` (whose `LayoutWrapper` is the full-height column).
import type { Handle } from 'remix/component'

import { LayoutFooter } from '../../common/layout-footer/layout-footer.tsx'
import { LayoutHeader } from '../../common/layout-header/layout-header.tsx'
import { LayoutMain } from '../layout-main/layout-main.tsx'
import type { LayoutPublicProps } from './layout-public.types.ts'

export type * from './layout-public.types.ts'

export function LayoutPublic(handle: Handle<LayoutPublicProps>) {
  return () => {
    const { children, ...header } = handle.props

    return (
      <>
        <LayoutHeader {...header} />
        <LayoutMain>{children}</LayoutMain>
        <LayoutFooter />
      </>
    )
  }
}
