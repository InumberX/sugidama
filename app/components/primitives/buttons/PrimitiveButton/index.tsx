import { type ReactNode, useMemo } from 'react'
import { Link } from 'react-router'

import * as styles from './style.css'

import type { EventTypes } from '~/types/event'
import type { ButtonType, AnchorTarget, AnchorRel } from '~/types/html'

export type PrimitiveButtonProps = {
  url?: string
  target?: AnchorTarget
  rel?: AnchorRel
  buttonType?: ButtonType
  isDisabled?: boolean
  className?: string
  children?: ReactNode
  onClick?: EventTypes['onClickButton']
  name?: string
  value?: string
}

export const PrimitiveButton = ({
  url,
  target,
  rel,
  buttonType = 'button',
  isDisabled,
  className,
  children,
  onClick,
  name,
  value,
}: PrimitiveButtonProps) => {
  // 外部リンク判定
  const isExternal: boolean = useMemo(() => {
    return url ? url.startsWith('http://') || url.startsWith('https://') : false
  }, [url])

  const primitiveButtonClassName = useMemo(() => {
    return [styles.primitiveButton, isDisabled && styles.primitiveButton__disabled, className].filter(Boolean).join(' ')
  }, [isDisabled, className])

  return isExternal ? (
    <a href={url} target={target} rel={rel} className={primitiveButtonClassName} onClick={onClick}>
      {children}
    </a>
  ) : url ? (
    <Link to={url} target={target} rel={rel} className={primitiveButtonClassName} onClick={onClick}>
      {children}
    </Link>
  ) : (
    <button
      type={buttonType}
      onClick={onClick}
      disabled={isDisabled}
      className={primitiveButtonClassName}
      name={name}
      value={value}
    >
      {children}
    </button>
  )
}
