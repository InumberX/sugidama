// Ported from develop's search condition tabs (SearchDrinksForm), the only
// tabs develop had, as the WAI-ARIA Tabs pattern with automatic activation:
// https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
// Interactive: render it inside a clientEntry.
import { css, on, type Handle } from 'remix/component'

import * as styles from './base-tabs.styles.ts'
import type { BaseTabsProps } from './base-tabs.types.ts'

export type * from './base-tabs.types.ts'

/** The tab index a key moves to from `current` among `count` tabs, or null for any other key. */
export const nextTabIndex = (key: string, current: number, count: number): number | null => {
  switch (key) {
    case 'ArrowRight':
      return (current + 1) % count
    case 'ArrowLeft':
      return (current - 1 + count) % count
    case 'Home':
      return 0
    case 'End':
      return count - 1
    default:
      return null
  }
}

/**
 * A tab list and its panels. Only the active tab is in the tab order (the
 * arrow keys, Home and End move between tabs and select as they go), and
 * inactive panels are `hidden`.
 */
export function BaseTabs(handle: Handle<BaseTabsProps>) {
  let active = handle.props.defaultValue ?? handle.props.items[0]?.value

  const tabId = (value: string) => `${handle.id}-tab-${value}`
  const panelId = (value: string) => `${handle.id}-panel-${value}`

  return () => {
    const { items, label, styleOverrides } = handle.props
    // An active value that is no longer among the items falls back to the first.
    const current = items.some((item) => item.value === active) ? active : items[0]?.value

    const select = (value: string) => {
      active = value
      void handle.update()
    }

    return (
      <div mix={css({ ...styles.baseTabs, ...styleOverrides })}>
        <div role="tablist" aria-label={label} mix={css(styles.baseTabs_list)}>
          {items.map((item, index) => {
            const isActive = item.value === current

            return (
              <button
                key={item.value}
                type="button"
                role="tab"
                id={tabId(item.value)}
                aria-selected={isActive ? 'true' : 'false'}
                aria-controls={panelId(item.value)}
                tabIndex={isActive ? 0 : -1}
                mix={[
                  css(styles.baseTabsTab),
                  on('click', () => select(item.value)),
                  on('keydown', (event) => {
                    const next = nextTabIndex(event.key, index, items.length)
                    const target = next === null ? undefined : items[next]
                    if (target === undefined) return
                    event.preventDefault()
                    select(target.value)
                    document.getElementById(tabId(target.value))?.focus()
                  }),
                ]}
              >
                {item.label}
              </button>
            )
          })}
        </div>
        {items.map((item) => (
          <div
            key={item.value}
            role="tabpanel"
            id={panelId(item.value)}
            aria-labelledby={tabId(item.value)}
            hidden={item.value !== current}
            mix={css(styles.baseTabsPanel)}
          >
            {item.content}
          </div>
        ))}
      </div>
    )
  }
}
