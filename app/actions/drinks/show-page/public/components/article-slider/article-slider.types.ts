export type ArticleSliderSlide = {
  src: string
  alt: string
  /** The thumbnail button's accessible name ("1枚目の画像を表示"). */
  thumbnailLabel: string
}

export type ArticleSliderProps = {
  slides: ArticleSliderSlide[]
  messages: { prev: string; next: string }
}
