import { useTranslation } from 'react-i18next'
import { type MetaFunction } from 'react-router'

import type { Route } from './+types/route'
import * as styles from './style.css'

import { PrimitiveButton } from '~/components/primitives/buttons/PrimitiveButton'
import { BaseButton } from '~/components/ui/buttons/BaseButton'
import { type ArticleCardProps } from '~/components/ui/cards/ArticleCard'
import { type ArticleCompactCardProps } from '~/components/ui/cards/ArticleCompactCard'
import { LayoutInner } from '~/components/ui/layouts/LayoutInner'
import { LayoutPageWrapper } from '~/components/ui/layouts/LayoutPageWrapper'
import { LayoutSection } from '~/components/ui/layouts/LayoutSection'
import { ArticleCardList } from '~/components/ui/lists/ArticleCardList'
import { ArticleCompactCardList } from '~/components/ui/lists/ArticleCompactCardList'
import { PageTitle } from '~/components/ui/typographies/PageTitle'
import { ReplaceNewLineText } from '~/components/ui/typographies/ReplaceNewLineText'
import { LANG, SITE_NAME_JA, SITE_NAME_EN } from '~/config/consts'
import { CACHE_BUSTER } from '~/config/env'
import { PAGES } from '~/config/paths'
import { getDrinks } from '~/server/api/drinks.server'
import { convertError } from '~/server/api/error.server'
import { getMasterDrinkCategory } from '~/server/api/masters.server'
import { getTagDrinkability, getTagTaste } from '~/server/api/tags.server'
import { convertDrinkToArticleCardProps, convertDrinkToArticleCompactCardProps } from '~/utils/article'
import { getLang } from '~/utils/locale'
import { getMetadata } from '~/utils/meta'
import { SEARCH_DRINKS_CONDITION_KEY } from '~/utils/search'
import { convertTags } from '~/utils/tags'
import { convertMasterDrinkCategory } from '~/utils/tags'

export const meta: MetaFunction = (args) => {
  return getMetadata({
    args,
  })
}

export async function loader(args: Route.LoaderArgs) {
  const { params } = args
  const lang = getLang(params)

  const [masterDrinkCategoryResult, tagTasteResult, tagDrinkabilityResult, drinksResult] = await Promise.all([
    getMasterDrinkCategory(),
    getTagTaste(),
    getTagDrinkability(),
    getDrinks({
      page: 1,
      pageSize: 6,
    }),
  ])

  if (!masterDrinkCategoryResult.success) {
    throw convertError(masterDrinkCategoryResult)
  }

  if (!tagTasteResult.success) {
    throw convertError(tagTasteResult)
  }

  if (!tagDrinkabilityResult.success) {
    throw convertError(tagDrinkabilityResult)
  }

  if (!drinksResult.success) {
    throw convertError(drinksResult)
  }

  const tagDrink = convertMasterDrinkCategory({
    lang,
    tagItems: masterDrinkCategoryResult.data.list,
  })

  const tagTaste = convertTags({
    lang,
    tagItems: tagTasteResult.data.list,
  })

  const tagDrinkability = convertTags({
    lang,
    tagItems: tagDrinkabilityResult.data.list,
  })

  const drinks = drinksResult.data.list
  const drinksArticleCardItems = drinks
    .slice(0, 2)
    .map((drink) =>
      convertDrinkToArticleCardProps({
        lang,
        drink,
        tags: [
          {
            name: SEARCH_DRINKS_CONDITION_KEY.TASTE,
            items: [...tagTaste],
          },
          {
            name: SEARCH_DRINKS_CONDITION_KEY.DRINKABILITY,
            items: [...tagDrinkability],
          },
        ],
        drinkCategories: [...tagDrink],
      })
    )
    .map((item) => ({
      ...item,
      title: {
        ...item.title,
        titleTag: 'h3',
      },
    }))
  const drinksArticleCompactCardItems = drinks
    .slice(2, 6)
    .map((drink) =>
      convertDrinkToArticleCompactCardProps({
        lang,
        drink,
        tags: [
          {
            name: SEARCH_DRINKS_CONDITION_KEY.TASTE,
            items: [...tagTaste],
          },
          {
            name: SEARCH_DRINKS_CONDITION_KEY.DRINKABILITY,
            items: [...tagDrinkability],
          },
        ],
        drinkCategories: [...tagDrink],
      })
    )
    .map((item) => ({
      ...item,
      title: {
        ...item.title,
        titleTag: 'h3',
      },
    }))

  return {
    lang,
    drinksArticleCardItems,
    drinksArticleCompactCardItems,
    tagDrink,
  }
}

