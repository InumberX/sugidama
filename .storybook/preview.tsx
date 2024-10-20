import React from 'react'
import { Preview } from '@storybook/react'
import { LayoutPortal } from '../app/components/common/LayoutPortal'
import * as styles from '../app/root.css'

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
  decorators: [
    (Story) => {
      return (
        <div className={styles.layoutRootStorybook}>
          <Story />
          <LayoutPortal />
        </div>
      )
    },
  ],
}

export default preview
