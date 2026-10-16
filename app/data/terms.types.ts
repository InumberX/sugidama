// What `toDrinkCategoryTerms()` and `toTagTerms()` both return.

/** A drink category or tag as the pages show it: one language, one id. */
export type Term = { id: number; label: string; slug?: string }
