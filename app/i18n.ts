import { LANG } from '~/config/consts'
import enCommon from '~/locales/en/common.json'
import jaCommon from '~/locales/ja/common.json'

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
    },
    ja: {
      common: jaCommon,
    },
  },
}
