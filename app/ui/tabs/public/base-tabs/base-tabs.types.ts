// Type-only module: erased from browser output, so it may sit beside the
// component in public/ without adding to the client build.
import type { RemixNode } from 'remix/component'

import type { StyleRecipe } from '../../../styles/public/mixins.ts'

export type BaseTabsItem = {
  /** Identifies the tab; unique within one set. */
  value: string
  /** The tab's own content. Keep it short: tabs scroll sideways, they do not wrap. */
  label: RemixNode
  /** The panel shown while this tab is active. */
  content: RemixNode
}

export type BaseTabsProps = {
  items: BaseTabsItem[]
  /** The accessible name of the tab list, e.g. what the tabs choose between. */
  label: string
  /** The tab active on first render. Defaults to the first one. */
  defaultValue?: string
  styleOverrides?: StyleRecipe
}
