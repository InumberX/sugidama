import { type LoaderFunctionArgs, Outlet } from 'react-router'

import { getLang } from '~/utils/locale'

export async function loader(args: LoaderFunctionArgs) {
  const { params } = args
  const lang = getLang(params)

  return {
    lang,
  }
}

export default function LayoutPublic() {
  return <Outlet />
}
