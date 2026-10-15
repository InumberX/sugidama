// Ported from develop: app/components/ui/lists/ArticleCardList
import { css, type Handle } from 'remix/component'

import { ArticleCard } from '../../cards/article-card/article-card.tsx'
import * as styles from './article-card-list.styles.ts'
import type { ArticleCardListProps } from './article-card-list.types.ts'

export type * from './article-card-list.types.ts'

export function ArticleCardList(handle: Handle<ArticleCardListProps>) {
  return () => {
    const { items, itemSize = 'medium' } = handle.props

    return (
      <div mix={css(styles.articleCardList)}>
        <div
          mix={css({
            ...styles.articleCardList_items,
            ...styles.articleCardListItemSizes[itemSize],
          })}
        >
          {items.map((item, i) => (
            <div key={i} mix={css(styles.articleCardList_item)}>
              <ArticleCard {...item} />
            </div>
          ))}
        </div>
      </div>
    )
  }
}
