import { createReadableStreamFromReadable } from '@react-router/node'
import { createInstance, type i18n as i18nType } from 'i18next'
import { isbot } from 'isbot'
import { randomBytes } from 'node:crypto'
import { renderToPipeableStream } from 'react-dom/server'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import { type EntryContext } from 'react-router'
import { ServerRouter } from 'react-router'
import { PassThrough } from 'stream'

import { i18n } from '~/i18n'
import { NonceProvider } from '~/providers/NonceProvider'
import { buildCspDirective } from '~/server/csp.server'

import i18next from './i18next.server'

// import { resolve } from 'node:path'

const ABORT_DELAY = 5000
const isDevelopment = process.env.NODE_ENV !== 'production'

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

  // Security headers
  responseHeaders.set('X-Content-Type-Options', 'nosniff')
  responseHeaders.set('X-Frame-Options', 'DENY')

  // HSTS and CSP are production-only (skip in development to avoid localhost issues and Vite HMR issues)
  const nonce = randomBytes(16).toString('base64')
  if (!isDevelopment) {
    responseHeaders.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
    responseHeaders.set('Content-Security-Policy', buildCspDirective(nonce))
  }

  return isbot(request.headers.get('user-agent'))
    ? handleBotRequest(request, responseStatusCode, responseHeaders, reactRouterContext, instance, nonce)
    : handleBrowserRequest(request, responseStatusCode, responseHeaders, reactRouterContext, instance, nonce)
}

function handleBotRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  i18n: i18nType,
  nonce: string
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false
    const { pipe, abort } = renderToPipeableStream(
      <I18nextProvider i18n={i18n}>
        <NonceProvider nonce={nonce}>
          <ServerRouter context={reactRouterContext} url={request.url} nonce={nonce} />
        </NonceProvider>
      </I18nextProvider>,
      {
        nonce,
        onAllReady() {
          shellRendered = true
          const body = new PassThrough()
          const stream = createReadableStreamFromReadable(body)

          responseHeaders.set('Content-Type', 'text/html')

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            })
          )

          pipe(body)
        },
        onShellError(error: unknown) {
          reject(error)
        },
        onError(error: unknown) {
          responseStatusCode = 500
          if (shellRendered) {
            console.error(error)
          }
        },
      }
    )

    setTimeout(abort, ABORT_DELAY)
  })
}

function handleBrowserRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  i18n: i18nType,
  nonce: string
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false
    const { pipe, abort } = renderToPipeableStream(
      <I18nextProvider i18n={i18n}>
        <NonceProvider nonce={nonce}>
          <ServerRouter context={reactRouterContext} url={request.url} nonce={nonce} />
        </NonceProvider>
      </I18nextProvider>,
      {
        nonce,
        onShellReady() {
          shellRendered = true
          const body = new PassThrough()
          const stream = createReadableStreamFromReadable(body)

          responseHeaders.set('Content-Type', 'text/html')

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            })
          )

          pipe(body)
        },
        onShellError(error: unknown) {
          reject(error)
        },
        onError(error: unknown) {
          responseStatusCode = 500
          if (shellRendered) {
            console.error(error)
          }
        },
      }
    )

    setTimeout(abort, ABORT_DELAY)
  })
}
