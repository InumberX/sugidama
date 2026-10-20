// Ported from develop: app/components/ui/articles/ArticleInfo
import { css, type Handle } from 'remix/component'

import { TextButton } from '../../../../../ui/buttons/public/text-button/text-button.tsx'
import { SvgIcon } from '../../../../../ui/icons/public/svg-icon/svg-icon.tsx'
import { ReplaceNewLineText } from '../../../../../ui/typographies/replace-new-line-text/replace-new-line-text.tsx'
import * as styles from './article-info.styles.ts'
import type { ArticleInfoProps } from './article-info.types.ts'

export type * from './article-info.types.ts'

/** A drink's facts: category, manufacturer, strength, comment and links. */
export function ArticleInfo(handle: Handle<ArticleInfoProps>) {
  return () => {
    const { items } = handle.props

    return (
      <dl mix={css(styles.articleInfo)}>
        {items.map((item, i) => (
          <div key={i} mix={css(styles.articleInfo_item)}>
            <dt mix={css(styles.articleInfo_title)}>
              <ReplaceNewLineText text={item.title} />
            </dt>
            <dd mix={css(styles.articleInfo_text)}>
              {item.text && <ReplaceNewLineText text={item.text} />}
              {item.links && item.links.length > 0 && (
                <ul mix={css(styles.articleInfoLinks)}>
                  {item.links.map((link, j) => (
                    <li key={j} mix={css(styles.articleInfoLinks_item)}>
                      <TextButton
                        url={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        leftElm={
                          <SvgIcon
                            variant="keyboardArrowRight"
                            styleOverrides={styles.articleInfoLinks_icon}
                          />
                        }
                      >
                        {link.text}
                      </TextButton>
                    </li>
                  ))}
                </ul>
              )}
            </dd>
          </div>
        ))}
      </dl>
    )
  }
}
