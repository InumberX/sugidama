import { StrictMode, type ReactNode } from 'react'

export const AppProvider = ({ children }: { children: ReactNode }) => {
  return <StrictMode>{children}</StrictMode>
}
