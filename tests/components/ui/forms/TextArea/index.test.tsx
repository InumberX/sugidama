import { render, type RenderResult, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, vi, beforeEach, afterEach, test, expect } from 'vitest'

import { TextArea, type TextAreaProps } from '~/components/ui/forms/TextArea'

describe('TextArea', () => {
  let result: RenderResult

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  //============================================================================
  // 1. 入出力 (Input/Output)
  //============================================================================
  describe('入出力 (Input/Output)', () => {
    describe('基本的なテキストエリア', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <TextArea />
          </MemoryRouter>
        )
      })

      test('textarea 要素が出力されている', () => {
        const textarea = result.container.querySelector('textarea')
        expect(textarea).not.toBe(null)
      })
    })

    describe('placeholder を指定した場合', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <TextArea placeholder="入力してください" />
          </MemoryRouter>
        )
      })

      test('placeholder が設定されている', () => {
        const textarea = result.container.querySelector('textarea')
        expect(textarea?.placeholder).toBe('入力してください')
      })
    })

    describe('helperText を指定した場合', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <TextArea helperText="注釈テキスト" />
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
            <TextArea />
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
            <TextArea errors={['エラー1', 'エラー2']} />
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
      test('inputProps の name が保持される', () => {
        result = render(
          <MemoryRouter>
            <TextArea
              inputProps={
                {
                  key: 'test-key',
                  id: 'test-id',
                  name: 'conform-name',
                  form: 'test-form',
                } as TextAreaProps['inputProps']
              }
            />
          </MemoryRouter>
        )
        const textarea = result.container.querySelector('textarea')
        expect(textarea?.name).toBe('conform-name')
      })

      test('inputProps の id が保持される', () => {
        result = render(
          <MemoryRouter>
            <TextArea
              inputProps={
                {
                  key: 'test-key',
                  id: 'conform-id',
                  name: 'test-name',
                  form: 'test-form',
                } as TextAreaProps['inputProps']
              }
            />
          </MemoryRouter>
        )
        const textarea = result.container.querySelector('textarea')
        expect(textarea?.id).toBe('conform-id')
      })
    })

    describe('maxLength と currentLength を指定した場合', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <TextArea maxLength={100} currentLength={30} />
          </MemoryRouter>
        )
      })

      test('文字数カウンターが出力されている', () => {
        const maxLengthArea = result.container.querySelector('[class*="textAreaMaxLength"]')
        expect(maxLengthArea).not.toBe(null)
        expect(maxLengthArea?.textContent).toContain('30')
        expect(maxLengthArea?.textContent).toContain('100')
      })
    })

    describe('maxLength を指定しない場合', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <TextArea />
          </MemoryRouter>
        )
      })

      test('文字数カウンターが出力されていない', () => {
        const maxLengthArea = result.container.querySelector('[class*="textAreaMaxLength"]')
        expect(maxLengthArea).toBe(null)
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
            <TextArea />
          </MemoryRouter>
        )
      })

      test('textArea クラスが適用されている', () => {
        const textArea = result.container.querySelector('div[class*="textArea"]')
        expect(textArea?.className).toContain('textArea')
      })

      test('textArea_input クラスが textarea に適用されている', () => {
        const textarea = result.container.querySelector('textarea[class*="textArea_input"]')
        expect(textarea).not.toBe(null)
      })
    })

    describe('カスタムクラス名', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <TextArea className="custom-class" />
          </MemoryRouter>
        )
      })

      test('カスタムクラス名が正常に付与されている', () => {
        const textArea = result.container.querySelector('div[class*="textArea"]')
        expect(textArea?.classList.contains('custom-class')).toBe(true)
      })
    })

    describe('エラー状態のスタイル', () => {
      test('errors がある場合、エラークラスが適用されている', () => {
        result = render(
          <MemoryRouter>
            <TextArea errors={['エラー']} />
          </MemoryRouter>
        )
        const textarea = result.container.querySelector('textarea')
        expect(textarea?.className).toContain('textArea_input__error')
      })

      test('isError が true の場合、エラークラスが適用されている', () => {
        result = render(
          <MemoryRouter>
            <TextArea isError />
          </MemoryRouter>
        )
        const textarea = result.container.querySelector('textarea')
        expect(textarea?.className).toContain('textArea_input__error')
      })

      test('errors も isError もない場合、エラークラスが適用されていない', () => {
        result = render(
          <MemoryRouter>
            <TextArea />
          </MemoryRouter>
        )
        const textarea = result.container.querySelector('textarea')
        expect(textarea?.className).not.toContain('textArea_input__error')
      })
    })

    describe('disabled 状態', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <TextArea isDisabled />
          </MemoryRouter>
        )
      })

      test('textarea が disabled になっている', () => {
        const textarea = result.container.querySelector('textarea')
        expect(textarea?.disabled).toBe(true)
      })
    })

    describe('readOnly 状態', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <TextArea isReadOnly />
          </MemoryRouter>
        )
      })

      test('textarea が readOnly になっている', () => {
        const textarea = result.container.querySelector('textarea')
        expect(textarea?.readOnly).toBe(true)
      })
    })

    describe('minHeight を指定した場合', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <TextArea minHeight={200} />
          </MemoryRouter>
        )
      })

      test('textarea に minBlockSize スタイルが設定されている', () => {
        const textarea = result.container.querySelector('textarea') as HTMLTextAreaElement
        expect(textarea?.style.minBlockSize).toBe('200px')
      })
    })

    describe('minHeight のデフォルト値', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <TextArea />
          </MemoryRouter>
        )
      })

      test('デフォルトで minBlockSize が 160px に設定されている', () => {
        const textarea = result.container.querySelector('textarea') as HTMLTextAreaElement
        expect(textarea?.style.minBlockSize).toBe('160px')
      })
    })

    describe('maxHeight を指定した場合', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <TextArea maxHeight={400} />
          </MemoryRouter>
        )
      })

      test('textarea に maxBlockSize スタイルが設定されている', () => {
        const textarea = result.container.querySelector('textarea') as HTMLTextAreaElement
        expect(textarea?.style.maxBlockSize).toBe('400px')
      })
    })

    describe('maxHeight を指定しない場合', () => {
      beforeEach(() => {
        result = render(
          <MemoryRouter>
            <TextArea />
          </MemoryRouter>
        )
      })

      test('maxBlockSize が none に設定されている', () => {
        const textarea = result.container.querySelector('textarea') as HTMLTextAreaElement
        expect(textarea?.style.maxBlockSize).toBe('none')
      })
    })
  })

  //============================================================================
  // 3. 操作 (Operation)
  //============================================================================
  describe.skip('操作 (Operation)', () => {})

  //============================================================================
  // 4. 入力規制 (Validation)
  //============================================================================
  describe.skip('入力規制 (Validation)', () => {})

  //============================================================================
  // 5. その他 (Optional)
  //============================================================================
  describe.skip('その他 (Optional)', () => {})
})
