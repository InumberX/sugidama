// The browser runtime: hydrates every `clientEntry` on the page. Compiled by
// scripts/build-client.ts and loaded by `Document` on pages that pass
// `hasClientEntries`.
import { run } from 'remix/component'

// Links and forms stay full-document navigations. Remix would otherwise turn
// same-origin navigations into fetches that patch the page, which would need
// its own answer for Google Analytics page views and the per-request CSP nonce;
// hydration does not need it. Registered before `run()` so it sees every
// navigation first.
window.navigation?.addEventListener('navigate', (event) => event.stopImmediatePropagation())

const app = run({
  async loadModule(moduleUrl, exportName) {
    const mod = await import(moduleUrl)
    const Component = mod[exportName]
    if (typeof Component !== 'function') {
      throw new Error(`Unknown component: ${moduleUrl}#${exportName}`)
    }
    return Component
  },
})

// Hydration and component failures are dispatched on the app rather than
// thrown; without a listener they would vanish.
app.addEventListener('error', (event) => {
  console.error('Component error:', event.error)
})
