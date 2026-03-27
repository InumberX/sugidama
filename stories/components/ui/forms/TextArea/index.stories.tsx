import { getFormProps, getTextareaProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod/v4'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { z } from 'zod'

import { TextArea } from '~/components/ui/forms/TextArea'
import { customErrorMessage } from '~/utils/custom-error-message'

const schema = z.object({
  name: z
    .string({
      error: customErrorMessage.required('名前'),
    })
    .max(200, {
      error: customErrorMessage.max(200, '名前'),
    }),
})

type Schema = z.infer<typeof schema>

const meta: Meta<typeof TextArea> = {
  title: 'components/ui/forms/TextArea',
  component: TextArea,
}
export default meta

type Story = StoryObj<typeof TextArea>

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
          <TextArea errors={fields.name.errors} inputProps={getTextareaProps(fields.name)} />
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
          <TextArea
            helperText="注釈が入ります。"
            errors={fields.name.errors}
            inputProps={getTextareaProps(fields.name)}
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
          <TextArea isDisabled errors={fields.name.errors} inputProps={getTextareaProps(fields.name)} />
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
          <TextArea isReadOnly errors={fields.name.errors} inputProps={getTextareaProps(fields.name)} />
        </form>
      )
    }

    return <StoryElement />
  },
}

export const MaxLength: Story = {
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
          <TextArea
            errors={fields.name.errors}
            inputProps={getTextareaProps(fields.name)}
            maxLength={fields.name.maxLength}
            currentLength={fields.name.value?.length ?? 0}
          />
        </form>
      )
    }

    return <StoryElement />
  },
}
