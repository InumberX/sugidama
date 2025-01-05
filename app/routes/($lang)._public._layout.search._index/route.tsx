import { type MetaFunction } from 'react-router'
import { LayoutPageWrapper } from '~/components/ui/layouts/LayoutPageWrapper'
import { getMetadata } from '~/utils/meta'

export const meta: MetaFunction = (args) => {
  return getMetadata({
    args,
    title: '検索結果',
  })
}

export async function loader() {
  return {}
}

export default function SearchPage() {
  return (
    <LayoutPageWrapper>
      <h1>検索結果ページ</h1>
    </LayoutPageWrapper>
  )
}
