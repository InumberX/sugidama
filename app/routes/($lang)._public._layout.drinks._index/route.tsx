import { type MetaFunction } from 'react-router'

import type { Route } from './+types/route'

import { LayoutPageWrapper } from '~/components/ui/layouts/LayoutPageWrapper'
import { getLang } from '~/utils/locale'
import { getMetadata } from '~/utils/meta'

export const meta: MetaFunction = (args) => {
  return getMetadata({
    args,
    title: 'お酒一覧',
  })
}

export async function loader({ params }: Route.LoaderArgs) {
  const lang = getLang(params)

  return {
    lang,
  }
}

export default function DrinksPage() {
  return (
    <LayoutPageWrapper>
      <h1>お酒一覧ページ</h1>
    </LayoutPageWrapper>
  )
}
