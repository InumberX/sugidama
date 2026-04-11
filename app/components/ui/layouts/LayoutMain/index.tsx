import { type ReactNode, type JSX } from 'react'

import * as styles from './style.css'

type Props = { children?: ReactNode; tag?: keyof JSX.IntrinsicElements }

export const LayoutMain = ({ children, tag }: Props) => {
  const Tag = tag ?? 'main'
  return (
    <Tag className={styles.layoutMain}>
      <div className={styles.layoutMain_container}>{children}</div>
    </Tag>
  )
}
