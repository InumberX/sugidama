import type { BaseTagProps } from '../../tags/base-tag/base-tag.types.ts'

export type BaseTagListAlign = 'left' | 'center' | 'right'

/** A tag that does nothing: the only kind that may sit inside a link. */
export type BaseTagInertProps = Extract<BaseTagProps, { nonClickableTag: unknown }>

export type BaseTagListProps = { align?: BaseTagListAlign } & (
  | { items: BaseTagProps[]; isNotSemantic?: false }
  | {
      /**
       * Spans instead of `div > ul > li`, for a list inside phrasing content —
       * a link or a heading — where a `ul` is not allowed. Its tags must be
       * inert: a link inside a link is invalid HTML the browser tears apart.
       */
      items: BaseTagInertProps[]
      isNotSemantic: true
    }
)
