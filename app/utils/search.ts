export const preprocessSearchKeyword = (keyword?: string): string => {
  if (!keyword) {
    return ''
  }

  return keyword.trim().replace(/\u3000/g, ' ')
}
