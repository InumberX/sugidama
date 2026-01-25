import type { Meta, StoryObj } from '@storybook/react-vite'

import type { ArticleCompactCardProps } from '~/components/ui/cards/ArticleCompactCard'
import { ArticleCompactCardList } from '~/components/ui/lists/ArticleCompactCardList'

const meta: Meta<typeof ArticleCompactCardList> = {
  title: 'components/ui/lists/ArticleCompactCardList',
  component: ArticleCompactCardList,
}
export default meta

type Story = StoryObj<typeof ArticleCompactCardList>

const buttonArgs: ArticleCompactCardProps = {
  title: {
    text: 'タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。',
  },
  description: {
    text: '説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。',
  },
  thumbnail: {
    src: 'https://placehold.jp/800x450.png',
  },
  tags: [
    {
      children: 'タグ名が入ります。',
    },
    {
      children: 'タグ名が入ります。',
    },
    {
      children: 'タグ名が入ります。',
    },
  ],
  button: {
    onClick: () => {
      alert('onClick')
    },
  },
}

export const Default: Story = {
  args: {
    items: Array.from({ length: 12 }, () => {
      return {
        ...buttonArgs,
      }
    }),
  },
}
