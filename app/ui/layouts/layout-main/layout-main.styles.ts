// Ported from develop: app/components/ui/layouts/LayoutMain/style.css.ts
import type { StyleRecipe } from '../../styles/public/mixins.ts'

/**
 * The container descendants size against. `CONTAINER_QUERY.*` carries no name,
 * so it resolves to the NEAREST ancestor with `container-type` — this one, until
 * something closer opens a container of its own. Targeting this container
 * specifically needs the named form (`@container layout-main (...)`), which the
 * shared constants do not build; write it out where you need it.
 */
export const LAYOUT_MAIN_CONTAINER = 'layout-main'

/**
 * A centred column, capped at the inner width plus both paddings plus both
 * gutters, that grows to fill `LayoutWrapper`.
 */
export const layoutMain: StyleRecipe = {
  containerName: LAYOUT_MAIN_CONTAINER,
  containerType: 'inline-size',
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  inlineSize: '100%',
  marginInline: 'auto',
  // The gutter between the viewport edge and the white sheet (develop's 16px).
  maxInlineSize: 'calc(var(--layout-inner-max-width-large) + (var(--layout-main-gutter) * 2))',
  paddingInline: 'var(--layout-main-gutter)',
}

/** The white sheet the page sits on. */
export const layoutMain_container: StyleRecipe = {
  backgroundColor: 'var(--color-background-light)',
  flexGrow: 1,
}
