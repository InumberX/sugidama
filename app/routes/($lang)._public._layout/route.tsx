import { Outlet, useRouteLoaderData } from 'react-router'
import { type loader as publicLoader } from '~/routes/($lang)._public/route'
import { LayoutWrapper } from '~/components/ui/layouts/LayoutWrapper'
import { LayoutHeader } from '~/components/common/LayoutHeader'
import { LayoutFooter } from '~/components/common/LayoutFooter'
import { LayoutMain } from '~/components/ui/layouts/LayoutMain'

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
