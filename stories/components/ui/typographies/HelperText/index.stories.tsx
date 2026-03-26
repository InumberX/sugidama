import type { Meta, StoryObj } from '@storybook/react-vite'

import { HelperText } from '~/components/ui/typographies/HelperText'

const meta: Meta<typeof HelperText> = {
  title: 'components/ui/typographies/HelperText',
  component: HelperText,
}
export default meta

type Story = StoryObj<typeof HelperText>

export const Default: Story = {
  args: {
    text: '注釈が入ります。注釈が入ります。注釈が入ります。注釈が入ります。注釈が入ります。注釈が入ります。注釈が入ります。注釈が入ります。注釈が入ります。',
  },
}
