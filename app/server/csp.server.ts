import { API_URL } from '~/config/env'

export function buildCspDirective(nonce: string): string {
  const scriptSources = ["'self'", `'nonce-${nonce}'`, "'strict-dynamic'", 'https://www.googletagmanager.com']
  const styleSources = ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com']
  const fontSources = ["'self'", 'https://fonts.gstatic.com']
  const imgSources = ["'self'", 'data:', 'blob:', API_URL, 'https://www.google.co.jp'].filter(Boolean)
  const connectSources = [
    "'self'",
    'https://www.googletagmanager.com',
    'https://www.google.com',
    'https://*.google-analytics.com',
    'https://analytics.google.com',
    'https://*.sentry.io',
    API_URL,
  ].filter(Boolean)
  const frameSources = ["'self'", 'https://www.googletagmanager.com']
  const mediaSources = ["'self'", 'blob:']
  const workerSources = ["'self'", 'blob:']
  const formActionSources = ["'self'"]

  const directives = [
    `default-src 'self'`,
    `script-src ${scriptSources.join(' ')}`,
    `style-src ${styleSources.join(' ')}`,
    `font-src ${fontSources.join(' ')}`,
    `img-src ${imgSources.join(' ')}`,
    `connect-src ${connectSources.join(' ')}`,
    `frame-src ${frameSources.join(' ')}`,
    `media-src ${mediaSources.join(' ')}`,
    `worker-src ${workerSources.join(' ')}`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action ${formActionSources.join(' ')}`,
    `frame-ancestors 'none'`,
  ]

  return directives.join('; ')
}
