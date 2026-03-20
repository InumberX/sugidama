import { type ReactNode, type JSX } from 'react'

import { LayoutInner, type LayoutInnerProps } from '~/components/ui/layouts/LayoutInner'

import * as styles from './style.css'

type PageTitleContentsProps = {
  title: ReactNode
  titleTag?: keyof JSX.IntrinsicElements
}

type PageTitleProps = {
  className?: string
  color?: 'dark' | 'primary'
  isWrap?: boolean
  innerProps?: LayoutInnerProps
} & PageTitleContentsProps

const PageTitleContents = ({ title, titleTag = 'h1' }: PageTitleContentsProps) => {
  const Title = titleTag

  return (
    <div className={styles.pageTitle_contents}>
      <Title className={styles.pageTitle_paragraph}>
        <span className={styles.pageTitle_text}>{title}</span>
      </Title>
    </div>
  )
}

export const PageTitle = ({ className, title, titleTag, color = 'dark', isWrap, innerProps }: PageTitleProps) => {
  return (
    <div className={[styles.pageTitle, styles[`pageTitle__${color}`], className].filter(Boolean).join(' ')}>
      {isWrap ? (
        <div className={styles.pageTitle_wrapper}>
          <LayoutInner {...innerProps}>
            <div className={styles.pageTitle_container}>
              <PageTitleContents title={title} titleTag={titleTag} />
            </div>
          </LayoutInner>
        </div>
      ) : (
        <PageTitleContents title={title} titleTag={titleTag} />
      )}
    </div>
  )
}
