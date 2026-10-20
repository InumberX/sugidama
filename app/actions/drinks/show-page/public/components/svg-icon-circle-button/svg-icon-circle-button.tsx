// Ported from develop: app/components/ui/buttons/SvgIconCircleButton
import { css, type Handle } from 'remix/component'

import { SvgIcon } from '../../../../../../ui/icons/public/svg-icon/svg-icon.tsx'
import { PrimitiveButton } from '../../../../../../ui/primitives/buttons/public/primitive-button/primitive-button.tsx'
import * as styles from './svg-icon-circle-button.styles.ts'
import type { SvgIconCircleButtonProps } from './svg-icon-circle-button.types.ts'

export type * from './svg-icon-circle-button.types.ts'

/** A round button holding one icon; its title names it. */
export function SvgIconCircleButton(handle: Handle<SvgIconCircleButtonProps>) {
  return () => {
    const { icon, size = 'medium', styleOverrides, ...forwarded } = handle.props

    return (
      <PrimitiveButton
        {...forwarded}
        ariaLabel={forwarded.ariaLabel ?? forwarded.title}
        styleOverrides={{
          ...styles.svgIconCircleButton,
          ...styles.svgIconCircleButtonSizes[size],
          ...(forwarded.isDisabled ? styles.svgIconCircleButton__disabled : null),
          ...styleOverrides,
        }}
      >
        <span mix={css(styles.svgIconCircleButton_container)}>
          <SvgIcon variant={icon} styleOverrides={styles.svgIconCircleButtonIconSizes[size]} />
        </span>
      </PrimitiveButton>
    )
  }
}
