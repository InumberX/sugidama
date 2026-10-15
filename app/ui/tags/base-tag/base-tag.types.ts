import type { RemixNode } from 'remix/component'

import type { PrimitiveButtonProps } from '../../primitives/buttons/primitive-button/primitive-button.types.ts'

export type BaseTagVariant = 'contained' | 'outlined'
export type BaseTagColor = 'sub'

/** Everything the primitive accepts; `styleOverrides` is merged over this tier's recipes. */
export type BaseTagProps = PrimitiveButtonProps & {
  variant?: BaseTagVariant
  color?: BaseTagColor
  /** Rendered before the label, e.g. an icon. */
  leftElm?: RemixNode
  /** Rendered after the label. */
  rightElm?: RemixNode
}
