// Compiles the browser modules ahead of time into public/client/, which the
// Workers ASSETS binding serves as-is. Remix's asset server compiles on
// request in Node, which a Worker cannot do; here it runs once, in Node, and
// every module it would have served is written to disk instead.
//
// Run through `npm run build-client`. wrangler runs it too, before `wrangler dev`
// and every deploy (`build.command` in wrangler.jsonc), so the output always
// matches the source it ships with.
//
// URLs are not fingerprinted: a module's URL is `/client/` plus its source
// path with a `.js` extension, so a component can name its own client entry
// without a build manifest (`clientModuleUrl()`). The cost is revalidation
// (ETag) instead of immutable caching, the same as every other root public/
// file.
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { glob } from 'node:fs/promises'
import * as path from 'node:path'
import { createAssetServer } from 'remix/assets'

import { CLIENT_BASE_PATH, toClientUrlPath } from '../app/ui/public/client-module-url.ts'

const rootDir = path.resolve(import.meta.dirname, '..')
const outDir = path.join(rootDir, 'public', CLIENT_BASE_PATH)

const assets = createAssetServer({
  basePath: `/${CLIENT_BASE_PATH}`,
  rootDir,
  allowFiles: ['app/**/public/**'],
  allowPackages: ['remix'],
  denyFiles: ['app/**/*.test.*'],
  minify: true,
  watch: false,
})

// Every module under a public/ directory is a possible entry; the runtime
// entry and each `clientEntry` load the rest through their imports.
const sources: string[] = []
for await (const file of glob('app/**/public/**/*.{ts,tsx}', { cwd: rootDir })) {
  if (/\.test\.tsx?$/.test(file) || /\.types\.ts$/.test(file)) continue
  sources.push(file.split(path.sep).join('/'))
}
const entries = sources.map((source) => `/${CLIENT_BASE_PATH}/${source}`)

// The asset server writes `remix/*` imports as URLs but leaves other packages
// as authored (`"@remix-run/ui/tabs"`) for an import map to resolve. There is
// no import map here (a Worker page would need one per document, nonce'd), so
// the map is applied now: each bare specifier becomes the URL the map gives it
// for the importing module.
const importMap = await assets.getImportMap(sources)
const resolveBare = (specifier: string, importer: string): string | undefined => {
  const scopes = Object.entries(importMap.scopes ?? {})
    .filter(([scope]) => importer.startsWith(scope))
    .sort(([a], [b]) => b.length - a.length)
  for (const [, mapping] of scopes) {
    if (Object.hasOwn(mapping, specifier)) return mapping[specifier]
  }
  return importMap.imports?.[specifier]
}

// Absolute module specifiers (`"/client/npm/…"`) and relative ones
// (`from"./frame.js"`, `import("../x.ts")`) in the asset server's output.
const SPECIFIER = new RegExp(`(["'])(/${CLIENT_BASE_PATH}/[^"'?#]+)\\1`, 'g')
const RELATIVE_SPECIFIER = /(?:\bfrom|\bimport)\s*\(?\s*(["'`])(\.{1,2}\/[^"'`]+)\1/g
// Bare package specifiers (`from"@remix-run/ui/tabs"`), resolved through the import map.
const BARE_SPECIFIER = /(?:\bfrom|\bimport)\s*\(?\s*(["'`])([^"'`./][^"'`]*)\1/g

const seen = new Set<string>()
const queue = [...entries]
await rm(outDir, { recursive: true, force: true })

while (queue.length > 0) {
  const url = queue.shift()!
  if (seen.has(url)) continue
  seen.add(url)

  const response = await assets.fetch(new Request(new URL(url, 'http://build.local')))
  if (response === null || !response.ok) {
    throw new Error(`build-client: ${url} answered ${response?.status ?? 'nothing'}`)
  }

  // Each specifier is queued under its source URL and rewritten to the `.js`
  // file it is written as: ASSETS picks the Content-Type from the extension,
  // and a `.ts` or `.tsx` file would not be served as JavaScript. App modules
  // import each other by relative path (`from"./x.styles.ts"`), packages by
  // absolute path; both are followed.
  const base = new URL(url, 'http://build.local')
  const source = (await response.text())
    .replace(BARE_SPECIFIER, (match, quote, specifier) => {
      // A template literal with an interpolation is a runtime URL (`import(`${moduleUrl}`)`).
      if (specifier.includes('${')) return match
      const resolved = resolveBare(specifier, url)
      if (resolved === undefined) {
        throw new Error(`build-client: ${url} imports ${specifier}, which the import map does not resolve`)
      }
      return match.replace(`${quote}${specifier}${quote}`, `${quote}${resolved}${quote}`)
    })
    .replace(SPECIFIER, (_match, quote, specifier) => {
      queue.push(specifier)
      return `${quote}${toClientUrlPath(specifier)}${quote}`
    })
    .replace(RELATIVE_SPECIFIER, (match, quote, specifier) => {
      queue.push(new URL(specifier, base).pathname)
      return match.replace(
        `${quote}${specifier}${quote}`,
        `${quote}${toClientUrlPath(specifier)}${quote}`
      )
    })

  const file = path.join(rootDir, 'public', decodeURIComponent(toClientUrlPath(url)))
  await mkdir(path.dirname(file), { recursive: true })
  await writeFile(file, source)
}

console.log(`build-client: ${seen.size} modules -> public/${CLIENT_BASE_PATH}/`)
