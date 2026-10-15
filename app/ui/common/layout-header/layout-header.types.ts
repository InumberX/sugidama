import type { Lang } from '../../../utils/i18n.ts'

export type LayoutHeaderProps = {
  /** The page's language, from `context.lang`: labels, links and the current language. */
  lang: Lang
  /** The request URL, from `context.url`: the language switch links to the same page. */
  url: URL
  /** Renders the logo as the page's `<h1>` — the home page, which has no other title. */
  isLogoTitle?: boolean
}
