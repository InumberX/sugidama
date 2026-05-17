import { createRequestHandler } from 'react-router'

import { createHandleWorkerRequest, type WorkerEnv } from './handler'

const requestHandler = createRequestHandler(() => import('virtual:react-router/server-build'), import.meta.env.MODE)

const handleWorkerRequest = createHandleWorkerRequest(requestHandler)

export default {
  fetch: (request, env) => handleWorkerRequest(request, env),
} satisfies ExportedHandler<WorkerEnv>
