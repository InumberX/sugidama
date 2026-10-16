import { MEDIA_QUERY } from '../../../../../ui/styles/public/media-query.ts'
// Ported from develop: app/components/ui/paginations/BasePagination.
import { getTransition, type StyleRecipe } from '../../../../../ui/styles/public/mixins.ts'
import { fontMediumBold } from '../../../../../ui/styles/public/tokens.ts'

export const basePagination_items: StyleRecipe = {
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
  listStyle: 'none',
}

export const basePagination_item: StyleRecipe = { paddingInline: '4px' }
export const basePagination_item__prev: StyleRecipe = { paddingInlineStart: 0 }
export const basePagination_item__next: StyleRecipe = { paddingInlineEnd: 0 }
/** Hidden below md (develop's `obj__md obj__lg …`). */
export const basePagination_item__wideOnly: StyleRecipe = {
  display: 'none',
  [MEDIA_QUERY.MD]: { display: 'block' },
}
/** Hidden from md up (develop's `obj__xs obj__sm`). */
export const basePagination_item__narrowOnly: StyleRecipe = {
  [MEDIA_QUERY.MD]: { display: 'none' },
}

const CIRCLE: StyleRecipe = {
  ...fontMediumBold,
  alignItems: 'center',
  aspectRatio: '1 / 1',
  borderRadius: 'calc(infinity * 1px)',
  display: 'inline-flex',
  inlineSize: '40px',
  justifyContent: 'center',
  lineHeight: 1,
  position: 'relative',
}

export const basePaginationLink: StyleRecipe = {
  ...CIRCLE,
  color: 'var(--color-font-sub-dark)',
  textDecoration: 'none',
  transition: getTransition([{ property: 'color' }, { property: 'background-color' }]),
  [MEDIA_QUERY.HOVER]: {
    '&:hover': {
      backgroundColor: 'var(--color-background-sub-light)',
      color: 'var(--color-font-primary)',
    },
  },
}

/** Previous and next: a gradient disc that darkens on hover. */
export const basePaginationLink__step: StyleRecipe = {
  isolation: 'isolate',
  '&::before, &::after': {
    blockSize: '100%',
    borderRadius: 'inherit',
    content: '""',
    inlineSize: '100%',
    insetBlockStart: 0,
    insetInlineStart: 0,
    position: 'absolute',
  },
  '&::before': {
    background: 'linear-gradient(90deg, var(--color-gradation-primary))',
    transition: getTransition([{ property: 'opacity' }]),
    zIndex: -1,
  },
  '&::after': {
    background: 'linear-gradient(90deg, var(--color-gradation-primary-dark))',
    zIndex: -2,
  },
  [MEDIA_QUERY.HOVER]: {
    '&:hover::before': { opacity: 0 },
  },
}

export const basePaginationLink__disabled: StyleRecipe = {
  cursor: 'not-allowed',
  opacity: 'var(--opacity-disabled)',
}

export const basePaginationLink_icon: StyleRecipe = {
  backgroundColor: 'var(--color-background-light)',
  inlineSize: '24px',
}

export const basePaginationCurrent: StyleRecipe = {
  ...CIRCLE,
  backgroundColor: 'var(--color-background-sub-light)',
  color: 'var(--color-font-primary)',
}

export const basePaginationGap: StyleRecipe = { alignItems: 'center', display: 'flex' }

export const basePaginationGap_icon: StyleRecipe = {
  backgroundColor: 'var(--color-background-sub-dark)',
  inlineSize: '24px',
}
