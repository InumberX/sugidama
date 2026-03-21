import { render, type RenderResult, cleanup, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, vi, beforeEach, afterEach, test, expect } from 'vitest'

import { InputRadio, type InputRadioProps } from '~/components/ui/forms/InputRadio'

const defaultInputProps = [
  { key: 'key-0', id: 'id-0', name: 'radio-group', value: '0', form: 'form-0' },
  { key: 'key-1', id: 'id-1', name: 'radio-group', value: '1', form: 'form-0' },
  { key: 'key-2', id: 'id-2', name: 'radio-group', value: '2', form: 'form-0' },
] as InputRadioProps['inputProps']

const defaultLabels = ['ラジオ1', 'ラジオ2', 'ラジオ3']

describe('InputRadio', () => {
  let result: RenderResult

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  //============================================================================
  // 1. 入出力 (Input/Output)
  //============================================================================
  describe('入出力 (Input/Output)', () => {
    describe('基本的なラジオボタン', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <InputRadio inputProps={defaultInputProps} labels={defaultLabels} />
          </MemoryRouter>
        )
      })

      test('radio 要素が出力されている', () => {
        const inputs = result.container.querySelectorAll('input[type="radio"]')
        expect(inputs.length).toBe(3)
      })

      test('各ラジオボタンのラベルが出力されている', () => {
        const labels = result.container.querySelectorAll('[class*="inputRadio_text"]')
        expect(labels.length).toBe(3)
        expect(labels[0]?.textContent).toBe('ラジオ1')
        expect(labels[1]?.textContent).toBe('ラジオ2')
        expect(labels[2]?.textContent).toBe('ラジオ3')
      })
    })

    describe('labels を指定しない場合', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <InputRadio inputProps={defaultInputProps} />
          </MemoryRouter>
        )
      })

      test('ラベルテキストが出力されていない', () => {
        const labels = result.container.querySelectorAll('[class*="inputRadio_text"]')
        expect(labels.length).toBe(0)
      })
    })

    describe('helperText を指定した場合', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <InputRadio inputProps={defaultInputProps} helperText="注釈テキスト" />
          </MemoryRouter>
        )
      })

      test('HelperText が出力されている', () => {
        const helperText = result.container.querySelector('[class*="helperText"]')
        expect(helperText).not.toBe(null)
        expect(helperText?.textContent).toBe('注釈テキスト')
      })
    })

    describe('helperText を指定しない場合', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <InputRadio inputProps={defaultInputProps} />
          </MemoryRouter>
        )
      })

      test('HelperText が出力されていない', () => {
        const helperText = result.container.querySelector('[class*="helperText"]')
        expect(helperText).toBe(null)
      })
    })

    describe('errors を指定した場合', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <InputRadio inputProps={defaultInputProps} errors={['エラー1', 'エラー2']} />
          </MemoryRouter>
        )
      })

      test('ErrorMessage が出力されている', () => {
        const errorMessages = result.container.querySelectorAll('[class*="errorMessage"]')
        expect(errorMessages.length).toBe(2)
        expect(errorMessages[0]?.textContent).toBe('エラー1')
        expect(errorMessages[1]?.textContent).toBe('エラー2')
      })
    })

    describe('inputProps の属性が引き継がれる場合', () => {
      test('inputProps の name が設定される', () => {
        result = render(
          <MemoryRouter>
            <InputRadio inputProps={defaultInputProps} />
          </MemoryRouter>
        )
        const inputs = result.container.querySelectorAll('input[type="radio"]')
        inputs.forEach((input) => {
          expect((input as HTMLInputElement).name).toBe('radio-group')
        })
      })

      test('inputProps の id が設定される', () => {
        result = render(
          <MemoryRouter>
            <InputRadio inputProps={defaultInputProps} />
          </MemoryRouter>
        )
        const inputs = result.container.querySelectorAll('input[type="radio"]')
        expect((inputs[0] as HTMLInputElement).id).toBe('id-0')
        expect((inputs[1] as HTMLInputElement).id).toBe('id-1')
        expect((inputs[2] as HTMLInputElement).id).toBe('id-2')
      })
    })
  })

  //============================================================================
  // 2. 表示 (Display)
  //============================================================================
  describe('表示 (Display)', () => {
    describe('ベーススタイル', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <InputRadio inputProps={defaultInputProps} />
          </MemoryRouter>
        )
      })

      test('inputRadio クラスが適用されている', () => {
        const inputRadio = result.container.querySelector('div[class*="inputRadio"]')
        expect(inputRadio?.className).toContain('inputRadio')
      })

      test('inputRadio_input クラスが input に適用されている', () => {
        const input = result.container.querySelector('input[class*="inputRadio_input"]')
        expect(input).not.toBe(null)
      })
    })

    describe('カスタムクラス名', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <InputRadio inputProps={defaultInputProps} className="custom-class" />
          </MemoryRouter>
        )
      })

      test('カスタムクラス名が正常に付与されている', () => {
        const inputRadio = result.container.querySelector('div[class*="inputRadio"]')
        expect(inputRadio?.classList.contains('custom-class')).toBe(true)
      })
    })

    describe('エラー状態のスタイル', () => {
      test('errors がある場合、エラークラスが適用されている', () => {
        result = render(
          <MemoryRouter>
            <InputRadio inputProps={defaultInputProps} errors={['エラー']} />
          </MemoryRouter>
        )
        const input = result.container.querySelector('input')
        expect(input?.className).toContain('inputRadio_input__error')
      })

      test('isError が true の場合、エラークラスが適用されている', () => {
        result = render(
          <MemoryRouter>
            <InputRadio inputProps={defaultInputProps} isError />
          </MemoryRouter>
        )
        const input = result.container.querySelector('input')
        expect(input?.className).toContain('inputRadio_input__error')
      })

      test('errors も isError もない場合、エラークラスが適用されていない', () => {
        result = render(
          <MemoryRouter>
            <InputRadio inputProps={defaultInputProps} />
          </MemoryRouter>
        )
        const input = result.container.querySelector('input')
        expect(input?.className).not.toContain('inputRadio_input__error')
      })
    })

    describe('disabled 状態', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <InputRadio inputProps={defaultInputProps} isDisabled />
          </MemoryRouter>
        )
      })

      test('全ての input が disabled になっている', () => {
        const inputs = result.container.querySelectorAll('input[type="radio"]')
        inputs.forEach((input) => {
          expect((input as HTMLInputElement).disabled).toBe(true)
        })
      })
    })

    describe('readOnly 状態', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <InputRadio inputProps={defaultInputProps} isReadOnly />
          </MemoryRouter>
        )
      })

      test('全ての input が readOnly になっている', () => {
        const inputs = result.container.querySelectorAll('input[type="radio"]')
        inputs.forEach((input) => {
          expect((input as HTMLInputElement).readOnly).toBe(true)
        })
      })
    })
  })

  //============================================================================
  // 3. 操作 (Operation)
  //============================================================================
  describe('操作 (Operation)', () => {
    describe('onChange', () => {
      test('選択時に onChange が呼ばれる', () => {
        const handleChange = vi.fn()
        result = render(
          <MemoryRouter>
            <InputRadio inputProps={defaultInputProps} onChange={handleChange} />
          </MemoryRouter>
        )
        const input = result.container.querySelectorAll('input[type="radio"]')[0]!
        fireEvent.click(input)
        expect(handleChange).toHaveBeenCalledTimes(1)
        expect(handleChange).toHaveBeenCalledWith(expect.any(Object), '0')
      })

      test('別の選択肢をクリックすると onChange が正しい値で呼ばれる', () => {
        const handleChange = vi.fn()
        result = render(
          <MemoryRouter>
            <InputRadio inputProps={defaultInputProps} onChange={handleChange} />
          </MemoryRouter>
        )
        const input = result.container.querySelectorAll('input[type="radio"]')[2]!
        fireEvent.click(input)
        expect(handleChange).toHaveBeenCalledWith(expect.any(Object), '2')
      })

      test('onChange が未指定の場合エラーにならない', () => {
        result = render(
          <MemoryRouter>
            <InputRadio inputProps={defaultInputProps} />
          </MemoryRouter>
        )
        const input = result.container.querySelectorAll('input[type="radio"]')[0]!
        expect(() => {
          fireEvent.click(input)
        }).not.toThrow()
      })
    })

    describe('onClick', () => {
      test('クリック時に onClick が呼ばれる', () => {
        const handleClick = vi.fn()
        result = render(
          <MemoryRouter>
            <InputRadio inputProps={defaultInputProps} onClick={handleClick} />
          </MemoryRouter>
        )
        const input = result.container.querySelectorAll('input[type="radio"]')[0]!
        fireEvent.click(input)
        expect(handleClick).toHaveBeenCalledTimes(1)
        expect(handleClick).toHaveBeenCalledWith(expect.any(Object), expect.any(Boolean))
      })
    })
  })

  //============================================================================
  // 4. 入力規制 (Validation)
  //============================================================================
  describe.skip('入力規制 (Validation)', () => {})

  //============================================================================
  // 5. その他 (Optional)
  //============================================================================
  describe.skip('その他 (Optional)', () => {})
})
