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
  const { lang } = useLoaderData<typeof loader>()
  const { t } = useTranslation()

  return (
    <LayoutPageWrapper>
      <h1>お酒一覧ページ</h1>
      <p>{lang}</p>
      <p>{t('greeting')}</p>
    </LayoutPageWrapper>
  )
}
