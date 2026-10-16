// Type-only module: erased from browser output, so it may sit beside the
// component in public/ without adding to the client build.
import type { RemixNode } from 'remix/component'

import type { StyleRecipe } from '../../../styles/public/mixins.ts'

export type BaseAccordionItem = {
  /** Identifies the item; unique within one accordion. */
  value: string
  /** The trigger's content, beside the arrow. */
  label: RemixNode
  /** Shown while the item is open. */
  content: RemixNode
}

export type BaseAccordionProps = {
  items: BaseAccordionItem[]
  /** Items open on first render. Several may be open at once. */
  defaultValue?: string[]
  styleOverrides?: StyleRecipe
}
