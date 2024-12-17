import { Outlet } from 'react-router'
import { LayoutWrapper } from '~/components/ui/layouts/LayoutWrapper'
import { LayoutHeader } from '~/components/common/LayoutHeader'
import { LayoutFooter } from '~/components/common/LayoutFooter'
import { LayoutMain } from '~/components/ui/layouts/LayoutMain'

export default function PublicWrapperLayout() {
  return (
    <LayoutWrapper>
      <LayoutHeader />
      <LayoutMain>
        <Outlet />
      </LayoutMain>
      <LayoutFooter />
    </LayoutWrapper>
  )
}
