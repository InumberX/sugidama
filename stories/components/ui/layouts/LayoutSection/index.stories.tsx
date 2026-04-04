import type { Meta, StoryObj } from '@storybook/react-vite'

import { LayoutSection } from '~/components/ui/layouts/LayoutSection'

const meta: Meta<typeof LayoutSection> = {
  title: 'components/ui/layouts/LayoutSection',
  component: LayoutSection,
}
export default meta

type Story = StoryObj<typeof LayoutSection>

export const SpaceMedium: Story = {
  args: {
    topSpace: 'topSpaceMedium',
    bottomSpace: 'bottomSpaceMedium',
    children: (
      <p>
        コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。
      </p>
    ),
  },
}

export const SpaceSmall: Story = {
  args: {
    tag: 'div',
    topSpace: 'topSpaceSmall',
    bottomSpace: 'bottomSpaceSmall',
    children: (
      <p>
        コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。
      </p>
    ),
  },
}

export const SpaceNone: Story = {
  args: {
    topSpace: 'topSpaceNone',
    bottomSpace: 'bottomSpaceNone',
    children: (
      <p>
        コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。コンテンツが入ります。
      </p>
    ),
  },
}
