export const SEARCH_DRINKS_CONDITION_KEY = {
  DRINK: 'drink',
  TASTE: 'taste',
}

export const preprocessSearchKeyword = (keyword?: string): string => {
  if (!keyword) {
    return ''
  }

  return keyword.trim().replace(/\u3000/g, ' ')
}
