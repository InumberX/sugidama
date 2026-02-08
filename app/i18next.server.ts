import { RemixI18Next } from 'remix-i18next/server'

import { LANG } from '~/config/consts'
import { i18n } from '~/i18n'

const i18next = new RemixI18Next({
  detection: {
    supportedLanguages: i18n.supportedLngs,
    fallbackLanguage: i18n.fallbackLng,
    async findLocale(request) {
      const url = new URL(request.url)
      const paths = url.pathname.split('/').splice(1)

      if (paths.length === 0) {
        return LANG.JA
      }

      switch (paths[0]) {
        case LANG.EN:
          return LANG.EN
        default:
          return LANG.JA
      }
    },
  },
  i18next: {
    ...i18n,
  },
})

export default i18next
