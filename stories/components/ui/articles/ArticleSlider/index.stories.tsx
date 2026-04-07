import type { Meta, StoryObj } from '@storybook/react-vite'

import { ArticleSlider } from '~/components/ui/articles/ArticleSlider'

const meta: Meta<typeof ArticleSlider> = {
  title: 'components/ui/articles/ArticleSlider',
  component: ArticleSlider,
}
export default meta

type Story = StoryObj<typeof ArticleSlider>

export const Single: Story = {
  args: {
    slides: [
      {
        image: {
          src: 'https://placehold.jp/800x450.png',
        },
      },
    ],
  },
}

export const Multiple: Story = {
  args: {
    slides: [
      {
        image: {
          src: 'https://placehold.jp/800x450.png',
        },
      },
      {
        image: {
          src: 'https://placehold.jp/800x400.png',
        },
      },
    ],
  },
}
