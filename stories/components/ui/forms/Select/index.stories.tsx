import { getFormProps, getSelectProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod/v4'
import { z } from 'zod'

import { Select } from '~/components/ui/forms/Select'
import { customErrorMessage } from '~/utils/custom-error-message'

import type { Meta, StoryObj } from '@storybook/react-vite'

const schema = z.object({
  name: z.string({
    error: customErrorMessage.required('名前'),
  }),
})

type Schema = z.infer<typeof schema>

const meta: Meta<typeof Select> = {
  title: 'components/ui/forms/Select',
  component: Select,
}
export default meta

type Story = StoryObj<typeof Select>

export const Default: Story = {
  render: () => {
    const StoryElement = () => {
      const [form, fields] = useForm<Schema>({
        constraint: getZodConstraint(schema),
        shouldValidate: 'onBlur',
        shouldRevalidate: 'onInput',
        onValidate({ formData }) {
          return parseWithZod(formData, {
            schema,
          })
        },
      })

      return (
        <form method="post" {...getFormProps(form)}>
          <Select
            errors={fields.name.errors}
            inputProps={getSelectProps(fields.name)}
            options={[
              {
                value: '0',
                label: '選択肢1',
              },
              {
                value: '1',
                label: '選択肢2',
              },
              {
                value: '2',
                label: '選択肢3',
              },
            ]}
          />
        </form>
      )
    }

    return <StoryElement />
  },
}

export const HelperText: Story = {
  render: () => {
    const StoryElement = () => {
      const [form, fields] = useForm<Schema>({
        constraint: getZodConstraint(schema),
        shouldValidate: 'onBlur',
        shouldRevalidate: 'onInput',
        onValidate({ formData }) {
          return parseWithZod(formData, {
            schema,
          })
        },
      })

      return (
        <form method="post" {...getFormProps(form)}>
          <Select
            helperText="注釈が入ります。"
            errors={fields.name.errors}
            inputProps={getSelectProps(fields.name)}
            options={[
              {
                value: '0',
                label: '選択肢1',
              },
              {
                value: '1',
                label: '選択肢2',
              },
              {
                value: '2',
                label: '選択肢3',
              },
            ]}
          />
        </form>
      )
    }

    return <StoryElement />
  },
}

export const Disabled: Story = {
  render: () => {
    const StoryElement = () => {
      const [form, fields] = useForm<Schema>({
        constraint: getZodConstraint(schema),
        shouldValidate: 'onBlur',
        shouldRevalidate: 'onInput',
        onValidate({ formData }) {
          return parseWithZod(formData, {
            schema,
          })
        },
        defaultValue: {
          name: '0',
        },
      })

      return (
        <form method="post" {...getFormProps(form)}>
          <Select
            isDisabled
            errors={fields.name.errors}
            inputProps={getSelectProps(fields.name)}
            options={[
              {
                value: '0',
                label: '選択肢1',
              },
              {
                value: '1',
                label: '選択肢2',
              },
              {
                value: '2',
                label: '選択肢3',
              },
            ]}
          />
        </form>
      )
    }

    return <StoryElement />
  },
}

export const ReadOnly: Story = {
  render: () => {
    const StoryElement = () => {
      const [form, fields] = useForm<Schema>({
        constraint: getZodConstraint(schema),
        shouldValidate: 'onBlur',
        shouldRevalidate: 'onInput',
        onValidate({ formData }) {
          return parseWithZod(formData, {
            schema,
          })
        },
        defaultValue: {
          name: '0',
        },
      })

      return (
        <form method="post" {...getFormProps(form)}>
          <Select
            isReadOnly
            errors={fields.name.errors}
            inputProps={getSelectProps(fields.name)}
            options={[
              {
                value: '0',
                label: '選択肢1',
              },
              {
                value: '1',
                label: '選択肢2',
              },
              {
                value: '2',
                label: '選択肢3',
              },
            ]}
          />
        </form>
      )
    }

    return <StoryElement />
  },
}
