// Ported from develop: app/utils/search.ts
//
// The drinks list's query parameters. The home page and the drink cards link
// into the list with them, and the list (SG20_100) reads them back.

export const SEARCH_DRINKS_CONDITION_KEY = {
  DRINK: 'drink',
  TASTE: 'taste',
  DRINKABILITY: 'drinkability',
} as const

export type SearchDrinksConditionKey =
  (typeof SEARCH_DRINKS_CONDITION_KEY)[keyof typeof SEARCH_DRINKS_CONDITION_KEY]
