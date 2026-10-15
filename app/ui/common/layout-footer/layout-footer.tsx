// Ported from develop: app/components/common/LayoutFooter
import { css, type Handle } from 'remix/component'

import { LayoutInner } from '../../layouts/layout-inner/layout-inner.tsx'
import * as styles from './layout-footer.styles.ts'
import type { LayoutFooterProps } from './layout-footer.types.ts'

export type * from './layout-footer.types.ts'

export function LayoutFooter(handle: Handle<LayoutFooterProps>) {
  return () => {
    // Read per render, inside the request: in a Worker's global scope the
    // clock reads as the Unix epoch.
    const { year = new Date().getFullYear() } = handle.props

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
