import { ArticleCard, type ArticleCardProps } from '~/components/ui/cards/ArticleCard'

import * as styles from './style.css'

export type ArticleCardListProps = {
  className?: string
  items: ArticleCardProps[]
  itemSize?: 'small' | 'medium'
}

export const ArticleCardList = ({ className, items, itemSize = 'medium' }: ArticleCardListProps) => {
  return (
    <div className={[styles.articleCardList, className].filter(Boolean).join(' ')}>
      <div
        className={[styles.articleCardList_items, styles[`articleCardList_items__${itemSize}`]]
          .filter(Boolean)
          .join(' ')}
      >
        {items.map((item, i) => (
          <div key={`${item.title.text}-${i}`} className={styles.articleCardList_item}>
            <ArticleCard {...item} />
          </div>
        ))}
      </div>
    </div>
  )
}
