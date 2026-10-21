// Ported from develop: app/components/ui/forms/FormSubSet. Only the drinks
// search uses it, so it lives with the page.
import { css, type Handle, type RemixNode } from 'remix/component'

import * as styles from './form-sub-set.styles.ts'

export type FormSubSetProps = {
  title: RemixNode
  /** The field the title names; makes the title its `<label>`. */
  htmlFor?: string
  isFirst?: boolean
  isLast?: boolean
  children?: RemixNode
}

/** A titled form field: the title above, the control below. */
export function FormSubSet(handle: Handle<FormSubSetProps>) {
  return () => {
    const { title, htmlFor, isFirst, isLast, children } = handle.props

    return (
      <dl
        mix={css({
          ...styles.formSubSet,
          ...(isFirst ? styles.formSubSet__first : null),
          ...(isLast ? styles.formSubSet__last : null),
        })}
      >
        <dt mix={css(styles.formSubSet_title)}>
          {htmlFor ? <label for={htmlFor}>{title}</label> : title}
        </dt>
        <dd mix={css(styles.formSubSet_contents)}>{children}</dd>
      </dl>
    )
  }
}
