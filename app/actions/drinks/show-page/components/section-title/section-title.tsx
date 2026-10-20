// Ported from develop: app/components/ui/typographies/SectionTitle
import { css, type Handle } from 'remix/component'

import * as styles from './section-title.styles.ts'
import type { SectionTitleProps } from './section-title.types.ts'

export type * from './section-title.types.ts'

export function SectionTitle(handle: Handle<SectionTitleProps>) {
  return () => {
    const { title } = handle.props

    return (
      <div mix={css(styles.sectionTitle)}>
        <span aria-hidden="true" mix={css(styles.sectionTitle_divider)} />
        <h2 mix={css(styles.sectionTitle_text)}>{title}</h2>
      </div>
    )
  }
}
