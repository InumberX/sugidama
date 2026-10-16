// An accordion over @remix-run/ui/accordion. This and BaseTabs are the only
// modules that import @remix-run/ui (an unstable 0.x package; .oxlintrc.json
// enforces it), so a breaking release is absorbed here rather than in every
// page. Interactive: render it inside a clientEntry.
import * as accordion from '@remix-run/ui/accordion'
import { css, type Handle } from 'remix/component'

import { SvgIcon } from '../../../icons/public/svg-icon/svg-icon.tsx'
import * as styles from './base-accordion.styles.ts'
import type { BaseAccordionProps } from './base-accordion.types.ts'

export type * from './base-accordion.types.ts'

/**
 * Items that open and close independently. The primitive wires the ids,
 * `aria-controls`, the arrow/Home/End keys between triggers and the
 * `data-state` attributes. The open state is kept here, not in the primitive,
 * because two of the attributes it writes are wrong in 0.12.1 and have to be
 * written explicitly (the primitive only fills in props the element lacks):
 * Remix renders its boolean `aria-expanded` as a bare attribute, which ARIA
 * reads as unset, and leaves it out entirely while closed; and a closed panel
 * gets `inert` but no `hidden`, so it would stay on screen.
 *
 * A closed panel is hidden by CSS from its `data-state`, not by `hidden` or
 * `inert`: `display: none` keeps it out of the accessibility tree and the
 * focus order just as well, and unlike an attribute in the server HTML it can
 * be lifted when the browser runs no script (`scripting: none`), where no
 * trigger could ever open it. `inert={false}` and `aria-hidden={false}` keep
 * the primitive's own defaults out for the same reason.
 */
export function BaseAccordion(handle: Handle<BaseAccordionProps>) {
  let open = [...(handle.props.defaultValue ?? [])]

  return () => {
    const { items, styleOverrides } = handle.props

    return (
      <accordion.Context
        type="multiple"
        value={open}
        onValueChange={(value) => {
          open = value
          void handle.update()
        }}
      >
        <div mix={[css({ ...styles.baseAccordion, ...styleOverrides }), accordion.root()]}>
          {items.map((item) => {
            const isOpen = open.includes(item.value)

            return (
              <accordion.ItemContext key={item.value} value={item.value}>
                <div mix={[css(styles.baseAccordionItem), accordion.item()]}>
                  <button
                    type="button"
                    aria-expanded={isOpen ? 'true' : 'false'}
                    mix={[css(styles.baseAccordionTrigger), accordion.trigger()]}
                  >
                    <span mix={css(styles.baseAccordionTrigger_label)}>{item.label}</span>
                    <SvgIcon
                      variant="keyboardArrowDown"
                      styleOverrides={styles.baseAccordionTrigger_arrow}
                    />
                  </button>
                  <div
                    inert={false}
                    aria-hidden={false}
                    mix={[css(styles.baseAccordionContent), accordion.content()]}
                  >
                    {item.content}
                  </div>
                </div>
              </accordion.ItemContext>
            )
          })}
        </div>
      </accordion.Context>
    )
  }
}
