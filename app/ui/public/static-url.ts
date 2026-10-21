// Static images under root public/static/ carry the per-deploy cache buster,
// as app.css does. The query has to be the same on the server and in the
// browser: a hydrated component that renders a different URL computes a
// different css(...) class, and the browser then fetches the image again
// without the query. It lives under public/ because hydrated components (the
// icons in the search form and the slider) import it in the browser too.
//
// The server cannot pass it in from app/env.ts, which is server-only, so the
// value reaches each side its own way: app/router.ts sets it once at start-up,
// and Document writes the same value into `<html data-static-query>`, which
// the browser reads.

/** The `<html>` attribute that carries the query to the browser. */
export const STATIC_QUERY_ATTRIBUTE = 'data-static-query'

/** A path under root public/static/, the only files that get the query. */
export type StaticPath = `/static/${string}`

let staticQuery: string | undefined

/** Sets the query (`ver=<BUILD_ID>`, without the `?`) for every later `staticUrl()`. */
export const setStaticQuery = (query: string): void => {
  staticQuery = query
}

const currentQuery = (): string => {
  if (staticQuery !== undefined) return staticQuery
  if (typeof document === 'undefined') return ''
  // The browser reads it once; it is the same for the life of the page.
  staticQuery = document.documentElement.getAttribute(STATIC_QUERY_ATTRIBUTE) ?? ''
  return staticQuery
}

/**
 * `/static/img/x.webp` with the cache buster: `/static/img/x.webp?ver=<BUILD_ID>`.
 * Call it while rendering, not at module load, so the server has set the
 * query first. Without one (a component rendered on its own in a test) the
 * path is returned as it is.
 */
export const staticUrl = (path: StaticPath): string => {
  const query = currentQuery()
  return query ? `${path}?${query}` : path
}
