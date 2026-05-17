import { createWorkerFetch } from '@inumberx/cloudflare-workers-basic-auth'
import { createRequestHandler } from 'react-router'

// Mirror of bindings declared in `wrangler.jsonc` plus Workers secrets set via
// `wrangler secret put`. Keep in sync manually whenever `wrangler.jsonc`
// changes; `npm run build` does not regenerate this type.
type WorkerEnv = {
  BASIC_AUTH_USER?: string
  BASIC_AUTH_PASS?: string
  ASSETS: Fetcher
}

const requestHandler = createRequestHandler(() => import('virtual:react-router/server-build'), import.meta.env.MODE)

const handleWorkerRequest = createWorkerFetch<WorkerEnv>({
  handler: requestHandler,
  realm: 'Sugidama',
  basicAuth: (env) => ({ user: env.BASIC_AUTH_USER, pass: env.BASIC_AUTH_PASS }),
  assets: (env) => env.ASSETS,
})

export default {
  fetch: (request, env) => handleWorkerRequest(request, env),
} satisfies ExportedHandler<WorkerEnv>
