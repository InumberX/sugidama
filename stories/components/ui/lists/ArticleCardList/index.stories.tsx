import type { Meta, StoryObj } from '@storybook/react-vite'

import type { ArticleCardProps } from '~/components/ui/cards/ArticleCard'
import { ArticleCardList } from '~/components/ui/lists/ArticleCardList'

const meta: Meta<typeof ArticleCardList> = {
  title: 'components/ui/lists/ArticleCardList',
  component: ArticleCardList,
}
export default meta

type Story = StoryObj<typeof ArticleCardList>

const buttonArgs: ArticleCardProps = {
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
