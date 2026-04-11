import type { Meta, StoryObj } from '@storybook/react-vite'
import { createRoutesStub } from 'react-router'

import { BaseArticle, type BaseArticleProps } from '~/components/ui/articles/BaseArticle'

const meta: Meta<typeof BaseArticle> = {
  title: 'components/ui/articles/BaseArticle',
  component: BaseArticle,
  decorators: [
    (Story) => {
      const RemixStub = createRoutesStub([
        {
          path: '/*',
          Component() {
            return <Story />
          },
        },
      ])

      return <RemixStub />
    },
  ],
}
export default meta

type Story = StoryObj<typeof BaseArticle>

const defaultArgs: BaseArticleProps = {
  title: {
    text: 'タイトルが入ります。タイトルが入ります。',
  },
  mainVisuals: [
    {
      src: 'https://placehold.co/600x400',
      alt: 'メインビジュアル1',
    },
    {
      src: 'https://placehold.co/600x400',
      alt: 'メインビジュアル2',
    },
    {
      src: 'https://placehold.co/600x400',
      alt: 'メインビジュアル3',
    },
  ],
  info: {
    items: [
      {
        title: '情報1',
        text: 'テキストが入ります。',
      },
      {
        title: '情報2',
        text: 'テキストが入ります。',
      },
      {
        title: '情報3',
        text: 'テキストが入ります。',
      },
    ],
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
}

export const Default: Story = {
  args: defaultArgs,
}
