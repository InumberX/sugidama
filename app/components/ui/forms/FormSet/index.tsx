import { type ReactNode } from 'react'

import * as styles from './style.css'

type Props = {
  id?: string
  className?: string
  isFirst?: boolean
  isLast?: boolean
  title: ReactNode
  subTitle?: ReactNode
  isTitleVertical?: boolean
  isRequired?: boolean
  children?: ReactNode
  size?: 'small' | 'medium'
}

export const FormSet = ({
  id,
  className,
  isFirst,
  isLast,
  title,
  subTitle,
  isRequired,
  children,
  size = 'medium',
  isTitleVertical,
}: Props) => {
  return (
    <dl
      className={[
        styles.formSet,
        isFirst && styles.formSet__first,
        isLast && styles.formSet__last,
        styles[`formSet__${size}`],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <dt id={id} className={styles.formSetTitle}>
        <div
          className={[styles.formSetTitle_container, isTitleVertical && styles.formSetTitle_container__vertical]
            .filter(Boolean)
            .join(' ')}
        >
          <div className={styles.formSetTitle_text}>{title}</div>

          {subTitle && <div className={styles.formSetTitle_sub}>{subTitle}</div>}
        </div>

        {isRequired && (
          <span className={styles.formSetTitleRequired}>
            <span className={styles.formSetTitleRequired_text}>必須</span>
          </span>
        )}
      </dt>
      <dd className={styles.formSetContents}>{children}</dd>
    </dl>
  )
}
