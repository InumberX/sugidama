import type { Lang } from '../../../utils/i18n.ts'

export type LayoutHeaderProps = {
  /** The page's language, from `context.lang`: labels, links and the current language. */
  lang: Lang
  /** The request URL, from `context.url`: the language switch links to the same page. */
  url: URL
  /**
   * Renders the logo as the page's `<h1>`. Ported with develop's header, but
   * no page uses it there: develop's home page has its own `<h1>` (the site
   * name logo) in the page body, and a page has one `<h1>`.
   */
  isLogoTitle?: boolean
}
