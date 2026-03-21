import { TransitionFade } from '~/components/ui/transitions/TransitionFade'
import { ErrorMessage } from '~/components/ui/typographies/ErrorMessage'
import { HelperText, type HelperTextProps } from '~/components/ui/typographies/HelperText'

import * as styles from './style.css'

import type { getInputProps } from '@conform-to/react'

import type { EventTypes } from '~/types/event'

export type InputTextProps = {
  className?: string
  type?: 'text' | 'url' | 'email' | 'password' | 'search'
  name?: string
  placeholder?: string
  helperText?: HelperTextProps['text']
  isDisabled?: boolean
  errors?: string[]
  inputProps?: ReturnType<typeof getInputProps>
  id?: string
  isError?: boolean
  value?: string
  onChange?: EventTypes['onChangeText']
  onBlur?: EventTypes['onBlur']
  onFocus?: EventTypes['onFocus']
  unit?: string
  maxWidth?: string | number
  autoComplete?: 'off' | 'on' | 'new-password'
  isReadOnly?: boolean
}

export const InputText = ({
  type = 'text',
  className,
  name,
  placeholder,
  helperText,
  isDisabled,
  errors,
  inputProps,
  id,
  isError,
  value,
  onChange,
  onBlur,
  onFocus,
  unit,
  maxWidth,
  autoComplete,
  isReadOnly,
}: InputTextProps) => {
  return (
    <div className={[styles.inputText, className].filter(Boolean).join(' ')}>
      <div className={styles.inputText_container}>
        <label className={styles.inputText_label}>
          <span
            className={styles.inputText_contents}
            style={{
              maxWidth,
            }}
          >
            <input
              type={type}
              name={name}
              value={value}
              onChange={(event) => {
                const newValue = event.currentTarget.value

                if (!onChange) {
                  return
                }

                onChange(event, newValue)
              }}
              onBlur={onBlur}
              onFocus={onFocus}
              autoComplete={autoComplete}
              {...inputProps}
              key={id ?? inputProps?.key}
              id={id ?? inputProps?.id}
              placeholder={placeholder}
              className={[styles.inputText_input, (!!errors || isError) && styles.inputText_input__error]
                .filter(Boolean)
                .join(' ')}
              disabled={isDisabled}
              readOnly={isReadOnly}
            />
          </span>
          {unit && <span className={styles.inputText_unit}>{unit}</span>}
        </label>

        <TransitionFade isShow={!!errors} className={styles.inputTextErrorMessage}>
          {errors &&
            errors.map((error, i) => {
              return <ErrorMessage key={i} text={error} />
            })}
        </TransitionFade>

        {helperText && <HelperText text={helperText} />}
      </div>
    </div>
  )
}
