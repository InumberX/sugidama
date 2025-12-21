import type { Meta, StoryObj } from '@storybook/react-vite'

import { LayoutWrapper } from '~/components/ui/layouts/LayoutWrapper'

const meta: Meta<typeof LayoutWrapper> = {
  title: 'components/ui/layouts/LayoutWrapper',
  component: LayoutWrapper,
}
export default meta

type Story = StoryObj<typeof LayoutWrapper>

export const Default: Story = {
  args: {
    children: (
      <p>
        コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。
      </p>
    ),
  },
}
