import type { Meta, StoryObj } from '@storybook/react-vite'
import { createRoutesStub } from 'react-router'

import { LayoutHeader } from '~/components/common/LayoutHeader'

const meta: Meta<typeof LayoutHeader> = {
  title: 'components/common/LayoutHeader',
  component: LayoutHeader,
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

type Story = StoryObj<typeof LayoutHeader>

export const Default: Story = {
  args: {},
}
