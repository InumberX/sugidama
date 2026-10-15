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
