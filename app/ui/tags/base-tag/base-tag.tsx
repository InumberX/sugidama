// Ported from develop: app/components/ui/tags/BaseTag
import { css, type Handle } from 'remix/component'

import { PrimitiveButton } from '../../primitives/buttons/primitive-button/primitive-button.tsx'
import * as styles from './base-tag.styles.ts'
import type { BaseTagProps } from './base-tag.types.ts'

export type * from './base-tag.types.ts'

/** A small pill label; a link to a filtered list on drink cards and articles. */
export function BaseTag(handle: Handle<BaseTagProps>) {
  return () => {
    const {
      variant = 'contained',
      color = 'sub',
      leftElm,
      rightElm,
      styleOverrides,
      children,
      ...forwarded
    } = handle.props
    const isInteractive = forwarded.url !== undefined || forwarded.buttonType !== undefined

    return (
      <PrimitiveButton
        {...forwarded}
        styleOverrides={{
          ...styles.baseTag,
          ...styles.baseTagVariants[variant],
          ...styles.baseTagColors[color][variant],
          ...(isInteractive ? styles.baseTagHovers[color][variant] : null),
          ...(forwarded.isDisabled ? styles.baseTag__disabled : null),
          ...styleOverrides,
        }}
      >
        <span mix={css(styles.baseTag_container)}>
          {leftElm}
          <span mix={css(styles.baseTag_text)}>{children}</span>
          {rightElm}
        </span>
      </PrimitiveButton>
    )
  }
}
