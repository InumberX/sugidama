// Replaces develop's date-fns `format` for the one format the site shows: a
// posting date in Japan, `2024/03/01` in Japanese and `March 1, 2024` in
// English. `Intl` gives both without a dependency, and Workers ship full ICU.
import type { Lang } from './i18n.ts'

const POSTED_DATE = {
  ja: new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }),
  en: new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
} satisfies Record<Lang, Intl.DateTimeFormat>

/** `''` for a missing or unparseable date, as develop's `format` returned for none. */
export const formatPostedDate = (date: string | undefined, lang: Lang): string => {
  const time = date ? Date.parse(date) : Number.NaN
  return Number.isNaN(time) ? '' : POSTED_DATE[lang].format(time)
}
