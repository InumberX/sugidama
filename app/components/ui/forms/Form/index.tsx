import { Form as ReactRouterForm, useRouteLoaderData } from 'react-router'

import type { ComponentProps } from 'react'

import type { loader as rootLoader } from '~/root'

type FormProps = ComponentProps<typeof ReactRouterForm>

/**
 * Hidden input that includes the CSRF token for native form submissions (JS-disabled).
 * Use inside fetcher.Form with method="post". The custom Form component includes this automatically.
 */
export const CsrfHiddenInput = () => {
  const rootData = useRouteLoaderData<typeof rootLoader>('root')
  const csrfToken = rootData?.csrfToken
  return csrfToken ? <input type="hidden" name="_csrf" value={csrfToken} /> : null
}

/**
 * Custom Form wrapper that auto-injects a CSRF hidden input for non-GET methods.
 * When JS is enabled, the fetch interceptor in entry.client.tsx handles CSRF headers.
 * When JS is disabled, native form submissions include the token via this hidden input.
 */
export const Form = ({ children, ...props }: FormProps) => {
  const method = (props.method ?? 'GET').toUpperCase()
  const isNeedsCsrf = method !== 'GET'

  return (
    <ReactRouterForm {...props}>
      {isNeedsCsrf && <CsrfHiddenInput />}
      {children}
    </ReactRouterForm>
  )
}
