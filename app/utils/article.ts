import type { BaseArticleProps } from '~/components/ui/articles/BaseArticle'
import { type ArticleCardProps } from '~/components/ui/cards/ArticleCard'
import { type ArticleCompactCardProps } from '~/components/ui/cards/ArticleCompactCard'
import { type BaseTagProps } from '~/components/ui/tags/BaseTag'
import { LANG } from '~/config/consts'
import { PAGES } from '~/config/paths'
import type { Drink } from '~/types/api/drinks'
import { format } from '~/utils/date'
import { SEARCH_DRINKS_CONDITION_KEY } from '~/utils/search'
import type { ConvertTag } from '~/utils/tags'

export const convertDrinkToArticleCardProps = ({
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

export const convertDrinkToArticleCompactCardProps = ({
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
}): ArticleCompactCardProps => {
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

export const convertDrinkToBaseArticleProps = ({
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
}): BaseArticleProps => {
  const drinksPageUrl = PAGES.SG20_100.getUrl({
    lang,
  })
  const drinkCategory = drinkCategories.find((category) => category.id === Number(drink.drink_category.key))
  const manufacturer = lang === LANG.EN ? drink.manufacturer_en : drink.manufacturer
  const abv = drink.abv
  const comment = lang === LANG.EN ? drink.comment_en : drink.comment
  const links = drink.links
    .map((link) => ({
      text: lang === LANG.EN ? link.link_text_en : link.link_text,
      url: lang === LANG.EN ? link.link_url_en : link.link_url,
    }))
    .filter((link) => link.text && link.text !== '' && link.url && link.url !== '')

  return {
    title: {
      text: lang === LANG.EN ? drink.subject_en : drink.subject,
    },
    mainVisuals: drink.main_visuals.map((mainVisual) => ({
      src: mainVisual.main_visual_image.url,
      alt: lang === LANG.EN ? mainVisual.main_visual_title_en : mainVisual.main_visual_title,
    })),
    info: {
      items: [
        ...(drinkCategory
          ? [
              {
                title: lang === LANG.EN ? 'Category' : '種類',
                text: drinkCategory.label,
              },
            ]
          : []),
        ...(manufacturer
          ? [
              {
                title: lang === LANG.EN ? 'Manufacturer' : '製造元',
                text: manufacturer,
              },
            ]
          : []),
        ...(abv
          ? [
              {
                title: lang === LANG.EN ? 'Alcohol content' : 'アルコール度数',
                text: `${abv}%`,
              },
            ]
          : []),
        ...(comment
          ? [
              {
                title: lang === LANG.EN ? 'Comment' : 'コメント',
                text: comment,
              },
            ]
          : []),
        ...(links.length > 0
          ? [
              {
                title: lang === LANG.EN ? 'Links' : 'リンク',
                links: links.map(
                  (link) =>
                    ({
                      children: link.text,
                      url: link.url,
                      target: '_blank',
                    }) as const
                ),
              },
            ]
          : []),
      ],
    },
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
