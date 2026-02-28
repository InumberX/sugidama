import { Outlet } from 'react-router'

import type { Route } from './+types/route'

import { LayoutFooter } from '~/components/common/LayoutFooter'
import { LayoutHeader } from '~/components/common/LayoutHeader'
import { LayoutMain } from '~/components/ui/layouts/LayoutMain'
import { LayoutWrapper } from '~/components/ui/layouts/LayoutWrapper'
import { getLang } from '~/utils/locale'

export async function loader(args: Route.LoaderArgs) {
  const { params } = args
  const lang = getLang(params)

  return {
    lang,
  }
}

export default function LayoutPublicWrapper({ loaderData }: Route.ComponentProps) {
  const { lang } = loaderData

  return (
    <LayoutWrapper>
      <LayoutHeader lang={lang} />
      <LayoutMain>
        <Outlet />
      </LayoutMain>
      <LayoutFooter />
    </LayoutWrapper>
  )
}
