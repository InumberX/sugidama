import { createRedirectResponse } from 'remix/response/redirect'

import { HTTP_STATUS } from '../utils/http-status.ts'

/**
 * A redirect to `path` on this site. The target is resolved against the
 * request's origin, as develop's `/ja` redirect did, and anything that would
 * leave it — `//host/…` from a doubled slash, say — becomes `/` instead. The
 * Location stays root-relative.
 */
export const localRedirect = (
  url: URL,
  path: string,
  status: number = HTTP_STATUS.FOUND
): Response => {
  const target = new URL(path, url.origin)
  return createRedirectResponse(
    target.origin === url.origin ? `${target.pathname}${target.search}` : '/',
    status
  )
}
