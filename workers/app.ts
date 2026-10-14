import { router } from '../app/router.ts'
import { createHandleWorkerRequest, type WorkerEnv } from './handler.ts'

// The Node starter gets this from `createRequestListener`'s default `onError`:
// log the error and answer a generic 500 rather than leaking the stack.
const handleRequest = async (request: Request): Promise<Response> => {
  try {
    return await router.fetch(request)
  } catch (error) {
    console.error(error)
    return new Response('Internal Server Error', { status: 500 })
  }
}

const handleWorkerRequest = createHandleWorkerRequest(handleRequest)

export default {
  fetch: (request: Request, env: WorkerEnv) => handleWorkerRequest(request, env),
}
