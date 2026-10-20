// Ported from develop: app/components/ui/articles/BaseArticle
import { css, type Handle } from 'remix/component'

import { BaseTagList } from '../../../../../ui/lists/base-tag-list/base-tag-list.tsx'
import { PageTitle } from '../../../../../ui/typographies/page-title/page-title.tsx'
import { ArticleSlider } from '../../public/components/article-slider/article-slider.tsx'
import { ArticleInfo } from '../article-info/article-info.tsx'
import * as styles from './base-article.styles.ts'
import type { BaseArticleProps } from './base-article.types.ts'

export type * from './base-article.types.ts'

/** A drink: its name, images, facts and tags. Each part is left out when empty. */
export function BaseArticle(handle: Handle<BaseArticleProps>) {
  return () => {
    const { title, mainVisuals, info, tags, sliderMessages } = handle.props

    return (
      <article mix={css(styles.baseArticle)}>
        <div mix={css(styles.baseArticle_container)}>
          <div mix={css(styles.baseArticleTitle)}>
            <PageTitle title={title} />
          </div>
          {mainVisuals.length > 0 && (
            <div mix={css(styles.baseArticleMainVisual)}>
              <ArticleSlider slides={mainVisuals} messages={sliderMessages} />
            </div>
          )}
          {info.length > 0 && (
            <div mix={css(styles.baseArticleInfo)}>
              <ArticleInfo items={info} />
            </div>
          )}
          {tags.length > 0 && (
            <div mix={css(styles.baseArticleTags)}>
              <BaseTagList items={tags} />
            </div>
          )}
        </div>
      </article>
    )
  }
}
