import { MEDIA_QUERY } from '../../../../../../ui/styles/public/media-query.ts'
// Ported from develop: app/components/ui/forms/InputCheckbox, keeping the
// states the drinks search reaches (focus, hover, checked).
import {
  getFontSize,
  getTransition,
  type StyleRecipe,
} from '../../../../../../ui/styles/public/mixins.ts'

export const inputCheckbox: StyleRecipe = {
  border: 'none',
  margin: 0,
  minInlineSize: 0,
  padding: 0,
}

export const inputCheckbox_items: StyleRecipe = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '16px',
  listStyle: 'none',
}

export const inputCheckbox_label: StyleRecipe = {
  cursor: 'pointer',
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  paddingBlock: '8px',
  paddingInline: '8px 16px',
  position: 'relative',
}

/** Visually hidden but focusable: the box below draws its state. */
export const inputCheckbox_input: StyleRecipe = {
  insetBlockStart: 0,
  insetInlineStart: 0,
  margin: 0,
  opacity: 0,
  position: 'absolute',
}

export const inputCheckboxBox: StyleRecipe = {
  aspectRatio: '1 / 1',
  border: '2px solid var(--color-border-sub)',
  borderRadius: '4px',
  display: 'block',
  inlineSize: '24px',
  position: 'relative',
  transition: getTransition([{ property: 'border-color' }, { property: 'background-color' }]),
  ':focus-visible + &': {
    outline: '2px solid var(--color-font-base)',
    outlineOffset: '2px',
  },
  ':checked + &': {
    backgroundColor: 'var(--color-background-primary)',
    borderColor: 'var(--color-border-primary)',
  },
  [MEDIA_QUERY.HOVER]: {
    'label:hover > &': { borderColor: 'var(--color-border-primary)' },
  },
}

export const inputCheckboxBox_icon: StyleRecipe = {
  backgroundColor: 'var(--color-background-light)',
  inlineSize: '24px',
  insetBlockStart: '-2px',
  insetInlineStart: '-2px',
  opacity: 0,
  position: 'absolute',
  transition: getTransition([{ property: 'opacity' }]),
  ':checked + * > &': { opacity: 1 },
}

export const inputCheckbox_text: StyleRecipe = {
  fontSize: getFontSize(16),
  fontWeight: 'var(--font-weight-medium)',
  marginInlineStart: '8px',
}
