import { vitePlugin as remix } from '@remix-run/dev'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import { installGlobals } from '@remix-run/node'

installGlobals()

export default defineConfig({
  plugins: [remix(), tsconfigPaths(), vanillaExtractPlugin()],
})