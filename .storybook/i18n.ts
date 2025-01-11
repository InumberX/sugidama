import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'
// import { getInitialNamespaces } from 'remix-i18next/client'
import { i18n as i18nSettings } from '~/i18n'

i18n
  // Tell i18next to use the react-i18next plugin
  .use(initReactI18next)
  // Setup a client-side language detector
  .use(LanguageDetector)
  // Setup your backend
  .use(Backend)
  .init({
    // spread the configuration
    ...i18nSettings,
    // This function detects the namespaces your routes rendered while SSR use
    // ns: getInitialNamespaces(),
    /*
    backend: {
      loadPath: '/assets/locales/{{lng}}/{{ns}}.json',
    },
    */
    detection: {
      // Here only enable htmlTag detection, we'll detect the language only
      // server-side with remix-i18next, by using the `<html lang>` attribute
      // we can communicate to the client the language detected server-side
      order: ['htmlTag'],
      // Because we only use htmlTag, there's no reason to cache the language
      // on the browser, so we disable it
      caches: [],
    },
  })

export default i18n
