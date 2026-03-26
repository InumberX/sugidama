import type { getSelectProps } from '@conform-to/react'
import { useTranslation } from 'react-i18next'

import * as styles from './style.css'

import { TransitionFade } from '~/components/ui/transitions/TransitionFade'
import { ErrorMessage } from '~/components/ui/typographies/ErrorMessage'
import { HelperText, type HelperTextProps } from '~/components/ui/typographies/HelperText'
import type { EventTypes } from '~/types/event'

export type SelectOption = {
  value: string
  label: string
}

export type SelectProps = {
  className?: string
  helperText?: HelperTextProps['text']
  options: SelectOption[]
  isDisabled?: boolean
  value?: string
  errors?: string[]
  isNotOutputEmptyOption?: boolean
  inputProps?: ReturnType<typeof getSelectProps>
  id?: string
  isError?: boolean
  onChange?: EventTypes['onChangeSelect']
  isReadOnly?: boolean
  dataTestId?: string
}

export const Select = ({
  className,
  helperText,
  options,
  isDisabled,
  value,
  errors,
  isNotOutputEmptyOption,
  inputProps,
  id,
  isError,
  onChange,
  isReadOnly,
  dataTestId,
}: SelectProps) => {
  const { t } = useTranslation('components/ui/forms/select')

  return (
    <div className={[styles.select, className].filter(Boolean).join(' ')}>
      <div className={styles.select_container}>
        <label className={styles.select_label}>
          <select
            data-test-id={dataTestId}
            value={value}
            {...inputProps}
            id={id ?? inputProps?.id}
            key={inputProps?.key ?? id}
            className={[styles.select_input, (!!errors || isError) && styles.select_input__error]
              .filter(Boolean)
              .join(' ')}
            disabled={isDisabled}
            // @ts-expect-error - readOnly prop is not included in HTMLSelectElement but needed for form handling
            readOnly={isReadOnly}
            onChange={(event) => {
              const newValue = event.currentTarget.value

              if (!onChange) {
                return
              }

              onChange(event, newValue)
            }}
          >
            {!isNotOutputEmptyOption && <option value="">{t('emptyOptionLabel')}</option>}
            {options.map((option, i) => {
              return (
                <option key={i} value={option.value}>
                  {option.label}
                </option>
              )
            })}
          </select>
        </label>

        <TransitionFade isShow={!!errors} className={styles.selectErrorMessage}>
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
