import type React from 'react'

export type EventTypes = {
  // 一般的な入力フォームのEvent型定義（text, checkbox, radioなど）
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  // input[type="button"]のEvent型定義
  onClick: (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => void
  // buttonタグのEvent型定義
  onClickButton: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>) => void
  // divタグのEvent型定義
  onClickDiv: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  // input[type="text"]のEvent型定義
  onChangeText: (event: React.ChangeEvent<HTMLInputElement>, newValue: string) => void
  // textareaのEvent型定義
  onChangeTextarea: (event: React.ChangeEvent<HTMLTextAreaElement>, newValue: string) => void
  // input[type="checkbox"]のEvent型定義
  onChangeCheckbox: (event: React.ChangeEvent<HTMLInputElement>, newValue: string[]) => void
  // input[type="radio"]のEvent型定義
  onChangeRadio: (event: React.ChangeEvent<HTMLInputElement>, newValue: string) => void
  // selectのEvent型定義
  onChangeSelect: (event: React.ChangeEvent<HTMLSelectElement>, newValue: string) => void
  // editorのEvent型定義
  onChangeEditor: (newValue: string) => void
  // input dateのEvent型定義
  onChangeDate: (newValue: string) => void
  // input date rangeのEvent型定義
  onChangeDateRange: (newValueFrom: string, newValueTo: string) => void
  // input datetimeのEvent型定義
  onChangeDatetime: (newValue: string) => void
  // Keyボード操作のEvent型定義
  onkeypress: (event: React.KeyboardEvent<HTMLInputElement>) => void
  // FocusのEvent型定義
  onFocus: (event: React.FocusEvent<HTMLInputElement>) => void
  // SubmitのEvent型定義
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  // タブボタンのEvent型定義
  onClickTabButton: (
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>,
    newValue: number
  ) => void
  // ドロップ時のEvent型定義
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void
  // ドロップターゲット上のEvent型定義
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void
}
