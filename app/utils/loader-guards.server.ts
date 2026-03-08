/**
 * Validates and parses a route parameter as a number
 * @throws {Response} 404 Not Found if parameter is missing or invalid
 */
export function parseNumberParam(param: string | undefined | null, paramName?: string): number {
  ensureCondition(param, { message: `Missing ${paramName}` })

  const numValue = parseInt(param, 10)
  ensureCondition(!isNaN(numValue), { message: paramName ? `Invalid ${paramName}` : '' })

  return numValue
}

/**
 * Validates multiple route parameters as numbers at once
 * @throws {Response} 404 Not Found if any parameter is missing or invalid
 */
export function parseNumberParams<T extends Record<string, string | undefined | null>>(
  params: T
): { [K in keyof T]: number } {
  const result = {} as { [K in keyof T]: number }

  for (const [key, value] of Object.entries(params)) {
    result[key as keyof T] = parseNumberParam(value, key)
  }

  return result
}

/**
 * Generic condition check with custom status code
 * Use this when the specific helpers (ensureFound, ensureAuthenticated) don't fit
 * @throws {Response} with specified status code if condition is falsy
 */
export function ensureCondition<T>(
  condition: T,
  options?: {
    status?: 401 | 403 | 404 | 500
    message?: string
  }
): asserts condition is NonNullable<T> {
  if (!condition) {
    throw new Response(options?.message || '', {
      status: options?.status ?? 404,
    })
  }
}
