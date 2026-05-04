import { createRequestHandler } from 'react-router'

import { verifyBasicAuth } from '~/server/basic-auth.server'

type Env = {
  BASIC_AUTH_USER?: string
  BASIC_AUTH_PASS?: string
}

const requestHandler = createRequestHandler(() => import('virtual:react-router/server-build'), import.meta.env.MODE)

export default {
  async fetch(request, env): Promise<Response> {
    if (env.BASIC_AUTH_USER && env.BASIC_AUTH_PASS) {
      const denied = verifyBasicAuth(request, env.BASIC_AUTH_USER, env.BASIC_AUTH_PASS)
      if (denied) {
        return denied
      }
    }
    return requestHandler(request)
  },
} satisfies ExportedHandler<Env>
