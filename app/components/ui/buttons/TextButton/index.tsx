import { type ReactNode, useMemo } from 'react'

import * as styles from './style.css'

import { PrimitiveButton, type PrimitiveButtonProps } from '~/components/primitives/buttons/PrimitiveButton'

export type TextButtonProps = PrimitiveButtonProps & {
  size?: 'large' | 'medium' | 'small'
  color?: 'sub' | 'light' | 'primary' | 'subDark'
  leftElm?: ReactNode
  rightElm?: ReactNode
  children?: ReactNode
}

export const TextButton = ({
  isDisabled,
  className,
  children,
  leftElm,
  rightElm,
  size = 'medium',
  color = 'primary',
  ...props
}: TextButtonProps) => {
  const textButtonClassName = useMemo(() => {
    return [
      styles.textButton,
      isDisabled && styles.textButton__disabled,
      className,
      styles[`textButton__${size}`],
      styles[`textButton__${color}`],
    ]
      .filter(Boolean)
      .join(' ')
  }, [isDisabled, className, size, color])

  return (
    <PrimitiveButton {...props} className={textButtonClassName} isDisabled={isDisabled}>
      <span className={styles.textButton_container}>
        {leftElm}
        <span className={styles.textButton_text}>{children}</span>
        {rightElm}
      </span>
    </PrimitiveButton>
  )
}
