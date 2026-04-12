import { LANG } from '~/config/consts'
import enCommon from '~/locales/en/common.json'
import enComponentsUiFormsSelect from '~/locales/en/components/ui/forms/select.json'
import enPagesSG10_100 from '~/locales/en/pages/SG10_100.json'
import enPagesSG20_100 from '~/locales/en/pages/SG20_100.json'
import enPagesSG20_101 from '~/locales/en/pages/SG20_101.json'
import jaCommon from '~/locales/ja/common.json'
import jaComponentsUiFormsSelect from '~/locales/ja/components/ui/forms/select.json'
import jaPagesSG10_100 from '~/locales/ja/pages/SG10_100.json'
import jaPagesSG20_100 from '~/locales/ja/pages/SG20_100.json'
import jaPagesSG20_101 from '~/locales/ja/pages/SG20_101.json'

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
      'pages/SG10_100': enPagesSG10_100,
      'pages/SG20_100': enPagesSG20_100,
      'pages/SG20_101': enPagesSG20_101,
      'components/ui/forms/select': enComponentsUiFormsSelect,
    },
    ja: {
      common: jaCommon,
      'pages/SG10_100': jaPagesSG10_100,
      'pages/SG20_100': jaPagesSG20_100,
      'pages/SG20_101': jaPagesSG20_101,
      'components/ui/forms/select': jaComponentsUiFormsSelect,
    },
  },
}
