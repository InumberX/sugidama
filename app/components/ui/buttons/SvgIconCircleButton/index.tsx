import { useMemo } from 'react'

import * as styles from './style.css'

import { PrimitiveButton, type PrimitiveButtonProps } from '~/components/primitives/buttons/PrimitiveButton'
import { SvgIcon, type SvgIconVariant } from '~/components/ui/icons/SvgIcon'

type SvgIconCircleButtonProps = PrimitiveButtonProps & {
  size?: 'small' | 'medium' | 'large'
  variant?: 'contained'
  color?: 'primary'
  icon: SvgIconVariant
}

export const SvgIconCircleButton = ({
  size = 'medium',
  color = 'primary',
  variant = 'contained',
  icon,
  ...props
}: SvgIconCircleButtonProps) => {
  const { isDisabled, className, title } = props
  const svgIconCircleButtonClassName = useMemo(() => {
    return [
      styles.svgIconCircleButton,
      styles[`svgIconCircleButton__${size}`],
      styles[`svgIconCircleButton__${color}`],
      styles[`svgIconCircleButton__${variant}`],
      isDisabled && styles.svgIconCircleButton__disabled,
      className,
    ]
      .filter(Boolean)
      .join(' ')
  }, [size, color, variant, isDisabled, className])

  return (
    <PrimitiveButton ariaLabel={title} {...props} className={svgIconCircleButtonClassName}>
      <span className={styles.svgIconCircleButton_container}>
        <SvgIcon variant={icon} className={styles.svgIconCircleButton_icon} />
      </span>
    </PrimitiveButton>
  )
}
