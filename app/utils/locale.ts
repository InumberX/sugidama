import { Params } from 'react-router'

import { LANG, PAGE_INFO } from '~/config/consts'

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
  return lang === LANG.JA ? '' : `/${lang}`
}

export const getPageInfo = ({ lang }: { lang?: string }) => {
  switch (lang) {
    case LANG.EN:
      return PAGE_INFO.EN
    default:
      return PAGE_INFO.JA
  }
}
