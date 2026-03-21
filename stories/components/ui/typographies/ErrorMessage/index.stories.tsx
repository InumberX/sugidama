import { ErrorMessage } from '~/components/ui/typographies/ErrorMessage'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta<typeof ErrorMessage> = {
  title: 'components/ui/typographies/ErrorMessage',
  component: ErrorMessage,
}
export default meta

type Story = StoryObj<typeof ErrorMessage>

export const Default: Story = {
  args: {
    text: 'エラーメッセージが入ります。エラーメッセージが入ります。エラーメッセージが入ります。エラーメッセージが入ります。エラーメッセージが入ります。エラーメッセージが入ります。エラーメッセージが入ります。エラーメッセージが入ります。エラーメッセージが入ります。',
  },
}
