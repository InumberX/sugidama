import { PrimitiveSkeleton } from '~/components/primitives/skeletons/PrimitiveSkeleton'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta<typeof PrimitiveSkeleton> = {
  title: 'components/primitives/skeletons/PrimitiveSkeleton',
  component: PrimitiveSkeleton,
}
export default meta

type Story = StoryObj<typeof PrimitiveSkeleton>

export const Auto: Story = {
  render: (args) => (
    <div
      style={{
        inlineSize: '100%',
        maxInlineSize: 400,
        blockSize: 100,
      }}
    >
      <PrimitiveSkeleton {...args} variant="auto" />
    </div>
  ),
}

export const Rectangle: Story = {
  render: (args) => (
    <div
      style={{
        inlineSize: '100%',
        maxInlineSize: 400,
      }}
    >
      <PrimitiveSkeleton {...args} variant="rectangle" />
    </div>
  ),
}

export const Square: Story = {
  render: (args) => (
    <div
      style={{
        inlineSize: '100%',
        maxInlineSize: 400,
      }}
    >
      <PrimitiveSkeleton {...args} variant="square" />
    </div>
  ),
}

export const Circle: Story = {
  render: (args) => (
    <div
      style={{
        inlineSize: '100%',
        maxInlineSize: 400,
      }}
    >
      <PrimitiveSkeleton {...args} variant="circle" />
    </div>
  ),
}

export const Bar: Story = {
  render: (args) => (
    <div
      style={{
        inlineSize: '100%',
        maxInlineSize: 400,
      }}
    >
      <PrimitiveSkeleton {...args} variant="bar" />
    </div>
  ),
}
