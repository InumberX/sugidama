// Tabs over @remix-run/ui/tabs. This and BaseAccordion are the only modules
// that import @remix-run/ui (an unstable 0.x package; .oxlintrc.json enforces
// it), so a breaking release is absorbed here rather than in every page.
// Interactive: render it inside a clientEntry.
import * as tabs from '@remix-run/ui/tabs'
import { css, type Handle } from 'remix/component'

import * as styles from './base-tabs.styles.ts'
import type { BaseTabsProps } from './base-tabs.types.ts'

export type * from './base-tabs.types.ts'

/**
 * A tab list and its panels. The primitive wires the roles, ids, selection,
 * arrow/Home/End keys, and hides inactive panels (`hidden` and `inert`).
 */
export function BaseTabs(handle: Handle<BaseTabsProps>) {
  return () => {
    const { items, label, defaultValue, styleOverrides } = handle.props

    return (
      <tabs.Context defaultActiveTab={defaultValue ?? items[0]?.value}>
        <div mix={[css({ ...styles.baseTabs, ...styleOverrides }), tabs.root()]}>
          <div aria-label={label} mix={[css(styles.baseTabs_list), tabs.list()]}>
            {items.map((item) => (
              <button
                key={item.value}
                type="button"
                mix={[css(styles.baseTabsTab), tabs.tab({ name: item.value })]}
              >
                {item.label}
              </button>
            ))}
          </div>
          {items.map((item) => (
            <div
              key={item.value}
              mix={[css(styles.baseTabsPanel), tabs.panel({ name: item.value })]}
            >
              {item.content}
            </div>
          ))}
        </div>
      </tabs.Context>
    )
  }
}
