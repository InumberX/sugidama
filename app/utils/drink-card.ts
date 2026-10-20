// Ported from develop: app/utils/article.ts (`convertDrinkToArticleCardProps`
// and its compact twin, which were identical)
//
// A drink as a card: the home page, the drinks list and a drink's related
// drinks all show the same card, so the mapping lives here rather than with
// one of them. It imports UI types only.

import type { Drink } from '../data/drinks.types.ts'
import type { Term } from '../data/terms.types.ts'
import { routes } from '../routes.ts'
import type { ArticleCardProps } from '../ui/cards/article-card/article-card.types.ts'
import type { BaseTagProps } from '../ui/tags/base-tag/base-tag.types.ts'
import { formatPostedDate } from './date.ts'
import {
  SEARCH_DRINKS_CONDITION_KEY,
  type SearchDrinksConditionKey,
  toDrinkSearchHref,
} from './drink-search.ts'
import { type Lang, toLangParam } from './i18n.ts'

/** The props both card components accept: everything but layout choices. */
export type DrinkCardProps = Required<Pick<ArticleCardProps, 'url' | 'title'>> &
  Pick<ArticleCardProps, 'description' | 'tags' | 'thumbnail'>

/** A tag vocabulary and the list's query parameter that filters by it. */
export type TagGroup = { name: SearchDrinksConditionKey; terms: Term[] }

type DrinkVocabularies = {
  drink: Drink
  lang: Lang
  categories: Term[]
  tagGroups: TagGroup[]
}

/**
 * A drink's page: by its slug, else its topics_id. The one URL a drink has —
 * the cards link to it, the page names it as canonical, the sitemap lists it.
 */
export const toDrinkHref = (drink: Drink, lang: Lang): string =>
  routes.drinks.show.href({ lang: toLangParam(lang), drinkId: toDrinkId(drink) })

/** The id in a drink's URL: its slug, else its topics_id. */
export const toDrinkId = (drink: Drink): string => drink.slug || String(drink.topics_id)

/** The drink's category from the master, if it names one the master has. */
export const findDrinkCategory = (drink: Drink, categories: Term[]): Term | undefined =>
  categories.find(
    (category) => drink.drink_category && drink.drink_category.key === String(category.id)
  )

/**
 * The drink's category, then its tags in the groups' order, each linking to
 * the list filtered by it. A card and the drink's own page list the same tags.
 */
export const toDrinkTags = ({
  drink,
  lang,
  categories,
  tagGroups,
}: DrinkVocabularies): BaseTagProps[] => {
  const category = findDrinkCategory(drink, categories)
  const categoryTags: BaseTagProps[] = category
    ? [
        {
          url: toDrinkSearchHref(lang, SEARCH_DRINKS_CONDITION_KEY.DRINK, category.id),
          children: category.label,
        },
      ]
    : []
  const drinkTags: BaseTagProps[] = tagGroups.flatMap((group) =>
    group.terms
      .filter((term) => drink.tags?.some((tag) => tag.tag_id === term.id))
      .map((term) => ({ url: toDrinkSearchHref(lang, group.name, term.id), children: term.label }))
  )
  return [...categoryTags, ...drinkTags]
}

export const toDrinkCardProps = ({
  titleTag,
  ...vocabularies
}: DrinkVocabularies & {
  /** The title's heading level, one below the section the cards sit in. */
  titleTag?: NonNullable<ArticleCardProps['title']['titleTag']>
}): DrinkCardProps => {
  const { drink, lang } = vocabularies
  const postedDate = formatPostedDate(drink.inst_ymdhi, lang)

  return {
    url: toDrinkHref(drink, lang),
    title: {
      text: lang === 'en' ? drink.subject_en : drink.subject,
      ...(titleTag && { titleTag }),
    },
    // No date, no row: an empty one would still be a focusable link.
    ...(postedDate && { description: { text: postedDate } }),
    ...(drink.thumbnail && {
      thumbnail: { src: drink.thumbnail.url, alt: drink.thumbnail.desc },
    }),
    tags: toDrinkTags(vocabularies),
  }
}
