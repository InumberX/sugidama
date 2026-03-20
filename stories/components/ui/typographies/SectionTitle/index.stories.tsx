import { SectionTitle } from '~/components/ui/typographies/SectionTitle'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta<typeof SectionTitle> = {
  title: 'components/ui/typographies/SectionTitle',
  component: SectionTitle,
}
export default meta

type Story = StoryObj<typeof SectionTitle>

export const Default: Story = {
  args: {
    title:
      'タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。',
  },
}
