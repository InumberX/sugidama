import { type ReactNode, type JSX } from 'react'

import * as styles from './style.css'

export type SectionTitleProps = {
  className?: string
  title: ReactNode
  titleTag?: keyof JSX.IntrinsicElements
  id?: string
}

export const SectionTitle = ({ className, title, titleTag = 'h2', id }: SectionTitleProps) => {
  const Title = titleTag

  return (
    <div className={[styles.sectionTitle, className].filter(Boolean).join(' ')}>
      <div className={styles.sectionTitle_container}>
        <span className={styles.sectionTitle_divider} />
        <Title id={id} className={styles.sectionTitle_text}>
          {title}
        </Title>
      </div>
    </div>
  )
}
