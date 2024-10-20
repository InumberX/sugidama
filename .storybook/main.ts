import path from 'path'
// const toPath = (filePath) => path.join(process.cwd(), filePath)
import { StorybookConfig } from '@storybook/react-vite'
import { loadConfigFromFile, mergeConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const config: StorybookConfig = {
  stories: ['../**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions'],
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
      {
        command: isProduction ? 'build' : 'serve',
        mode: isProduction ? 'production' : 'development',
      },
      path.resolve(__dirname, '../vite-storybook.config.ts')
    )

    const userConfig = configFromFile?.config

    // tsconfigの情報をマージし、pathaliasを有効にする
    return mergeConfig(config, {
      ...userConfig,
      plugins: [tsconfigPaths()],
    })
  },
}

export default config
