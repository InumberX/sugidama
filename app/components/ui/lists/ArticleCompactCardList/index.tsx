import { ArticleCompactCard, type ArticleCompactCardProps } from '~/components/ui/cards/ArticleCompactCard'

import * as styles from './style.css'

type Props = {
  className?: string
  items: ArticleCompactCardProps[]
}

export const ArticleCompactCardList = ({ className, items }: Props) => {
  return (
    <div className={[styles.articleCompactCardList, className].filter(Boolean).join(' ')}>
      <div className={styles.articleCompactCardList_items}>
        {items.map((item, i) => (
          <div key={i} className={styles.articleCompactCardList_item}>
            <ArticleCompactCard {...item} />
          </div>
        ))}
      </div>
    </div>
  )
}
