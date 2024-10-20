import { type StyleRule } from '@vanilla-extract/css'
import { getFontSize } from '~/styles/mixins/font.css'
import { getClampRem } from '~/styles/mixins/size.css'
import { cssVariables } from '~/styles/variables/cssVariables.css'

export const fontHeading1: StyleRule = {
  fontSize: getClampRem(20, 28),
  fontWeight: cssVariables.font.weight.bold,
}

export const fontHeading2: StyleRule = {
  fontSize: getClampRem(18, 24),
  fontWeight: cssVariables.font.weight.bold,
}

export const fontHeading3: StyleRule = {
  fontSize: getClampRem(16, 22),
  fontWeight: cssVariables.font.weight.bold,
}

export const fontHeading4: StyleRule = {
  fontSize: getClampRem(14, 20),
  fontWeight: cssVariables.font.weight.bold,
}

export const fontMaximumBold: StyleRule = {
  fontSize: getClampRem(28, 40),
  fontWeight: cssVariables.font.weight.bold,
}

export const fontLarge: StyleRule = {
  fontSize: getClampRem(16, 18),
  fontWeight: cssVariables.font.weight.medium,
}

export const fontLargeBold: StyleRule = {
  fontSize: getClampRem(16, 18),
  fontWeight: cssVariables.font.weight.bold,
}

export const fontMedium: StyleRule = {
  fontSize: getClampRem(14, 16),
  fontWeight: cssVariables.font.weight.medium,
}

export const fontMediumBold: StyleRule = {
  fontSize: getClampRem(14, 16),
  fontWeight: cssVariables.font.weight.bold,
}

export const fontSmall: StyleRule = {
  fontSize: getClampRem(12, 14),
  fontWeight: cssVariables.font.weight.medium,
}

export const fontSmallBold: StyleRule = {
  fontSize: getClampRem(12, 14),
  fontWeight: cssVariables.font.weight.bold,
}

export const fontCaption: StyleRule = {
  fontSize: getFontSize(12),
  fontWeight: cssVariables.font.weight.medium,
}

export const fontCaptionBold: StyleRule = {
  fontSize: getFontSize(12),
  fontWeight: cssVariables.font.weight.bold,
}

export const fontMinimum: StyleRule = {
  fontSize: getFontSize(10),
  fontWeight: cssVariables.font.weight.medium,
}

export const fontMinimumBold: StyleRule = {
  fontSize: getFontSize(10),
  fontWeight: cssVariables.font.weight.bold,
}
