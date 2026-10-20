// Ported from develop: the loader of app/routes/($lang)._public._layout.drinks.$drinkId
//
// One drink, the vocabularies that name its category and tags, and two rows
// of cards: drinks of the same category and the newest drinks. The drink and
// the vocabularies are the page; a failure there ends the request with its
// error response, as develop's loader threw it. The rows are extras: develop
// streamed them and hid a row whose fetch failed, and a failed row is left out
// here too, without failing the page.
//
// Everything starts at once except the same-category row, which waits only
// for the drink to name its category.
import { apiErrorResponse } from '../../../data/api-client.ts'
import { type DrinkTerms, getDrinkTerms } from '../../../data/drink-terms.ts'
import { type Drink, getDrinkDetail, getDrinks } from '../../../data/drinks.ts'
import type { Term } from '../../../data/terms.types.ts'
import {
  type DrinkCardProps,
  findDrinkCategory,
  toDrinkCardProps,
} from '../../../utils/drink-card.ts'
import { CANONICAL_INTEGER } from '../../../utils/drink-search.ts'
import type { Lang } from '../../../utils/i18n.ts'

/** develop's row length: one line of small cards on a wide screen. */
const ROW_SIZE = 4

export type ShowPageData = DrinkTerms & {
  drink: Drink
  /** The drink's category, when the master has it; it names the related row. */
  category: Term | undefined
  /** Empty when the drink has no category, or the row failed to load. */
  related: DrinkCardProps[]
  /** Empty when the row failed to load. */
  latest: DrinkCardProps[]
}

/** A row's cards, or none when its fetch failed. */
const toRow = (
  result: Awaited<ReturnType<typeof getDrinks>>,
  lang: Lang,
  terms: DrinkTerms
): DrinkCardProps[] =>
  result.success
    ? result.data.list
        .slice(0, ROW_SIZE)
        // The rows sit under an h2 each, so a card's title is an h3.
        .map((drink) => toDrinkCardProps({ drink, lang, ...terms, titleTag: 'h3' }))
    : []

/** The category id a drink names, if it is one the API could have: a canonical positive integer. */
const toCategoryId = (drink: Drink): number | undefined => {
  const key = drink.drink_category ? drink.drink_category.key : ''
  return CANONICAL_INTEGER.test(key) ? Number(key) : undefined
}

export const loadShowPage = async (
  lang: Lang,
  drinkId: string
): Promise<ShowPageData | Response> => {
  const termsRequest = getDrinkTerms(lang)
  const latestRequest = getDrinks({ page: 1, pageSize: ROW_SIZE })
  const detailRequest = getDrinkDetail(drinkId)
  // The related row needs only the drink's category key, so it starts as soon
  // as the drink arrives instead of waiting for the vocabularies too; the key
  // is checked against the master once both are in.
  const relatedRequest = detailRequest.then((detail) => {
    const categoryId = detail.success && detail.data?.details && toCategoryId(detail.data.details)
    return categoryId
      ? getDrinks({ page: 1, pageSize: ROW_SIZE, drinkCategoryIds: [categoryId] })
      : undefined
  })

  // A missing drink answers at once; the other requests are left to finish
  // unread (none of them rejects).
  const detail = await detailRequest
  if (!detail.success) return apiErrorResponse(detail)
  // An answer without a drink names none, whatever its status said.
  if (!detail.data?.details) return new Response('Not Found', { status: 404 })
  const terms = await termsRequest
  if (!terms.success) return apiErrorResponse(terms)

  const drink = detail.data.details
  const category = findDrinkCategory(drink, terms.data.categories)
  const [related, latest] = await Promise.all([relatedRequest, latestRequest])

  return {
    ...terms.data,
    drink,
    category,
    related: category && related ? toRow(related, lang, terms.data) : [],
    latest: toRow(latest, lang, terms.data),
  }
}
