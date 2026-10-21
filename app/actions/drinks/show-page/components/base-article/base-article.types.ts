import type { BaseTagProps } from '../../../../../ui/tags/base-tag/base-tag.types.ts'
import type { ArticleSliderProps } from '../../public/components/article-slider/article-slider.types.ts'
import type { ArticleInfoItem } from '../article-info/article-info.types.ts'

export type BaseArticleProps = {
  /** The page's `h1`. */
  title: string
  mainVisuals: ArticleSliderProps['slides']
  info: ArticleInfoItem[]
  tags: BaseTagProps[]
  sliderMessages: ArticleSliderProps['messages']
}
