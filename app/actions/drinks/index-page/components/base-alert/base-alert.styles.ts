// Ported from develop: app/components/ui/alerts/BaseAlert.
import { CONTAINER_QUERY } from '../../../../../ui/styles/public/media-query.ts'
import { getClampPx, type StyleRecipe } from '../../../../../ui/styles/public/mixins.ts'
import { fontCaption, fontSmall } from '../../../../../ui/styles/public/tokens.ts'

export const baseAlert: StyleRecipe = {
  borderRadius: getClampPx(4, 8),
  display: 'grid',
  alignItems: 'flex-start',
  gridTemplateAreas: '"icon title" "description description"',
  gridTemplateColumns: 'auto 1fr',
  padding: getClampPx(8, 16),
  [CONTAINER_QUERY.SM]: { gridTemplateAreas: '"icon title" "icon description"' },
}

export const baseAlertColors = {
  success: { backgroundColor: 'var(--color-background-success-light)' },
  error: { backgroundColor: 'var(--color-background-error-light)' },
} as const satisfies Record<string, StyleRecipe>

export const baseAlertIconColors = {
  success: { backgroundColor: 'var(--color-background-success)' },
  error: { backgroundColor: 'var(--color-background-error)' },
} as const satisfies Record<string, StyleRecipe>

export const baseAlert_icon: StyleRecipe = { display: 'flex', gridArea: 'icon', inlineSize: '24px' }

export const baseAlert_title: StyleRecipe = {
  ...fontSmall,
  color: 'var(--color-font-base)',
  gridArea: 'title',
  marginBlockStart: getClampPx(2, 3),
  marginInlineStart: getClampPx(8, 16),
}

export const baseAlert_description: StyleRecipe = {
  ...fontCaption,
  color: 'var(--color-font-sub-dark)',
  gridArea: 'description',
  marginBlockStart: getClampPx(4, 8),
  [CONTAINER_QUERY.SM]: { marginInlineStart: getClampPx(8, 16) },
}
