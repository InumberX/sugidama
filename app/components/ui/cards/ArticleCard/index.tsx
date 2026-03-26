import { type ReactNode, type JSX } from 'react'

import * as styles from './style.css'

import { PrimitiveButton, type PrimitiveButtonProps } from '~/components/primitives/buttons/PrimitiveButton'
import { BaseTagList } from '~/components/ui/lists/BaseTagList'
import type { BaseTagProps } from '~/components/ui/tags/BaseTag'
import { CACHE_BUSTER } from '~/config/env'

type TitleProps = {
  text: ReactNode
  titleTag?: keyof JSX.IntrinsicElements
}

type DescriptionProps = {
  text: ReactNode
}

type ThumbnailProps = {
  src: string
  alt?: string
}

export type ArticleCardProps = {
  className?: string
  button?: PrimitiveButtonProps
  title: TitleProps
  description?: DescriptionProps
  tags?: BaseTagProps[]
  thumbnail?: ThumbnailProps
  articleTag?: keyof JSX.IntrinsicElements
}

const ArticleCardTitle = ({ text, titleTag = 'h2', ...rest }: TitleProps & PrimitiveButtonProps) => {
  const Title = titleTag
  const isClickable = rest.url || rest.onClick || rest.buttonType

  return (
    <Title className={styles.articleCardTitle}>
      <PrimitiveButton
        {...rest}
        className={[styles.articleCardTitle_text, isClickable && styles.articleCard_clickable]
          .filter(Boolean)
          .join(' ')}
      >
        {text}
      </PrimitiveButton>
    </Title>
  )
}

const ArticleCardDescription = ({ text, ...rest }: DescriptionProps & PrimitiveButtonProps) => {
  const isClickable = rest.url || rest.onClick || rest.buttonType

  return (
    <p className={styles.articleCardDescription}>
      <PrimitiveButton
        {...rest}
        className={[styles.articleCardDescription_container, isClickable && styles.articleCard_clickable]
          .filter(Boolean)
          .join(' ')}
      >
        <span className={styles.articleCardDescription_text}>{text}</span>
      </PrimitiveButton>
    </p>
  )
}

const ArticleCardThumbnail = ({ src, alt, ...rest }: ThumbnailProps & PrimitiveButtonProps) => {
  const isClickable = rest.url || rest.onClick || rest.buttonType

  return (
    <div className={styles.articleCardThumbnail}>
      <PrimitiveButton
        {...rest}
        className={[styles.articleCardThumbnail_container, isClickable && styles.articleCard_clickable]
          .filter(Boolean)
          .join(' ')}
      >
        <span className={styles.articleCardThumbnail_contents}>
          <img src={src} alt={alt ?? ''} className={styles.articleCardThumbnail_image} />
        </span>
      </PrimitiveButton>
    </div>
  )
}

export const ArticleCard = ({
  className,
  button,
  title,
  description,
  tags,
  thumbnail,
  articleTag = 'article',
}: ArticleCardProps) => {
  const ArticleTag = articleTag

  return (
    <ArticleTag className={[styles.articleCard, className].filter(Boolean).join(' ')}>
      <ArticleCardTitle {...title} {...button} />

      {description && <ArticleCardDescription {...description} {...button} />}

      {tags && tags.length > 0 && (
        <div className={styles.articleCardTags}>
          <BaseTagList
            items={tags.map((tag) => ({
              variant: 'outlined',
              ...tag,
            }))}
          />
        </div>
      )}

      <ArticleCardThumbnail
        {...thumbnail}
        src={thumbnail?.src ?? `/assets/img/img-empty-16-9.avif?${CACHE_BUSTER}`}
        {...button}
      />
    </ArticleTag>
  )
}
