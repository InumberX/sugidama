import { json } from '@remix-run/node'
import { Links, Meta, Outlet, ScrollRestoration, Scripts } from '@remix-run/react'
import { AppProvider } from '~/providers/AppProvider'
import { LayoutPortal } from '~/components/common/LayoutPortal'
import * as styles from './root.css'

export async function loader() {
  return json({
    env: {
      NO_INDEX: process.env.NO_INDEX || '',
      SITE_URL: process.env.SITE_URL || 'http://localhost:5173',
    },
  })
}

export default function App() {
  return (
    <AppProvider>
      <html lang="ja">
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
