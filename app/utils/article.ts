import { type ArticleCardProps } from '~/components/ui/cards/ArticleCard'
import { LANG } from '~/config/consts'
import { PAGES } from '~/config/paths'
import { format } from '~/utils/date'

import type { Drink } from '~/types/api/drinks'

export const convertDrinksToArticleCardProps = ({ lang, drink }: { lang: string; drink: Drink }): ArticleCardProps => {
  return {
    button: {
      url: PAGES.SG20_101.getUrl({
        lang,
        params: { drinkId: drink.slug ?? drink.topics_id },
      }),
    },
    title: {
      text: lang === LANG.EN ? drink.subject_en : drink.subject,
    },
    description: {
      text: format({
        date: drink.inst_ymdhi,
        format: lang === LANG.EN ? 'MMMM d, yyyy' : 'yyyy/MM/dd',
        locale: lang === LANG.EN ? 'en' : 'ja',
      }),
    },
    ...(drink.thumbnail && {
      thumbnail: {
        src: drink.thumbnail.url,
        alt: drink.thumbnail.desc,
      },
    }),
  }
}
