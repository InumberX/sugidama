import { type LoaderFunctionArgs, Outlet } from 'react-router'
import { getLang } from '~/utils/locale'

export async function loader({ params }: LoaderFunctionArgs) {
  const lang = getLang(params)

  return {
    lang,
  }
}

export default function PublicLayout() {
  return <Outlet />
}
