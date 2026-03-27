import type { Meta, StoryObj } from '@storybook/react-vite'
import { createRoutesStub } from 'react-router'

import { TextButton } from '~/components/ui/buttons/TextButton'

const meta: Meta<typeof TextButton> = {
  title: 'components/ui/buttons/TextButton',
  component: TextButton,
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

type Story = StoryObj<typeof TextButton>

export const SubLarge: Story = {
  args: {
    children: 'LARGE',
    color: 'sub',
    size: 'large',
    url: 'https://example.com',
  },
}

export const SubMedium: Story = {
  args: {
    children: 'MEDIUM',
    color: 'sub',
    size: 'medium',
    url: 'https://example.com',
    target: '_blank',
    rel: 'noopener noreferrer',
  },
}

export const SubSmall: Story = {
  args: {
    children: 'SMALL',
    color: 'sub',
    size: 'small',
    onClick: () => {
      alert('onClick')
    },
  },
}

export const LightLarge: Story = {
  args: {
    children: 'LARGE',
    color: 'light',
    size: 'large',
    onClick: () => {
      alert('onClick')
    },
  },
}

export const LightMedium: Story = {
  args: {
    children: 'MEDIUM',
    color: 'light',
    size: 'medium',
    onClick: () => {
      alert('onClick')
    },
  },
}

export const LightSmall: Story = {
  args: {
    children: 'SMALL',
    color: 'light',
    size: 'small',
    onClick: () => {
      alert('onClick')
    },
  },
}

export const PrimaryLarge: Story = {
  args: {
    children: 'LARGE',
    color: 'primary',
    size: 'large',
    onClick: () => {
      alert('onClick')
    },
  },
}

export const PrimaryMedium: Story = {
  args: {
    children: 'MEDIUM',
    color: 'primary',
    size: 'medium',
    onClick: () => {
      alert('onClick')
    },
  },
}

export const PrimarySmall: Story = {
  args: {
    children: 'SMALL',
    color: 'primary',
    size: 'small',
    onClick: () => {
      alert('onClick')
    },
  },
}

export const SubDarkLarge: Story = {
  args: {
    children: 'LARGE',
    color: 'subDark',
    size: 'large',
    onClick: () => {
      alert('onClick')
    },
  },
}

export const SubDarkMedium: Story = {
  args: {
    children: 'MEDIUM',
    color: 'subDark',
    size: 'medium',
    onClick: () => {
      alert('onClick')
    },
  },
}

export const SubDarkSmall: Story = {
  args: {
    children: 'SMALL',
    color: 'subDark',
    size: 'small',
    onClick: () => {
      alert('onClick')
    },
  },
}
