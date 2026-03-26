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

export type ArticleCompactCardProps = {
  className?: string
  button?: PrimitiveButtonProps
  title: TitleProps
  description?: DescriptionProps
  tags?: BaseTagProps[]
  thumbnail?: ThumbnailProps
  articleTag?: keyof JSX.IntrinsicElements
}

const ArticleCompactCardTitle = ({ text, titleTag = 'h2', ...rest }: TitleProps & PrimitiveButtonProps) => {
  const Title = titleTag
  const isClickable = rest.url || rest.onClick || rest.buttonType

  return (
    <Title className={styles.articleCompactCardTitle}>
      <PrimitiveButton
        {...rest}
        className={[styles.articleCompactCardTitle_container, isClickable && styles.articleCompactCard_clickable]
          .filter(Boolean)
          .join(' ')}
      >
        <span className={styles.articleCompactCardTitle_text}>{text}</span>
      </PrimitiveButton>
    </Title>
  )
}

const ArticleCompactCardDescription = ({ text, ...rest }: DescriptionProps & PrimitiveButtonProps) => {
  const isClickable = rest.url || rest.onClick || rest.buttonType

  return (
    <p className={styles.articleCompactCardDescription}>
      <PrimitiveButton
        {...rest}
        className={[styles.articleCompactCardDescription_container, isClickable && styles.articleCompactCard_clickable]
          .filter(Boolean)
          .join(' ')}
      >
        <span className={styles.articleCompactCardDescription_text}>{text}</span>
      </PrimitiveButton>
    </p>
  )
}

const ArticleCompactCardThumbnail = ({ src, alt, ...rest }: ThumbnailProps & PrimitiveButtonProps) => {
  const isClickable = rest.url || rest.onClick || rest.buttonType

  return (
    <div className={styles.articleCompactCardThumbnail}>
      <PrimitiveButton
        {...rest}
        className={[styles.articleCompactCardThumbnail_container, isClickable && styles.articleCompactCard_clickable]
          .filter(Boolean)
          .join(' ')}
      >
        <span className={styles.articleCompactCardThumbnail_contents}>
          <img src={src} alt={alt ?? ''} className={styles.articleCompactCardThumbnail_image} />
        </span>
      </PrimitiveButton>
    </div>
  )
}

export const ArticleCompactCard = ({
  className,
  button,
  title,
  description,
  tags,
  thumbnail,
  articleTag = 'article',
}: ArticleCompactCardProps) => {
  const ArticleTag = articleTag

  return (
    <ArticleTag className={[styles.articleCompactCard, className].filter(Boolean).join(' ')}>
      <ArticleCompactCardTitle {...title} {...button} />

      {description && <ArticleCompactCardDescription {...description} {...button} />}

      {tags && tags.length > 0 && (
        <div className={styles.articleCompactCardTags}>
          <BaseTagList
            items={tags.map((tag) => ({
              variant: 'outlined',
              ...tag,
            }))}
          />
        </div>
      )}

      <ArticleCompactCardThumbnail
        {...thumbnail}
        src={thumbnail?.src ?? `/assets/img/img-empty-16-9.avif?${CACHE_BUSTER}`}
        {...button}
      />
    </ArticleTag>
  )
}
