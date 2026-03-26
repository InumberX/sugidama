import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod/v4'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { z } from 'zod'

import { InputText } from '~/components/ui/forms/InputText'
import { customErrorMessage } from '~/utils/custom-error-message'

const schema = z.object({
  name: z.string({
    error: customErrorMessage.required('名前'),
  }),
})

type Schema = z.infer<typeof schema>

const meta: Meta<typeof InputText> = {
  title: 'components/ui/forms/InputText',
  component: InputText,
}
export default meta

type Story = StoryObj<typeof InputText>

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
          <InputText
            errors={fields.name.errors}
            inputProps={getInputProps(fields.name, {
              type: 'text',
            })}
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
          <InputText
            helperText="注釈が入ります。"
            errors={fields.name.errors}
            inputProps={getInputProps(fields.name, {
              type: 'text',
            })}
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
          name: '入力値が入ります',
        },
      })

      return (
        <form method="post" {...getFormProps(form)}>
          <InputText
            isDisabled
            errors={fields.name.errors}
            inputProps={getInputProps(fields.name, {
              type: 'text',
            })}
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
          name: '入力値が入ります',
        },
      })

      return (
        <form method="post" {...getFormProps(form)}>
          <InputText
            isReadOnly
            errors={fields.name.errors}
            inputProps={getInputProps(fields.name, {
              type: 'text',
            })}
          />
        </form>
      )
    }

    return <StoryElement />
  },
}

export const Unit: Story = {
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
          <InputText
            errors={fields.name.errors}
            inputProps={getInputProps(fields.name, {
              type: 'text',
            })}
            maxWidth={160}
            unit="年"
          />
        </form>
      )
    }

    return <StoryElement />
  },
}
