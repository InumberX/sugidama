import { type Params } from 'react-router'

import { LANG, PAGE_INFO, SITE_INFO } from '~/config/consts'

export const getLang = (params: Params<string>) => {
  const lang = params.lang ?? LANG.JA

  switch (lang) {
    case LANG.EN:
      return LANG.EN
    case LANG.JA:
      return LANG.JA
    default:
      throw new Response(null, {
        status: 404,
        statusText: `Not Found: Invalid language ${lang}`,
      })
  }
}

export const getLangRoute = ({ lang }: { lang?: string }) => {
  const effectiveLang = lang ?? LANG.JA
  return effectiveLang === LANG.JA ? '' : `/${effectiveLang}`
}

export const getPageInfo = ({ lang }: { lang?: string }) => {
  switch (lang) {
    case LANG.EN:
      return PAGE_INFO.EN
    default:
      return PAGE_INFO.JA
  }
}

export const getSiteInfo = ({ lang }: { lang?: string }) => {
  switch (lang) {
    case LANG.EN:
      return SITE_INFO.EN
    default:
      return SITE_INFO.JA
  }
}
