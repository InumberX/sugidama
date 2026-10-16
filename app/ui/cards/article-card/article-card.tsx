// Ported from develop: app/components/ui/cards/ArticleCard
import { css, type Handle, type RemixNode } from 'remix/component'

import { BaseTagList } from '../../lists/base-tag-list/base-tag-list.tsx'
import { PrimitiveButton } from '../../primitives/buttons/primitive-button/primitive-button.tsx'
import type { StyleRecipe } from '../../styles/public/mixins.ts'
import * as styles from './article-card.styles.ts'
import type { ArticleCardProps } from './article-card.types.ts'

export type * from './article-card.types.ts'

/** Shown when a drink has no thumbnail. Shared with the home page's compact card. */
export const EMPTY_THUMBNAIL = '/assets/img/img-empty-16-9.avif'

/**
 * A drink card. As in develop, the title, the description and the thumbnail are three
 * links to the same page, each wrapped so the card's hover rule can find them;
 * the tags are links of their own to a filtered list.
 */
export function ArticleCard(handle: Handle<ArticleCardProps>) {
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
    const linkAttributes = url === undefined ? {} : { [styles.ARTICLE_CARD_LINK_ATTRIBUTE]: '' }

    return (
      <ArticleTag
        {...{ [styles.ARTICLE_CARD_ATTRIBUTE]: '' }}
        mix={css({ ...styles.articleCard, ...styleOverrides })}
      >
        <Title {...linkAttributes} mix={css(styles.articleCardTitle)}>
          <CardLink url={url} styleOverrides={styles.articleCardTitle_text}>
            {title.text}
          </CardLink>
        </Title>

        {description && (
          <p {...linkAttributes} mix={css(styles.articleCardDescription)}>
            <CardLink url={url} styleOverrides={styles.articleCardDescription_container}>
              <span mix={css(styles.articleCardDescription_text)}>{description.text}</span>
            </CardLink>
          </p>
        )}

        {tags && tags.length > 0 && (
          <div mix={css(styles.articleCardTags)}>
            <BaseTagList items={tags.map((tag) => ({ variant: 'outlined' as const, ...tag }))} />
          </div>
        )}

        <div {...linkAttributes} mix={css(styles.articleCardThumbnail)}>
          <CardLink url={url} styleOverrides={styles.articleCardThumbnail_container} isRedundant>
            <span mix={css(styles.articleCardThumbnail_contents)}>
              <img
                src={thumbnail?.src ?? EMPTY_THUMBNAIL}
                alt={thumbnail?.alt ?? ''}
                mix={css(styles.articleCardThumbnail_image)}
              />
            </span>
          </CardLink>
        </div>
      </ArticleTag>
    )
  }
}

/**
 * A link to the card's page, or an inert span when the card has none. Shared
 * with the home page's compact card, so both cards render a link the same way.
 * `isRedundant` marks a second link to the same page (the thumbnail): it is
 * kept for the mouse but skipped by the keyboard and by screen readers, which
 * would otherwise meet an unnamed link whenever the image has no alt text.
 */
export function CardLink(
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
    const hidden = isRedundant ? { ariaHidden: true, tabIndex: -1 } : {}
    return (
      <PrimitiveButton {...element} {...hidden} styleOverrides={styleOverrides}>
        {children}
      </PrimitiveButton>
    )
  }
}
