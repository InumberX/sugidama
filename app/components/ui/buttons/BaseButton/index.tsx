import { type ReactNode, useMemo } from 'react'

import * as styles from './style.css'

import { PrimitiveButton, type PrimitiveButtonProps } from '~/components/primitives/buttons/PrimitiveButton'

export type BaseButtonProps = PrimitiveButtonProps & {
  size?: 'large' | 'medium' | 'small'
  variant?: 'contained' // | 'outlined'
  color?: 'primary'
  leftElm?: ReactNode
  rightElm?: ReactNode
  children?: ReactNode
}

export const BaseButton = ({
  isDisabled,
  className,
  children,
  leftElm,
  rightElm,
  size = 'medium',
  variant = 'contained',
  color = 'primary',
  ...props
}: BaseButtonProps) => {
  const baseButtonClassName = useMemo(() => {
    return [
      styles.baseButton,
      isDisabled && styles.baseButton__disabled,
      className,
      styles[`baseButton__${size}`],
      styles[`baseButton__${variant}`],
      styles[`baseButton__${color}`],
    ]
      .filter(Boolean)
      .join(' ')
  }, [isDisabled, className, size, variant, color])

  return (
    <PrimitiveButton {...props} className={baseButtonClassName} isDisabled={isDisabled}>
      <span className={styles.baseButton_container}>
        {leftElm}
        <span className={styles.baseButton_text}>{children}</span>
        {rightElm}
      </span>
    </PrimitiveButton>
  )
}
