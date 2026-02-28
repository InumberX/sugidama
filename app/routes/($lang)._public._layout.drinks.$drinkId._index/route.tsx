import { type MetaFunction } from 'react-router'

import type { Route } from './+types/route'

import { LayoutPageWrapper } from '~/components/ui/layouts/LayoutPageWrapper'
import { PAGES } from '~/config/paths'
import { getDrinksDetail } from '~/server/api/drinks.server'
import { getLang } from '~/utils/locale'
import { getMetadata } from '~/utils/meta'

const page = PAGES.SG20_101

export const meta: MetaFunction = (args) => {
  const { params } = args
  const { drinkId } = params
  const lang = getLang({
    lang: params.lang,
  })

  return getMetadata({
    args,
    title: page.getName({
      lang,
      params: {
        drinkName: String(drinkId),
      },
    }),
  })
}

export async function loader(args: Route.LoaderArgs) {
  const { params } = args
  const { drinkId } = params
  const lang = getLang(params)

  const drink = await getDrinksDetail({ id: drinkId })

  if (!drink) {
    throw new Response('', {
      status: 404,
    })
  }

  return {
    lang,
    drink,
  }
}

export default function PageSG20_101({ loaderData }: Route.ComponentProps) {
  const { lang, drink } = loaderData

  const pageName = page.getName({
    lang,
    params: {
      drinkName: drink.subject,
    },
  })

  return (
    <LayoutPageWrapper>
      <h1>{pageName}</h1>
    </LayoutPageWrapper>
  )
}
