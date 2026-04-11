import { type JSX } from 'react'

import * as styles from './style.css'

import { ArticleInfo, type ArticleInfoProps } from '~/components/ui/articles/ArticleInfo'
import { ArticleSlider } from '~/components/ui/articles/ArticleSlider'
import { BaseTagList } from '~/components/ui/lists/BaseTagList'
import { type BaseTagProps } from '~/components/ui/tags/BaseTag'
import { PageTitle } from '~/components/ui/typographies/PageTitle'

type TitleProps = {
  text: string
  titleTag?: keyof JSX.IntrinsicElements
}

type MainVisualProps = {
  src: string
  alt?: string
}

type InfoProps = {
  items?: ArticleInfoProps['items']
}

export type BaseArticleProps = {
  className?: string
  articleTag?: keyof JSX.IntrinsicElements
  title: TitleProps
  mainVisuals?: MainVisualProps[]
  info?: InfoProps
  tags?: BaseTagProps[]
}

export const BaseArticle = ({
  className,
  articleTag = 'article',
  title,
  mainVisuals,
  info,
  tags,
}: BaseArticleProps) => {
  const ArticleTag = articleTag

  return (
    <ArticleTag className={[styles.baseArticle, className].filter(Boolean).join(' ')}>
      <div className={styles.baseArticle_container}>
        <div className={styles.baseArticleTitle}>
          <PageTitle title={title.text} titleTag={title.titleTag} />
        </div>
        {mainVisuals && mainVisuals.length > 0 && (
          <div className={styles.baseArticleMainVisual}>
            <ArticleSlider
              slides={mainVisuals.map((mainVisual) => ({
                image: {
                  src: mainVisual.src,
                  alt: mainVisual.alt,
                },
              }))}
            />
          </div>
        )}
        {info && info.items && info.items.length > 0 && (
          <div className={styles.baseArticleInfo}>
            <ArticleInfo items={info.items} />
          </div>
        )}
        {tags && tags.length > 0 && (
          <div className={styles.baseArticleTags}>
            <BaseTagList items={tags} />
          </div>
        )}
      </div>
    </ArticleTag>
  )
}
