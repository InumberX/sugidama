import type { Meta, StoryObj } from '@storybook/react'
import { createRoutesStub } from 'react-router'
import { LayoutFooter } from '~/components/common/LayoutFooter'

const meta: Meta<typeof LayoutFooter> = {
  title: 'components/common/LayoutFooter',
  component: LayoutFooter,
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

type Story = StoryObj<typeof LayoutFooter>

export const Default: Story = {
  args: {},
}
