import { type ReactNode } from 'react'

import * as styles from './style.css'

type Props = {
  children?: ReactNode
}

export const LayoutWrapper = ({ children }: Props) => {
  return <div className={styles.layoutWrapper}>{children}</div>
}
