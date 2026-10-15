import type { RemixNode } from 'remix/component'

import type { PrimitiveButtonProps } from '../../primitives/buttons/primitive-button/primitive-button.types.ts'

export type BaseButtonSize = 'large' | 'medium' | 'small'
export type BaseButtonVariant = 'contained' | 'outlined'
export type BaseButtonColor = 'primary'

/**
 * `Omit` applied to each member of a union. Plain `Omit` merges the union
 * first, which would lose the primitive's url / buttonType / nonClickableTag
 * choice.
 */
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never

/** Everything the primitive accepts except `styleOverrides`, which this tier owns. */
export type BaseButtonProps = DistributiveOmit<PrimitiveButtonProps, 'styleOverrides'> & {
  size?: BaseButtonSize
  variant?: BaseButtonVariant
  color?: BaseButtonColor
  /** Rendered before the label, e.g. an icon. */
  leftElm?: RemixNode
  /** Rendered after the label. */
  rightElm?: RemixNode
}
