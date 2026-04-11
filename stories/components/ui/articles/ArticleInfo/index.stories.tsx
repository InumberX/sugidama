import type { Meta, StoryObj } from '@storybook/react-vite'

import { ArticleInfo } from '~/components/ui/articles/ArticleInfo'

const meta: Meta<typeof ArticleInfo> = {
  title: 'components/ui/articles/ArticleInfo',
  component: ArticleInfo,
}
export default meta

type Story = StoryObj<typeof ArticleInfo>

export const Default: Story = {
  args: {
    items: [
      {
        title: 'タイトルが入ります。',
        text: 'テキストが入ります。',
      },
      {
        title: 'タイトルが入ります。（2行目）',
        text: 'テキストが入ります。（2行目）',
      },
      {
        title: 'タイトルが入ります。',
        text: 'テキストが入ります。',
      },
    ],
  },
}
