import { createRequestHandler } from 'react-router'

type Env = {
  BASIC_AUTH_USER?: string
  BASIC_AUTH_PASS?: string
}

const requestHandler = createRequestHandler(() => import('virtual:react-router/server-build'), import.meta.env.MODE)

const REALM = 'Sugidama'

function unauthorizedResponse(): Response {
  return new Response('Unauthorized', {
    status: 401,
    headers: { 'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"` },
  })
}

function timingSafeEqual(a: string, b: string): boolean {
  const encoder = new TextEncoder()
  const aBytes = encoder.encode(a)
  const bBytes = encoder.encode(b)
  if (aBytes.length !== bBytes.length) {
    return false
  }
  let diff = 0
  for (let i = 0; i < aBytes.length; i++) {
    diff |= aBytes[i] ^ bBytes[i]
  }
  return diff === 0
}

function verifyBasicAuth(request: Request, expectedUser: string, expectedPass: string): Response | null {
  const header = request.headers.get('Authorization')
  if (!header || !header.startsWith('Basic ')) {
    return unauthorizedResponse()
  }
  let decoded: string
  try {
    decoded = atob(header.slice('Basic '.length).trim())
  } catch {
    return unauthorizedResponse()
  }
  const sep = decoded.indexOf(':')
  if (sep === -1) {
    return unauthorizedResponse()
  }
  const user = decoded.slice(0, sep)
  const pass = decoded.slice(sep + 1)
  const userOk = timingSafeEqual(user, expectedUser)
  const passOk = timingSafeEqual(pass, expectedPass)
  if (!userOk || !passOk) {
    return unauthorizedResponse()
  }
  return null
}

export default {
  async fetch(request, env): Promise<Response> {
    if (env.BASIC_AUTH_USER && env.BASIC_AUTH_PASS) {
      const denied = verifyBasicAuth(request, env.BASIC_AUTH_USER, env.BASIC_AUTH_PASS)
      if (denied) {
        return denied
      }
    }
    return requestHandler(request)
  },
} satisfies ExportedHandler<Env>
