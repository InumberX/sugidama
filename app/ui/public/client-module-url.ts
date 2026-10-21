// Where scripts/build-client.ts writes each browser module, so a component can
// name its own client entry without a build manifest. It lives under public/
// because a hydrated component imports it in the browser too.

/** The URL prefix, and the directory under root public/, of the compiled modules. */
export const CLIENT_BASE_PATH = 'client'

/** `/client/app/x.tsx` → `/client/app/x.js`: the file a module URL is written as. */
export const toClientUrlPath = (urlPath: string): string =>
  urlPath.replace(/\.(?:tsx?|mts|jsx)$/, '.js')

/**
 * The public URL of a browser module, from its path in the repository:
 * `clientModuleUrl('app/a/public/b.tsx')` is `/client/app/a/public/b.js`.
 * `clientEntry(import.meta.url, …)` cannot be used here, because wrangler bundles
 * the Worker into one file and `import.meta.url` stops naming the module; pass
 * the module's own path instead (a test checks it matches the file).
 */
export const clientModuleUrl = (sourcePath: string): string =>
  toClientUrlPath(`/${CLIENT_BASE_PATH}/${sourcePath}`)
