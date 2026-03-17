import * as styles from './style.css'

import { ArticleCard, type ArticleCardProps } from '~/components/ui/cards/ArticleCard'

export type ArticleCardListProps = {
  className?: string
  items: ArticleCardProps[]
}

export const ArticleCardList = ({ className, items }: ArticleCardListProps) => {
  return (
    <div className={[styles.articleCardList, className].filter(Boolean).join(' ')}>
      <div className={styles.articleCardList_items}>
        {items.map((item, i) => (
          <div key={`${item.title.text}-${i}`} className={styles.articleCardList_item}>
            <ArticleCard {...item} />
          </div>
        ))}
      </div>
    </div>
  )
}
