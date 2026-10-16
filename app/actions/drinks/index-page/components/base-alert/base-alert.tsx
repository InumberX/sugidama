// Ported from develop: app/components/ui/alerts/BaseAlert. Only the drinks
// list uses it (for a failed search), so it lives with the page.
import { css, type Handle, type RemixNode } from 'remix/component'

import { SvgIcon } from '../../../../../ui/icons/public/svg-icon/svg-icon.tsx'
import * as styles from './base-alert.styles.ts'

export type BaseAlertProps = {
  color?: keyof typeof styles.baseAlertColors
  title?: RemixNode
  description?: RemixNode
}

/** A message box. `role="alert"` so a screen reader hears it with the page. */
/** develop always drew the error icon, even on a success alert. */
const ICONS = { success: 'check', error: 'error' } as const

export function BaseAlert(handle: Handle<BaseAlertProps>) {
  return () => {
    const { color = 'success', title, description } = handle.props

    return (
      <div role="alert" mix={css({ ...styles.baseAlert, ...styles.baseAlertColors[color] })}>
        <SvgIcon
          variant={ICONS[color]}
          styleOverrides={{ ...styles.baseAlert_icon, ...styles.baseAlertIconColors[color] }}
        />
        {title && <p mix={css(styles.baseAlert_title)}>{title}</p>}
        {description && <p mix={css(styles.baseAlert_description)}>{description}</p>}
      </div>
    )
  }
}
