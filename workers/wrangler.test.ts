import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'
import { experimental_readRawConfig } from 'wrangler'

import { API_URL } from '../app/env.ts'

// wrangler.jsonc is the source of every deployed Worker's configuration, and
// neither `define` nor `vars` is inherited by an environment. A new environment,
// or a variable added to one but not the other, would deploy with app/env.ts's
// local defaults (localhost canonical URLs, an indexable staging site) and still
// pass typecheck, so this reads the file the way wrangler does and checks it.
type RawEnvironment = {
  name?: string
  define?: Record<string, string>
  vars?: Record<string, unknown>
  assets?: { directory?: string; binding?: string; run_worker_first?: unknown }
  placement?: { mode?: string }
}

// Resolved from this file, so the suite also runs from a directory other than
// the repository root (an editor's test runner).
const fromRoot = (path: string) => fileURLToPath(new URL(`../${path}`, import.meta.url))

const { rawConfig } = experimental_readRawConfig({ config: fromRoot('wrangler.jsonc') })
const environments = (rawConfig.env ?? {}) as Record<string, RawEnvironment>
const varsOf = (name: string) => environments[name]?.vars ?? {}

// Every variable app/env.ts reads, taken from its source so a new one cannot be
// forgotten here — minus those that are not per-environment config: NODE_ENV
// (pinned through `define`) and the per-deploy values scripts/deploy.sh passes.
const NOT_IN_VARS = new Set(['NODE_ENV', 'BUILD_ID', 'DEPLOYED_AT'])
const REQUIRED_VARS = [
  ...new Set(
    [...readFileSync(fromRoot('app/env.ts'), 'utf8').matchAll(/process\.env\.([A-Z0-9_]+)/g)].map(
      ([, name]) => name
    )
  ),
].filter((name) => !NOT_IN_VARS.has(name))

// Credential-like words, whole or run together with a neighbour as people tend
// to write them (APIKEY, PASSWD). SEO_KEYWORDS and CACHE_BYPASS still pass.
const CREDENTIAL_NAME =
  /(^|_)(API_?KEYS?|KEYS?|TOKENS?|SECRETS?|PASS|PASSWD|PASSWORDS?|PWD|CREDENTIALS?|AUTH|PRIVATE)(_|$)/i

describe('wrangler.jsonc', () => {
  it('declares the two deploy environments', () => {
    assert.deepEqual(Object.keys(environments).sort(), ['development', 'production'])
  })

  it('reads the variable list from app/env.ts', () => {
    assert.ok(REQUIRED_VARS.includes('SITE_URL'), `found ${REQUIRED_VARS.join(', ')}`)
  })

  it('gives the top level a name no deployed Worker uses', () => {
    // A bare `wrangler deploy` uses the top level, which has no vars.
    const deployed = Object.values(environments).map((env) => env.name)
    assert.ok(!deployed.includes(rawConfig.name), `${rawConfig.name} is a deployed Worker`)
  })

  for (const [name, env] of Object.entries(environments)) {
    describe(`env.${name}`, () => {
      const vars = env.vars ?? {}

      it('pins NODE_ENV to production, whatever the deploying shell exports', () => {
        assert.equal(env.define?.['process.env.NODE_ENV'], '"production"')
      })

      it('sets every variable app/env.ts reads, with no placeholder left', () => {
        for (const key of REQUIRED_VARS) {
          assert.equal(typeof vars[key], 'string', `${key} is set`)
          assert.doesNotMatch(String(vars[key]), /__SET_ME__/, `${key} is filled in`)
        }
      })

      it('holds no credential-looking key, since vars are public', () => {
        for (const key of Object.keys(vars)) {
          assert.doesNotMatch(key, CREDENTIAL_NAME, `${key} belongs in a secret`)
        }
      })

      it('uses absolute https URLs', () => {
        assert.match(String(vars.SITE_URL), /^https:\/\/[^/]+$/)
        // No trailing slash: app/env.ts strips one, but the stored value is
        // what the dashboard and the next reader see.
        assert.match(String(vars.API_URL), /^https:\/\/.*[^/]$/)
      })

      it('leaves per-deploy values to scripts/deploy.sh', () => {
        assert.equal(vars.BUILD_ID, undefined)
        assert.equal(vars.DEPLOYED_AT, undefined)
      })
    })
  }

  it('places only production with Smart Placement', () => {
    assert.equal(environments.production?.placement?.mode, 'smart')
    // Staging's assets go through the Worker for Basic auth, and a placed
    // Worker would make every asset request detour to it (wrangler warns).
    assert.equal(environments.development?.placement, undefined)
    assert.equal(rawConfig.placement, undefined)
  })

  it('routes only staging assets through the Worker, for Basic auth', () => {
    // An environment's `assets` replaces the top level's whole, so staging
    // must repeat the directory and the binding the Worker reads.
    assert.deepEqual(environments.development?.assets, {
      ...rawConfig.assets,
      run_worker_first: true,
    })
    // Production inherits the top level, which serves assets from the edge.
    assert.equal(environments.production?.assets, undefined)
    assert.equal(rawConfig.assets?.run_worker_first, false)
  })

  it('defaults the local API to the staging endpoint', () => {
    // app/env.ts writes the URL again as its local default; this keeps the two
    // from drifting when staging moves. The suite runs without API_URL set.
    assert.equal(API_URL, varsOf('development').API_URL)
  })

  it('keeps staging out of search engines and production indexable', () => {
    assert.equal(varsOf('development').NO_INDEX, 'true')
    assert.equal(varsOf('production').NO_INDEX, 'false')
  })
})
