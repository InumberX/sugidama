import { type AssetFetcher, createWorkerFetch } from '@inumberx/cloudflare-workers-basic-auth'

import { internalServerError } from '../app/middleware/internal-server-error.ts'

// Mirror of bindings declared in `wrangler.jsonc` plus Workers secrets set via
// `wrangler secret put`. Keep in sync manually whenever `wrangler.jsonc`
// changes; nothing regenerates this type.
export type WorkerEnv = {
  BASIC_AUTH_USER?: string
  BASIC_AUTH_PASS?: string
  ASSETS: AssetFetcher
}

type RequestHandler = (request: Request) => Response | Promise<Response>

// Catches what throws before a response exists — routing, middleware, an action
// — and answers a generic 500 rather than leaking the stack. It cannot catch a
// component that throws while rendering: `context.render` streams, so the 200
// and the first bytes are already sent by then. Those errors are logged by the
// renderer itself (`console.error`, the `renderToStream` default), and the
// browser receives truncated HTML. The Node starter's `createRequestListener`
// has the same split.
export const withErrorResponse =
  (handler: RequestHandler): RequestHandler =>
  async (request) => {
    try {
      return await handler(request)
    } catch (error) {
      return internalServerError(error)
    }
  }

export const createHandleWorkerRequest = (handler: RequestHandler) =>
  createWorkerFetch<WorkerEnv>({
    handler,
    realm: 'Sugidama',
    basicAuth: (env) => ({ user: env.BASIC_AUTH_USER, pass: env.BASIC_AUTH_PASS }),
    assets: (env) => env.ASSETS,
  })
