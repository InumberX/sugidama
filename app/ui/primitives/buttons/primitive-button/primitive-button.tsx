// Ported from auba-general-view: app/components/primitives/buttons/PrimitiveButton
//
// Unstyled skeleton. It owns element selection (an anchor for `url`, a button
// for `buttonType`, the inert tag named by `nonClickableTag` — the props type
// requires exactly one), the accessibility attributes and the user-agent
// reset — nothing else. Design decisions belong to the styled tier in
// `app/ui/<category>/`, which passes them down through `styleOverrides`.
import { css, type Handle, type MixInput } from 'remix/component'

import * as styles from './primitive-button.styles.ts'
import type { PrimitiveButtonProps } from './primitive-button.types.ts'

export type * from './primitive-button.types.ts'

export function PrimitiveButton(handle: Handle<PrimitiveButtonProps>) {
  return () => {
    const {
      url,
      target,
      rel,
      buttonType,
      isDisabled = false,
      children,
      styleOverrides,
      mix,
      name,
      value,
      title,
      role,
      tabIndex,
      ariaLabel,
      ariaControls,
      ariaSelected,
      nonClickableTag,
    } = handle.props

    // One css(...) call: the reset, the disabled treatment and the caller's
    // recipe are merged as plain objects, so JS spread order decides which
    // declaration wins. Output is content-hashed and deduplicated.
    const hostStyle: MixInput<HTMLElement> = [
      css({
        ...styles.primitiveButton,
        ...(isDisabled ? styles.primitiveButton__disabled : null),
        ...styleOverrides,
      }),
      mix,
    ]

    if (url) {
      // A disabled link keeps its element but loses `href`: an `<a>` without
      // one is neither focusable nor followable, so Tab and Enter cannot reach
      // a destination that `pointer-events: none` only hid from the mouse.
      // `aria-disabled` keeps it announced as disabled, and the caller's role
      // (a disabled tab, say) survives; without one it stays a link.
      if (isDisabled) {
        return (
          <a
            role={role ?? 'link'}
            aria-disabled="true"
            title={title}
            aria-label={ariaLabel}
            aria-controls={ariaControls}
            aria-selected={ariaSelected}
            mix={hostStyle}
          >
            {children}
          </a>
        )
      }

      return (
        <a
          href={url}
          target={target}
          rel={rel}
          title={title}
          role={role}
          tabIndex={tabIndex}
          aria-label={ariaLabel}
          aria-controls={ariaControls}
          aria-selected={ariaSelected}
          data-rmx-document={isDocumentNavigation(url) ? '' : undefined}
          mix={hostStyle}
        >
          {children}
        </a>
      )
    }

    if (buttonType) {
      return (
        <button
          type={buttonType}
          disabled={isDisabled}
          name={name}
          value={value}
          title={title}
          role={role}
          tabIndex={tabIndex}
          aria-label={ariaLabel}
          aria-controls={ariaControls}
          aria-selected={ariaSelected}
          mix={hostStyle}
        >
          {children}
        </button>
      )
    }

    // The props type leaves `nonClickableTag` as the only remaining choice.
    const Tag = nonClickableTag ?? 'span'

    return (
      <Tag
        title={title}
        role={role}
        tabIndex={tabIndex}
        aria-label={ariaLabel}
        aria-controls={ariaControls}
        aria-selected={ariaSelected}
        mix={hostStyle}
      >
        {children}
      </Tag>
    )
  }
}

/**
 * Whether a link should bypass the client runtime's navigation and load as a
 * plain document. A root-relative path (`/drinks`) or a query on the current
 * page (`?page=2`) is this app; anything else — another origin, `mailto:`,
 * `tel:`, an in-page `#hash`, and the protocol-relative `//host` or
 * `/\host` (browsers read a backslash after the scheme-less slash as a
 * second slash) — is left to the browser.
 */
const isDocumentNavigation = (url: string): boolean => {
  if (url.startsWith('?')) return false
  return !url.startsWith('/') || url.startsWith('//') || url.startsWith('/\\')
}
