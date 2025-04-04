import Backend from 'i18next-fs-backend'
// import { resolve } from 'node:path'
import { RemixI18Next } from 'remix-i18next/server'
import { i18n } from '~/i18n'

const i18next = new RemixI18Next({
  detection: {
    supportedLanguages: i18n.supportedLngs,
    fallbackLanguage: i18n.fallbackLng,
    async findLocale(request) {
      const url = new URL(request.url)
      const paths = url.pathname.split('/').splice(1)

      if (paths.length === 0) {
        return 'ja'
      }

      switch (paths[0]) {
        case 'en':
          return 'en'
        default:
          return 'ja'
      }
    },
  },
  i18next: {
    ...i18n,
    /*
    backend: {
      loadPath: resolve('./public/assets/locales/{{lng}}/{{ns}}.json'),
    },
    */
  },
  backend: Backend,
})

export default i18next
