import type { StyleRecipe } from '../../ui/styles/public/mixins.ts'

export const devUiPage: StyleRecipe = {
  boxSizing: 'border-box',
  margin: 0,
  minHeight: '100vh',
  padding: '32px 24px 64px',
  background: '#f7f8f8',
  color: '#2f3a3a',
  fontFamily: 'system-ui, sans-serif',
  '& *, & *::before, & *::after': { boxSizing: 'border-box' },
}

export const devUiPage_heading: StyleRecipe = { margin: '0 0 32px', fontSize: '20px' }

/** A dark ground for the light text button. */
export const devUiPage_dark: StyleRecipe = {
  background: 'var(--color-util-black)',
  borderRadius: '6px',
  padding: '8px 12px',
}

/**
 * A box the header's `position: fixed` parts stay inside: a transformed
 * element is the containing block of its fixed descendants.
 */
export const devUiPage_frame: StyleRecipe = {
  blockSize: '200px',
  inlineSize: '100%',
  outline: '1px dashed #c3cbcb',
  overflow: 'hidden',
  position: 'relative',
  transform: 'translateZ(0)',
}
