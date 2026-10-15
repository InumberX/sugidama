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

/** develop's gutter between the viewport edge and the white sheet. */
const GUTTER = '16px'

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
  maxInlineSize: `calc(var(--layout-inner-width-large) + (var(--layout-inner-padding-md) * 2) + (${GUTTER} * 2))`,
  paddingInline: GUTTER,
}

/** The white sheet the page sits on. */
export const layoutMain_container: StyleRecipe = {
  backgroundColor: 'var(--color-background-light)',
  flexGrow: 1,
}
