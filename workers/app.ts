import { router } from '../app/router.ts'
import { createHandleWorkerRequest, type WorkerEnv, withErrorResponse } from './handler.ts'

const handleWorkerRequest = createHandleWorkerRequest(withErrorResponse(router.fetch))

export default {
  fetch: (request: Request, env: WorkerEnv) => handleWorkerRequest(request, env),
}
