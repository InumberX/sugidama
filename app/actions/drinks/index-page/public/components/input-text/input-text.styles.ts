import { MEDIA_QUERY } from '../../../../../../ui/styles/public/media-query.ts'
import {
  getFontSize,
  getTransition,
  type StyleRecipe,
} from '../../../../../../ui/styles/public/mixins.ts'

export const inputText: StyleRecipe = {
  backgroundColor: 'var(--color-background-light)',
  border: '1px solid var(--color-border-sub)',
  borderRadius: '4px',
  fontSize: getFontSize(16),
  fontWeight: 'var(--font-weight-medium)',
  inlineSize: '100%',
  paddingBlock: '12px',
  paddingInline: '16px',
  transition: getTransition([{ property: 'border-color' }, { property: 'background-color' }]),
  '&:focus': { borderColor: 'var(--color-border-primary)' },
  [MEDIA_QUERY.HOVER]: {
    '&:hover': { borderColor: 'var(--color-border-primary)' },
  },
}
