export type Drink = {
  topics_id: number
  ymd: Date
  contents_type: number
  contents: string
  subject: string
  topics_flg: number
  open_flg: number
  regular_flg: number
  inst_ymdhi: Date
  update_ymdhi: Date
  topics_group_id: number
  post_time: string
  slug: string
  ai_postprocess_state: string
  group_nm: string
  group_description: string
  contents_type_cnt: number
  contents_type_nm: string
  contents_type_slug: null
  contents_type_parent_nm: null
  category_parent_id: null
  contents_type_ext_col_01: null
  contents_type_ext_col_02: null
  contents_type_ext_col_03: null
  contents_type_ext_col_04: null
  contents_type_ext_col_05: null
  tags: Tag[]
  contents_type_list: number[]
  description: string
  thumbnail: Thumbnail
  main_visuals: MainVisual[]
  manufacturer: string
  abv: number
  drink_category: DrinkCategory
  links: Link[]
  comment: string
  subject_en: string
  description_en: string
  contents_en: string
  manufacturer_en: string
  comment_en: string
}

export type DrinkCategory = {
  key: string
  label: string
}

export type Link = {
  link_text: string
  link_text_en: string
  link_url: string
  link_url_en: string
}

type MainVisual = {
  main_visual_image: Thumbnail
  main_visual_title: string
  main_visual_title_en: string
}

type Thumbnail = {
  id: string
  url: string
  desc: string
  url_org: string
}

type Tag = {
  tag_id: number
  tag_nm: string
  open_contents_cnt: number
  all_contents_cnt: number
  inst_ymdhi: Date
  update_ymdhi: Date
  tag_category_id: number
  ext_col_01: string
  ext_col_02: string
  ext_col_03: string
  ext_col_04: string
  ext_col_05: string
  ext_col_06: string
  ext_col_07: string
  ext_col_08: string
  ext_col_09: string
  ext_col_10: string
  weight: number
}

type PageInfo = {
  totalCnt: number
  perPage: number
  totalPageCnt: number
  pageNo: number
  firstIndex: number
  lastIndex: number
  path: string
  param: string
  startPageNo: number
  endPageNo: number
}

export type Drinks = {
  errors: string[]
  messages: string[]
  list: Drink[]
  pageInfo: PageInfo
}
