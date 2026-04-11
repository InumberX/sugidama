import * as styles from './style.css'

import { TextButton, type TextButtonProps } from '~/components/ui/buttons/TextButton'
import { SvgIcon } from '~/components/ui/icons/SvgIcon'
import { ReplaceNewLineText } from '~/components/ui/typographies/ReplaceNewLineText'

export type ArticleInfoProps = {
  className?: string
  items: {
    title: string
    text?: string
    links?: TextButtonProps[]
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
                {item.text && <ReplaceNewLineText text={item.text} />}
                {item.links && item.links.length > 0 && (
                  <div className={styles.articleInfoLinks}>
                    <ul className={styles.articleInfoLinks_items}>
                      {item.links.map((link, linkIndex) => (
                        <li key={linkIndex} className={styles.articleInfoLinks_item}>
                          <TextButton
                            {...link}
                            leftElm={<SvgIcon variant="keyboardArrowRight" className={styles.articleInfoLink_icon} />}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </dd>
            </dl>
          ))}
        </div>
      </div>
    </div>
  )
}
