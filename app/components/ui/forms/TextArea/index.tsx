import { TransitionFade } from '~/components/ui/transitions/TransitionFade'
import { ErrorMessage } from '~/components/ui/typographies/ErrorMessage'
import { HelperText, type HelperTextProps } from '~/components/ui/typographies/HelperText'

import * as styles from './style.css'

import type { getTextareaProps } from '@conform-to/react'

export type TextAreaProps = {
  className?: string
  placeholder?: string
  helperText?: HelperTextProps['text']
  isDisabled?: boolean
  errors?: string[]
  inputProps?: ReturnType<typeof getTextareaProps>
  id?: string
  minHeight?: number
  maxHeight?: number
  isError?: boolean
  isReadOnly?: boolean
  currentLength?: number
  maxLength?: number
}

export const TextArea = ({
  className,
  placeholder,
  helperText,
  isDisabled,
  errors,
  inputProps,
  id,
  minHeight = 160,
  maxHeight,
  isError,
  isReadOnly,
  currentLength,
  maxLength,
}: TextAreaProps) => {
  return (
    <div className={[styles.textArea, className].filter(Boolean).join(' ')}>
      <div className={styles.textArea_wrapper}>
        <div className={styles.textArea_container}>
          <label className={styles.textArea_label}>
            <textarea
              {...inputProps}
              id={id ?? inputProps?.id}
              key={inputProps?.key ?? id}
              placeholder={placeholder}
              className={[styles.textArea_input, (!!errors || isError) && styles.textArea_input__error]
                .filter(Boolean)
                .join(' ')}
              disabled={isDisabled}
              readOnly={isReadOnly}
              style={{
                minBlockSize: `${minHeight}px`,
                maxBlockSize: maxHeight ? `${maxHeight}px` : 'none',
              }}
            />
          </label>

          {maxLength && typeof currentLength !== 'undefined' && (
            <div className={styles.textAreaMaxLength}>
              <p className={styles.textAreaMaxLength_paragraph}>
                <span className={styles.textAreaMaxLength_text}>{currentLength}</span>
                <span className={styles.textAreaMaxLength_text}>/</span>
                <span className={styles.textAreaMaxLength_text}>{maxLength}</span>
              </p>
            </div>
          )}
        </div>

        <TransitionFade isShow={!!errors} className={styles.textAreaErrorMessage}>
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
