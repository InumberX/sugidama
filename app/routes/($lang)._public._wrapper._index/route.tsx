import { type MetaFunction } from 'react-router'
import { useLoaderData } from 'react-router'
import { LayoutPageWrapper } from '~/components/ui/layouts/LayoutPageWrapper'
import { getMetadata } from '~/utils/meta'
import { getLang } from '~/utils/locale'
import { useTranslation } from 'react-i18next'
import type { Route } from './+types/route'

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
