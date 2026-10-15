import type { RemixNode } from 'remix/component'

export type SpecimenProps = {
  label: string
  /** Spans the whole row, for a component laid out against the page width (the header). */
  isWide?: boolean
  children?: RemixNode
}
