import { type ArticleCardProps } from '~/components/ui/cards/ArticleCard'
import { type BaseTagProps } from '~/components/ui/tags/BaseTag'
import { LANG } from '~/config/consts'
import { PAGES } from '~/config/paths'
import { format } from '~/utils/date'
import { SEARCH_DRINKS_CONDITION_KEY } from '~/utils/search'

import type { Drink } from '~/types/api/drinks'
import type { ConvertTag } from '~/utils/tags'

export const convertDrinksToArticleCardProps = ({
  lang,
  drink,
  tags,
  drinkCategories,
}: {
  lang: string
  drink: Drink
  tags: {
    name: string
    items: ConvertTag[]
  }[]
  drinkCategories: ConvertTag[]
}): ArticleCardProps => {
  const drinksPageUrl = PAGES.SG20_100.getUrl({
    lang,
  })

  return {
    button: {
      url: PAGES.SG20_101.getUrl({
        lang,
        params: { drinkId: drink.slug || drink.topics_id },
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
    tags: [
      ...(drinkCategories.length > 0
        ? drinkCategories
            .filter((category) => drink.drink_category.key === String(category.id))
            .map((category) => {
              return {
                url: `${drinksPageUrl}?${SEARCH_DRINKS_CONDITION_KEY.DRINK}=${category.id}`,
                children: category.label,
              }
            })
        : []),
      ...(tags.length > 0 && drink.tags.length > 0
        ? tags
            .map((tag) => {
              return tag.items
                .filter((item) => drink.tags.some((drinkTag) => drinkTag.tag_id === item.id))
                .map((item): BaseTagProps => {
                  return {
                    url: `${drinksPageUrl}?${tag.name}=${item.id}`,
                    children: item.label,
                  }
                })
            })
            .flat()
        : []),
    ],
  }
}
