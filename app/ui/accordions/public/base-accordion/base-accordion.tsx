// Ported from develop's search condition groups (SearchDrinksForm), the only
// accordion develop had.
import { css, on, type Handle } from 'remix/component'

import { SvgIcon } from '../../../icons/public/svg-icon/svg-icon.tsx'
import * as styles from './base-accordion.styles.ts'
import type { BaseAccordionProps } from './base-accordion.types.ts'

export type * from './base-accordion.types.ts'

/**
 * Items that open and close independently, as native `<details>`: the
 * browser owns opening and closing, the keyboard and what assistive
 * technology is told, and it works without script.
 *
 * The open state is still mirrored here from each `toggle` event, because a
 * re-render resets `open` to whatever the props say: inside a client entry
 * (the drinks search, which re-renders on every checkbox) an item the visitor
 * opened would otherwise close again on the next update.
 */
export function BaseAccordion(handle: Handle<BaseAccordionProps>) {
  const open = new Set(handle.props.defaultValue ?? [])

  return () => {
    const { items, styleOverrides } = handle.props

    return (
      <div mix={css({ ...styles.baseAccordion, ...styleOverrides })}>
        {items.map((item) => (
          <details
            key={item.value}
            open={open.has(item.value) || undefined}
            mix={[
              css(styles.baseAccordionItem),
              on('toggle', (event) => {
                if ((event.currentTarget as HTMLDetailsElement).open) open.add(item.value)
                else open.delete(item.value)
              }),
            ]}
          >
            <summary mix={css(styles.baseAccordionTrigger)}>
              <span mix={css(styles.baseAccordionTrigger_label)}>{item.label}</span>
              <SvgIcon
                variant="keyboardArrowDown"
                styleOverrides={styles.baseAccordionTrigger_arrow}
              />
            </summary>
            <div mix={css(styles.baseAccordionContent)}>{item.content}</div>
          </details>
        ))}
      </div>
    )
  }
}
