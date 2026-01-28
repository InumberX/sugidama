type PageParam = string | number
type PageParams = Record<string, PageParam>

type PageInfoBase = {
  id: string
}

// getName用の型定義
type GetNameFunction<T extends PageParams = never> = [T] extends [never]
  ? (props: { lang: string }) => string
  : (props: { lang: string; params: T }) => string

// getUrl用の型定義
type GetUrlFunction<T extends PageParams = never> = [T] extends [never]
  ? (props: { lang: string }) => string
  : (props: { lang: string; params: T }) => string

// 汎用的なページ情報型
type PageInfo<
  NameParams extends PageParams | never = never,
  UrlParams extends PageParams | never = never,
> = PageInfoBase & {
  getName: GetNameFunction<NameParams>
  getUrl: GetUrlFunction<UrlParams>
}

export type PagesConfig = {
  SG10_100: PageInfo<never, never>
  SG20_100: PageInfo<never, never>
  SG20_101: PageInfo<
    {
      drinkName: PageParam
    },
    {
      drinkId: PageParam
    }
  >
}
