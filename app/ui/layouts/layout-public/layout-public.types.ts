import type { RemixNode } from 'remix/component'

import type { LayoutHeaderProps } from '../../common/layout-header/layout-header.types.ts'

export type LayoutPublicProps = LayoutHeaderProps & {
  children?: RemixNode
}
