import type { Meta, StoryObj } from '@storybook/react-vite'

import { FormSet } from '~/components/ui/forms/FormSet'

const meta: Meta<typeof FormSet> = {
  title: 'components/ui/forms/FormSet',
  component: FormSet,
}
export default meta

type Story = StoryObj<typeof FormSet>

export const Default: Story = {
  args: {
    title: '入力項目名が入ります。',
    children: 'コンテンツが入ります。',
  },
}

export const Required: Story = {
  args: {
    title: '入力項目名が入ります。',
    isRequired: true,
    children: 'コンテンツが入ります。',
  },
}

export const SubTitle: Story = {
  args: {
    title: '入力項目名が入ります。',
    subTitle: '補足情報が入ります。',
    children: 'コンテンツが入ります。',
  },
}

export const RequiredSubTitle: Story = {
  args: {
    title: '入力項目名が入ります。',
    subTitle: '補足情報が入ります。',
    isRequired: true,
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
