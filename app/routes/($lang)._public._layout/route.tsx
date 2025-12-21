import { Outlet, useRouteLoaderData } from 'react-router'

import { LayoutFooter } from '~/components/common/LayoutFooter'
import { LayoutHeader } from '~/components/common/LayoutHeader'
import { LayoutMain } from '~/components/ui/layouts/LayoutMain'
import { LayoutWrapper } from '~/components/ui/layouts/LayoutWrapper'
import { type loader as publicLoader } from '~/routes/($lang)._public/route'

export default function PublicWrapperLayout() {
  const publicLoaderData = useRouteLoaderData<typeof publicLoader>('routes/($lang)._public')

  if (!publicLoaderData) {
    throw new Error('loader data of routes/($lang)._public is undefined')
  }

  const { lang } = publicLoaderData

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
