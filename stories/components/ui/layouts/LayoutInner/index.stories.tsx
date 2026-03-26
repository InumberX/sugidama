import type { Meta, StoryObj } from '@storybook/react-vite'

import { LayoutInner } from '~/components/ui/layouts/LayoutInner'

const meta: Meta<typeof LayoutInner> = {
  title: 'components/ui/layouts/LayoutInner',
  component: LayoutInner,
}
export default meta

type Story = StoryObj<typeof LayoutInner>

export const Large: Story = {
  args: {
    size: 'large',
    children: (
      <p>
        コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。
      </p>
    ),
  },
}

export const Full: Story = {
  args: {
    size: 'full',
    children: (
      <p>
        コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。
      </p>
    ),
  },
}
