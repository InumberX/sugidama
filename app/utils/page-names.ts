// The pages' own names, read both by the page (its title) and by whatever
// links to it (the header's global menu). develop kept them in `PAGE_INFO` and
// read them through `PAGES.<id>.getName`; a name read in two places lives here
// so the menu and the page cannot drift apart. A name only its own page reads
// stays a constant in that page.
import { defineMessages } from './i18n.ts'

export const PAGE_NAMES = defineMessages({
  ja: { home: 'ホーム', drinks: 'お酒一覧' },
  en: { home: 'Home', drinks: 'Drinks' },
})
