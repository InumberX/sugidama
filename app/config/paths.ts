import { type PagesConfig } from '~/types/paths'
import { getLangRoute, getPageInfo } from '~/utils/locale'

export const PAGES: PagesConfig = {
  SG10_100: {
    id: 'SG10_100',
    getName: ({ lang }) => {
      const pageInfo = getPageInfo({
        lang,
      })
      return pageInfo.SG10_100.NAME
    },
    getUrl: ({ lang }) => {
      const langRoute = getLangRoute({
        lang,
      })
      return langRoute === '' ? '/' : langRoute
    },
  },
  SG20_100: {
    id: 'SG20_100',
    getName: ({ lang }) => {
      const pageInfo = getPageInfo({
        lang,
      })
      return pageInfo.SG20_100.NAME
    },
    getUrl: ({ lang }) => {
      const langRoute = getLangRoute({
        lang,
      })
      return `${langRoute}/drinks`
    },
  },
  SG20_101: {
    id: 'SG20_101',
    getName: ({ params: { drinkName } }) => String(drinkName),
    getUrl: ({ lang, params: { drinkId } }) => {
      const langRoute = getLangRoute({
        lang,
      })
      return `${langRoute}/drinks/${drinkId}`
    },
  },
} as const

export type PageKey = keyof typeof PAGES
export type PageConfig = (typeof PAGES)[PageKey]
