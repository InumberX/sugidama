import { useEffect } from 'react'
import { Preview } from '@storybook/react'
import { LayoutPortal } from '../app/components/common/LayoutPortal'
import * as styles from '../app/root.css'
import i18n from './i18n'
import { I18nextProvider } from 'react-i18next'

export const handle = {
  i18n: 'common',
}

const WithI18next: Preview['decorators'] = (Story, context) => {
  const { locale } = context.globals

  useEffect(() => {
    i18n.changeLanguage(locale ?? 'ja')
  }, [locale])

  return (
    <I18nextProvider i18n={i18n}>
      <div className={styles.layoutRootStorybook}>
        <Story />
        <LayoutPortal />
      </div>
    </I18nextProvider>
  )
}

export const globalTypes = {
  locale: {
    name: 'Locale',
    description: 'Internationalization locale',
    toolbar: {
      icon: 'globe',
      items: [
        {
          value: 'ja',
          title: '日本語',
        },
        {
          value: 'en',
          title: 'English',
        },
      ],
      showName: true,
    },
  },
}

const preview: Preview = {
  parameters: {
    actions: {
      argTypesRegex: '^on[A-Z].*',
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [WithI18next],
}

export default preview
