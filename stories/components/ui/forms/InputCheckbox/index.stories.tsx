import { getFormProps, getCollectionProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod/v4'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { z } from 'zod'

import { InputCheckbox } from '~/components/ui/forms/InputCheckbox'
import { customErrorMessage } from '~/utils/custom-error-message'

const schema = z.object({
  name: z.array(z.string()).min(1, {
    error: customErrorMessage.required('名前'),
  }),
})

type Schema = z.infer<typeof schema>

const meta: Meta<typeof InputCheckbox> = {
  title: 'components/ui/forms/InputCheckbox',
  component: InputCheckbox,
}
export default meta

type Story = StoryObj<typeof InputCheckbox>

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
          <InputCheckbox
            errors={fields.name.errors}
            inputProps={getCollectionProps(fields.name, {
              type: 'checkbox',
              options: ['0', '1', '2'],
            })}
            labels={['チェックボックス1', 'チェックボックス2', 'チェックボックス3']}
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
          <InputCheckbox
            errors={fields.name.errors}
            inputProps={getCollectionProps(fields.name, {
              type: 'checkbox',
              options: ['0', '1', '2'],
            })}
            labels={['チェックボックス1', 'チェックボックス2', 'チェックボックス3']}
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
          name: ['1'],
        },
      })

      return (
        <form method="post" {...getFormProps(form)}>
          <InputCheckbox
            errors={fields.name.errors}
            inputProps={getCollectionProps(fields.name, {
              type: 'checkbox',
              options: ['0', '1', '2'],
            })}
            labels={['チェックボックス1', 'チェックボックス2', 'チェックボックス3']}
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
          name: ['1'],
        },
      })

      return (
        <form method="post" {...getFormProps(form)}>
          <InputCheckbox
            errors={fields.name.errors}
            inputProps={getCollectionProps(fields.name, {
              type: 'checkbox',
              options: ['0', '1', '2'],
            })}
            labels={['チェックボックス1', 'チェックボックス2', 'チェックボックス3']}
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
          <InputCheckbox
            errors={fields.name.errors}
            inputProps={getCollectionProps(fields.name, {
              type: 'checkbox',
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
