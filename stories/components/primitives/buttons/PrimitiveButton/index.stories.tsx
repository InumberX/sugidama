import type { Meta, StoryObj } from '@storybook/react'
import { createRoutesStub } from 'react-router'

import { PrimitiveButton } from '~/components/primitives/buttons/PrimitiveButton'

const meta: Meta<typeof PrimitiveButton> = {
  title: 'components/primitives/buttons/PrimitiveButton',
  component: PrimitiveButton,
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

type Story = StoryObj<typeof PrimitiveButton>

export const Button: Story = {
  args: {
    children: 'Button',
    onClick: () => {
      alert('onClick')
    },
  },
}

export const ButtonDisabled: Story = {
  args: {
    children: 'Button',
    isDisabled: true,
    onClick: () => {
      alert('onClick')
    },
  },
}

export const Link: Story = {
  args: {
    children: 'Link',
    url: 'https://example.com',
  },
}

export const LinkDisabled: Story = {
  args: {
    children: 'Link',
    url: 'https://example.com',
    isDisabled: true,
  },
}

export const LinkExternal: Story = {
  args: {
    children: 'Link',
    url: 'https://example.com',
    target: '_blank',
  },
}

export const LinkExternalDisabled: Story = {
  args: {
    children: 'Link',
    url: 'https://example.com',
    target: '_blank',
    isDisabled: true,
  },
}
