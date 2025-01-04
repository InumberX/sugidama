import { redirect } from 'react-router'
import { Links, Meta, Outlet, ScrollRestoration, Scripts } from 'react-router'
import { AppProvider } from '~/providers/AppProvider'
import { LayoutPortal } from '~/components/common/LayoutPortal'
import * as styles from './root.css'
import 'dotenv/config'
import { useChangeLanguage } from 'remix-i18next/react'
import { useTranslation } from 'react-i18next'
import { getLang } from '~/utils/locale'
import type { Route } from './+types/root'

export const handle = {
  i18n: 'common',
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const lang = getLang(params)
  const url = new URL(request.url)
  const paths = url.pathname.split('/').splice(1)

  if (lang === 'ja' && paths.length > 0 && paths[0] === 'ja') {
    const redirectUrl = `${url.pathname.replace(/^\/ja/, '/').replace(/\/\//g, '/')}${url.search}${url.hash}`
    redirect(redirectUrl)
  }

  return {
    env: {
      NO_INDEX: process.env.NO_INDEX || '',
      SITE_URL: process.env.SITE_URL || 'http://localhost:5173',
      SITE_NAME: process.env.SITE_NAME || 'Sugidama(development)',
    },
    lang,
  }
}

export default function RootRoute({ loaderData }: Route.ComponentProps) {
  const { lang } = loaderData
  const { i18n } = useTranslation()
  useChangeLanguage(lang)

  return (
    <AppProvider>
      <html lang={lang} dir={i18n.dir()}>
        <head>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, minimum-scale=1.0, shrink-to-fit=no, viewport-fit=cover"
          />
          <meta name="theme-color" content="#a2beed" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="twitter:site" content="@InumberX" />
          <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="16x16" />
          <link rel="apple-touch-icon" href="/apple-icon.png" type="image/png" sizes="180x180" />
          <Meta />
          <Links />
        </head>
        <body>
          <div className={styles.layoutRoot}>
            <Outlet />
            <LayoutPortal />
          </div>
          <ScrollRestoration />
          <Scripts />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.env = ${JSON.stringify({})}`,
            }}
          />
        </body>
      </html>
    </AppProvider>
  )
}
