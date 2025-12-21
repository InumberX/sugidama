import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { redirect } from 'react-router'
import { Links, Meta, Outlet, ScrollRestoration, Scripts, useLocation } from 'react-router'
import { useChangeLanguage } from 'remix-i18next/react'

import type { Route } from './+types/root'
import * as styles from './root.css'

import { LayoutPortal } from '~/components/common/LayoutPortal'
import { GOOGLE_ANALYTICS_ID } from '~/config/env'
import { AppProvider } from '~/providers/AppProvider'
import * as gtag from '~/utils/gtags.client'
import { getLang } from '~/utils/locale'

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
    lang,
  }
}

export default function RootRoute({ loaderData }: Route.ComponentProps) {
  const { lang } = loaderData
  const { i18n } = useTranslation()
  useChangeLanguage(lang)

  const location = useLocation()

  useEffect(() => {
    if (!GOOGLE_ANALYTICS_ID) {
      return
    }

    gtag.pageview(location.pathname, GOOGLE_ANALYTICS_ID)
  }, [location])

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
          {GOOGLE_ANALYTICS_ID && (
            <>
              <script async src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`} />
              <script
                async
                id="gtag-init"
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${GOOGLE_ANALYTICS_ID}', {
                      page_path: window.location.pathname,
                    });
                  `,
                }}
              />
            </>
          )}
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
