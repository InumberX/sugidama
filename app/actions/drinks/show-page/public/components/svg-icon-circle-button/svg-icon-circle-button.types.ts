import type { SvgIconVariant } from '../../../../../../ui/icons/public/svg-icon/svg-icon.types.ts'
import type { PrimitiveButtonProps } from '../../../../../../ui/primitives/buttons/public/primitive-button/primitive-button.types.ts'

export type SvgIconCircleButtonSize = 'large' | 'medium' | 'small'

/**
 * Everything the primitive accepts, with `title` required: the icon is the
 * only content, so the title is the button's accessible name too (and
 * `children` is ignored). develop's
 * `variant` and `color` had one value each (contained, primary) and are not
 * props here.
 */
export type SvgIconCircleButtonProps = PrimitiveButtonProps & {
  title: string
  icon: SvgIconVariant
  size?: SvgIconCircleButtonSize
}
