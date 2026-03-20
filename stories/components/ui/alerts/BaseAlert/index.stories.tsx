import { BaseAlert } from '~/components/ui/alerts/BaseAlert'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta<typeof BaseAlert> = {
  title: 'components/ui/alerts/BaseAlert',
  component: BaseAlert,
}
export default meta

type Story = StoryObj<typeof BaseAlert>

export const ContainedSuccess: Story = {
  args: {
    title:
      'テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。',
    description:
      '説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。',
    variant: 'contained',
    color: 'success',
  },
}

export const ContainedError: Story = {
  args: {
    title:
      'テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。',
    description:
      '説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。説明文が入ります。',
    variant: 'contained',
    color: 'error',
  },
}
