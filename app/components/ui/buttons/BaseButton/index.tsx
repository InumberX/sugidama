import { type ReactNode, useMemo } from 'react'
import { Link } from 'react-router'
import type { ButtonType, AnchorTarget, AnchorRel } from '~/types/html'
import type { EventTypes } from '~/types/event'
import * as styles from './style.css'

type BaseButtonContainerProps = {
  leftElm?: ReactNode
  rightElm?: ReactNode
  children?: ReactNode
}

export type BaseButtonProps = BaseButtonContainerProps & {
  url?: string
  target?: AnchorTarget
  rel?: AnchorRel
  buttonType?: ButtonType
  isDisabled?: boolean
  className?: string
  onClick?: EventTypes['onClickButton']
  size?: 'large' | 'medium' | 'small'
  variant?: 'contained' // | 'outlined'
  color?: 'primary'
}

const BaseButtonContainer = ({ children, leftElm, rightElm }: BaseButtonContainerProps) => {
  return (
    <span className={styles.baseButton_container}>
      {leftElm && leftElm}
      <span className={styles.baseButton_text}>{children}</span>
      {rightElm && rightElm}
    </span>
  )
}

export const BaseButton = ({
  url,
  target,
  rel,
  buttonType = 'button',
  isDisabled,
  className,
  children,
  leftElm,
  rightElm,
  onClick,
  size = 'medium',
  variant = 'contained',
  color = 'primary',
}: BaseButtonProps) => {
  // 外部リンク判定
  const isExternal: boolean = useMemo(() => {
    return url ? url.startsWith('http://') || url.startsWith('https://') : false
  }, [url])

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

  return isExternal ? (
    <a href={url} target={target} rel={rel} onClick={onClick} className={baseButtonClassName}>
      <BaseButtonContainer leftElm={leftElm} rightElm={rightElm}>
        {children}
      </BaseButtonContainer>
    </a>
  ) : url ? (
    <Link to={url} target={target} rel={rel} onClick={onClick} className={baseButtonClassName}>
      <BaseButtonContainer leftElm={leftElm} rightElm={rightElm}>
        {children}
      </BaseButtonContainer>
    </Link>
  ) : (
    <button type={buttonType} onClick={onClick} disabled={isDisabled} className={baseButtonClassName}>
      <BaseButtonContainer leftElm={leftElm} rightElm={rightElm}>
        {children}
      </BaseButtonContainer>
    </button>
  )
}
