import { randomBytes, timingSafeEqual } from 'node:crypto'

import { parse, serialize } from 'cookie'

const CSRF_COOKIE_NAME = '_csrf'
const CSRF_HEADER_NAME = 'X-CSRF-Token'

export function generateCsrfToken(): string {
  return randomBytes(32).toString('hex')
}

export function createCsrfCookieHeader(token: string): string {
  return serialize(CSRF_COOKIE_NAME, token, {
    path: '/',
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })
}

export function getCsrfTokenFromCookie(request: Request): string | undefined {
  const cookieHeader = request.headers.get('Cookie')
  if (!cookieHeader) return undefined
  const cookies = parse(cookieHeader)
  return cookies[CSRF_COOKIE_NAME] || undefined
}

export async function validateCsrfRequest(request: Request): Promise<void> {
  const cookieToken = getCsrfTokenFromCookie(request)
  const headerToken = request.headers.get(CSRF_HEADER_NAME)

  // When JS is enabled, the fetch interceptor sets the header.
  // When JS is disabled, native form submissions include the token as a hidden input.
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

  const a = Buffer.from(cookieToken)
  const b = Buffer.from(token)
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    throw new Response('Invalid CSRF token', { status: 403 })
  }
}
