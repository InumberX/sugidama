import { API_URL } from '~/config/env'
import { getErrorMessage } from '~/utils/error'

type ApiSuccess<T> = {
  success: true
  data: T
}

type ApiError = {
  success: false
  // null = ネットワークエラー等
  status: number | null
  message: string
}

export type ApiResult<T> = ApiSuccess<T> | ApiError

export const apiClient = async <T>({
  path,
  options,
}: {
  path: string
  options?: RequestInit
}): Promise<ApiResult<T>> => {
  let response: Response

  try {
    response = await fetch(`${API_URL}${path}`, {
      cache: 'no-store',
      ...options,
    })
  } catch (error) {
    console.error(`[API] Network error: ${path}`, error)
    return {
      success: false,
      status: null,
      message: getErrorMessage(error),
    }
  }

  if (!response.ok) {
    console.error(`[API] ${response.status}: ${path}`)
    return {
      success: false,
      status: response.status,
      message: getErrorMessage(response.statusText),
    }
  }

  try {
    const data = (await response.json()) as T
    return {
      success: true,
      data,
    }
  } catch {
    console.error(`[API] JSON parse error: ${path}`)
    return {
      success: false,
      status: response.status,
      message: 'JSON parse error',
    }
  }
}