export default function PageSG10_100({ loaderData }: Route.ComponentProps) {
  const { lang, tagDrink } = loaderData
  const drinksArticleCardItems = loaderData.drinksArticleCardItems as ArticleCardProps[]
  const drinksArticleCompactCardItems = loaderData.drinksArticleCompactCardItems as ArticleCompactCardProps[]
  const { t: tPage } = useTranslation('pages/SG10_100')

  return (
    <LayoutPageWrapper>
      <div className={styles.home}>
        <LayoutSection className={styles.homeTitle} tag="div" bottomSpace="bottomSpaceSmall">
          <LayoutInner>
            <div className={styles.homeTitle_container}>
              <h1 className={styles.homeTitleLogo}>
                <img
                  src={`/assets/img/img-logo-site-name.svg?${CACHE_BUSTER}`}
                  alt={lang === LANG.EN ? SITE_NAME_EN : SITE_NAME_JA}
                  className={styles.homeTitleLogo_image}
                  width={480}
                  height={99}
                />
              </h1>
              <div className={styles.homeTitleLead}>
                <p className={styles.homeTitleLead_paragraph}>
                  <ReplaceNewLineText text={tPage('title.lead')} />
                </p>
              </div>
            </div>
          </LayoutInner>
        </LayoutSection>
        <LayoutSection className={styles.homeNewArrivals} topSpace="topSpaceSmall">
          <LayoutInner>
            <div className={styles.homeNewArrivals_container}>
              <PageTitle titleTag="h2" color="primary" title={tPage('newArrivals.title')} />
              <div className={styles.homeNewArrivalsList}>
                <div className={styles.homeNewArrivalsList_main}>
                  <ArticleCardList items={drinksArticleCardItems} itemSize="twoColumns" />
                </div>
                {drinksArticleCompactCardItems.length > 0 && (
                  <div className={styles.homeNewArrivalsList_sub}>
                    <ArticleCompactCardList items={drinksArticleCompactCardItems} />
                  </div>
                )}
              </div>
              <div className={styles.homeNewArrivals_bottom}>
                <BaseButton
                  url={PAGES.SG20_100.getUrl({
                    lang,
                  })}
                  size="large"
                >
                  {tPage('newArrivals.bottom.button.label')}
                </BaseButton>
              </div>
            </div>
          </LayoutInner>
        </LayoutSection>
        <LayoutSection className={styles.homeSearchCategory}>
          <LayoutInner>
            <div className={styles.homeSearchCategory_container}>
              <PageTitle titleTag="h2" color="primary" title={tPage('searchCategory.title')} />
              <div className={styles.homeSearchCategoryList}>
                <ul className={styles.homeSearchCategoryList_items}>
                  {tagDrink.map((tag) => (
                    <li key={`${tag.id}-${lang}`} className={styles.homeSearchCategoryList_item}>
                      <PrimitiveButton
                        url={`${PAGES.SG20_100.getUrl({
                          lang,
                        })}?${SEARCH_DRINKS_CONDITION_KEY.DRINK}=${tag.id}`}
                        className={styles.homeSearchCategoryListLink}
                      >
                        <div className={styles.homeSearchCategoryListLink_container}>
                          <figure className={styles.homeSearchCategoryListLinkThumbnail}>
                            <img
                              src={`/assets/img/img-category-${tag.slug}.webp?${CACHE_BUSTER}`}
                              alt=""
                              className={styles.homeSearchCategoryListLinkThumbnail_image}
                            />
                          </figure>
                          <h3 className={styles.homeSearchCategoryListLink_title}>{tag.label}</h3>
                        </div>
                      </PrimitiveButton>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles.homeSearchCategory_bottom}>
                <BaseButton
                  url={PAGES.SG20_100.getUrl({
                    lang,
                  })}
                  size="large"
                >
                  {tPage('searchCategory.bottom.button.label')}
                </BaseButton>
              </div>
            </div>
          </LayoutInner>
        </LayoutSection>
      </div>
    </LayoutPageWrapper>
  )
}
