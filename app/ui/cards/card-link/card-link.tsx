// The link inside a drink card. ArticleCard and the home page's compact card
// both render their title, description and thumbnail through it, so a card
// links the same way wherever it appears.
import type { Handle, RemixNode } from 'remix/component'

import { PrimitiveButton } from '../../primitives/buttons/primitive-button/primitive-button.tsx'
import type { StyleRecipe } from '../../styles/public/mixins.ts'

export type CardLinkProps = {
  /** The card's page; without one the part renders as an inert span. */
  url?: string
  styleOverrides: StyleRecipe
  /**
   * A second link to the same page (the thumbnail): kept for the mouse but
   * skipped by the keyboard and by screen readers, which would otherwise meet
   * an unnamed link whenever the image has no alt text. An inert part keeps
   * its content, alt text included, for there is no title link it repeats.
   */
  isRedundant?: boolean
  children?: RemixNode
}

/** A link to the card's page, or an inert span when the card has none. */
export function CardLink(handle: Handle<CardLinkProps>) {
  return () => {
    const { url, styleOverrides, isRedundant, children } = handle.props
    const element = url === undefined ? { nonClickableTag: 'span' as const } : { url }
    return (
      <PrimitiveButton
        {...element}
        ariaHidden={isRedundant && url !== undefined}
        styleOverrides={styleOverrides}
      >
        {children}
      </PrimitiveButton>
    )
  }
}
