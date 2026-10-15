// Ported from develop: app/components/ui/buttons/BaseButton
//
// Styled counterpart to the unstyled primitive: it adds size, variant, color
// and motion, and delegates element selection and accessibility downwards.
import { css, type Handle } from 'remix/component'

import { PrimitiveButton } from '../../primitives/buttons/primitive-button/primitive-button.tsx'
import * as styles from './base-button.styles.ts'
import type { BaseButtonProps } from './base-button.types.ts'

export type * from './base-button.types.ts'

export function BaseButton(handle: Handle<BaseButtonProps>) {
  return () => {
    const {
      size = 'medium',
      variant = 'contained',
      color = 'primary',
      leftElm,
      rightElm,
      children,
      ...forwarded
    } = handle.props

    return (
      <PrimitiveButton
        {...forwarded}
        styleOverrides={{
          ...styles.baseButton,
          ...styles.baseButtonSizes[size],
          ...styles.baseButtonVariants[variant],
          ...styles.baseButtonColors[color][variant],
          ...(forwarded.isDisabled ? styles.baseButton__disabled : null),
        }}
      >
        <span mix={css(styles.baseButton_container)}>
          {leftElm}
          <span mix={css(styles.baseButton_text)}>{children}</span>
          {rightElm}
        </span>
      </PrimitiveButton>
    )
  }
}
