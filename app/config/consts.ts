import { SITE_NAME } from '~/config/env'

export const SITE_NAME_JA = SITE_NAME
export const BASE_DESCRIPTION_JA =
  'このサイトでは、管理人がこれまで飲んできた美味しいお酒を独断と偏見で記録しています。銘柄、製造元、味わいの特徴を紹介し、気になるお酒があれば販売サイトもご覧いただけます。'
export const BASE_TITLE_NOTE_JA = 'お酒の銘柄、製造元、味わいを紹介'

export const SITE_NAME_EN = SITE_NAME
export const BASE_DESCRIPTION_EN =
  "This site is a personal archive of drinks I've enjoyed, with notes on makers, flavors, and where to buy them."
export const BASE_TITLE_NOTE_EN = 'Brand, Manufacturer, and Taste of Sake'

// Timezone constant for Japan Standard Time (JST)
export const JST_TIMEZONE_OFFSET = '+09:00'

export const DRINKS_PAGE_SIZE = 12

export const LANG = {
  JA: 'ja',
  EN: 'en',
} as const

export const PAGE_INFO = {
  JA: {
    SG10_100: {
      NAME: 'ホーム',
    },
    SG20_100: {
      NAME: 'お酒一覧',
    },
  },
  EN: {
    SG10_100: {
      NAME: 'Home',
    },
    SG20_100: {
      NAME: 'Drinks',
    },
  },
} as const

export const SITE_INFO = {
  JA: {
    SITE_NAME: SITE_NAME_JA,
    BASE_TITLE_NOTE: BASE_TITLE_NOTE_JA,
    BASE_DESCRIPTION: BASE_DESCRIPTION_JA,
  },
  EN: {
    SITE_NAME: SITE_NAME_EN,
    BASE_TITLE_NOTE: BASE_TITLE_NOTE_EN,
    BASE_DESCRIPTION: BASE_DESCRIPTION_EN,
  },
} as const
