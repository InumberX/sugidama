import { use, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { type MetaFunction, useRouteLoaderData, Await } from 'react-router'

import type { Route } from './+types/route'
import * as styles from './style.css'

import { BaseButton } from '~/components/ui/buttons/BaseButton'
import { LayoutInner } from '~/components/ui/layouts/LayoutInner'
import { LayoutPageWrapper } from '~/components/ui/layouts/LayoutPageWrapper'
import { LayoutSection } from '~/components/ui/layouts/LayoutSection'
import { ArticleCardList } from '~/components/ui/lists/ArticleCardList'
import { SectionTitle } from '~/components/ui/typographies/SectionTitle'
import { LANG } from '~/config/consts'
import { PAGES } from '~/config/paths'
import { loader as drinkDetailLoader } from '~/routes/($lang)._public._layout.drinks.$drinkId/route'
import { getLang } from '~/utils/locale'
import { getMetadata } from '~/utils/meta'

const page = PAGES.SG20_101

export const meta: MetaFunction<{
  'routes/($lang)._public._layout.drinks.$drinkId': typeof drinkDetailLoader
}> = (args) => {
  const { matches } = args
  const matchData = matches.find((match) => {
    return match.id === 'routes/($lang)._public._layout.drinks.$drinkId'
  })?.loaderData as ReturnType<typeof useRouteLoaderData<typeof drinkDetailLoader>>

  const { params } = args
  const lang = getLang({
    lang: params.lang,
  })
  const drink = matchData?.drink

  return getMetadata({
    args,
    title: page.getName({
      lang,
      params: {
        drinkName: lang === LANG.EN ? (drink?.subject_en ?? '') : (drink?.subject ?? ''),
      },
    }),
  })
}

export async function loader(args: Route.LoaderArgs) {
  const { params } = args
  const lang = getLang(params)

  return {
    lang,
  }
}

export default function PageSG20_101({ loaderData }: Route.ComponentProps) {
  const { lang } = loaderData
  const drinkDetailLoaderData = useRouteLoaderData<typeof drinkDetailLoader>(
    'routes/($lang)._public._layout.drinks.$drinkId'
  )
  const { t: tPage } = useTranslation('pages/SG20_101')
  const drinkCategory = drinkDetailLoaderData?.drinkCategory
  const latestDrinks = use(
    drinkDetailLoaderData?.latestDrinks ??
      Promise.resolve({
        success: true,
        drinks: [],
      })
  )
  const relatedDrinks = use(
    drinkDetailLoaderData?.relatedDrinks ??
      Promise.resolve({
        success: true,
        drinks: [],
      })
  )

  return (
    <LayoutPageWrapper className={styles.drink} isBottomNoSpace>
      <div className={styles.drink_wrapper}>
        <div className={styles.drink_container}>
          <Suspense fallback={<></>}>
            <Await resolve={relatedDrinks}>
              {(data) => {
                if (!data) {
                  return null
                }

                if (!data.success) {
                  return null
                }

                const { drinks: relatedDrinks } = data

                if (relatedDrinks.length === 0) {
                  return null
                }

                return (
                  <LayoutSection className={styles.drinkRelated}>
                    <LayoutInner>
                      <div className={styles.drinkRelated_container}>
                        <SectionTitle
                          title={tPage('relatedDrinks.title', {
                            drinkCategory: drinkCategory?.label,
                          })}
                        />
                        <ArticleCardList items={relatedDrinks} itemSize="small" />
                      </div>
                    </LayoutInner>
                  </LayoutSection>
                )
              }}
            </Await>
          </Suspense>
          <Suspense fallback={<></>}>
            <Await resolve={latestDrinks}>
              {(data) => {
                if (!data) {
                  return null
                }

                if (!data.success) {
                  return null
                }

                const { drinks: latestDrinks } = data

                if (latestDrinks.length === 0) {
                  return null
                }

                return (
                  <LayoutSection className={styles.drinkRelated}>
                    <LayoutInner>
                      <div className={styles.drinkRelated_container}>
                        <SectionTitle title={tPage('latestDrinks.title')} />
                        <ArticleCardList items={latestDrinks} itemSize="small" />
                      </div>
                    </LayoutInner>
                  </LayoutSection>
                )
              }}
            </Await>
          </Suspense>
          <LayoutSection className={styles.drinkBottom} topSpace="topSpaceSmall" tag="div">
            <LayoutInner>
              <div className={styles.drinkBottom_container}>
                <BaseButton
                  url={PAGES.SG20_100.getUrl({
                    lang,
                  })}
                  size="large"
                >
                  {tPage('bottom.backToListButton.label')}
                </BaseButton>
              </div>
            </LayoutInner>
          </LayoutSection>
        </div>
      </div>
    </LayoutPageWrapper>
  )
}
