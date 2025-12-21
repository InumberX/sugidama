import type { Meta, StoryObj } from '@storybook/react-vite'

import { LayoutPageWrapper } from '~/components/ui/layouts/LayoutPageWrapper'

const meta: Meta<typeof LayoutPageWrapper> = {
  title: 'components/ui/layouts/LayoutPageWrapper',
  component: LayoutPageWrapper,
}
export default meta

type Story = StoryObj<typeof LayoutPageWrapper>

export const Default: Story = {
  args: {
    children: (
      <p>
        コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。
      </p>
    ),
  },
}
