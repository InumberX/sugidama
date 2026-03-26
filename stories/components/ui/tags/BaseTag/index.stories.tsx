import type { Meta, StoryObj } from '@storybook/react-vite'

import { BaseTag } from '~/components/ui/tags/BaseTag'

const meta: Meta<typeof BaseTag> = {
  title: 'components/ui/tags/BaseTag',
  component: BaseTag,
}
export default meta

type Story = StoryObj<typeof BaseTag>

export const ContainedSub: Story = {
  args: {
    children: 'タグ名が入ります',
    variant: 'contained',
    color: 'sub',
  },
}

export const ContainedSubButton: Story = {
  args: {
    children: 'タグ名が入ります',
    variant: 'contained',
    color: 'sub',
    onClick: () => {
      alert('onClick')
    },
  },
}

export const ContainedSubButtonDisabled: Story = {
  args: {
    children: 'タグ名が入ります',
    variant: 'contained',
    color: 'sub',
    onClick: () => {
      alert('onClick')
    },
    isDisabled: true,
  },
}

export const ContainedSubLink: Story = {
  args: {
    children: 'タグ名が入ります',
    variant: 'contained',
    color: 'sub',
    url: 'https://example.com',
  },
}

export const OutlinedSub: Story = {
  args: {
    children: 'タグ名が入ります',
    variant: 'outlined',
    color: 'sub',
  },
}

export const OutlinedSubButton: Story = {
  args: {
    children: 'タグ名が入ります',
    variant: 'outlined',
    color: 'sub',
    onClick: () => {
      alert('onClick')
    },
  },
}

export const OutlinedSubButtonDisabled: Story = {
  args: {
    children: 'タグ名が入ります',
    variant: 'outlined',
    color: 'sub',
    onClick: () => {
      alert('onClick')
    },
    isDisabled: true,
  },
}

export const OutlinedSubLink: Story = {
  args: {
    children: 'タグ名が入ります',
    variant: 'outlined',
    color: 'sub',
    url: 'https://example.com',
  },
}
