// The single place this app reads `process.env`. Everything else imports the
// resolved constants from here, so the set of environment variables the app
// depends on — and their defaults — is visible in one file.
//
// On Workers, `process.env` is filled from the Worker's `vars` and secrets
// (`nodejs_compat` with a compatibility date of 2025-04-01 or later), and from
// `.dev.vars` under `wrangler dev`. It is read once, when the module loads.
//
// Per-environment values live in `wrangler.jsonc` (`env.<name>.vars`); the
// defaults below are what `wrangler dev` and the tests see when nothing is set.

export type NodeEnv = 'development' | 'production' | 'test'

export const NODE_ENV: NodeEnv = (process.env.NODE_ENV as NodeEnv | undefined) ?? 'development'
export const IS_DEVELOPMENT = NODE_ENV === 'development'
export const IS_PRODUCTION = NODE_ENV === 'production'
export const IS_TEST = NODE_ENV === 'test'

/**
 * Set per deployment to the commit sha (`npm run deploy-*` passes it with
 * `--var`). There is no build step to bake a value into, so it has to come from
 * the environment. Defaults to a fixed `dev` rather than a timestamp so local
 * reloads do not refetch the root `public/` files.
 */
// `||`, not `??`: an interpolated but unset variable arrives as an empty
// string, which would otherwise produce the cache key `ver=`.
export const BUILD_ID = process.env.BUILD_ID || 'dev'

/** Whether `BUILD_ID` came from the environment rather than the `dev` fallback. */
export const HAS_BUILD_ID = Boolean(process.env.BUILD_ID)

/**
 * When this Worker was deployed, as an ISO 8601 UTC timestamp (`npm run
 * deploy-*` passes it with `--var`). It stands in for the build time that
 * React Router's Vite build used as the sitemap's `<lastmod>`. Unset under
 * `wrangler dev` and in tests, where there is no deploy to date — a caller
 * should omit `<lastmod>` rather than invent one. It cannot default to "now":
 * in a Worker's global scope `new Date()` is the Unix epoch (measured:
 * 1970-01-01T00:00:00.000Z under `wrangler dev`), and a per-request date would
 * not be the deploy time either.
 */
export const DEPLOYED_AT: string | undefined = process.env.DEPLOYED_AT || undefined

/** Absolute origin used to build canonical and og:url values. Defaults to `wrangler dev`. */
export const SITE_URL = (process.env.SITE_URL || 'http://localhost:8787').replace(/\/$/, '')

/** Force `noindex, nofollow` on every page (staging). Production defaults to indexable. */
export const NO_INDEX = process.env.NO_INDEX === 'true'

/** Site name for `<title>` and `og:site_name`. The default marks a local build. */
export const SITE_NAME = process.env.SITE_NAME || 'Sugidama(development)'

/**
 * Kuroco CMS API base URL, without a trailing slash. The default is the staging
 * endpoint (`/7`); production uses `/8`.
 */
export const API_URL = (
  process.env.API_URL || 'https://afterworks.g.kuroco.app/rcms-api/7'
).replace(/\/$/, '')

/**
 * Google Analytics measurement id. Empty locally, so `wrangler dev` sends no
 * page views — the React Router app defaulted to the staging property's id
 * (G-P7SXGX2CCT), so every local reload was counted there.
 */
export const GOOGLE_ANALYTICS_ID = process.env.GOOGLE_ANALYTICS_ID || ''

/**
 * Query string, without the `?`.
 *
 * Files under the root `public/` directory are served by the Workers `ASSETS`
 * binding exactly as they are on disk — no content hash — so a per-deploy
 * query string is what invalidates them in browsers. Append it only where the
 * file must change in step with the deployed HTML (see CLAUDE.md, Caching),
 * keeping the pattern in the type:
 *
 *   `/static/css/app.css?${CACHE_BUSTER}`  ->  `/static/css/app.css?${string}`
 */
export const CACHE_BUSTER = `ver=${encodeURIComponent(BUILD_ID)}`
