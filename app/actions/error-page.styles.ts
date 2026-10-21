import { getClampPx, type StyleRecipe } from '../ui/styles/public/mixins.ts'
import { fontMedium } from '../ui/styles/public/tokens.ts'

export const errorPage_container: StyleRecipe = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  gap: getClampPx(24, 40),
  textAlign: 'center',
}

export const errorPage_description: StyleRecipe = {
  ...fontMedium,
}
