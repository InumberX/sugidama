// Ported from develop: app/components/ui/typographies/PageTitle
import { css, type Handle } from 'remix/component'

import { LayoutInner } from '../../layouts/layout-inner/layout-inner.tsx'
import * as styles from './page-title.styles.ts'
import type { PageTitleProps } from './page-title.types.ts'

export type * from './page-title.types.ts'

export function PageTitle(handle: Handle<PageTitleProps>) {
  return () => {
    const { title, titleTag: Title = 'h1', color = 'dark', isWrap, innerProps } = handle.props
    const contents = (
      <Title mix={css(styles.pageTitle_paragraph)}>
        <span mix={css({ ...styles.pageTitle_text, ...styles.pageTitleTextColors[color] })}>
          {title}
        </span>
      </Title>
    )

    return (
      <div mix={css(styles.pageTitle)}>
        {isWrap ? (
          <div mix={css(styles.pageTitle_wrapper)}>
            <LayoutInner {...innerProps}>{contents}</LayoutInner>
          </div>
        ) : (
          contents
        )}
      </div>
    )
  }
}
