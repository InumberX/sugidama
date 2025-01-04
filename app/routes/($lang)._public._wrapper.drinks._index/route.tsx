import { type MetaFunction, json } from '@remix-run/node'
import { LayoutPageWrapper } from '~/components/ui/layouts/LayoutPageWrapper'
import { getMetadata } from '~/utils/meta'

export const meta: MetaFunction = (args) => {
  return getMetadata({
    args,
    title: 'お酒一覧',
  })
}

export async function loader() {
  return json({})
}

export default function DrinksPage() {
  return (
    <LayoutPageWrapper>
      <h1>お酒一覧ページ</h1>
    </LayoutPageWrapper>
  )
}
