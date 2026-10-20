// Ported from develop's searchDrinksConditionsButtons (the drinks search tabs),
// the only tabs develop had.
import { MEDIA_QUERY } from '../../../../../../ui/styles/public/media-query.ts'
import {
  getClampPx,
  getTransition,
  type StyleRecipe,
} from '../../../../../../ui/styles/public/mixins.ts'
import { fontSmall, fontSmallBold } from '../../../../../../ui/styles/public/tokens.ts'

export const baseTabs: StyleRecipe = {}

export const baseTabs_list: StyleRecipe = {
  borderBlockEnd: '1px solid var(--color-border-sub)',
  display: 'flex',
  overflow: 'auto clip',
}

export const baseTabsTab: StyleRecipe = {
  ...fontSmall,
  alignItems: 'center',
  appearance: 'none',
  background: 'transparent',
  border: 'none',
  borderRadius: 0,
  color: 'var(--color-font-sub-dark)',
  cursor: 'pointer',
  display: 'flex',
  flexShrink: 0,
  paddingBlock: '4px',
  paddingInline: getClampPx(12, 24),
  position: 'relative',
  transition: getTransition([{ property: 'color' }, { property: 'font-weight' }]),
  whiteSpace: 'nowrap',
  '&::before': {
    background: 'linear-gradient(90deg, var(--color-gradation-primary))',
    blockSize: '2px',
    content: '""',
    inlineSize: '100%',
    insetBlockEnd: 0,
    insetInlineStart: 0,
    opacity: 0,
    position: 'absolute',
    transition: getTransition([{ property: 'opacity' }]),
  },
  '&[aria-selected="true"]': {
    ...fontSmallBold,
    color: 'var(--color-font-primary)',
  },
  '&[aria-selected="true"]::before': { opacity: 1 },
  [MEDIA_QUERY.HOVER]: {
    '&:hover': { color: 'var(--color-font-primary)' },
  },
}

export const baseTabsPanel: StyleRecipe = {}
