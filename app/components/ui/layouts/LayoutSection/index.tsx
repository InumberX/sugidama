import { type ReactNode, type JSX } from 'react'

import * as styles from './style.css'

export type LayoutSectionProps = {
  children?: ReactNode
  tag?: keyof JSX.IntrinsicElements
  className?: string
  color?: 'default'
  topSpace?: 'topSpaceNone' | 'topSpaceSmall' | 'topSpaceMedium'
  bottomSpace?: 'bottomSpaceNone' | 'bottomSpaceSmall' | 'bottomSpaceMedium'
}

export const LayoutSection = ({
  children,
  tag = 'section',
  className,
  color = 'default',
  topSpace = 'topSpaceMedium',
  bottomSpace = 'bottomSpaceMedium',
}: LayoutSectionProps) => {
  const Tag = tag
  return (
    <Tag
      className={[
        styles.layoutSection,
        styles[`layoutSection__${color}`],
        styles[`layoutSection__${topSpace}`],
        styles[`layoutSection__${bottomSpace}`],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Tag>
  )
}
