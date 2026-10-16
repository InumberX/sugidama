import { MEDIA_QUERY } from '../../../styles/public/media-query.ts'
// Ported from develop's searchDrinksConditionsContentsHeader (the drinks search
// condition groups), the only accordion develop had.
import { getTransition, type StyleRecipe } from '../../../styles/public/mixins.ts'
import { fontSmallBold } from '../../../styles/public/tokens.ts'

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
  paddingBlock: '12px',
  paddingInline: 0,
  textAlign: 'start',
  transition: getTransition([{ property: 'color' }]),
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
  '[data-state="open"] > &': { rotate: '-180deg' },
  [MEDIA_QUERY.HOVER]: {
    'button:hover > &': { backgroundColor: 'var(--color-background-primary)' },
  },
  // Every panel is open without script, and no trigger can close one.
  [MEDIA_QUERY.NOT_SCRIPTING]: { display: 'none' },
}

/** Closed panels are hidden here rather than with `hidden`; see BaseAccordion. */
export const baseAccordionContent: StyleRecipe = {
  '&[data-state="closed"]': { display: 'none' },
  [MEDIA_QUERY.NOT_SCRIPTING]: {
    '&[data-state="closed"]': { display: 'block' },
  },
}
