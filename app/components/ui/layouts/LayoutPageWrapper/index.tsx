import { type CSSProperties, type ReactNode } from 'react'

import * as styles from './style.css'

type Props = {
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

export const LayoutPageWrapper = ({ children, className, style }: Props) => {
  return (
    <div className={[styles.layoutPageWrapper, className].filter(Boolean).join(' ')} style={style}>
      {children}
    </div>
  )
}
