import type { RemixNode } from 'remix/component'

import type { StyleRecipe } from '../../styles/public/mixins.ts'
import type { BaseTagProps } from '../../tags/base-tag/base-tag.types.ts'

export type ArticleCardTitleTag = 'h2' | 'h3' | 'h4' | 'p'
export type ArticleCardTag = 'article' | 'div'

export type ArticleCardProps = {
  /**
   * Where the card leads: its title, description and thumbnail each link here.
   * develop took a whole `button` props object, and only ever passed `url`.
   */
  url?: string
  title: { text: RemixNode; titleTag?: ArticleCardTitleTag }
  /** A short line above the title. develop's drink cards put the posting date here. */
  description?: { text: RemixNode }
  /** Rendered outlined unless an item says otherwise. */
  tags?: BaseTagProps[]
  /** Without one, the card shows the empty 16:9 placeholder. */
  thumbnail?: { src: string; alt?: string }
  articleTag?: ArticleCardTag
  styleOverrides?: StyleRecipe
}
