// Ported from develop: app/components/ui/icons/SvgIcon
import { css, type Handle, type MixInput } from 'remix/component'

import * as styles from './svg-icon.styles.ts'
import type { SvgIconProps } from './svg-icon.types.ts'

export type * from './svg-icon.types.ts'

/**
 * A monochrome icon. develop put `aria-label` on a bare `<i>`, which has no
 * role to carry a name; here a titled icon is `role="img"` and an untitled one
 * is `aria-hidden`.
 */
export function SvgIcon(handle: Handle<SvgIconProps>) {
  return () => {
    const { variant, title, styleOverrides, mix } = handle.props
    const hostStyle: MixInput<HTMLElement> = [
      css({ ...styles.svgIcon, ...styles.svgIconVariants[variant], ...styleOverrides }),
      mix,
    ]

    return title ? (
      <i role="img" aria-label={title} title={title} mix={hostStyle} />
    ) : (
      <i aria-hidden="true" mix={hostStyle} />
    )
  }
}
