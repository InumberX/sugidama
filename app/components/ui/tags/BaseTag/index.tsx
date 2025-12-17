import { type ReactNode, useMemo } from 'react'

import * as styles from './style.css'

import { PrimitiveButton, type PrimitiveButtonProps } from '~/components/primitives/buttons/PrimitiveButton'

export type BaseTagProps = PrimitiveButtonProps & {
  variant?: 'contained' | 'outlined'
  color?: 'sub'
  children?: ReactNode
  leftElm?: ReactNode
  rightElm?: ReactNode
}

export const BaseTag = ({
  isDisabled,
  className,
  children,
  leftElm,
  rightElm,
  variant = 'contained',
  color = 'sub',
  onClick,
  url,
  buttonType,
  ...props
}: BaseTagProps) => {
  const baseTagClassName = useMemo(() => {
    return [
      styles.baseTag,
      styles[`baseTag__${variant}`],
      styles[`baseTag__${color}`],
      (url || onClick || buttonType) && styles.baseTag__button,
      isDisabled && styles.baseTag__disabled,
      className,
    ]
      .filter(Boolean)
      .join(' ')
  }, [variant, color, url, onClick, buttonType, isDisabled, className])

  return (
    <PrimitiveButton {...props} className={baseTagClassName} isDisabled={isDisabled} onClick={onClick} url={url} buttonType={buttonType}>
      <span className={styles.baseTag_container}>
        {leftElm}
        <span className={styles.baseTag_text}>{children}</span>
        {rightElm}
      </span>
    </PrimitiveButton>
  )
}
