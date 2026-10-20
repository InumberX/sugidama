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

const toAriaBoolean = (value: boolean | 'true' | 'false' | undefined) =>
  value === undefined ? undefined : value === true || value === 'true' ? 'true' : 'false'

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
      ariaHidden,
      ariaControls,
      ariaExpanded,
      ariaSelected,
      ariaCurrent,
      nonClickableTag,
    } = handle.props
    // Never focusable while hidden from assistive technology.
    const focusIndex = ariaHidden ? -1 : tabIndex
    // A boolean ARIA state has to be the string: Remix writes `true` as a bare
    // attribute, which ARIA reads as unset.
    const expanded = toAriaBoolean(ariaExpanded)
    const selected = toAriaBoolean(ariaSelected)

    // One css(...) call: the reset, the disabled treatment and the caller's
    // recipe are merged as plain objects, so JS spread order decides which
    // declaration wins. Output is content-hashed and deduplicated.
    const hostStyle: MixInput<HTMLElement> = [
      css({
        ...styles.primitiveButton,
        ...styleOverrides,
        // Last, so no caller recipe (a styled tier's own `cursor` or
        // `pointer-events`) can switch the disabled treatment back off.
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
      // (a disabled tab, say) survives; without one it stays a link. One
      // element for both states, so an attribute added later reaches both.
      return (
        <a
          href={isDisabled ? undefined : url}
          target={isDisabled ? undefined : target}
          rel={isDisabled ? undefined : rel}
          title={title}
          role={isDisabled ? (role ?? 'link') : role}
          tabIndex={isDisabled ? undefined : focusIndex}
          aria-disabled={isDisabled ? 'true' : undefined}
          aria-label={ariaLabel}
          aria-hidden={ariaHidden ? 'true' : undefined}
          aria-controls={ariaControls}
          aria-expanded={expanded}
          aria-selected={role ? selected : undefined}
          aria-current={ariaCurrent ? 'true' : undefined}
          data-rmx-document={!isDisabled && isDocumentNavigation(url) ? '' : undefined}
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
          tabIndex={focusIndex}
          aria-label={ariaLabel}
          aria-hidden={ariaHidden ? 'true' : undefined}
          aria-controls={ariaControls}
          aria-expanded={expanded}
          aria-selected={role ? selected : undefined}
          aria-current={ariaCurrent ? 'true' : undefined}
          mix={hostStyle}
        >
          {children}
        </button>
      )
    }

    // The props type leaves `nonClickableTag` as the only remaining choice.
    // `?? 'span'` only keeps an untyped caller that passed none of the three
    // from rendering nothing; typed code cannot reach it.
    const Tag = nonClickableTag ?? 'span'

    return (
      <Tag
        title={title}
        role={role}
        tabIndex={focusIndex}
        aria-label={ariaLabel}
        aria-hidden={ariaHidden ? 'true' : undefined}
        aria-controls={ariaControls}
        // aria-expanded is not allowed on a generic element: only with a role.
        aria-expanded={role ? expanded : undefined}
        aria-selected={role ? selected : undefined}
        aria-current={ariaCurrent ? 'true' : undefined}
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
