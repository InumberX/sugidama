import { Outlet } from 'react-router'

import type { Route } from './+types/route'

import { getDrinksDetail, getDrinks } from '~/server/api/drinks.server'
import { convertError } from '~/server/api/error.server'
import { getMasterDrinkCategory } from '~/server/api/masters.server'
import { getTagDrinkability, getTagTaste } from '~/server/api/tags.server'
import { convertDrinkToArticleCardProps, convertDrinkToBaseArticleProps } from '~/utils/article'
import { getLang } from '~/utils/locale'
import { SEARCH_DRINKS_CONDITION_KEY } from '~/utils/search'
import { convertTags, convertMasterDrinkCategory } from '~/utils/tags'

export async function loader(args: Route.LoaderArgs) {
  const { params } = args
  const { drinkId } = params
  const lang = getLang(params)

  const [drinkDetailResult, masterDrinkCategoryResult, tagTasteResult, tagDrinkabilityResult] = await Promise.all([
    getDrinksDetail({
      id: drinkId,
    }),
    getMasterDrinkCategory(),
    getTagTaste(),
    getTagDrinkability(),
  ])

  if (!drinkDetailResult.success) {
    throw convertError(drinkDetailResult)
  }

  if (!masterDrinkCategoryResult.success) {
    throw convertError(masterDrinkCategoryResult)
  }

  if (!tagTasteResult.success) {
    throw convertError(tagTasteResult)
  }

  if (!tagDrinkabilityResult.success) {
    throw convertError(tagDrinkabilityResult)
  }

  const drink = drinkDetailResult.data.details

  const tagDrink = convertMasterDrinkCategory({
    lang,
    tagItems: masterDrinkCategoryResult.data.list,
  })

  const tagTaste = convertTags({
    lang,
    tagItems: tagTasteResult.data.list,
  })

  const tagDrinkability = convertTags({
    lang,
    tagItems: tagDrinkabilityResult.data.list,
  })

  const drinkCategory = tagDrink.find((category) => category.id === Number(drink.drink_category.key))

  const drinkArticle = convertDrinkToBaseArticleProps({
    lang,
    drink,
    tags: [
      {
        name: SEARCH_DRINKS_CONDITION_KEY.TASTE,
        items: [...tagTaste],
      },
      {
        name: SEARCH_DRINKS_CONDITION_KEY.DRINKABILITY,
        items: [...tagDrinkability],
      },
    ],
    drinkCategories: [...tagDrink],
  })

  const latestDrinksResult = getDrinks({
    page: 1,
    pageSize: 4,
  }).then((res) => {
    if (!res.success) {
      return {
        success: false,
        error: res.message,
        drinks: [],
      }
    }

    return {
      success: true,
      drinks: res.data.list.map((drink) =>
        convertDrinkToArticleCardProps({
          lang,
          drink,
          tags: [
            {
              name: SEARCH_DRINKS_CONDITION_KEY.TASTE,
              items: [...tagTaste],
            },
            {
              name: SEARCH_DRINKS_CONDITION_KEY.DRINKABILITY,
              items: [...tagDrinkability],
            },
          ],
          drinkCategories: [...tagDrink],
        })
      ),
    }
  })

  const relatedDrinksResult = drinkCategory
    ? getDrinks({
        page: 1,
        pageSize: 4,
        drinkCategoryIds: [drinkCategory.id],
      }).then((res) => {
        if (!res.success) {
          return {
            success: false,
            error: res.message,
            drinks: [],
          }
        }

        return {
          success: true,
          drinks: res.data.list.map((drink) =>
            convertDrinkToArticleCardProps({
              lang,
              drink,
              tags: [
                {
                  name: SEARCH_DRINKS_CONDITION_KEY.TASTE,
                  items: [...tagTaste],
                },
                {
                  name: SEARCH_DRINKS_CONDITION_KEY.DRINKABILITY,
                  items: [...tagDrinkability],
                },
              ],
              drinkCategories: [...tagDrink],
            })
          ),
        }
      })
    : Promise.resolve({
        success: true,
        drinks: [],
      })

  return {
    thumbnail: drink.thumbnail?.url,
    drinkArticle,
    drinkCategory,
    latestDrinks: latestDrinksResult,
    relatedDrinks: relatedDrinksResult,
  }
}

export default function LayoutSG20_101() {
  return <Outlet />
}
