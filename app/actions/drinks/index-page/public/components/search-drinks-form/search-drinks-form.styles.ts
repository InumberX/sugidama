import { CONTAINER_QUERY, MEDIA_QUERY } from '../../../../../../ui/styles/public/media-query.ts'
// Ported from develop: SearchDrinksForm/style.css.ts. The tabs and the
// accordion triggers are BaseTabs / BaseAccordion now; what is left here is
// the form's own layout.
import {
  getClampPx,
  getTransition,
  type StyleRecipe,
} from '../../../../../../ui/styles/public/mixins.ts'
import { fontMinimumBold } from '../../../../../../ui/styles/public/tokens.ts'

/**
 * The custom property the component reads to tell the two layouts apart, so
 * it switches between tabs and accordion at exactly the container width the
 * CSS does.
 */
export const WIDE_PROPERTY = '--search-drinks-form-wide'

export const searchDrinksForm: StyleRecipe = {
  position: 'relative',
  [WIDE_PROPERTY]: '0',
  [CONTAINER_QUERY.MD]: { [WIDE_PROPERTY]: '1' },
}

export const searchDrinksFormInputs: StyleRecipe = {
  display: 'grid',
  gap: '16px',
  gridTemplateColumns: '1fr',
  position: 'relative',
  zIndex: 1,
  [CONTAINER_QUERY.MD]: { paddingBlockEnd: getClampPx(16, 24) },
}

export const searchDrinksFormInputs_reset: StyleRecipe = {
  display: 'flex',
  justifyContent: 'flex-end',
  [CONTAINER_QUERY.MD]: { justifyContent: 'flex-start' },
}

export const searchDrinksFormInputs_resetIcon: StyleRecipe = {
  backgroundColor: 'var(--color-background-sub)',
  flexShrink: 0,
  inlineSize: '20px',
  marginInlineEnd: '8px',
}

/**
 * Below md the conditions fold away behind "Add conditions"; the grid row
 * animates between 0fr and 1fr. Without JavaScript they stay open, since
 * nothing could open them.
 */
export const searchDrinksConditions: StyleRecipe = {
  display: 'grid',
  gridTemplateRows: '0fr',
  transition: getTransition([{ property: 'grid-template-rows' }]),
  [MEDIA_QUERY.NOT_SCRIPTING]: { gridTemplateRows: '1fr' },
  [CONTAINER_QUERY.MD]: { gridTemplateRows: '1fr' },
}

export const searchDrinksConditions__open: StyleRecipe = { gridTemplateRows: '1fr' }

export const searchDrinksConditions_wrapper: StyleRecipe = { overflow: 'hidden' }

export const searchDrinksConditions_container: StyleRecipe = { paddingBlockStart: '16px' }

export const searchDrinksConditions_contents: StyleRecipe = {
  backgroundColor: 'var(--color-background-sub-light)',
  maxBlockSize: '320px',
  overflow: 'clip auto',
  padding: '16px',
  [CONTAINER_QUERY.MD]: {
    borderBlockStart: '1px solid var(--color-border-sub)',
    maxBlockSize: 'none',
    overflow: 'visible',
    padding: '12px',
  },
}

/** The number of checked values beside a condition's name. */
export const searchDrinksConditionCount: StyleRecipe = {
  ...fontMinimumBold,
  alignItems: 'center',
  aspectRatio: '1 / 1',
  backgroundColor: 'var(--color-background-primary-light)',
  borderRadius: 'calc(infinity * 1px)',
  color: 'var(--color-font-sub-dark)',
  display: 'inline-flex',
  fontStyle: 'normal',
  inlineSize: '20px',
  justifyContent: 'center',
  marginInlineStart: '8px',
}

export const searchDrinksFormBottom: StyleRecipe = {
  backgroundColor: 'var(--color-background-light)',
  display: 'grid',
  gap: '16px',
  gridTemplateColumns: 'repeat(2, 1fr)',
  paddingBlockStart: '16px',
  [CONTAINER_QUERY.MD]: {
    borderBlockStart: '1px solid var(--color-border-sub)',
    gridTemplateColumns: '1fr',
    insetBlockEnd: 0,
    paddingBlock: '16px',
    position: 'sticky',
    zIndex: 2,
  },
}

export const searchDrinksFormBottom_button: StyleRecipe = { inlineSize: '100%' }

/** "Add conditions" only exists below md, and only works with JavaScript. */
export const searchDrinksFormBottom_toggle: StyleRecipe = {
  [MEDIA_QUERY.NOT_SCRIPTING]: { display: 'none' },
  [CONTAINER_QUERY.MD]: { display: 'none' },
}
