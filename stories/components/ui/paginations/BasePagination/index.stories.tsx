import type { Meta, StoryObj } from '@storybook/react-vite'

import { BasePagination } from '~/components/ui/paginations/BasePagination'

const meta: Meta<typeof BasePagination> = {
  title: 'components/ui/paginations/BasePagination',
  component: BasePagination,
}
export default meta

type Story = StoryObj<typeof BasePagination>

export const TotalPage1CurrentPage1: Story = {
  args: {
    currentPage: 1,
    totalSize: 12,
    onChangePage(newPage) {
      alert(`newPage is ${newPage}`)
    },
  },
}

export const TotalPage5CurrentPage1: Story = {
  args: {
    currentPage: 1,
    totalSize: 60,
    onChangePage(newPage) {
      alert(`newPage is ${newPage}`)
    },
  },
}

export const TotalPage10CurrentPage1: Story = {
  args: {
    currentPage: 1,
    totalSize: 120,
    onChangePage(newPage) {
      alert(`newPage is ${newPage}`)
    },
  },
}

export const TotalPage10CurrentPage3: Story = {
  args: {
    currentPage: 3,
    totalSize: 120,
    onChangePage(newPage) {
      alert(`newPage is ${newPage}`)
    },
  },
}

export const TotalPage10CurrentPage4: Story = {
  args: {
    currentPage: 4,
    totalSize: 120,
    onChangePage(newPage) {
      alert(`newPage is ${newPage}`)
    },
  },
}

export const TotalPage10CurrentPage5: Story = {
  args: {
    currentPage: 5,
    totalSize: 120,
    onChangePage(newPage) {
      alert(`newPage is ${newPage}`)
    },
  },
}

export const TotalPage10CurrentPage7: Story = {
  args: {
    currentPage: 7,
    totalSize: 120,
    onChangePage(newPage) {
      alert(`newPage is ${newPage}`)
    },
  },
}

export const TotalPage10CurrentPage8: Story = {
  args: {
    currentPage: 8,
    totalSize: 120,
    onChangePage(newPage) {
      alert(`newPage is ${newPage}`)
    },
  },
}

export const TotalPage10CurrentPage9: Story = {
  args: {
    currentPage: 9,
    totalSize: 120,
    onChangePage(newPage) {
      alert(`newPage is ${newPage}`)
    },
  },
}

export const TotalPage10CurrentPage10: Story = {
  args: {
    currentPage: 10,
    totalSize: 120,
    onChangePage(newPage) {
      alert(`newPage is ${newPage}`)
    },
  },
}
