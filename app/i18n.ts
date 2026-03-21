import { LANG } from '~/config/consts'
import enCommon from '~/locales/en/common.json'
import enPagesSG20_100 from '~/locales/en/pages/SG20_100.json'
import jaCommon from '~/locales/ja/common.json'
import jaPagesSG20_100 from '~/locales/ja/pages/SG20_100.json'

export const i18n = {
  supportedLngs: [LANG.EN, LANG.JA],
  fallbackLng: LANG.JA,
  defaultNS: 'common',
  react: {
    useSuspense: false,
  },
  resources: {
    en: {
      common: enCommon,
      'pages/SG20_100': enPagesSG20_100,
    },
    ja: {
      common: jaCommon,
      'pages/SG20_100': jaPagesSG20_100,
    },
  },
}
