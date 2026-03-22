import { render, type RenderResult, cleanup, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, vi, beforeEach, afterEach, test, expect } from 'vitest'

import { InputCheckbox, type InputCheckboxProps } from '~/components/ui/forms/InputCheckbox'

const defaultOptions = [
  { value: '0', label: 'チェックボックス1' },
  { value: '1', label: 'チェックボックス2' },
  { value: '2', label: 'チェックボックス3' },
]

describe('InputCheckbox', () => {
  let result: RenderResult

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  //============================================================================
  // 1. 入出力 (Input/Output)
  //============================================================================
  describe('入出力 (Input/Output)', () => {
    describe('基本的なチェックボックス', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <InputCheckbox options={defaultOptions} />
          </MemoryRouter>
        )
      })

      test('checkbox 要素が出力されている', () => {
        const inputs = result.container.querySelectorAll('input[type="checkbox"]')
        expect(inputs.length).toBe(3)
      })

      test('各チェックボックスのラベルが出力されている', () => {
        const labels = result.container.querySelectorAll('[class*="inputCheckbox_text"]')
        expect(labels.length).toBe(3)
        expect(labels[0]?.textContent).toBe('チェックボックス1')
        expect(labels[1]?.textContent).toBe('チェックボックス2')
        expect(labels[2]?.textContent).toBe('チェックボックス3')
      })
    })

    describe('name を指定した場合', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <InputCheckbox options={defaultOptions} name="fruits" />
          </MemoryRouter>
        )
      })

      test('name 属性が設定されている', () => {
        const inputs = result.container.querySelectorAll('input[type="checkbox"]')
        inputs.forEach((input) => {
          expect((input as HTMLInputElement).name).toBe('fruits')
        })
      })
    })

    describe('value を指定した場合', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <InputCheckbox options={defaultOptions} value={['0', '2']} />
          </MemoryRouter>
        )
      })

      test('指定した value のチェックボックスが checked になっている', () => {
        const inputs = result.container.querySelectorAll('input[type="checkbox"]')
        expect((inputs[0] as HTMLInputElement).checked).toBe(true)
        expect((inputs[1] as HTMLInputElement).checked).toBe(false)
        expect((inputs[2] as HTMLInputElement).checked).toBe(true)
      })
    })

    describe('value を文字列で指定した場合', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <InputCheckbox options={defaultOptions} value="1" />
          </MemoryRouter>
        )
      })

      test('指定した value のチェックボックスが checked になっている', () => {
        const inputs = result.container.querySelectorAll('input[type="checkbox"]')
        expect((inputs[0] as HTMLInputElement).checked).toBe(false)
        expect((inputs[1] as HTMLInputElement).checked).toBe(true)
        expect((inputs[2] as HTMLInputElement).checked).toBe(false)
      })
    })

    describe('helperText を指定した場合', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <InputCheckbox options={defaultOptions} helperText="注釈テキスト" />
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
            <InputCheckbox options={defaultOptions} />
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
            <InputCheckbox options={defaultOptions} errors={['エラー1', 'エラー2']} />
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

    describe('options を指定しない場合', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <InputCheckbox />
          </MemoryRouter>
        )
      })

      test('チェックボックスが出力されていない', () => {
        const inputs = result.container.querySelectorAll('input[type="checkbox"]')
        expect(inputs.length).toBe(0)
      })
    })

    describe('inputProps から name/id が引き継がれる場合', () => {
      test('inputProps のチェックボックスが出力される', () => {
        const inputProps = [
          { key: 'key-0', id: 'id-0', name: 'name-0', value: '0', form: 'form-0' },
          { key: 'key-1', id: 'id-1', name: 'name-1', value: '1', form: 'form-1' },
        ] as InputCheckboxProps['inputProps']

        result = render(
          <MemoryRouter>
            <InputCheckbox inputProps={inputProps} labels={['ラベル1', 'ラベル2']} />
          </MemoryRouter>
        )
        const inputs = result.container.querySelectorAll('input[type="checkbox"]')
        expect(inputs.length).toBe(2)
      })

      test('labels が表示される', () => {
        const inputProps = [
          { key: 'key-0', id: 'id-0', name: 'name-0', value: '0', form: 'form-0' },
          { key: 'key-1', id: 'id-1', name: 'name-1', value: '1', form: 'form-1' },
        ] as InputCheckboxProps['inputProps']

        result = render(
          <MemoryRouter>
            <InputCheckbox inputProps={inputProps} labels={['ラベル1', 'ラベル2']} />
          </MemoryRouter>
        )
        const labels = result.container.querySelectorAll('[class*="inputCheckbox_text"]')
        expect(labels.length).toBe(2)
        expect(labels[0]?.textContent).toBe('ラベル1')
        expect(labels[1]?.textContent).toBe('ラベル2')
      })
    })

    describe('inputProps に defaultChecked を含む場合', () => {
      test('defaultChecked の値が初期選択として反映される', () => {
        const inputProps = [
          { key: 'key-0', id: 'id-0', name: 'taste', value: '0', form: 'form-0', defaultChecked: true },
          { key: 'key-1', id: 'id-1', name: 'taste', value: '1', form: 'form-0', defaultChecked: false },
          { key: 'key-2', id: 'id-2', name: 'taste', value: '2', form: 'form-0', defaultChecked: true },
        ] as InputCheckboxProps['inputProps']

        result = render(
          <MemoryRouter>
            <InputCheckbox inputProps={inputProps} labels={['ラベル1', 'ラベル2', 'ラベル3']} />
          </MemoryRouter>
        )
        const inputs = result.container.querySelectorAll('input[type="checkbox"]')
        expect((inputs[0] as HTMLInputElement).checked).toBe(true)
        expect((inputs[1] as HTMLInputElement).checked).toBe(false)
        expect((inputs[2] as HTMLInputElement).checked).toBe(true)
      })

      test('defaultChecked がある状態で別の項目をチェックすると既存選択が保持される', () => {
        const handleChange = vi.fn()
        const inputProps = [
          { key: 'key-0', id: 'id-0', name: 'taste', value: '0', form: 'form-0', defaultChecked: true },
          { key: 'key-1', id: 'id-1', name: 'taste', value: '1', form: 'form-0', defaultChecked: false },
          { key: 'key-2', id: 'id-2', name: 'taste', value: '2', form: 'form-0', defaultChecked: true },
        ] as InputCheckboxProps['inputProps']

        result = render(
          <MemoryRouter>
            <InputCheckbox inputProps={inputProps} labels={['ラベル1', 'ラベル2', 'ラベル3']} onChange={handleChange} />
          </MemoryRouter>
        )
        // 未チェックの項目をチェック
        const inputs = result.container.querySelectorAll('input[type="checkbox"]')
        fireEvent.click(inputs[1]!)
        // 既存の defaultChecked の値が保持されている
        expect(handleChange).toHaveBeenCalledWith(expect.any(Object), ['0', '2', '1'])
      })

      test('defaultChecked がある状態でチェック解除すると正しく除外される', () => {
        const handleChange = vi.fn()
        const inputProps = [
          { key: 'key-0', id: 'id-0', name: 'taste', value: '0', form: 'form-0', defaultChecked: true },
          { key: 'key-1', id: 'id-1', name: 'taste', value: '1', form: 'form-0', defaultChecked: false },
          { key: 'key-2', id: 'id-2', name: 'taste', value: '2', form: 'form-0', defaultChecked: true },
        ] as InputCheckboxProps['inputProps']

        result = render(
          <MemoryRouter>
            <InputCheckbox inputProps={inputProps} labels={['ラベル1', 'ラベル2', 'ラベル3']} onChange={handleChange} />
          </MemoryRouter>
        )
        // defaultChecked の項目をチェック解除
        const inputs = result.container.querySelectorAll('input[type="checkbox"]')
        fireEvent.click(inputs[0]!)
        expect(handleChange).toHaveBeenCalledWith(expect.any(Object), ['2'])
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
            <InputCheckbox options={defaultOptions} />
          </MemoryRouter>
        )
      })

      test('inputCheckbox クラスが適用されている', () => {
        const inputCheckbox = result.container.querySelector('div[class*="inputCheckbox"]')
        expect(inputCheckbox?.className).toContain('inputCheckbox')
      })

      test('inputCheckbox_input クラスが input に適用されている', () => {
        const input = result.container.querySelector('input[class*="inputCheckbox_input"]')
        expect(input).not.toBe(null)
      })
    })

    describe('カスタムクラス名', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <InputCheckbox options={defaultOptions} className="custom-class" />
          </MemoryRouter>
        )
      })

      test('カスタムクラス名が正常に付与されている', () => {
        const inputCheckbox = result.container.querySelector('div[class*="inputCheckbox"]')
        expect(inputCheckbox?.classList.contains('custom-class')).toBe(true)
      })
    })

    describe('エラー状態のスタイル', () => {
      test('errors がある場合、エラークラスが適用されている', () => {
        result = render(
          <MemoryRouter>
            <InputCheckbox options={defaultOptions} errors={['エラー']} />
          </MemoryRouter>
        )
        const input = result.container.querySelector('input')
        expect(input?.className).toContain('inputCheckbox_input__error')
      })

      test('isError が true の場合、エラークラスが適用されている', () => {
        result = render(
          <MemoryRouter>
            <InputCheckbox options={defaultOptions} isError />
          </MemoryRouter>
        )
        const input = result.container.querySelector('input')
        expect(input?.className).toContain('inputCheckbox_input__error')
      })

      test('errors も isError もない場合、エラークラスが適用されていない', () => {
        result = render(
          <MemoryRouter>
            <InputCheckbox options={defaultOptions} />
          </MemoryRouter>
        )
        const input = result.container.querySelector('input')
        expect(input?.className).not.toContain('inputCheckbox_input__error')
      })
    })

    describe('disabled 状態', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <InputCheckbox options={defaultOptions} isDisabled />
          </MemoryRouter>
        )
      })

      test('全ての input が disabled になっている', () => {
        const inputs = result.container.querySelectorAll('input[type="checkbox"]')
        inputs.forEach((input) => {
          expect((input as HTMLInputElement).disabled).toBe(true)
        })
      })
    })

    describe('readOnly 状態', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <InputCheckbox options={defaultOptions} isReadOnly />
          </MemoryRouter>
        )
      })

      test('全ての input が readOnly になっている', () => {
        const inputs = result.container.querySelectorAll('input[type="checkbox"]')
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
      test('チェック時に onChange が呼ばれる', () => {
        const handleChange = vi.fn()
        result = render(
          <MemoryRouter>
            <InputCheckbox options={defaultOptions} onChange={handleChange} />
          </MemoryRouter>
        )
        const input = result.container.querySelectorAll('input[type="checkbox"]')[0]!
        fireEvent.click(input)
        expect(handleChange).toHaveBeenCalledTimes(1)
        expect(handleChange).toHaveBeenCalledWith(expect.any(Object), ['0'])
      })

      test('複数チェック時に onChange が正しい値で呼ばれる', () => {
        const handleChange = vi.fn()
        result = render(
          <MemoryRouter>
            <InputCheckbox options={defaultOptions} value={['0']} onChange={handleChange} />
          </MemoryRouter>
        )
        const input = result.container.querySelectorAll('input[type="checkbox"]')[2]!
        fireEvent.click(input)
        expect(handleChange).toHaveBeenCalledWith(expect.any(Object), ['0', '2'])
      })

      test('チェック解除時に onChange が呼ばれる', () => {
        const handleChange = vi.fn()
        result = render(
          <MemoryRouter>
            <InputCheckbox options={defaultOptions} value={['0', '1']} onChange={handleChange} />
          </MemoryRouter>
        )
        const input = result.container.querySelectorAll('input[type="checkbox"]')[0]!
        fireEvent.click(input)
        expect(handleChange).toHaveBeenCalledWith(expect.any(Object), ['1'])
      })

      test('onChange が未指定の場合エラーにならない', () => {
        result = render(
          <MemoryRouter>
            <InputCheckbox options={defaultOptions} />
          </MemoryRouter>
        )
        const input = result.container.querySelectorAll('input[type="checkbox"]')[0]!
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
            <InputCheckbox options={defaultOptions} onClick={handleClick} />
          </MemoryRouter>
        )
        const input = result.container.querySelectorAll('input[type="checkbox"]')[0]!
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
