import { reactRouter } from '@react-router/dev/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import devtoolsJson from 'vite-plugin-devtools-json'

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

// Function to get warmup config based on environment
const warmupConfig = () => {
  if (process.env.GIT_WORKTREE) {
    // Skip warmup in git worktree environments to avoid file loading issues
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
  server: {
    // ホットリロードを有効したい時はコメントアウト
    hmr: false,
    warmup: warmupConfig(),
    fs: {
      strict: !process.env.GIT_WORKTREE,
    },
  },
  define: {
    'import.meta.env.VITE_NO_INDEX': `"${process.env.NO_INDEX || ''}"`,
    'import.meta.env.VITE_SITE_URL': `"${process.env.SITE_URL || 'http://localhost:5173'}"`,
    'import.meta.env.VITE_SITE_NAME': `"${process.env.SITE_NAME || 'Sugidama(development)'}"`,
    'import.meta.env.VITE_GOOGLE_ANALYTICS_ID': `"${process.env.GOOGLE_ANALYTICS_ID || 'G-P7SXGX2CCT'}"`,
    'import.meta.env.VITE_CACHE_BUSTER': `"${CACHE_BUSTER}"`,
    'import.meta.env.VITE_LASTMOD': `"${LASTMOD}"`,
  },
  plugins: [reactRouter(), tsconfigPaths(), vanillaExtractPlugin(), devtoolsJson()],
})
