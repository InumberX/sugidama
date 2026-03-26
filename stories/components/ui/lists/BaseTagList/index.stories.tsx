import type { Meta, StoryObj } from '@storybook/react-vite'

import { BaseTagList } from '~/components/ui/lists/BaseTagList'

const meta: Meta<typeof BaseTagList> = {
  title: 'components/ui/lists/BaseTagList',
  component: BaseTagList,
}
export default meta

type Story = StoryObj<typeof BaseTagList>

export const Default: Story = {
  args: {
    items: [
      {
        children: 'タグ名が入ります',
        variant: 'contained',
        color: 'sub',
        onClick: () => {
          alert('onClick')
        },
      },
      {
        children: 'タグ名が入ります',
        variant: 'contained',
        color: 'sub',
        onClick: () => {
          alert('onClick')
        },
      },
      {
        children: 'タグ名が入ります',
        variant: 'contained',
        color: 'sub',
        onClick: () => {
          alert('onClick')
        },
      },
      {
        children: 'タグ名が入ります',
        variant: 'contained',
        color: 'sub',
        onClick: () => {
          alert('onClick')
        },
      },
      {
        children: 'タグ名が入ります',
        variant: 'contained',
        color: 'sub',
        onClick: () => {
          alert('onClick')
        },
      },
      {
        children: 'タグ名が入ります',
        variant: 'contained',
        color: 'sub',
        onClick: () => {
          alert('onClick')
        },
      },
    ],
  },
}

export const NotSemantic: Story = {
  args: {
    isNotSemantic: true,
    items: [
      {
        children: 'タグ名が入ります',
        variant: 'outlined',
        color: 'sub',
      },
      {
        children: 'タグ名が入ります',
        variant: 'outlined',
        color: 'sub',
      },
      {
        children: 'タグ名が入ります',
        variant: 'outlined',
        color: 'sub',
      },
      {
        children: 'タグ名が入ります',
        variant: 'outlined',
        color: 'sub',
      },
      {
        children: 'タグ名が入ります',
        variant: 'outlined',
        color: 'sub',
      },
      {
        children: 'タグ名が入ります',
        variant: 'outlined',
        color: 'sub',
      },
      {
        children: 'タグ名が入ります',
        variant: 'outlined',
        color: 'sub',
      },
    ],
  },
}
