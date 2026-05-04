import { verifyBasicAuth } from '~/server/basic-auth.server'

export type WorkerEnv = {
  BASIC_AUTH_USER?: string
  BASIC_AUTH_PASS?: string
}

export type WorkerFetch = (request: Request, env: WorkerEnv) => Promise<Response>

export function createWorkerFetch(handler: (request: Request) => Response | Promise<Response>): WorkerFetch {
  return async function fetch(request, env) {
    if (env.BASIC_AUTH_USER && env.BASIC_AUTH_PASS) {
      const denied = verifyBasicAuth(request, env.BASIC_AUTH_USER, env.BASIC_AUTH_PASS)
      if (denied) {
        return denied
      }
    }
    return handler(request)
  }
}
