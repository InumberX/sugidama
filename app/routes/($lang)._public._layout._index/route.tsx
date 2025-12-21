import { type MetaFunction } from 'react-router'

import type { Route } from './+types/route'

import { LayoutPageWrapper } from '~/components/ui/layouts/LayoutPageWrapper'
import { getLang } from '~/utils/locale'
import { getMetadata } from '~/utils/meta'

export const meta: MetaFunction = (args) => {
  return getMetadata({
    args,
  })
}

export async function loader({ params }: Route.LoaderArgs) {
  const lang = getLang(params)

  return {
    lang,
  }
}

export default function HomePage() {
  return (
    <LayoutPageWrapper>
      <h1>トップページ</h1>
    </LayoutPageWrapper>
  )
}
