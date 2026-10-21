/**
 * The generic 500 for an error nothing else handled: logged for the Workers
 * observability logs, never echoed to the client. Shared by securityHeaders()
 * (errors inside the router) and workers/handler.ts withErrorResponse (errors
 * outside it), so both answer the same way.
 */
export const internalServerError = (error: unknown): Response => {
  console.error(error)
  return new Response('Internal Server Error', {
    status: 500,
    headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
  })
}
