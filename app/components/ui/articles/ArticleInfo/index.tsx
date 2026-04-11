import * as styles from './style.css'

import { ReplaceNewLineText } from '~/components/ui/typographies/ReplaceNewLineText'

export type ArticleInfoProps = {
  className?: string
  items: {
    title: string
    text: string
  }[]
}

export const ArticleInfo = ({ className, items }: ArticleInfoProps) => {
  return (
    <div className={[styles.articleInfo, className].filter(Boolean).join(' ')}>
      <div className={styles.articleInfo_container}>
        <div className={styles.articleInfo_items}>
          {items.map((item, index) => (
            <dl key={`${item.title}-${item.text}-${index}`} className={styles.articleInfo_item}>
              <dt className={styles.articleInfo_title}>
                <ReplaceNewLineText text={item.title} />
              </dt>
              <dd className={styles.articleInfo_text}>
                <ReplaceNewLineText text={item.text} />
              </dd>
            </dl>
          ))}
        </div>
      </div>
    </div>
  )
}
