import { LANG } from '~/config/consts'
import type { MasterDrinkCategory } from '~/types/api/master-drink-category'
import type { Tag } from '~/types/api/tags'

export type ConvertTag = {
  id: number
  label: string
  slug?: string
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

export const convertMasterDrinkCategory = ({
  lang,
  tagItems,
}: {
  lang: string
  tagItems: MasterDrinkCategory['list']
}): ConvertTag[] => {
  return tagItems
    .sort((a, b) => Number(a.order) - Number(b.order))
    .map((item) => {
      return {
        id: parseInt(item.id, 10),
        label: lang === LANG.EN ? item.name_en : item.name,
        slug: item.slug,
      }
    })
    .filter((item) => !isNaN(item.id) && item.slug !== '')
}
