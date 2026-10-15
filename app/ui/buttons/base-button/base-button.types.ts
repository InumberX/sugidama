import type { RemixNode } from 'remix/component'

import type { PrimitiveButtonProps } from '../../primitives/buttons/primitive-button/primitive-button.types.ts'

export type BaseButtonSize = 'large' | 'medium' | 'small'
export type BaseButtonVariant = 'contained' | 'outlined'
export type BaseButtonColor = 'primary'

/** Everything the primitive accepts except `styleOverrides`, which this tier owns. */
export type BaseButtonProps = Omit<PrimitiveButtonProps, 'styleOverrides'> & {
  size?: BaseButtonSize
  variant?: BaseButtonVariant
  color?: BaseButtonColor
  /** Rendered before the label, e.g. an icon. */
  leftElm?: RemixNode
  /** Rendered after the label. */
  rightElm?: RemixNode
}
