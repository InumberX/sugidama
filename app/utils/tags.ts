import { LANG } from '~/config/consts'

import type { Tag } from '~/types/api/tags'

export type ConvertTag = {
  id: number
  label: string
}

export const convertTags = ({ lang, tagItems }: { lang: string; tagItems: Tag['list'] }): ConvertTag[] => {
  return tagItems
    .map((item) => {
      return Object.entries(item.tags).map(([_key, value]) => {
        return {
          id: value.tag_id,
          label: lang === LANG.EN ? value.ext_col_01 : value.tag_nm,
        }
      })
    })
    .flat()
}
