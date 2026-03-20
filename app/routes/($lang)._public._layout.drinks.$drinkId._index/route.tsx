import { type MetaFunction, useRouteLoaderData } from 'react-router'

import { LayoutPageWrapper } from '~/components/ui/layouts/LayoutPageWrapper'
import { PAGES } from '~/config/paths'
import { loader as drinkDetailLoader } from '~/routes/($lang)._public._layout.drinks.$drinkId/route'
import { getLang } from '~/utils/locale'
import { getMetadata } from '~/utils/meta'

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
        drinkName: drink?.subject ?? '',
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

  const pageName = page.getName({
    lang,
    params: {
      drinkName: drink?.subject ?? '',
    },
  })

  return (
    <LayoutPageWrapper>
      <h1>{pageName}</h1>
    </LayoutPageWrapper>
  )
}
