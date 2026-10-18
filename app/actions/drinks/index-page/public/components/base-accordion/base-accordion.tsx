// Ported from develop's search condition groups (SearchDrinksForm), the only
// accordion develop had.
import { css, on, type Handle } from 'remix/component'

import { SvgIcon } from '../../../../../../ui/icons/public/svg-icon/svg-icon.tsx'
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
  // Seeded from the server's HTML when there is one: an item opened before
  // the client entry hydrated has no `toggle` listener to record it yet, and
  // the next update would close it again. Found by the caller's `id`, because
  // `handle.id` differs between the server and the browser (measured).
  const root = typeof document === 'undefined' ? null : document.getElementById(handle.props.id)
  const open = new Set(
    root === null
      ? (handle.props.defaultValue ?? [])
      : [...root.querySelectorAll<HTMLDetailsElement>(':scope > details[open]')].map(
          (details) => details.dataset.value ?? ''
        )
  )

  return () => {
    const { items, styleOverrides } = handle.props

    return (
      <div id={handle.props.id} mix={css({ ...styles.baseAccordion, ...styleOverrides })}>
        {items.map((item) => (
          <details
            key={item.value}
            data-value={item.value}
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
