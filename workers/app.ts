import { router } from '../app/router.ts'
import { createHandleWorkerRequest, type WorkerEnv } from './handler.ts'

// Catches what throws before a response exists — routing, middleware, an action
// — and answers a generic 500 rather than leaking the stack. It cannot catch a
// component that throws while rendering: `context.render` streams, so the 200
// and the first bytes are already sent by then. Those errors are logged by the
// renderer itself (`console.error`, the `renderToStream` default), and the
// browser receives truncated HTML. The Node starter's `createRequestListener`
// has the same split.
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
