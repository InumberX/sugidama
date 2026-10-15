// Ported from develop: app/components/common/LayoutFooter
import { css, type Handle } from 'remix/component'

import { LayoutInner } from '../../layouts/layout-inner/layout-inner.tsx'
import * as styles from './layout-footer.styles.ts'
import type { LayoutFooterProps } from './layout-footer.types.ts'

export type * from './layout-footer.types.ts'

/**
 * The year in Japan, where the site's readers are. A Worker runs in UTC, and
 * nothing re-renders the footer in the browser as develop's hydration did, so
 * the server's own year would still read as last year until 09:00 on New
 * Year's Day.
 */
export const getYearInJapan = (date: Date): number =>
  Number(new Intl.DateTimeFormat('en', { timeZone: 'Asia/Tokyo', year: 'numeric' }).format(date))

export function LayoutFooter(handle: Handle<LayoutFooterProps>) {
  return () => {
    // Read per render, inside the request: in a Worker's global scope the
    // clock reads as the Unix epoch.
    const { year = getYearInJapan(new Date()) } = handle.props

    return (
      <footer mix={css(styles.layoutFooter)}>
        <div mix={css(styles.layoutFooter_wrapper)}>
          <LayoutInner>
            <div mix={css(styles.layoutFooterCopy)}>
              <p mix={css(styles.layoutFooterCopy_paragraph)}>
                <small lang="en" translate="no" mix={css(styles.layoutFooterCopy_text)}>
                  {`Copyright © ${year} N/NE, All rights reserved.`}
                </small>
              </p>
            </div>
          </LayoutInner>
        </div>
      </footer>
    )
  }
}
