// The single place this app reads `process.env`. Everything else imports the
// resolved constants from here, so the set of environment variables the app
// depends on — and their defaults — is visible in one file.
//
// On Workers, `process.env` is filled from the Worker's `vars` and secrets
// (`nodejs_compat` with a compatibility date of 2025-04-01 or later), and from
// `.dev.vars` under `wrangler dev`. It is read once, when the module loads.

export type NodeEnv = 'development' | 'production' | 'test'

export const NODE_ENV: NodeEnv = (process.env.NODE_ENV as NodeEnv | undefined) ?? 'development'
export const IS_DEVELOPMENT = NODE_ENV === 'development'
export const IS_PRODUCTION = NODE_ENV === 'production'
export const IS_TEST = NODE_ENV === 'test'

/**
 * Set per deployment (a commit sha or a build timestamp). There is no build
 * step to bake a value into, so it has to come from the environment. Defaults
 * to a fixed `dev` rather than a timestamp so local reloads do not refetch the
 * root `public/` files.
 */
// `||`, not `??`: CI interpolating an unset variable hands over an empty
// string, which would otherwise produce the cache key `ver=`.
export const BUILD_ID = process.env.BUILD_ID || 'dev'

/** Whether `BUILD_ID` came from the environment rather than the `dev` fallback. */
export const HAS_BUILD_ID = Boolean(process.env.BUILD_ID)

/** Absolute origin used to build canonical and og:url values. Defaults to `wrangler dev`. */
export const SITE_URL = (process.env.SITE_URL || 'http://localhost:8787').replace(/\/$/, '')

/** Force `noindex, nofollow` on every page (staging). Production defaults to indexable. */
export const NO_INDEX = process.env.NO_INDEX === 'true'

/**
 * Query string, without the `?`.
 *
 * Files under the root `public/` directory are served by the Workers `ASSETS`
 * binding exactly as they are on disk — no content hash — so a per-deploy
 * query string is what invalidates them in browsers. Append it where the URL
 * is written, keeping the pattern in the type:
 *
 *   `/assets/img/img.jpg?${CACHE_BUSTER}`  ->  `/assets/img/img.jpg?${string}`
 */
export const CACHE_BUSTER = `ver=${BUILD_ID}`
