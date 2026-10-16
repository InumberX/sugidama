// Ported from develop: app/components/ui/lists/ArticleCompactCardList
import { css, type Handle } from 'remix/component'

import { ArticleCompactCard } from '../article-compact-card/article-compact-card.tsx'
import * as styles from './article-compact-card-list.styles.ts'
import type { ArticleCompactCardListProps } from './article-compact-card-list.types.ts'

export type * from './article-compact-card-list.types.ts'

export function ArticleCompactCardList(handle: Handle<ArticleCompactCardListProps>) {
  return () => (
    <div mix={css(styles.articleCompactCardList)}>
      <div mix={css(styles.articleCompactCardList_items)}>
        {handle.props.items.map((item, i) => (
          <div key={i} mix={css(styles.articleCompactCardList_item)}>
            <ArticleCompactCard {...item} />
          </div>
        ))}
      </div>
    </div>
  )
}
