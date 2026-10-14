import { type AssetFetcher, createWorkerFetch } from '@inumberx/cloudflare-workers-basic-auth'

// Mirror of bindings declared in `wrangler.jsonc` plus Workers secrets set via
// `wrangler secret put`. Keep in sync manually whenever `wrangler.jsonc`
// changes; nothing regenerates this type.
export type WorkerEnv = {
  BASIC_AUTH_USER?: string
  BASIC_AUTH_PASS?: string
  ASSETS: AssetFetcher
}

export function createHandleWorkerRequest(
  handler: (request: Request) => Response | Promise<Response>
) {
  return createWorkerFetch<WorkerEnv>({
    handler,
    realm: 'Sugidama',
    basicAuth: (env) => ({ user: env.BASIC_AUTH_USER, pass: env.BASIC_AUTH_PASS }),
    assets: (env) => env.ASSETS,
  })
}
