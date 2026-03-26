import type { Meta, StoryObj } from '@storybook/react-vite'

import { ArticleCardListSkeleton } from '~/components/ui/skeletons/ArticleCardListSkeleton'

const meta: Meta<typeof ArticleCardListSkeleton> = {
  title: 'components/ui/skeletons/ArticleCardListSkeleton',
  component: ArticleCardListSkeleton,
}
export default meta

type Story = StoryObj<typeof ArticleCardListSkeleton>

export const Default: Story = {
  args: {
    listLength: 12,
  },
}
