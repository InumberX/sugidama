import { type ReactNode, useMemo } from 'react'
import { Link } from '@remix-run/react'
import type { ButtonType, AnchorTarget, AnchorRel } from '~/types/html'
import type { EventTypes } from '~/types/event'
import * as styles from './style.css'

export type BaseButtonProps = {
  url?: string
  target?: AnchorTarget
  rel?: AnchorRel
  buttonType?: ButtonType
  isDisabled?: boolean
  className?: string
  text: ReactNode
  leftElm?: ReactNode
  rightElm?: ReactNode
  onClick?: EventTypes['onClickButton']
}

export const BaseButton = ({
  url,
  target,
  rel,
  buttonType = 'button',
  isDisabled,
  className,
  text,
  leftElm,
  rightElm,
  onClick,
}: BaseButtonProps) => {
  // 外部リンク判定
  const isExternal: boolean = useMemo(() => {
    return url ? url.startsWith('http://') || url.startsWith('https://') : false
  }, [url])

  const baseButtonClassName = useMemo(() => {
    return [styles.baseButton, isDisabled && styles.baseButton__disabled, className].filter(Boolean).join(' ')
  }, [isDisabled, className])

  return isExternal ? (
    <a href={url} target={target} rel={rel} className={baseButtonClassName}>
      <span className={styles.baseButton_container}>
        {leftElm && leftElm}
        <span className={styles.baseButton_text}>{text}</span>
        {rightElm && rightElm}
      </span>
    </a>
  ) : url ? (
    <Link to={url} target={target} rel={rel} className={baseButtonClassName}>
      <span className={styles.baseButton_container}>
        {leftElm && leftElm}
        <span className={styles.baseButton_text}>{text}</span>
        {rightElm && rightElm}
      </span>
    </Link>
  ) : (
    <button type={buttonType} onClick={onClick} disabled={isDisabled} className={baseButtonClassName}>
      <span className={styles.baseButton_container}>
        {leftElm && leftElm}
        <span className={styles.baseButton_text}>{text}</span>
        {rightElm && rightElm}
      </span>
    </button>
  )
}
