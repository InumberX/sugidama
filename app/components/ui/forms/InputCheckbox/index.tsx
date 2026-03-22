import { useState, useSyncExternalStore, useEffect } from 'react'

import { SvgIcon } from '~/components/ui/icons/SvgIcon'
import { TransitionFade } from '~/components/ui/transitions/TransitionFade'
import { ErrorMessage } from '~/components/ui/typographies/ErrorMessage'
import { HelperText, type HelperTextProps } from '~/components/ui/typographies/HelperText'

import * as styles from './style.css'

import type { getCollectionProps } from '@conform-to/react'

import type { EventTypes } from '~/types/event'

export type InputCheckboxOption = {
  value: string
  label: string
}

export type InputCheckboxProps = {
  className?: string
  name?: string
  isRequired?: boolean
  helperText?: HelperTextProps['text']
  options?: InputCheckboxOption[]
  isDisabled?: boolean
  errors?: string[]
  inputProps?: ReturnType<typeof getCollectionProps>
  id?: string
  labels?: string[]
  isError?: boolean
  value?: string | (string | undefined)[]
  onChange?: EventTypes['onChangeCheckbox']
  onClick?: EventTypes['onClickCheckbox']
  isReadOnly?: boolean
}

const normalizeValue = (value: string | (string | undefined)[] | undefined): string[] => {
  if (!value) {
    return []
  }
  return Array.isArray(value) ? value.filter((v): v is string => typeof v !== 'undefined') : [value]
}

export const InputCheckbox = ({
  className,
  name,
  isRequired,
  helperText,
  options,
  isDisabled,
  errors,
  inputProps,
  // id,
  labels,
  isError,
  value,
  onChange,
  onClick,
  isReadOnly,
}: InputCheckboxProps) => {
  const [currentValue, setCurrentValue] = useState<string[]>(() => {
    const normalized = normalizeValue(value)
    if (normalized.length > 0) {
      return normalized
    }

    // inputProps（Conform の getCollectionProps）から defaultChecked の値を取得
    if (inputProps) {
      return inputProps
        .filter((prop) => prop.defaultChecked)
        .map((prop) => prop.value)
        .filter((v): v is string => typeof v !== 'undefined')
    }

    return []
  })

  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = [...currentValue]
    const currentTargetValue = event.currentTarget.value

    // チェックがONの場合
    if (event.currentTarget.checked) {
      // 配列に値がまだない場合は追加
      if (!newValue.includes(currentTargetValue)) {
        newValue.push(currentTargetValue)
      }
    }
    // チェックがOFFの場合
    else {
      // 配列に値がある場合は削除
      const index = newValue.indexOf(currentTargetValue)
      if (index !== -1) {
        newValue.splice(index, 1)
      }
    }

    // onChangeプロパティの有無に関わらず、内部状態を更新する
    setCurrentValue(newValue)

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

  useEffect(() => {
    if (value !== undefined) {
      setCurrentValue(normalizeValue(value))
    }
  }, [value])

  // ハイドレーション完了前は空の配列を表示してSSRとクライアントサイドの不整合を防ぐ
  const safeOptions = isHydrated ? options : undefined
  const safeInputProps = isHydrated ? inputProps : undefined
  const safeLabels = isHydrated ? labels : undefined

  return (
    <div className={[styles.inputCheckbox, className].filter(Boolean).join(' ')}>
      <div className={styles.inputCheckbox_wrapper}>
        <fieldset className={styles.inputCheckbox_container}>
          <ul className={styles.inputCheckbox_items}>
            {safeOptions
              ? safeOptions.map((option, i) => {
                  return (
                    <li key={i} className={styles.inputCheckbox_item}>
                      <label className={styles.inputCheckbox_label}>
                        <input
                          type="checkbox"
                          name={name}
                          value={option.value}
                          required={isRequired && currentValue.length <= 0}
                          className={[
                            styles.inputCheckbox_input,
                            (!!errors || isError) && styles.inputCheckbox_input__error,
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          disabled={isDisabled}
                          readOnly={isReadOnly}
                          onChange={handleChange}
                          onClick={handleClick}
                          checked={currentValue.includes(option.value)}
                        />
                        <span className={styles.inputCheckbox_contents}>
                          <span className={styles.inputCheckboxIcon}>
                            <SvgIcon className={styles.inputCheckboxIcon_icon} variant="check" />
                          </span>
                          {option.label && <span className={styles.inputCheckbox_text}>{option.label}</span>}
                        </span>
                      </label>
                    </li>
                  )
                })
              : safeInputProps?.map((inputProp, i) => {
                  const { defaultChecked: _, ...restInputProp } = inputProp
                  return (
                    <li key={inputProp.id} className={styles.inputCheckbox_item}>
                      <label className={styles.inputCheckbox_label}>
                        <input
                          {...restInputProp}
                          type="checkbox"
                          key={inputProp.key}
                          className={[
                            styles.inputCheckbox_input,
                            (!!errors || isError) && styles.inputCheckbox_input__error,
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          disabled={isDisabled}
                          readOnly={isReadOnly}
                          onChange={handleChange}
                          onClick={handleClick}
                          checked={currentValue.includes(inputProp.value ?? '')}
                        />
                        <span className={styles.inputCheckbox_contents}>
                          <span className={styles.inputCheckboxIcon}>
                            <SvgIcon className={styles.inputCheckboxIcon_icon} variant="check" />
                          </span>
                          {safeLabels && safeLabels.length > i && (
                            <span className={styles.inputCheckbox_text}>{safeLabels[i]}</span>
                          )}
                        </span>
                      </label>
                    </li>
                  )
                })}
          </ul>
        </fieldset>

        <TransitionFade isShow={!!errors} className={styles.inputCheckboxErrorMessage}>
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
