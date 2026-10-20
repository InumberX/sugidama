// Ported from develop's searchDrinksConditionsContentsHeader (the drinks search
// condition groups), the only accordion develop had.
import { MEDIA_QUERY } from '../../../../../../ui/styles/public/media-query.ts'
import { getTransition, type StyleRecipe } from '../../../../../../ui/styles/public/mixins.ts'
import { fontSmallBold } from '../../../../../../ui/styles/public/tokens.ts'

export const baseAccordion: StyleRecipe = {}

export const baseAccordionItem: StyleRecipe = {}

export const baseAccordionTrigger: StyleRecipe = {
  ...fontSmallBold,
  alignItems: 'center',
  appearance: 'none',
  background: 'transparent',
  border: 'none',
  borderBlockStart: '1px solid var(--color-border-sub)',
  borderRadius: 0,
  color: 'var(--color-font-sub-dark)',
  cursor: 'pointer',
  display: 'flex',
  inlineSize: '100%',
  listStyle: 'none',
  paddingBlock: '12px',
  paddingInline: 0,
  textAlign: 'start',
  transition: getTransition([{ property: 'color' }]),
  // Safari still draws the disclosure triangle without `list-style: none`.
  '&::-webkit-details-marker': { display: 'none' },
  [MEDIA_QUERY.HOVER]: {
    '&:hover': { color: 'var(--color-font-primary)' },
  },
}

export const baseAccordionTrigger_label: StyleRecipe = {
  alignItems: 'center',
  display: 'flex',
  flexGrow: 1,
}

/** The arrow turns over while its item is open, and takes the hover color. */
export const baseAccordionTrigger_arrow: StyleRecipe = {
  backgroundColor: 'var(--color-background-sub-dark)',
  flexShrink: 0,
  inlineSize: '24px',
  marginInlineStart: '16px',
  transition: getTransition([{ property: 'background-color' }, { property: 'rotate' }]),
  '[open] > summary > &': { rotate: '-180deg' },
  [MEDIA_QUERY.HOVER]: {
    'summary:hover > &': { backgroundColor: 'var(--color-background-primary)' },
  },
}

export const baseAccordionContent: StyleRecipe = {}
