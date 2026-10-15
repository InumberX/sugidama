import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'
import { experimental_readRawConfig } from 'wrangler'

// wrangler.jsonc is the source of every deployed Worker's configuration, and
// neither `define` nor `vars` is inherited by an environment. A new environment,
// or a variable added to one but not the other, would deploy with app/env.ts's
// local defaults (localhost canonical URLs, an indexable staging site) and still
// pass typecheck, so this reads the file the way wrangler does and checks it.
type RawEnvironment = { define?: Record<string, string>; vars?: Record<string, unknown> }

const { rawConfig } = experimental_readRawConfig({ config: 'wrangler.jsonc' })
const environments = Object.entries((rawConfig.env ?? {}) as Record<string, RawEnvironment>)
const varsOf = (name: string) => Object.fromEntries(environments)[name]?.vars ?? {}

// Whole underscore-separated words, so SEO_KEYWORDS or CACHE_BYPASS pass while
// API_KEY, KUROCO_AUTH_TOKEN or DB_PASSWORD do not.
const CREDENTIAL_NAME =
  /(^|_)(KEYS?|TOKENS?|SECRETS?|PASS|PASSWORDS?|CREDENTIALS?|AUTH|PRIVATE)(_|$)/i

const REQUIRED_VARS = ['SITE_URL', 'NO_INDEX', 'SITE_NAME', 'API_URL', 'GOOGLE_ANALYTICS_ID']

describe('wrangler.jsonc', () => {
  it('declares the two deploy environments', () => {
    assert.deepEqual(environments.map(([name]) => name).sort(), ['development', 'production'])
  })

  for (const [name, env] of environments) {
    describe(`env.${name}`, () => {
      it('pins NODE_ENV to production, whatever the deploying shell exports', () => {
        assert.equal(env.define?.['process.env.NODE_ENV'], '"production"')
      })

      it('sets every variable app/env.ts reads, with no placeholder left', () => {
        const vars = env.vars ?? {}
        for (const key of REQUIRED_VARS) {
          assert.equal(typeof vars[key], 'string', `${key} is set`)
          assert.doesNotMatch(String(vars[key]), /__SET_ME__/, `${key} is filled in`)
        }
      })

      it('holds no credential-looking key, since vars are public', () => {
        for (const key of Object.keys(env.vars ?? {})) {
          assert.doesNotMatch(key, CREDENTIAL_NAME, `${key} belongs in a secret`)
        }
      })

      it('uses absolute https URLs', () => {
        const vars = env.vars ?? {}
        assert.match(String(vars.SITE_URL), /^https:\/\/[^/]+$/)
        // No trailing slash: app/env.ts strips one, but the stored value is
        // what the dashboard and the next reader see.
        assert.match(String(vars.API_URL), /^https:\/\/.*[^/]$/)
      })

      it('leaves per-deploy values to `npm run deploy-*`', () => {
        const vars = env.vars ?? {}
        assert.equal(vars.BUILD_ID, undefined)
        assert.equal(vars.DEPLOYED_AT, undefined)
      })
    })
  }

  it('keeps staging out of search engines and production indexable', () => {
    assert.equal(varsOf('development').NO_INDEX, 'true')
    assert.equal(varsOf('production').NO_INDEX, 'false')
  })
})
