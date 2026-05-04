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
const ABORT_DELAY_MS = 5000

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

  const renderTimeout = new AbortController()
  const timeoutId = setTimeout(() => renderTimeout.abort(), ABORT_DELAY_MS)
  // Combine client disconnect with our render-time budget so React aborts on either.
  const signal = AbortSignal.any([request.signal, renderTimeout.signal])

  let body: Awaited<ReturnType<typeof renderToReadableStream>>
  try {
    body = await renderToReadableStream(
      <I18nextProvider i18n={instance}>
        <NonceProvider nonce={nonce}>
          <ServerRouter context={reactRouterContext} url={request.url} nonce={nonce} />
        </NonceProvider>
      </I18nextProvider>,
      {
        nonce,
        signal,
        onError(error) {
          if (signal.aborted) {
            return
          }
          console.error(error)
          responseStatusCode = 500
        },
      }
    )
  } catch (error) {
    clearTimeout(timeoutId)
    // Aborts (5s render budget exceeded or client disconnect) are expected
    // control flow, not bugs — only log unexpected shell-rendering errors.
    if (!signal.aborted) {
      console.error(error)
    }
    // Preserve the security headers (XFO/XCTO/HSTS/CSP) already attached to
    // responseHeaders so the error page is not served less protected than a
    // successful response.
    responseHeaders.set('Content-Type', 'text/plain')
    return new Response('Internal Server Error', {
      headers: responseHeaders,
      status: 500,
    })
  }

  if (waitForAll) {
    try {
      await body.allReady
    } catch {
      // Timed out or client disconnected — fall through with whatever rendered.
    }
    // Bot path is fully resolved; safe to release the abort budget.
    clearTimeout(timeoutId)
  }
  // Browser path: keep `timeoutId` alive so the abort signal still fires if a
  // Suspense or data promise stalls during streaming. The pending timer is
  // garbage-collected when the worker invocation ends; an abort after the
  // stream already completed is a harmless no-op.

  responseHeaders.set('Content-Type', 'text/html')
  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  })
}
