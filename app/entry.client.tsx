import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { startTransition, StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import { HydratedRouter } from 'react-router/dom'

import { i18n, i18nNamespaces } from '~/i18n'

// Check if a URL is same-origin to avoid leaking CSRF token to third parties
function isSameOrigin(input: RequestInfo | URL): boolean {
  try {
    const url = input instanceof Request ? new URL(input.url) : new URL(input.toString(), window.location.origin)
    return url.origin === window.location.origin
  } catch {
    // Relative URLs are same-origin
    return true
  }
}

// Attach CSRF token to same-origin mutating fetch requests (POST/PUT/DELETE/PATCH)
function setupCsrfInterceptor() {
  const originalFetch = window.fetch.bind(window)
  window.fetch = function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const method = (init?.method || (input instanceof Request ? input.method : 'GET')).toUpperCase()
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method) && isSameOrigin(input)) {
      const csrfToken = document.cookie.match(/(?:^|;\s*)_csrf=([^;]*)/)?.[1]
      if (csrfToken) {
        if (input instanceof Request) {
          const newHeaders = new Headers(input.headers)
          newHeaders.set('X-CSRF-Token', csrfToken)
          input = new Request(input, { headers: newHeaders })
        } else {
          init = init || {}
          const headers = new Headers(init.headers)
          headers.set('X-CSRF-Token', csrfToken)
          init = { ...init, headers }
        }
      }
    }
    return originalFetch(input, init)
  }
}

setupCsrfInterceptor()

async function hydrate() {
  await i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
      ...i18n,
      ns: i18nNamespaces,
      detection: {
        order: ['htmlTag'],
        caches: [],
      },
    })

  startTransition(() => {
    hydrateRoot(
      document,
      <I18nextProvider i18n={i18next}>
        <StrictMode>
          <HydratedRouter />
        </StrictMode>
      </I18nextProvider>
    )
  })
}

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate)
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  window.setTimeout(hydrate, 1)
}
