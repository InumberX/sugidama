import { type MetaFunction, type LoaderFunctionArgs, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { LayoutPageWrapper } from '~/components/ui/layouts/LayoutPageWrapper'
import { getMetadata } from '~/utils/meta'
import { getLang } from '~/utils/locale'
import { useTranslation } from 'react-i18next'

export const meta: MetaFunction = (args) => {
  return getMetadata({
    args,
  })
}

export async function loader({ params }: LoaderFunctionArgs) {
  const lang = getLang(params)

  return json({
    lang,
  })
}

export default function HomePage() {
  const { lang } = useLoaderData<typeof loader>()
  const { t } = useTranslation()

  return (
    <LayoutPageWrapper>
      <h1>トップページ</h1>
      <p>{lang}</p>
      <p>{t('greeting')}</p>
    </LayoutPageWrapper>
  )
}
