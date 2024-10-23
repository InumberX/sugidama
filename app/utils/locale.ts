import { Params } from '@remix-run/react'

export const getLang = (params: Params<string>) => {
  const lang = params.lang

  switch (lang) {
    case 'en':
      return 'en'
    default:
      return 'ja'
  }
}
