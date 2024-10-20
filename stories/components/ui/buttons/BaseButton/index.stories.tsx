import type { Meta, StoryObj } from '@storybook/react'
import { createRemixStub } from '@remix-run/testing'
import { BaseButton } from '~/components/ui/buttons/BaseButton'

const meta: Meta<typeof BaseButton> = {
  title: 'components/ui/buttons/BaseButton',
  component: BaseButton,
  decorators: [
    (Story) => {
      const RemixStub = createRemixStub([
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

type Story = StoryObj<typeof BaseButton>

export const Large: Story = {
  args: {
    text: 'LARGE',
    onClick: () => {
      alert('onClick')
    },
  },
}
