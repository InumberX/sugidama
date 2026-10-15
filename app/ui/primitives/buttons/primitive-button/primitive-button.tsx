// Ported from auba-general-view: app/components/primitives/buttons/PrimitiveButton
//
// Unstyled skeleton. It owns element selection (an anchor with a `url`, the
// inert tag named by `nonClickableTag`, otherwise a button), the accessibility
// attributes and the user-agent reset — nothing else. Design decisions belong to the styled tier in
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
      buttonType = 'button',
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
      // `role="link"` and `aria-disabled` keep it announced as a disabled link.
      if (isDisabled) {
        return (
          <a role="link" aria-disabled="true" title={title} aria-label={ariaLabel} mix={hostStyle}>
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

    // A button unless the caller asked for an inert tag. React's version made
    // a button only when given `onClick` or `buttonType`, but a Remix click
    // handler is a `mix={on('click', …)}` the component cannot see, so the
    // inert case is the one that has to be named.
    if (!nonClickableTag) {
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

    const Tag = nonClickableTag

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
 * plain document. Only a root-relative path (`/drinks`) is a page of this
 * app; anything else — another origin, a protocol-relative `//host`, `mailto:`,
 * `tel:`, an in-page `#hash` — is left to the browser.
 */
const isDocumentNavigation = (url: string): boolean => !url.startsWith('/') || url.startsWith('//')
