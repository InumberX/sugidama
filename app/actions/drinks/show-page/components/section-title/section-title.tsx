// Ported from develop: app/components/ui/typographies/SectionTitle
import { css, type Handle } from 'remix/component'

import * as styles from './section-title.styles.ts'
import type { SectionTitleProps } from './section-title.types.ts'

export type * from './section-title.types.ts'

export function SectionTitle(handle: Handle<SectionTitleProps>) {
  return () => {
    const { title, titleTag: Title = 'h2', id } = handle.props

    return (
      <div mix={css(styles.sectionTitle)}>
        <span aria-hidden="true" mix={css(styles.sectionTitle_divider)} />
        <Title id={id} mix={css(styles.sectionTitle_text)}>
          {title}
        </Title>
      </div>
    )
  }
}
