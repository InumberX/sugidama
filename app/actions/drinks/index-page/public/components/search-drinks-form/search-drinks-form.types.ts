// Type-only module: erased from browser output.
import type { SearchDrinksConditionKey } from '../../../../../../utils/drink-search.ts'

export type SearchDrinksCondition = {
  /** The query parameter, e.g. `taste` in `?taste=11`. */
  name: SearchDrinksConditionKey
  label: string
  options: { value: string; label: string }[]
  /** The values the current search has checked. */
  selected: string[]
}

export type SearchDrinksFormMessages = {
  reset: string
  keywordTitle: string
  keywordPlaceholder: string
  search: string
  conditionsLabel: string
  showConditions: string
  hideConditions: string
  /** Spoken after a condition's name; `{count}` is replaced. A string, not a function: props must serialize. */
  selectedCount: string
}

/** Serializable: the form is a client entry. */
export type SearchDrinksFormProps = {
  /** The list URL the form submits to (GET), in the page's language. */
  action: string
  /** The list URL without a search: where "reset" leads. */
  resetHref: string
  keyword: string
  conditions: SearchDrinksCondition[]
  messages: SearchDrinksFormMessages
}
