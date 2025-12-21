import { type ReactNode } from 'react'

import * as styles from './style.css'

export type LayoutInnerProps = {
  children?: ReactNode
  className?: string
  size?: 'large' | 'full'
}

export const LayoutInner = ({ children, className, size = 'large' }: LayoutInnerProps) => {
  return (
    <div className={[styles.layoutInner, styles[`layoutInner__${size}`], className].filter(Boolean).join(' ')}>
      {children}
    </div>
  )
}
