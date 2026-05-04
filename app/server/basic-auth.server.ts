import { timingSafeEqual } from '~/server/timing-safe-equal.server'

const REALM = 'Sugidama'
// HTTP authorization scheme matching is case-insensitive per RFC 7235.
const BASIC_AUTH_HEADER_PATTERN = /^Basic\s+(.+)$/i

export function unauthorizedResponse(): Response {
  return new Response('Unauthorized', {
    status: 401,
    headers: { 'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"` },
  })
}

export function decodeBasicCredentials(b64: string): string | null {
  try {
    const binary = atob(b64.trim())
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
  } catch {
    return null
  }
}

export async function verifyBasicAuth(
  request: Request,
  expectedUser: string,
  expectedPass: string
): Promise<Response | null> {
  const header = request.headers.get('Authorization')
  const match = header?.match(BASIC_AUTH_HEADER_PATTERN)
  if (!match) {
    return unauthorizedResponse()
  }
  const decoded = decodeBasicCredentials(match[1])
  if (decoded === null) {
    return unauthorizedResponse()
  }
  const sep = decoded.indexOf(':')
  if (sep === -1) {
    return unauthorizedResponse()
  }
  const user = decoded.slice(0, sep)
  const pass = decoded.slice(sep + 1)
  // Run both comparisons in parallel so a wrong username does not return
  // sooner than a wrong password (which itself would be a small timing leak).
  const [userOk, passOk] = await Promise.all([timingSafeEqual(user, expectedUser), timingSafeEqual(pass, expectedPass)])
  if (!userOk || !passOk) {
    return unauthorizedResponse()
  }
  return null
}
