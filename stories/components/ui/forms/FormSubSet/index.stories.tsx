import type { Meta, StoryObj } from '@storybook/react-vite'

import { FormSubSet } from '~/components/ui/forms/FormSubSet'

const meta: Meta<typeof FormSubSet> = {
  title: 'components/ui/forms/FormSubSet',
  component: FormSubSet,
}
export default meta

type Story = StoryObj<typeof FormSubSet>

export const Default: Story = {
  args: {
    title: '入力項目名が入ります。',
    children: 'コンテンツが入ります。',
  },
}

export const First: Story = {
  args: {
    title: '入力項目名が入ります。',
    isFirst: true,
    children: 'コンテンツが入ります。',
  },
}

export const Last: Story = {
  args: {
    title: '入力項目名が入ります。',
    isLast: true,
    children: 'コンテンツが入ります。',
  },
}
