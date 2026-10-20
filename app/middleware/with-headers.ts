/**
 * The response's media type, lower-cased and without parameters
 * (`text/html; charset=UTF-8` is `text/html`), or `null` without one. The same
 * parse as `isHtmlResponse()` in @remix-run/render-middleware's render-ui.ts,
 * which is not exported; keep the two in step when Remix is upgraded.
 */
export const mediaTypeOf = (response: Response): string | null => {
  const type = response.headers.get('Content-Type')
  return type === null ? null : (type.split(';', 1)[0] ?? '').trim().toLowerCase()
}

/**
 * Sets headers on a response, copying it first when its headers are immutable
 * (`Response.redirect()` and some fetched responses throw on `set`).
 */
export const withHeaders = (response: Response, headers: Record<string, string>): Response => {
  try {
    for (const [name, value] of Object.entries(headers)) response.headers.set(name, value)
    return response
  } catch {
    const copy = new Response(response.body, response)
    for (const [name, value] of Object.entries(headers)) copy.headers.set(name, value)
    return copy
  }
}
