// The languages the site is published in, and the vocabulary for translating
// it. Pure values and types only — the request side (which language a URL
// asks for) is app/middleware/lang.ts — so a component, a page or a future
// browser module can import this without pulling in server code.

/** Every published language. Japanese is the default and has no URL prefix. */
export const LANGS = ['ja', 'en'] as const

export type Lang = (typeof LANGS)[number]

export const DEFAULT_LANG = 'ja' satisfies Lang

export const isLang = (value: string): value is Lang => (LANGS as readonly string[]).includes(value)

/**
 * The `lang` route param for `href()`. The default language is served without
 * a prefix (`/drinks`, not `/ja/drinks`), so it maps to `undefined` and the
 * optional segment drops out.
 */
export const toLangParam = (lang: Lang): Exclude<Lang, typeof DEFAULT_LANG> | undefined =>
  lang === DEFAULT_LANG ? undefined : lang

/** One set of messages per language, every language with the same shape. */
export type Messages<T> = { readonly [L in Lang]: T }

/**
 * Declares a page's or component's translations. The Japanese messages define
 * the shape; every other language must provide exactly the same keys, so a
 * missing or misspelled translation is a type error rather than a blank on the
 * page. A message that interpolates is a function, which types its arguments:
 *
 * ```ts
 * const MESSAGES = defineMessages({
 *   ja: { title: '新着のお酒', related: (category: string) => `${category}のお酒` },
 *   en: { title: 'New Arrivals', related: (category: string) => `${category} Drinks` },
 * })
 * const messages = MESSAGES[lang]
 * ```
 */
export const defineMessages = <T>(
  messages: { readonly ja: T } & { readonly [L in Exclude<Lang, 'ja'>]: NoInfer<T> }
): Messages<T> => messages
