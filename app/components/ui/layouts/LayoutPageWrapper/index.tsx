import { type CSSProperties, type ReactNode } from 'react'

import * as styles from './style.css'

type Props = {
  children?: ReactNode
  className?: string
  style?: CSSProperties
  isTopNoSpace?: boolean
  isBottomNoSpace?: boolean
}

export const LayoutPageWrapper = ({
  children,
  className,
  style,
  isTopNoSpace = false,
  isBottomNoSpace = false,
}: Props) => {
  return (
    <div
      className={[
        styles.layoutPageWrapper,
        isTopNoSpace && styles.layoutPageWrapper__topNoSpace,
        isBottomNoSpace && styles.layoutPageWrapper__bottomNoSpace,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      {children}
    </div>
  )
}
