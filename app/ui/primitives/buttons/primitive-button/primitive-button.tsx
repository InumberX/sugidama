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
        ...styleOverrides,
        // Last, so a styled tier's own `cursor` (BaseButton sets `pointer`)
        // cannot switch the disabled treatment back off.
        ...(isDisabled ? styles.primitiveButton__disabled : null),
      }),
      mix,
    ]

    // `!== undefined`, not truthiness: an empty `url` is still a link (to the
    // current page), not a silent fall-through to the inert tag.
    if (url !== undefined) {
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

/** A stand-in origin to resolve relative URLs against; it never leaves this module. */
const APP_ORIGIN = 'https://app.invalid'

/**
 * Whether a link should bypass the client runtime's navigation and load as a
 * plain document: anything that does not resolve to this origin (another
 * site, `mailto:`, `tel:`, a protocol-relative `//host`), and an in-page
 * `#hash`. The URL is resolved the way the browser resolves an href rather
 * than matched as a string, so `/\host` and a tab or newline smuggled into
 * `/\t/host` — both of which a browser reads as `//host` — count as
 * another origin too.
 */
const isDocumentNavigation = (url: string): boolean => {
  if (url.startsWith('#')) return true
  try {
    return new URL(url, APP_ORIGIN).origin !== APP_ORIGIN
  } catch {
    return true
  }
}
