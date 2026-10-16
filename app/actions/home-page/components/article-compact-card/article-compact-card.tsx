// Ported from develop: app/components/ui/cards/ArticleCompactCard. Only the
// home page uses it, so it lives with the home page.
import { css, type Handle } from 'remix/component'

import { CardLink, EMPTY_THUMBNAIL } from '../../../../ui/cards/article-card/article-card.tsx'
import { BaseTagList } from '../../../../ui/lists/base-tag-list/base-tag-list.tsx'
import * as styles from './article-compact-card.styles.ts'
import type { ArticleCompactCardProps } from './article-compact-card.types.ts'

export type * from './article-compact-card.types.ts'

/** A drink as a row: the thumbnail on the left, the date, title and tags beside it. */
export function ArticleCompactCard(handle: Handle<ArticleCompactCardProps>) {
  return () => {
    const {
      url,
      title,
      description,
      tags,
      thumbnail,
      articleTag: ArticleTag = 'article',
      styleOverrides,
    } = handle.props
    const Title = title.titleTag ?? 'h2'
    const hasTags = tags !== undefined && tags.length > 0
    const linkAttributes =
      url === undefined ? {} : { [styles.ARTICLE_COMPACT_CARD_LINK_ATTRIBUTE]: '' }

    return (
      <ArticleTag
        {...{ [styles.ARTICLE_COMPACT_CARD_ATTRIBUTE]: '' }}
        mix={css({ ...styles.articleCompactCard, ...styleOverrides })}
      >
        <Title {...linkAttributes} mix={css(styles.articleCompactCardTitle)}>
          <CardLink
            url={url}
            styleOverrides={{
              ...styles.articleCompactCardTitle_container,
              ...(description ? styles.articleCompactCardTitle_container__afterDescription : null),
              ...(hasTags ? styles.articleCompactCardTitle_container__beforeTags : null),
            }}
          >
            <span mix={css(styles.articleCompactCardTitle_text)}>{title.text}</span>
          </CardLink>
        </Title>

        {description && (
          <p {...linkAttributes} mix={css(styles.articleCompactCardDescription)}>
            <CardLink url={url} styleOverrides={styles.articleCompactCardDescription_container}>
              <span mix={css(styles.articleCompactCardDescription_text)}>{description.text}</span>
            </CardLink>
          </p>
        )}

        {hasTags && (
          <div mix={css(styles.articleCompactCardTags)}>
            <BaseTagList items={tags.map((tag) => ({ variant: 'outlined' as const, ...tag }))} />
          </div>
        )}

        <div {...linkAttributes} mix={css(styles.articleCompactCardThumbnail)}>
          <CardLink
            url={url}
            styleOverrides={styles.articleCompactCardThumbnail_container}
            isRedundant
          >
            <span mix={css(styles.articleCompactCardThumbnail_contents)}>
              <img
                src={thumbnail?.src ?? EMPTY_THUMBNAIL}
                alt={thumbnail?.alt ?? ''}
                mix={css(styles.articleCompactCardThumbnail_image)}
              />
            </span>
          </CardLink>
        </div>
      </ArticleTag>
    )
  }
}
