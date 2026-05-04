import { verifyBasicAuth } from '~/server/basic-auth.server'

// Mirror of bindings declared in `wrangler.jsonc` plus Workers secrets set via
// `wrangler secret put`. Keep in sync manually whenever `wrangler.jsonc`
// changes; `npm run build` does not regenerate this type.
export type WorkerEnv = {
  BASIC_AUTH_USER?: string
  BASIC_AUTH_PASS?: string
  ASSETS: Fetcher
}

export type WorkerFetch = (request: Request, env: WorkerEnv) => Promise<Response>

// Static assets only answer safe, body-less methods. Routing POST/PUT/DELETE
// /PATCH through ASSETS would surface 405s for the app's own mutating routes
// (forms, CSRF-protected actions) before React Router can handle them.
const ASSET_FETCH_METHODS = new Set(['GET', 'HEAD'])

export function createWorkerFetch(handler: (request: Request) => Response | Promise<Response>): WorkerFetch {
  return async function fetch(request, env) {
    const userSet = Boolean(env.BASIC_AUTH_USER)
    const passSet = Boolean(env.BASIC_AUTH_PASS)
    // Fail closed on partial configuration: a misplaced `wrangler secret put`
    // (only one of USER/PASS) used to silently disable the auth gate. Now we
    // refuse all traffic until the operator fixes the misconfiguration.
    if (userSet !== passSet) {
      console.error('BASIC_AUTH_USER and BASIC_AUTH_PASS must both be set or both be unset; rejecting all requests.')
      return new Response('Service Unavailable', { status: 503 })
    }
    if (userSet && passSet) {
      const denied = verifyBasicAuth(request, env.BASIC_AUTH_USER!, env.BASIC_AUTH_PASS!)
      if (denied) {
        return denied
      }
    }
    if (ASSET_FETCH_METHODS.has(request.method)) {
      const assetResponse = await env.ASSETS.fetch(request)
      if (assetResponse.status !== 404) {
        return assetResponse
      }
    }
    return handler(request)
  }
}
