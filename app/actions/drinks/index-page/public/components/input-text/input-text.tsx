// Ported from develop: app/components/ui/forms/InputText, reduced to what the
// drinks search uses (no error, helper text, unit or read-only state). Only
// that page uses it, so it lives with the page.
import { css, type Handle } from 'remix/component'

import * as styles from './input-text.styles.ts'

export type InputTextProps = {
  id: string
  name: string
  defaultValue?: string
  placeholder?: string
  maxLength?: number
}

/** A single-line text field, uncontrolled: the form submits whatever it holds. */
export function InputText(handle: Handle<InputTextProps>) {
  return () => {
    const { id, name, defaultValue, placeholder, maxLength } = handle.props

    return (
      <input
        type="text"
        id={id}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        maxLength={maxLength}
        mix={css(styles.inputText)}
      />
    )
  }
}
