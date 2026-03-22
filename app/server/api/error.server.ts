import { type ApiError } from '~/server/api/client.server'

export const convertError = (error: ApiError) => {
  if (!error.status) {
    return new Response('Internal server error. Please try again later.', {
      status: 500,
    })
  }

  return new Response(error.message, {
    status: error.status,
  })
}
