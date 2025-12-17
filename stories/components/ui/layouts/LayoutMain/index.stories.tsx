import type { Meta, StoryObj } from '@storybook/react-vite'
import { LayoutMain } from '~/components/ui/layouts/LayoutMain'

const meta: Meta<typeof LayoutMain> = {
  title: 'components/ui/layouts/LayoutMain',
  component: LayoutMain,
}
export default meta

type Story = StoryObj<typeof LayoutMain>

export const Default: Story = {
  args: {
    children: (
      <p>
        コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。
      </p>
    ),
  },
}
