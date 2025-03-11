import * as path from 'path'
import * as VitestConfig from 'vitest/config'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import react from '@vitejs/plugin-react'

export default VitestConfig.defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./setup-test-env.ts'],
    includeSource: ['app/**/*.{ts,tsx}'],
    exclude: ['node_modules'],
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'app'),
    },
  },
  plugins: [react(), vanillaExtractPlugin()],
  build: {
    assetsInlineLimit: 0,
  },
})
