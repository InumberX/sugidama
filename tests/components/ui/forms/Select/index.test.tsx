import { render, type RenderResult, cleanup, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, vi, beforeEach, afterEach, test, expect } from 'vitest'

import jaSelect from '~/locales/ja/components/ui/forms/select.json'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => jaSelect[key as keyof typeof jaSelect] ?? key,
  }),
}))

import { Select, type SelectProps } from '~/components/ui/forms/Select'

const defaultOptions = [
  { value: '0', label: '選択肢1' },
  { value: '1', label: '選択肢2' },
  { value: '2', label: '選択肢3' },
]

describe('Select', () => {
  let result: RenderResult

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  //============================================================================
  // 1. 入出力 (Input/Output)
  //============================================================================
  describe('入出力 (Input/Output)', () => {
    describe('基本的なセレクトボックス', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <Select options={defaultOptions} />
          </MemoryRouter>
        )
      })

      test('select 要素が出力されている', () => {
        const select = result.container.querySelector('select')
        expect(select).not.toBe(null)
      })

      test('デフォルトの空オプション「選択してください」が出力されている', () => {
        const options = result.container.querySelectorAll('option')
        expect(options[0]?.textContent).toBe('選択してください')
        expect((options[0] as HTMLOptionElement).value).toBe('')
      })

      test('各 option が出力されている', () => {
        const options = result.container.querySelectorAll('option')
        // 空オプション + 3つの選択肢
        expect(options.length).toBe(4)
        expect(options[1]?.textContent).toBe('選択肢1')
        expect(options[2]?.textContent).toBe('選択肢2')
        expect(options[3]?.textContent).toBe('選択肢3')
      })
    })

    describe('isNotOutputEmptyOption を指定した場合', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <Select options={defaultOptions} isNotOutputEmptyOption />
          </MemoryRouter>
        )
      })

      test('空オプションが出力されていない', () => {
        const options = result.container.querySelectorAll('option')
        expect(options.length).toBe(3)
        expect(options[0]?.textContent).toBe('選択肢1')
      })
    })

    describe('value を指定した場合', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <Select options={defaultOptions} value="1" />
          </MemoryRouter>
        )
      })

      test('指定した value が選択されている', () => {
        const select = result.container.querySelector('select')
        expect(select?.value).toBe('1')
      })
    })

    describe('helperText を指定した場合', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <Select options={defaultOptions} helperText="注釈テキスト" />
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
            <Select options={defaultOptions} />
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
            <Select options={defaultOptions} errors={['エラー1', 'エラー2']} />
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

    describe('inputProps から属性が引き継がれる場合', () => {
      test('inputProps の name が設定される', () => {
        result = render(
          <MemoryRouter>
            <Select
              options={defaultOptions}
              inputProps={
                {
                  key: 'test-key',
                  id: 'test-id',
                  name: 'conform-name',
                  form: 'test-form',
                } as SelectProps['inputProps']
              }
            />
          </MemoryRouter>
        )
        const select = result.container.querySelector('select')
        expect(select?.name).toBe('conform-name')
      })

      test('inputProps の id が設定される', () => {
        result = render(
          <MemoryRouter>
            <Select
              options={defaultOptions}
              inputProps={
                {
                  key: 'test-key',
                  id: 'conform-id',
                  name: 'test-name',
                  form: 'test-form',
                } as SelectProps['inputProps']
              }
            />
          </MemoryRouter>
        )
        const select = result.container.querySelector('select')
        expect(select?.id).toBe('conform-id')
      })
    })

    describe('dataTestId を指定した場合', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <Select options={defaultOptions} dataTestId="test-select" />
          </MemoryRouter>
        )
      })

      test('data-test-id 属性が設定されている', () => {
        const select = result.container.querySelector('select')
        expect(select?.getAttribute('data-test-id')).toBe('test-select')
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
            <Select options={defaultOptions} />
          </MemoryRouter>
        )
      })

      test('select クラスが適用されている', () => {
        const selectDiv = result.container.querySelector('div[class*="select"]')
        expect(selectDiv?.className).toContain('select')
      })

      test('select_input クラスが select に適用されている', () => {
        const select = result.container.querySelector('select[class*="select_input"]')
        expect(select).not.toBe(null)
      })
    })

    describe('カスタムクラス名', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <Select options={defaultOptions} className="custom-class" />
          </MemoryRouter>
        )
      })

      test('カスタムクラス名が正常に付与されている', () => {
        const selectDiv = result.container.querySelector('div[class*="select"]')
        expect(selectDiv?.classList.contains('custom-class')).toBe(true)
      })
    })

    describe('エラー状態のスタイル', () => {
      test('errors がある場合、エラークラスが適用されている', () => {
        result = render(
          <MemoryRouter>
            <Select options={defaultOptions} errors={['エラー']} />
          </MemoryRouter>
        )
        const select = result.container.querySelector('select')
        expect(select?.className).toContain('select_input__error')
      })

      test('isError が true の場合、エラークラスが適用されている', () => {
        result = render(
          <MemoryRouter>
            <Select options={defaultOptions} isError />
          </MemoryRouter>
        )
        const select = result.container.querySelector('select')
        expect(select?.className).toContain('select_input__error')
      })

      test('errors も isError もない場合、エラークラスが適用されていない', () => {
        result = render(
          <MemoryRouter>
            <Select options={defaultOptions} />
          </MemoryRouter>
        )
        const select = result.container.querySelector('select')
        expect(select?.className).not.toContain('select_input__error')
      })
    })

    describe('disabled 状態', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <Select options={defaultOptions} isDisabled />
          </MemoryRouter>
        )
      })

      test('select が disabled になっている', () => {
        const select = result.container.querySelector('select')
        expect(select?.disabled).toBe(true)
      })
    })

    describe('readOnly 状態', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <Select options={defaultOptions} isReadOnly />
          </MemoryRouter>
        )
      })

      test('select に readOnly 属性が設定されている', () => {
        const select = result.container.querySelector('select')
        expect(select?.getAttribute('readonly')).not.toBe(null)
      })
    })
  })

  //============================================================================
  // 3. 操作 (Operation)
  //============================================================================
  describe('操作 (Operation)', () => {
    describe('onChange', () => {
      test('選択変更時に onChange が呼ばれる', () => {
        const handleChange = vi.fn()
        result = render(
          <MemoryRouter>
            <Select options={defaultOptions} onChange={handleChange} />
          </MemoryRouter>
        )
        const select = result.container.querySelector('select')!
        fireEvent.change(select, { target: { value: '1' } })
        expect(handleChange).toHaveBeenCalledTimes(1)
        expect(handleChange).toHaveBeenCalledWith(expect.any(Object), '1')
      })

      test('別の選択肢に変更すると onChange が正しい値で呼ばれる', () => {
        const handleChange = vi.fn()
        result = render(
          <MemoryRouter>
            <Select options={defaultOptions} onChange={handleChange} />
          </MemoryRouter>
        )
        const select = result.container.querySelector('select')!
        fireEvent.change(select, { target: { value: '2' } })
        expect(handleChange).toHaveBeenCalledWith(expect.any(Object), '2')
      })

      test('onChange が未指定の場合エラーにならない', () => {
        result = render(
          <MemoryRouter>
            <Select options={defaultOptions} />
          </MemoryRouter>
        )
        const select = result.container.querySelector('select')!
        expect(() => {
          fireEvent.change(select, { target: { value: '1' } })
        }).not.toThrow()
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
