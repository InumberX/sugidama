import { type MetaFunction, json } from '@remix-run/node'
import { LayoutPageWrapper } from '~/components/ui/layouts/LayoutPageWrapper'
import { getMetadata } from '~/utils/meta'

export const meta: MetaFunction = (args) => {
  return getMetadata({
    args,
  })
}

export async function loader() {
  return json({})
}

export default function HomePage() {
  return (
    <LayoutPageWrapper>
      <h1>トップページ</h1>
    </LayoutPageWrapper>
  )
}
