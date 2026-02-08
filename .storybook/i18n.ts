import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import { i18n as i18nSettings } from '~/i18n'

i18n.use(LanguageDetector).init({
  ...i18nSettings,
  detection: {
    order: ['htmlTag'],
    caches: [],
  },
})

export default i18n
