import { createContext, useContext, type ReactNode } from 'react'

const NonceContext = createContext<string>('')

export const NonceProvider = ({ nonce, children }: { nonce: string; children: ReactNode }) => (
  <NonceContext.Provider value={nonce}>{children}</NonceContext.Provider>
)

export const useNonce = () => useContext(NonceContext)
