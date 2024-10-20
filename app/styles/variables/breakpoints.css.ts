export type BreakpointsKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

export const BREAKPOINTS: {
  [key in BreakpointsKey]: number
} = {
  xs: 360,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
}
