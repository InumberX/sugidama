// The HTTP statuses the app answers with or reads from the API, named once so a
// call site says what it means (`HTTP_STATUS.NOT_FOUND`) rather than a bare
// number. Imports nothing, so middleware, actions and data can all use it.
export const HTTP_STATUS = {
  /** A redirect for GET/HEAD (`/ja` to the unprefixed URL), as develop did. */
  FOUND: 302,
  /** A redirect that keeps the method and body, for anything but GET/HEAD. */
  TEMPORARY_REDIRECT: 307,
  /** A permanent redirect that keeps the method and body (trailing slashes). */
  PERMANENT_REDIRECT: 308,
  /** The first error status; anything below it is not an error. */
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  /** What the API answers for an id it no longer has. */
  GONE: 410,
  /** The first server error status. */
  INTERNAL_SERVER_ERROR: 500,
  /** An API failure that is not the visitor's fault. */
  BAD_GATEWAY: 502,
} as const
