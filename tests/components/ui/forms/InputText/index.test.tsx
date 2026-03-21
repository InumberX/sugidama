import { render, type RenderResult, cleanup, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, vi, beforeEach, afterEach, test, expect } from 'vitest'

import { InputText } from '~/components/ui/forms/InputText'

describe('InputText', () => {
  let result: RenderResult

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  //============================================================================
  // 1. 入出力 (Input/Output)
  //============================================================================
  describe('入出力 (Input/Output)', () => {
    describe('基本的な入力フィールド', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <InputText />
          </MemoryRouter>
        )
      })

      test('input 要素が出力されている', () => {
        const input = result.container.querySelector('input')
        expect(input).not.toBe(null)
      })

      test('デフォルトで type="text" が設定されている', () => {
        const input = result.container.querySelector('input')
        expect(input?.type).toBe('text')
      })
    })

    describe('type を指定した場合', () => {
      test.each(['email', 'password', 'url', 'search'] as const)('type="%s" が設定される', (type) => {
        result = render(
          <MemoryRouter>
            <InputText type={type} />
          </MemoryRouter>
        )
        const input = result.container.querySelector('input')
        expect(input?.type).toBe(type)
      })
    })

    describe('name を指定した場合', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <InputText name="username" />
          </MemoryRouter>
        )
      })

      test('name 属性が設定されている', () => {
        const input = result.container.querySelector('input')
        expect(input?.name).toBe('username')
      })
    })

    describe('placeholder を指定した場合', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <InputText placeholder="入力してください" />
          </MemoryRouter>
        )
      })

      test('placeholder が設定されている', () => {
        const input = result.container.querySelector('input')
        expect(input?.placeholder).toBe('入力してください')
      })
    })

    describe('value を指定した場合', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <InputText value="初期値" onChange={vi.fn()} />
          </MemoryRouter>
        )
      })

      test('value が設定されている', () => {
        const input = result.container.querySelector('input')
        expect(input?.value).toBe('初期値')
      })
    })

    describe('helperText を指定した場合', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <InputText helperText="注釈テキスト" />
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
            <InputText />
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
            <InputText errors={['エラー1', 'エラー2']} />
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

    describe('unit を指定した場合', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <InputText unit="年" />
          </MemoryRouter>
        )
      })

      test('unit が出力されている', () => {
        const unit = result.container.querySelector('[class*="inputText_unit"]')
        expect(unit).not.toBe(null)
        expect(unit?.textContent).toBe('年')
      })
    })

    describe('unit を指定しない場合', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <InputText />
          </MemoryRouter>
        )
      })

      test('unit が出力されていない', () => {
        const unit = result.container.querySelector('[class*="inputText_unit"]')
        expect(unit).toBe(null)
      })
    })

    describe('autoComplete を指定した場合', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <InputText autoComplete="off" />
          </MemoryRouter>
        )
      })

      test('autoComplete 属性が設定されている', () => {
        const input = result.container.querySelector('input')
        expect(input?.autocomplete).toBe('off')
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
            <InputText />
          </MemoryRouter>
        )
      })

      test('inputText クラスが適用されている', () => {
        const inputText = result.container.querySelector('div[class*="inputText"]')
        expect(inputText?.className).toContain('inputText')
      })

      test('inputText_input クラスが input に適用されている', () => {
        const input = result.container.querySelector('input[class*="inputText_input"]')
        expect(input).not.toBe(null)
      })
    })

    describe('カスタムクラス名', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <InputText className="custom-class" />
          </MemoryRouter>
        )
      })

      test('カスタムクラス名が正常に付与されている', () => {
        const inputText = result.container.querySelector('div[class*="inputText"]')
        expect(inputText?.classList.contains('custom-class')).toBe(true)
      })
    })

    describe('エラー状態のスタイル', () => {
      test('errors がある場合、エラークラスが適用されている', () => {
        result = render(
          <MemoryRouter>
            <InputText errors={['エラー']} />
          </MemoryRouter>
        )
        const input = result.container.querySelector('input')
        expect(input?.className).toContain('inputText_input__error')
      })

      test('isError が true の場合、エラークラスが適用されている', () => {
        result = render(
          <MemoryRouter>
            <InputText isError />
          </MemoryRouter>
        )
        const input = result.container.querySelector('input')
        expect(input?.className).toContain('inputText_input__error')
      })

      test('errors も isError もない場合、エラークラスが適用されていない', () => {
        result = render(
          <MemoryRouter>
            <InputText />
          </MemoryRouter>
        )
        const input = result.container.querySelector('input')
        expect(input?.className).not.toContain('inputText_input__error')
      })
    })

    describe('disabled 状態', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <InputText isDisabled />
          </MemoryRouter>
        )
      })

      test('input が disabled になっている', () => {
        const input = result.container.querySelector('input')
        expect(input?.disabled).toBe(true)
      })
    })

    describe('readOnly 状態', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <InputText isReadOnly />
          </MemoryRouter>
        )
      })

      test('input が readOnly になっている', () => {
        const input = result.container.querySelector('input')
        expect(input?.readOnly).toBe(true)
      })
    })

    describe('maxWidth を指定した場合', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <InputText maxWidth={160} />
          </MemoryRouter>
        )
      })

      test('inputText_contents に maxWidth スタイルが設定されている', () => {
        const contents = result.container.querySelector('span[class*="inputText_contents"]')
        expect(contents).not.toBe(null)
        expect((contents as HTMLElement)?.style.maxWidth).toBe('160px')
      })
    })
  })

  //============================================================================
  // 3. 操作 (Operation)
  //============================================================================
  describe('操作 (Operation)', () => {
    describe('onChange', () => {
      test('入力時に onChange が呼ばれる', () => {
        const handleChange = vi.fn()
        result = render(
          <MemoryRouter>
            <InputText value="" onChange={handleChange} />
          </MemoryRouter>
        )
        const input = result.container.querySelector('input')!
        fireEvent.change(input, { target: { value: 'テスト入力' } })
        expect(handleChange).toHaveBeenCalledTimes(1)
        expect(handleChange).toHaveBeenCalledWith(expect.any(Object), 'テスト入力')
      })

      test('onChange が未指定の場合エラーにならない', () => {
        result = render(
          <MemoryRouter>
            <InputText />
          </MemoryRouter>
        )
        const input = result.container.querySelector('input')!
        expect(() => {
          fireEvent.change(input, { target: { value: 'テスト' } })
        }).not.toThrow()
      })
    })

    describe('onBlur', () => {
      test('フォーカスが外れた時に onBlur が呼ばれる', () => {
        const handleBlur = vi.fn()
        result = render(
          <MemoryRouter>
            <InputText onBlur={handleBlur} />
          </MemoryRouter>
        )
        const input = result.container.querySelector('input')!
        fireEvent.blur(input)
        expect(handleBlur).toHaveBeenCalledTimes(1)
      })
    })

    describe('onFocus', () => {
      test('フォーカス時に onFocus が呼ばれる', () => {
        const handleFocus = vi.fn()
        result = render(
          <MemoryRouter>
            <InputText onFocus={handleFocus} />
          </MemoryRouter>
        )
        const input = result.container.querySelector('input')!
        fireEvent.focus(input)
        expect(handleFocus).toHaveBeenCalledTimes(1)
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
