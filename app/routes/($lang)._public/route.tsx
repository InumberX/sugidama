import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { getLang } from '~/utils/locale'

export async function loader({ params }: LoaderFunctionArgs) {
  const lang = getLang(params)

  return json({
    lang,
  })
}

export default function PublicLayout() {
  return <Outlet />
}
