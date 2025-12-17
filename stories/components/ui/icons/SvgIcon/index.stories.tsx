import type { Meta, StoryObj } from '@storybook/react-vite'
import { SvgIcon } from '~/components/ui/icons/SvgIcon'

const meta: Meta<typeof SvgIcon> = {
  title: 'components/ui/icons/SvgIcon',
  component: SvgIcon,
}
export default meta

type Story = StoryObj<typeof SvgIcon>

export const Home: Story = {
  args: {
    variant: 'home',
  },
}

export const Search: Story = {
  args: {
    variant: 'search',
  },
}

export const Mail: Story = {
  args: {
    variant: 'mail',
  },
}

export const Liquor: Story = {
  args: {
    variant: 'liquor',
  },
}

export const Translate: Story = {
  args: {
    variant: 'translate',
  },
}

export const KeyboardArrowDown: Story = {
  args: {
    variant: 'keyboardArrowDown',
  },
}

export const KeyboardArrowLeft: Story = {
  args: {
    variant: 'keyboardArrowLeft',
  },
}

export const KeyboardArrowRight: Story = {
  args: {
    variant: 'keyboardArrowRight',
  },
}

export const KeyboardArrowUp: Story = {
  args: {
    variant: 'keyboardArrowUp',
  },
}
