import { type MetaFunction } from 'react-router'

import { LayoutPageWrapper } from '~/components/ui/layouts/LayoutPageWrapper'
import { PAGES } from '~/config/paths'
import { getLang } from '~/utils/locale'
import { getMetadata } from '~/utils/meta'

import type { Route } from './+types/route'

const page = PAGES.SG10_100

export const meta: MetaFunction = (args) => {
  return getMetadata({
    args,
  })
}

export async function loader(args: Route.LoaderArgs) {
  const { params } = args
  const lang = getLang(params)

  return {
    lang,
  }
}

export default function PageSG10_100({ loaderData }: Route.ComponentProps) {
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
