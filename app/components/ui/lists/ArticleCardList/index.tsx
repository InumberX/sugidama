import * as styles from './style.css'

import { ArticleCard, type ArticleCardProps } from '~/components/ui/cards/ArticleCard'

type Props = {
  className?: string
  items: ArticleCardProps[]
}

export const ArticleCardList = ({ className, items }: Props) => {
  return (
    <div className={[styles.articleCardList, className].filter(Boolean).join(' ')}>
      <div className={styles.articleCardList_items}>
        {items.map((item, i) => (
          <div key={i} className={styles.articleCardList_item}>
            <ArticleCard {...item} />
          </div>
        ))}
      </div>
    </div>
  )
}
