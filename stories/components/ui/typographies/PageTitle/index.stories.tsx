import { PageTitle } from '~/components/ui/typographies/PageTitle'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta<typeof PageTitle> = {
  title: 'components/ui/typographies/PageTitle',
  component: PageTitle,
}
export default meta

type Story = StoryObj<typeof PageTitle>

export const Default: Story = {
  args: {
    title:
      'タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。',
  },
}

export const Primary: Story = {
  args: {
    title: 'タイトルが入ります。',
    color: 'primary',
  },
}

export const Wrap: Story = {
  args: {
    title:
      'タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。タイトルが入ります。',
    color: 'primary',
    isWrap: true,
  },
}
