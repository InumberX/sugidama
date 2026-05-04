import { verifyBasicAuth } from '~/server/basic-auth.server'

export type WorkerEnv = {
  BASIC_AUTH_USER?: string
  BASIC_AUTH_PASS?: string
  ASSETS: Fetcher
}

export type WorkerFetch = (request: Request, env: WorkerEnv) => Promise<Response>

export function createWorkerFetch(handler: (request: Request) => Response | Promise<Response>): WorkerFetch {
  return async function fetch(request, env) {
    // Auth gate covers everything (static assets included).
    if (env.BASIC_AUTH_USER && env.BASIC_AUTH_PASS) {
      const denied = verifyBasicAuth(request, env.BASIC_AUTH_USER, env.BASIC_AUTH_PASS)
      if (denied) {
        return denied
      }
    }
    // Try the static-asset binding first; missing assets fall through to SSR.
    const assetResponse = await env.ASSETS.fetch(request)
    if (assetResponse.status !== 404) {
      return assetResponse
    }
    return handler(request)
  }
}
