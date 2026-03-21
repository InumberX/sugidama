import { getFormProps, getCollectionProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod/v4'
import { z } from 'zod'

import { InputRadio } from '~/components/ui/forms/InputRadio'
import { customErrorMessage } from '~/utils/custom-error-message'

import type { Meta, StoryObj } from '@storybook/react-vite'

const schema = z.object({
  name: z.string({
    error: customErrorMessage.required('名前'),
  }),
})

type Schema = z.infer<typeof schema>

const meta: Meta<typeof InputRadio> = {
  title: 'components/ui/forms/InputRadio',
  component: InputRadio,
}
export default meta

type Story = StoryObj<typeof InputRadio>

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
          <InputRadio
            errors={fields.name.errors}
            inputProps={getCollectionProps(fields.name, {
              type: 'radio',
              options: ['0', '1', '2'],
            })}
            labels={['ラジオ1', 'ラジオ2', 'ラジオ3']}
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
          <InputRadio
            errors={fields.name.errors}
            inputProps={getCollectionProps(fields.name, {
              type: 'radio',
              options: ['0', '1', '2'],
            })}
            labels={['ラジオ1', 'ラジオ2', 'ラジオ3']}
            helperText="注釈が入ります。"
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
          name: '1',
        },
      })

      return (
        <form method="post" {...getFormProps(form)}>
          <InputRadio
            errors={fields.name.errors}
            inputProps={getCollectionProps(fields.name, {
              type: 'radio',
              options: ['0', '1', '2'],
            })}
            labels={['ラジオ1', 'ラジオ2', 'ラジオ3']}
            isDisabled
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
          name: '1',
        },
      })

      return (
        <form method="post" {...getFormProps(form)}>
          <InputRadio
            errors={fields.name.errors}
            inputProps={getCollectionProps(fields.name, {
              type: 'radio',
              options: ['0', '1', '2'],
            })}
            labels={['ラジオ1', 'ラジオ2', 'ラジオ3']}
            isReadOnly
          />
        </form>
      )
    }

    return <StoryElement />
  },
}

export const LabelEmpty: Story = {
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
          <InputRadio
            errors={fields.name.errors}
            inputProps={getCollectionProps(fields.name, {
              type: 'radio',
              options: ['0', '1', '2'],
            })}
            helperText="注釈が入ります。"
          />
        </form>
      )
    }

    return <StoryElement />
  },
}
