import { createInstance } from 'i18next'
import { isbot } from 'isbot'
import { renderToReadableStream } from 'react-dom/server'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import { type EntryContext, ServerRouter } from 'react-router'

import { NODE_ENV } from './config/env'
import i18next from './i18next.server'

import { i18n } from '~/i18n'
import { NonceProvider } from '~/providers/NonceProvider'
import { buildCspDirective } from '~/server/csp.server'

const isDevelopment = NODE_ENV !== 'production'

function generateNonce(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext
) {
  const instance = createInstance()
  const lng = await i18next.getLocale(request)
  const ns = i18next.getRouteNamespaces(reactRouterContext)

  await instance.use(initReactI18next).init({
    ...i18n,
    lng,
    ns,
  })

  responseHeaders.set('X-Content-Type-Options', 'nosniff')
  responseHeaders.set('X-Frame-Options', 'DENY')

  const nonce = generateNonce()
  if (!isDevelopment) {
    responseHeaders.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
    responseHeaders.set('Content-Security-Policy', buildCspDirective(nonce))
  }

  const userAgent = request.headers.get('user-agent')
  const waitForAll = isbot(userAgent)

  const body = await renderToReadableStream(
    <I18nextProvider i18n={instance}>
      <NonceProvider nonce={nonce}>
        <ServerRouter context={reactRouterContext} url={request.url} nonce={nonce} />
      </NonceProvider>
    </I18nextProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error(error)
        responseStatusCode = 500
      },
    }
  )

  if (waitForAll) {
    await body.allReady
  }

  responseHeaders.set('Content-Type', 'text/html')
  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  })
}
