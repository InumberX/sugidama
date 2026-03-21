import { type ReactNode, type JSX } from 'react'

import * as styles from './style.css'

export type ErrorMessageProps = {
  className?: string
  text: ReactNode
  textTag?: keyof JSX.IntrinsicElements
}

export const ErrorMessage = ({ className, text, textTag = 'span' }: ErrorMessageProps) => {
  const Text = textTag

  return <Text className={[styles.errorMessage, className].filter(Boolean).join(' ')}>{text}</Text>
}
