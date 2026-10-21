// Ported from develop: app/components/ui/layouts/LayoutSection
//
// develop's `color` prop had a single value (`default`) with no styles, so it
// is not carried over.
import { css, type Handle, type MixInput } from 'remix/component'

import * as styles from './layout-section.styles.ts'
import type { LayoutSectionProps } from './layout-section.types.ts'

export type * from './layout-section.types.ts'

/** A full-width band of the page with vertical rhythm above and below it. */
export function LayoutSection(handle: Handle<LayoutSectionProps>) {
  return () => {
    const {
      children,
      tag = 'section',
      topSpace = 'medium',
      bottomSpace = 'medium',
      styleOverrides,
      mix,
    } = handle.props
    const hostStyle: MixInput<HTMLElement> = [
      css({
        ...styles.layoutSection,
        ...styles.layoutSectionTopSpaces[topSpace],
        ...styles.layoutSectionBottomSpaces[bottomSpace],
        ...styleOverrides,
      }),
      mix,
    ]
    const Tag = tag

    return <Tag mix={hostStyle}>{children}</Tag>
  }
}
