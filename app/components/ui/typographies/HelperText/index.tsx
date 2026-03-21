import { type ReactNode, type JSX } from 'react'

import * as styles from './style.css'

export type HelperTextProps = {
  className?: string
  text: ReactNode
  textTag?: keyof JSX.IntrinsicElements
}

export const HelperText = ({ className, text, textTag = 'p' }: HelperTextProps) => {
  const Text = textTag

  return <Text className={[styles.helperText, className].filter(Boolean).join(' ')}>{text}</Text>
}
