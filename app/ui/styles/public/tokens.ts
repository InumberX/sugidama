// Ported from develop: app/styles/variables/font.css.ts
//
// Colors and font weights are NOT duplicated here — they are CSS custom
// properties declared in `@layer base` of public/static/css/app.css, so that
// the `util` layer can override them. Reference them with `var(--…)`; a TS
// copy would be a second source of truth the cascade cannot reach.
import { getClampRem, getFontSize, type StyleRecipe } from './mixins.ts'

const MEDIUM = 'var(--font-weight-medium)'
const BOLD = 'var(--font-weight-bold)'

export const fontHeading1: StyleRecipe = { fontSize: getClampRem(20, 28), fontWeight: BOLD }
export const fontHeading2: StyleRecipe = { fontSize: getClampRem(18, 24), fontWeight: BOLD }
export const fontHeading3: StyleRecipe = { fontSize: getClampRem(16, 22), fontWeight: BOLD }
export const fontHeading4: StyleRecipe = { fontSize: getClampRem(14, 20), fontWeight: BOLD }

export const fontMaximumBold: StyleRecipe = { fontSize: getClampRem(28, 40), fontWeight: BOLD }

export const fontLarge: StyleRecipe = { fontSize: getClampRem(16, 18), fontWeight: MEDIUM }
export const fontLargeBold: StyleRecipe = { fontSize: getClampRem(16, 18), fontWeight: BOLD }

export const fontMedium: StyleRecipe = { fontSize: getClampRem(14, 16), fontWeight: MEDIUM }
export const fontMediumBold: StyleRecipe = { fontSize: getClampRem(14, 16), fontWeight: BOLD }

export const fontSmall: StyleRecipe = { fontSize: getClampRem(12, 14), fontWeight: MEDIUM }
export const fontSmallBold: StyleRecipe = { fontSize: getClampRem(12, 14), fontWeight: BOLD }

export const fontCaption: StyleRecipe = { fontSize: getFontSize(12), fontWeight: MEDIUM }
export const fontCaptionBold: StyleRecipe = { fontSize: getFontSize(12), fontWeight: BOLD }

export const fontMinimum: StyleRecipe = { fontSize: getFontSize(10), fontWeight: MEDIUM }
export const fontMinimumBold: StyleRecipe = { fontSize: getFontSize(10), fontWeight: BOLD }
