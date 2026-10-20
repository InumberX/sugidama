// A section of the drink page: a title over a row of small cards.
import { css, type Handle } from 'remix/component'

import { LayoutInner } from '../../../../../ui/layouts/layout-inner/layout-inner.tsx'
import { LayoutSection } from '../../../../../ui/layouts/layout-section/layout-section.tsx'
import { ArticleCardList } from '../../../../../ui/lists/article-card-list/article-card-list.tsx'
import { SectionTitle } from '../section-title/section-title.tsx'
import * as styles from './card-row.styles.ts'
import type { CardRowProps } from './card-row.types.ts'

export type * from './card-row.types.ts'

/** Nothing at all when there are no cards: develop hid an empty or failed row. */
export function CardRow(handle: Handle<CardRowProps>) {
  return () => {
    const { title, cards } = handle.props
    if (cards.length === 0) return null

    return (
      <LayoutSection>
        <LayoutInner>
          <div mix={css(styles.cardRow_container)}>
            <SectionTitle title={title} />
            <ArticleCardList items={cards} itemSize="small" />
          </div>
        </LayoutInner>
      </LayoutSection>
    )
  }
}
