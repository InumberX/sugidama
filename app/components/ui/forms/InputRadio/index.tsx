import { useSyncExternalStore } from 'react'

import { TransitionFade } from '~/components/ui/transitions/TransitionFade'
import { ErrorMessage } from '~/components/ui/typographies/ErrorMessage'
import { HelperText, type HelperTextProps } from '~/components/ui/typographies/HelperText'

import * as styles from './style.css'

import type { getCollectionProps } from '@conform-to/react'
import type React from 'react'

import type { EventTypes } from '~/types/event'

export type InputRadioProps = {
  className?: string
  helperText?: HelperTextProps['text']
  isDisabled?: boolean
  errors?: string[]
  inputProps: ReturnType<typeof getCollectionProps>
  id?: string
  labels?: string[]
  isError?: boolean
  isReadOnly?: boolean
  onChange?: EventTypes['onChangeRadio']
  onClick?: EventTypes['onClickRadio']
}

export const InputRadio = ({
  className,
  helperText,
  isDisabled,
  errors,
  inputProps,
  // id,
  labels,
  isError,
  isReadOnly,
  onChange,
  onClick,
}: InputRadioProps) => {
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value

    if (!onChange) {
      return
    }

    onChange(event, newValue)
  }

  const handleClick = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    if (!onClick) {
      return
    }

    const isChecked = event.currentTarget.checked

    onClick(event, isChecked)
  }

  // ハイドレーション完了前は空の配列を表示してSSRとクライアントサイドの不整合を防ぐ
  const safeInputProps = isHydrated ? inputProps : []
  const safeLabels = isHydrated ? labels : undefined

  return (
    <div className={[styles.inputRadio, className].filter(Boolean).join(' ')}>
      <div className={styles.inputRadio_wrapper}>
        <fieldset className={styles.inputRadio_container}>
          <ul className={styles.inputRadio_items}>
            {safeInputProps.map((inputProp, i) => {
              return (
                <li key={inputProp.id} className={styles.inputRadio_item}>
                  <label className={styles.inputRadio_label}>
                    <input
                      {...inputProp}
                      type="radio"
                      key={inputProp.key}
                      className={[styles.inputRadio_input, (!!errors || isError) && styles.inputRadio_input__error]
                        .filter(Boolean)
                        .join(' ')}
                      disabled={isDisabled}
                      readOnly={isReadOnly}
                      onChange={handleChange}
                      onClick={handleClick}
                    />
                    <span className={styles.inputRadio_contents}>
                      <span className={styles.inputRadioIcon}>
                        <i className={styles.inputRadioIcon_icon} />
                      </span>
                      {safeLabels && safeLabels.length > i && (
                        <span className={styles.inputRadio_text}>{safeLabels[i]}</span>
                      )}
                    </span>
                  </label>
                </li>
              )
            })}
          </ul>
        </fieldset>

        <TransitionFade isShow={!!errors} className={styles.inputRadioErrorMessage}>
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
