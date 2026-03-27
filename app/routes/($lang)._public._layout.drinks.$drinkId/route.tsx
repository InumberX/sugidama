import { Outlet } from 'react-router'

import { getDrinksDetail, getDrinks } from '~/server/api/drinks.server'
import { convertError } from '~/server/api/error.server'
import { getMasterDrinkCategory } from '~/server/api/masters.server'
import { getTagTaste } from '~/server/api/tags.server'
import { convertDrinksToArticleCardProps } from '~/utils/article'
import { getLang } from '~/utils/locale'
import { SEARCH_DRINKS_CONDITION_KEY } from '~/utils/search'
import { convertTags, convertMasterDrinkCategory } from '~/utils/tags'

import type { Route } from './+types/route'

export async function loader(args: Route.LoaderArgs) {
  const { params } = args
  const { drinkId } = params
  const lang = getLang(params)

  const [drinkDetailResult, latestDrinksResult, tagTasteResult, masterDrinkCategoryResult] = await Promise.all([
    getDrinksDetail({
      id: drinkId,
    }),
    getDrinks({
      page: 1,
      pageSize: 4,
    }),
    getTagTaste(),
    getMasterDrinkCategory(),
  ])

  if (!drinkDetailResult.success) {
    throw convertError(drinkDetailResult)
  }

  if (!latestDrinksResult.success) {
    throw convertError(latestDrinksResult)
  }

  if (!tagTasteResult.success) {
    throw convertError(tagTasteResult)
  }

  if (!masterDrinkCategoryResult.success) {
    throw convertError(masterDrinkCategoryResult)
  }

  const drink = drinkDetailResult.data.details

  const tagTaste = convertTags({
    lang,
    tagItems: tagTasteResult.data.list,
  })

  const tagDrink = convertMasterDrinkCategory({
    lang,
    tagItems: masterDrinkCategoryResult.data.list,
  })

  const drinkCategory = tagDrink.find((category) => category.id === Number(drink.drink_category.key))

  const relatedDrinksResult = drinkCategory
    ? await getDrinks({
        page: 1,
        pageSize: 4,
        drinkCategoryIds: [drinkCategory.id],
      })
    : undefined

  if (relatedDrinksResult && !relatedDrinksResult.success) {
    throw convertError(relatedDrinksResult)
  }

  const latestDrinks = latestDrinksResult.data.list.map((drink) =>
    convertDrinksToArticleCardProps({
      lang,
      drink,
      tags: [
        {
          name: SEARCH_DRINKS_CONDITION_KEY.TASTE,
          items: [...tagTaste],
        },
      ],
      drinkCategories: [...tagDrink],
    })
  )

  const relatedDrinks = relatedDrinksResult
    ? relatedDrinksResult.data.list.map((drink) =>
        convertDrinksToArticleCardProps({
          lang,
          drink,
          tags: [
            {
              name: SEARCH_DRINKS_CONDITION_KEY.TASTE,
              items: [...tagTaste],
            },
          ],
          drinkCategories: [...tagDrink],
        })
      )
    : []

  return {
    drink,
    latestDrinks,
    drinkCategory,
    relatedDrinks,
  }
}

export default function LayoutSG20_101() {
  return <Outlet />
}
