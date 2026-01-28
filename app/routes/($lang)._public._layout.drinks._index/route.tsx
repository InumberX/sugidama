import { type MetaFunction } from 'react-router'

import type { Route } from './+types/route'

import { LayoutPageWrapper } from '~/components/ui/layouts/LayoutPageWrapper'
import { PAGES } from '~/config/paths'
import { getLang } from '~/utils/locale'
import { getMetadata } from '~/utils/meta'

const page = PAGES.SG20_100

export const meta: MetaFunction = (args) => {
  const { params } = args
  const lang = getLang({
    lang: params.lang,
  })

  return getMetadata({
    args,
    title: page.getName({
      lang,
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

export default function PageSG20_100({ loaderData }: Route.ComponentProps) {
  const { lang } = loaderData

  const pageName = page.getName({
    lang,
  })

  return (
    <LayoutPageWrapper>
      <h1>{pageName}</h1>
    </LayoutPageWrapper>
  )
}
