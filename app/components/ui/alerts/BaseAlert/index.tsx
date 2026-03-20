import { type ReactNode } from 'react'

import { SvgIcon } from '~/components/ui/icons/SvgIcon'

import * as styles from './style.css'

export type BaseAlertProps = {
  className?: string
  variant?: 'contained'
  color?: 'success' | 'error'
  title?: ReactNode
  description?: ReactNode
}

export const BaseAlert = ({
  className,
  variant = 'contained',
  color = 'success',
  title,
  description,
}: BaseAlertProps) => {
  return (
    <div
      className={[styles.baseAlert, styles[`baseAlert__${variant}`], styles[`baseAlert__${color}`], className]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={styles.baseAlert_container}>
        <div className={styles.baseAlertIcon}>
          <SvgIcon variant="error" className={styles.baseAlertIcon_icon} />
        </div>

        {title && <p className={styles.baseAlert_title}>{title}</p>}
        {description && <p className={styles.baseAlert_description}>{description}</p>}
      </div>
    </div>
  )
}
