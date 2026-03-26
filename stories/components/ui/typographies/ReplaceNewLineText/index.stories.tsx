import type { Meta, StoryObj } from '@storybook/react-vite'

import { ReplaceNewLineText } from '~/components/ui/typographies/ReplaceNewLineText'

const meta: Meta<typeof ReplaceNewLineText> = {
  title: 'components/ui/typographies/ReplaceNewLineText',
  component: ReplaceNewLineText,
}
export default meta

type Story = StoryObj<typeof ReplaceNewLineText>

export const Default: Story = {
  args: {
    text: 'テキストが入ります。テキストが入ります。テキストが入ります。\nテキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。\nテキストが入ります。テキストが入ります。',
  },
}
