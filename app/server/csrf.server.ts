import { parseCookie, stringifySetCookie } from 'cookie'

import { NODE_ENV } from '~/config/env'
import { timingSafeEqual } from '~/server/timing-safe-equal.server'

const CSRF_COOKIE_NAME = '_csrf'
const CSRF_HEADER_NAME = 'X-CSRF-Token'

export function generateCsrfToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

export function createCsrfCookieHeader(token: string): string {
  return stringifySetCookie({
    name: CSRF_COOKIE_NAME,
    value: token,
    path: '/',
    httpOnly: false,
    secure: NODE_ENV === 'production',
    sameSite: 'lax',
  })
}

export function getCsrfTokenFromCookie(request: Request): string | undefined {
  const cookieHeader = request.headers.get('Cookie')
  if (!cookieHeader) return undefined
  const cookies = parseCookie(cookieHeader)
  return cookies[CSRF_COOKIE_NAME] || undefined
}

export async function validateCsrfRequest(request: Request): Promise<void> {
  const cookieToken = getCsrfTokenFromCookie(request)
  const headerToken = request.headers.get(CSRF_HEADER_NAME)

  let token = headerToken
  if (!token) {
    try {
      const formData = await request.clone().formData()
      token = formData.get(CSRF_COOKIE_NAME)?.toString() || null
    } catch {
      // Not a form submission or unparseable body
    }
  }

  if (!cookieToken || !token) {
    throw new Response('Invalid CSRF token', { status: 403 })
  }

  if (!(await timingSafeEqual(cookieToken, token))) {
    throw new Response('Invalid CSRF token', { status: 403 })
  }
}
