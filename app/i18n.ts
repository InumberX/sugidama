import enCommon from '~/locales/en/common.json'
import jaCommon from '~/locales/ja/common.json'

export const i18n = {
  supportedLngs: ['en', 'ja'],
  fallbackLng: 'ja',
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
