// Ported from develop: app/utils/article.ts (`convertDrinkToArticleCardProps`
// and its compact twin, which were identical)
//
// A drink as a card: the home page, the drinks list and a drink's related
// drinks all show the same card, so the mapping lives here rather than with
// one of them. It imports UI types only.
import type { Term } from '../data/drink-categories.ts'
import type { Drink } from '../data/drinks.types.ts'
import { routes } from '../routes.ts'
import type { ArticleCardProps } from '../ui/cards/article-card/article-card.types.ts'
import type { BaseTagProps } from '../ui/tags/base-tag/base-tag.types.ts'
import { formatPostedDate } from './date.ts'
import { SEARCH_DRINKS_CONDITION_KEY, type SearchDrinksConditionKey } from './drink-search.ts'
import { type Lang, toLangParam } from './i18n.ts'

/** The props both card components accept: everything but layout choices. */
export type DrinkCardProps = Required<Pick<ArticleCardProps, 'url' | 'title' | 'description'>> &
  Pick<ArticleCardProps, 'tags' | 'thumbnail'>

/** A tag vocabulary and the list's query parameter that filters by it. */
export type TagGroup = { name: SearchDrinksConditionKey; terms: Term[] }

export const toDrinkCardProps = ({
  drink,
  lang,
  categories,
  tagGroups,
}: {
  drink: Drink
  lang: Lang
  categories: Term[]
  tagGroups: TagGroup[]
}): DrinkCardProps => {
  const langParam = { lang: toLangParam(lang) }
  const listUrl = (name: SearchDrinksConditionKey, id: number) =>
    routes.drinks.index.href(langParam, { searchParams: { [name]: id } })

  const categoryTags: BaseTagProps[] = categories
    .filter((category) => drink.drink_category.key === String(category.id))
    .map((category) => ({
      url: listUrl(SEARCH_DRINKS_CONDITION_KEY.DRINK, category.id),
      children: category.label,
    }))
  const drinkTags: BaseTagProps[] = tagGroups.flatMap((group) =>
    group.terms
      .filter((term) => drink.tags.some((tag) => tag.tag_id === term.id))
      .map((term) => ({ url: listUrl(group.name, term.id), children: term.label }))
  )

  return {
    url: routes.drinks.show.href({ ...langParam, drinkId: drink.slug || drink.topics_id }),
    title: { text: lang === 'en' ? drink.subject_en : drink.subject },
    description: { text: formatPostedDate(drink.inst_ymdhi, lang) },
    ...(drink.thumbnail && {
      thumbnail: { src: drink.thumbnail.url, alt: drink.thumbnail.desc },
    }),
    tags: [...categoryTags, ...drinkTags],
  }
}
