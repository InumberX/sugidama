// Ported from develop: app/components/ui/forms/InputCheckbox, reduced to what
// the drinks search uses (no error, helper text or read-only state). Only that
// page uses it, so it lives with the page.
import { css, on, type Handle } from 'remix/component'

import { SvgIcon } from '../../../../../../ui/icons/public/svg-icon/svg-icon.tsx'
import * as styles from './input-checkbox.styles.ts'

export type InputCheckboxOption = { value: string; label: string }

export type InputCheckboxProps = {
  name: string
  /** The group's accessible name, e.g. the condition it filters by. */
  label: string
  options: InputCheckboxOption[]
  /** The checked values; the group is controlled by its owner. */
  values: string[]
  onToggle: (value: string, checked: boolean) => void
}

/** A group of checkboxes submitted under one name, one value each. */
export function InputCheckbox(handle: Handle<InputCheckboxProps>) {
  return () => {
    const { name, label, options, values, onToggle } = handle.props

    return (
      <fieldset aria-label={label} mix={css(styles.inputCheckbox)}>
        <ul mix={css(styles.inputCheckbox_items)}>
          {options.map((option) => (
            <li key={option.value}>
              <label mix={css(styles.inputCheckbox_label)}>
                <input
                  type="checkbox"
                  name={name}
                  value={option.value}
                  checked={values.includes(option.value)}
                  mix={[
                    css(styles.inputCheckbox_input),
                    on('change', (event) => onToggle(option.value, event.currentTarget.checked)),
                  ]}
                />
                <span mix={css(styles.inputCheckboxBox)}>
                  <SvgIcon variant="check" styleOverrides={styles.inputCheckboxBox_icon} />
                </span>
                <span mix={css(styles.inputCheckbox_text)}>{option.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
    )
  }
}
