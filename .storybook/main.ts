import path from 'path'
import { fileURLToPath } from 'url'
// const toPath = (filePath) => path.join(process.cwd(), filePath)
import { StorybookConfig } from '@storybook/react-vite'
import { loadConfigFromFile, mergeConfig, type ConfigEnv } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const __sbFilename = fileURLToPath(import.meta.url)
const __sbDirname = path.dirname(__sbFilename)

const configEnvServe: ConfigEnv = {
  mode: 'development',
  command: 'serve',
  isSsrBuild: false,
}

const configEnvBuild: ConfigEnv = {
  mode: 'production',
  command: 'build',
  isSsrBuild: false,
}

const config: StorybookConfig = {
  stories: ['../**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-vite',
    options: {
      strictMode: true,
      builder: {
        viteConfigPath: 'vite-storybook.config.ts',
      },
    },
  },
  staticDirs: ['../public'],
  viteFinal: async (config, { configType }) => {
    const isProduction = configType === 'PRODUCTION'

    // Add your configuration here
    const configFromFile = await loadConfigFromFile(
      isProduction ? configEnvBuild : configEnvServe,
      path.resolve(__sbDirname, '../vite-storybook.config.ts')
    )

    // tsconfigの情報をマージし、pathaliasを有効にする
    return mergeConfig(config, {
      ...configFromFile?.config,
      plugins: [tsconfigPaths()],
      define: {
        ...configFromFile?.config.define,
        'process.env.NODE_DEBUG': false,
      },
    })
  },
}

export default config
