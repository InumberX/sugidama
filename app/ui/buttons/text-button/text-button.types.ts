import type { RemixNode } from 'remix/component'

import type { PrimitiveButtonProps } from '../../primitives/buttons/primitive-button/primitive-button.types.ts'

export type TextButtonSize = 'large' | 'medium' | 'small'
export type TextButtonColor = 'sub' | 'light' | 'primary' | 'subDark'

/** Everything the primitive accepts; `styleOverrides` is merged over this tier's recipes. */
export type TextButtonProps = PrimitiveButtonProps & {
  size?: TextButtonSize
  color?: TextButtonColor
  /** Rendered before the label, e.g. an icon. */
  leftElm?: RemixNode
  /** Rendered after the label. */
  rightElm?: RemixNode
}
