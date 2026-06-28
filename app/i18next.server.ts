import { LANG } from '~/config/consts'

export { i18nNamespaces } from '~/i18n'

// Detect the active language from the request URL. Japanese is the default and
// has no path prefix (e.g. `/`), English is prefixed with `/en`.
export function getLocale(request: Request): string {
  const url = new URL(request.url)
  const paths = url.pathname.split('/').splice(1)

  if (paths.length === 0) {
    return LANG.JA
  }

  switch (paths[0]) {
    case LANG.EN:
      return LANG.EN
    default:
      return LANG.JA
  }
}
