// develop's React Router routes answered `/en/` as well as `/en`; Remix route
// patterns are exact, so without this a trailing slash is a 404. Redirecting
// to the slash-less URL keeps old links and bookmarks working and leaves each
// page one canonical URL.
import type { Middleware } from 'remix/router'

import { localRedirect } from './local-redirect.ts'

/**
 * Router middleware: a GET or HEAD for `/path/` is redirected (301) to
 * `/path`, query kept. Other methods pass through untouched, since a redirect
 * would turn them into a GET.
 */
export const trailingSlash = (): Middleware => (context, next) => {
  const { pathname, search } = context.url
  if (
    (context.method === 'GET' || context.method === 'HEAD') &&
    pathname.length > 1 &&
    pathname.endsWith('/')
  ) {
    return localRedirect(context.url, `${pathname.replace(/\/+$/, '')}${search}`, 301)
  }
  return next()
}
