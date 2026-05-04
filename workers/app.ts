import { createRequestHandler } from 'react-router'

import { createWorkerFetch, type WorkerEnv } from '~/server/worker-fetch.server'

const requestHandler = createRequestHandler(() => import('virtual:react-router/server-build'), import.meta.env.MODE)
const handleWorkerRequest = createWorkerFetch(requestHandler)

export default {
  fetch: (request, env) => handleWorkerRequest(request, env),
} satisfies ExportedHandler<WorkerEnv>
