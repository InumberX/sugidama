// Ported from develop: app/components/ui/buttons/TextButton
import { css, type Handle } from 'remix/component'

import { PrimitiveButton } from '../../../primitives/buttons/public/primitive-button/primitive-button.tsx'
import * as styles from './text-button.styles.ts'
import type { TextButtonProps } from './text-button.types.ts'

export type * from './text-button.types.ts'

export function TextButton(handle: Handle<TextButtonProps>) {
  return () => {
    const {
      size = 'medium',
      color = 'primary',
      leftElm,
      rightElm,
      styleOverrides,
      children,
      ...forwarded
    } = handle.props

    return (
      <PrimitiveButton
        {...forwarded}
        styleOverrides={{
          ...styles.textButton,
          ...styles.textButtonSizes[size],
          ...styles.textButtonColors[color],
          ...(forwarded.isDisabled ? styles.textButton__disabled : null),
          ...styleOverrides,
        }}
      >
        <span mix={css(styles.textButton_container)}>
          {leftElm}
          <span mix={css(styles.textButton_text)}>{children}</span>
          {rightElm}
        </span>
      </PrimitiveButton>
    )
  }
}
