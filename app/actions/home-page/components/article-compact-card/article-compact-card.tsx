// Ported from develop: app/components/ui/cards/ArticleCompactCard. Only the
// home page uses it, so it lives with the home page.
import { css, type Handle, type RemixNode } from 'remix/component'

import { BaseTagList } from '../../../../ui/lists/base-tag-list/base-tag-list.tsx'
import { PrimitiveButton } from '../../../../ui/primitives/buttons/primitive-button/primitive-button.tsx'
import type { StyleRecipe } from '../../../../ui/styles/public/mixins.ts'
import * as styles from './article-compact-card.styles.ts'
import type { ArticleCompactCardProps } from './article-compact-card.types.ts'

export type * from './article-compact-card.types.ts'

/** Shown when a drink has no thumbnail. */
const EMPTY_THUMBNAIL = '/assets/img/img-empty-16-9.avif'

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

/**
 * A link to the card's page, or an inert span when the card has none.
 * `isRedundant` marks a second link to the same page (the thumbnail): it is
 * kept for the mouse but skipped by the keyboard and by screen readers, which
 * would otherwise meet an unnamed link whenever the image has no alt text. An
 * inert part keeps its content, alt text included, for there is no title link
 * it repeats. ArticleCard (`app/ui/cards/article-card/`) has its own copy; keep the two in step.
 */
function CardLink(
  handle: Handle<{
    url?: string
    styleOverrides: StyleRecipe
    isRedundant?: boolean
    children?: RemixNode
  }>
) {
  return () => {
    const { url, styleOverrides, isRedundant, children } = handle.props
    const element = url === undefined ? { nonClickableTag: 'span' as const } : { url }
    return (
      <PrimitiveButton
        {...element}
        ariaHidden={isRedundant && url !== undefined}
        styleOverrides={styleOverrides}
      >
        {children}
      </PrimitiveButton>
    )
  }
}
