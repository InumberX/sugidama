import { type ReactNode } from 'react'

import * as styles from './style.css'

type Props = {
  className?: string
  isFirst?: boolean
  isLast?: boolean
  title: ReactNode
  children?: ReactNode
}

export const FormSubSet = ({ className, isFirst, isLast, title, children }: Props) => {
  return (
    <dl
      className={[styles.formSubSet, isFirst && styles.formSubSet__first, isLast && styles.formSubSet__last, className]
        .filter(Boolean)
        .join(' ')}
    >
      <dt className={styles.formSubSetTitle}>
        <div className={styles.formSubSetTitle_container}>
          <div className={styles.formSubSetTitle_text}>{title}</div>
        </div>
      </dt>
      <dd className={styles.formSubSetContents}>{children}</dd>
    </dl>
  )
}
