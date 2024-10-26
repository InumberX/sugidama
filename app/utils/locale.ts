import { Params } from '@remix-run/react'

export const getLang = (params: Params<string>) => {
  const lang = params.lang ?? 'ja'

  switch (lang) {
    case 'en':
      return 'en'
    case 'ja':
      return 'ja'
    default:
      throw new Response(null, {
        status: 404,
        statusText: `Not Found: Invalid language ${lang}`,
      })
  }
}
