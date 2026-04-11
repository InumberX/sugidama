import type { Meta, StoryObj } from '@storybook/react-vite'
import { createRoutesStub } from 'react-router'

import { SvgIconCircleButton } from '~/components/ui/buttons/SvgIconCircleButton'

const meta: Meta<typeof SvgIconCircleButton> = {
  title: 'components/ui/buttons/SvgIconCircleButton',
  component: SvgIconCircleButton,
  decorators: [
    (Story) => {
      const RemixStub = createRoutesStub([
        {
          path: '/*',
          Component() {
            return <Story />
          },
        },
      ])

      return <RemixStub />
    },
  ],
}
export default meta

type Story = StoryObj<typeof SvgIconCircleButton>

export const Large: Story = {
  args: {
    size: 'large',
    icon: 'keyboardArrowRight',
  },
}

export const Medium: Story = {
  args: {
    size: 'medium',
    icon: 'keyboardArrowLeft',
  },
}

export const Small: Story = {
  args: {
    size: 'small',
    icon: 'keyboardArrowUp',
  },
}

export const Disabled: Story = {
  args: {
    size: 'large',
    icon: 'keyboardArrowDown',
    isDisabled: true,
  },
}
