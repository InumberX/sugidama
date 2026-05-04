import { cloudflare } from '@cloudflare/vite-plugin'
import { reactRouter } from '@react-router/dev/vite'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import { defineConfig, type Plugin } from 'vite'
import devtoolsJson from 'vite-plugin-devtools-json'

// vanilla-extract sets `ssr.external` for Node SSR runtime sharing.
// Cloudflare Workers bundle everything into a single isolate, so externals
// are unnecessary and rejected by @cloudflare/vite-plugin's validation.
// Strip them before the cloudflare plugin's configResolved runs.
const stripSsrExternalsForCloudflare: Plugin = {
  name: 'sugidama:strip-ssr-externals-for-cloudflare',
  enforce: 'pre',
  configResolved(config) {
    const ssr = config.environments?.ssr
    if (ssr?.resolve) {
      ssr.resolve.external = []
    }
  },
}

const now = new Date()
const nowDatetime =
  now.getFullYear() +
  ('0' + (now.getMonth() + 1)).slice(-2) +
  ('0' + now.getDate()).slice(-2) +
  ('0' + now.getHours()).slice(-2) +
  ('0' + now.getMinutes()).slice(-2) +
  ('0' + now.getSeconds()).slice(-2)
const CACHE_BUSTER = `ver=${nowDatetime}`
const LASTMOD =
  now.getFullYear() +
  '-' +
  ('0' + (now.getMonth() + 1)).slice(-2) +
  '-' +
  ('0' + now.getDate()).slice(-2) +
  'T' +
  ('0' + now.getHours()).slice(-2) +
  ':' +
  ('0' + now.getMinutes()).slice(-2) +
  ':' +
  ('0' + now.getSeconds()).slice(-2) +
  '+09:00'

const warmupConfig = () => {
  if (process.env.GIT_WORKTREE) {
    return undefined
  }

  return {
    clientFiles: ['./app/**/!(*.server|*.test|*.stories)*.tsx'],
  }
}

export default defineConfig({
  build: {
    assetsInlineLimit: 0,
  },
  // Align Cloudflare plugin's per-environment outDir with React Router's
  // expected build/client and build/server layout.
  environments: {
    client: {
      build: { outDir: 'build/client' },
    },
    ssr: {
      build: { outDir: 'build/server' },
    },
  },
  server: {
    warmup: warmupConfig(),
    fs: {
      strict: !process.env.GIT_WORKTREE,
    },
  },
  define: {
    'import.meta.env.VITE_NODE_ENV': `"${process.env.NODE_ENV || 'development'}"`,
    'import.meta.env.VITE_NO_INDEX': `"${process.env.NO_INDEX || ''}"`,
    'import.meta.env.VITE_SITE_URL': `"${process.env.SITE_URL || 'http://localhost:5173'}"`,
    'import.meta.env.VITE_SITE_NAME': `"${process.env.SITE_NAME || 'Sugidama(development)'}"`,
    'import.meta.env.VITE_GOOGLE_ANALYTICS_ID': `"${process.env.GOOGLE_ANALYTICS_ID || 'G-P7SXGX2CCT'}"`,
    'import.meta.env.VITE_CACHE_BUSTER': `"${CACHE_BUSTER}"`,
    'import.meta.env.VITE_LASTMOD': `"${LASTMOD}"`,
    'import.meta.env.VITE_API_URL': `"${process.env.API_URL || 'https://afterworks.g.kuroco.app/rcms-api/7'}"`,
  },
  plugins: [
    stripSsrExternalsForCloudflare,
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    reactRouter(),
    vanillaExtractPlugin(),
    devtoolsJson(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
})
