import { type MetaFunction, useRouteLoaderData } from 'react-router'

import { LayoutInner } from '~/components/ui/layouts/LayoutInner'
import { LayoutPageWrapper } from '~/components/ui/layouts/LayoutPageWrapper'
import { ArticleCardList } from '~/components/ui/lists/ArticleCardList'
import { SectionTitle } from '~/components/ui/typographies/SectionTitle'
import { LANG } from '~/config/consts'
import { PAGES } from '~/config/paths'
import { loader as drinkDetailLoader } from '~/routes/($lang)._public._layout.drinks.$drinkId/route'
import { getLang } from '~/utils/locale'
import { getMetadata } from '~/utils/meta'

import * as styles from './style.css'

import type { Route } from './+types/route'

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
  const drink = drinkDetailLoaderData?.drink
  const latestDrinks = drinkDetailLoaderData?.latestDrinks
  const drinkCategory = drinkDetailLoaderData?.drinkCategory
  const relatedDrinks = drinkDetailLoaderData?.relatedDrinks

  const pageName = page.getName({
    lang,
    params: {
      drinkName: drink?.subject ?? '',
    },
  })

  return (
    <LayoutPageWrapper className={styles.drink}>
      <div className={styles.drink_wrapper}>
        <div className={styles.drink_container}>
          {relatedDrinks && relatedDrinks.length > 0 && (
            <LayoutInner>
              <SectionTitle title={drinkCategory?.label} />
              <ArticleCardList items={relatedDrinks} itemSize="small" />
            </LayoutInner>
          )}
          {latestDrinks && latestDrinks.length > 0 && (
            <LayoutInner>
              <ArticleCardList items={latestDrinks} itemSize="small" />
            </LayoutInner>
          )}
        </div>
      </div>
    </LayoutPageWrapper>
  )
}
