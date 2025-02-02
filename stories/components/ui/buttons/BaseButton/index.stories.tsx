import type { Meta, StoryObj } from '@storybook/react'
import { createRoutesStub } from 'react-router'
import { BaseButton } from '~/components/ui/buttons/BaseButton'

const meta: Meta<typeof BaseButton> = {
  title: 'components/ui/buttons/BaseButton',
  component: BaseButton,
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

type Story = StoryObj<typeof BaseButton>

export const Large: Story = {
  args: {
    children: 'LARGE',
    size: 'large',
    onClick: () => {
      alert('onClick')
    },
  },
}

export const Medium: Story = {
  args: {
    children: 'MEDIUM',
    size: 'medium',
    url: 'https://www.google.com',
    target: '_blank',
  },
}

export const Small: Story = {
  args: {
    children: 'SMALL',
    size: 'small',
    url: '/',
  },
}

export const Disabled: Story = {
  args: {
    children: 'DISABLED',
    size: 'large',
    isDisabled: true,
    onClick: () => {
      alert('onClick')
    },
  },
}
