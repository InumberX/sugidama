# Bad 例（アンチパターン）

レビューで指摘すべき典型例と、対応する Good への修正方針。

## 1. ❌ コンポーネントディレクトリ命名

```
# Bad
app/components/ui/button/base-button/index.tsx
app/components/ui/Buttons/BaseButton/index.tsx
app/components/ui/buttons/baseButton/index.tsx
app/components/ui/BaseButton/index.tsx          # ui/ 直下にカテゴリなし
```

**問題**: カテゴリが単数形 / PascalCase、コンポーネントが kebab-case / camelCase、ui/ 直下に置いている。

```
# Good
app/components/ui/buttons/BaseButton/index.tsx
```

参照: `rules/style/structure.md` ui/ 配下のカテゴリ分割

## 2. ❌ コンポーネントエントリ／スタイルファイル名

```
# Bad
app/components/ui/buttons/BaseButton/BaseButton.tsx
app/components/ui/buttons/BaseButton/Component.tsx
app/components/ui/buttons/BaseButton/index.module.css   # CSS Modules ではない
app/components/ui/buttons/BaseButton/styles.css.ts
```

```
# Good
app/components/ui/buttons/BaseButton/index.tsx
app/components/ui/buttons/BaseButton/style.css.ts
```

参照: `rules/style/structure.md` コンポーネントディレクトリの構造

## 3. ❌ Props 型の命名

```tsx
// Bad
export type ButtonProps = { /* ... */ }       // コンポーネント名と乖離
export interface BaseButtonProps { /* ... */ } // interface
```

**問題**: 1 つ目は `BaseButton` というコンポーネント名と一致しない。2 つ目は `interface`（本プロジェクトは `type` で統一）。

```tsx
// Good
export type BaseButtonProps = { /* ... */ }
```

参照: `rules/style/naming.md` Props 型

## 4. ❌ boolean Props に `is*` がない

```tsx
// Bad
type Props = {
  disabled?: boolean
  logoTitle?: boolean
  external?: boolean
}
```

```tsx
// Good
type Props = {
  isDisabled?: boolean
  isLogoTitle?: boolean
  isExternal?: boolean
}

// 内部で HTML 属性に渡すときに展開
<button disabled={isDisabled} />
```

参照: `rules/style/naming.md` Props の命名

## 5. ❌ Vanilla Extract のエクスポート命名

```ts
// Bad — PascalCase は CSS Modules 風で本プロジェクトの慣例外
export const BaseButton = style({ /* ... */ })
export const BaseButton__text = style({ /* ... */ })

// Bad — Element に __ を 2 つ使う（Modifier と区別がつかない）
export const baseButton__text = style({ /* ... */ })
export const baseButton__container = style({ /* ... */ })

// Bad — Modifier に _ を 1 つ使う（Element と区別がつかない）
export const baseButton_disabled = style({ /* ... */ })
export const baseButton_large = style({ /* ... */ })

// Bad — Modifier を独立ブロックにする
export const baseButtonRightArrow = style({ /* ... */ })
export const baseButtonDisabled = style({ /* ... */ })
```

```ts
// Good
export const baseButton = style({ /* ... */ })           // ベース block
export const baseButton_text = style({ /* ... */ })       // Element（_ 1つ）
export const baseButton_container = style({ /* ... */ })  // Element
export const baseButton__disabled = style({ /* ... */ })  // Modifier（__ 2つ）
export const baseButton__large = style({ /* ... */ })     // Modifier
export const baseButton__contained = style({ /* ... */ }) // Modifier
```

参照: `rules/style/css.md` エクスポート命名

## 6. ❌ `@layer` の指定漏れ・誤り

```ts
// Bad — レイヤー指定なしの裸 style
export const baseButton = style({
  display: 'inline-flex',
  alignItems: 'center',
})
```

```ts
// Bad — 配置場所と合わないレイヤー
// app/components/ui/buttons/BaseButton/style.css.ts に Common を使うのは誤り
export const baseButton = style({
  '@layer': {
    [cssLayerComponentCommon]: { /* ... */ },
  },
})
```

```ts
// Bad — primitives/ 配下なのに UiLow を使う
// app/components/primitives/buttons/PrimitiveButton/style.css.ts
export const primitiveButton = style({
  '@layer': {
    [cssLayerComponentUiLow]: { /* ... */ },
  },
})
```

```ts
// Good
import { cssLayerComponentUiLow } from '~/styles/variables/layers.css'

export const baseButton = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      display: 'inline-flex',
      alignItems: 'center',
    },
  },
})
```

定義済みレイヤー定数: `cssLayerReset`、`cssLayerComponentUiPrimitive`、`cssLayerComponentUiLow`、`cssLayerComponentUiMiddle`、`cssLayerComponentUiHigh`、`cssLayerComponentCommon`、`cssLayerComponentPage`、`cssLayerUtils`

参照: `rules/style/css.md` カスケードレイヤー

## 7. ❌ 物理プロパティの直書き

```ts
// Bad
export const baseButton = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      width: '100%',
      height: 48,
      paddingTop: 12,
      paddingBottom: 12,
      paddingLeft: 16,
      paddingRight: 16,
      marginTop: 8,
      marginLeft: 16,
      top: 0,
      left: 0,
      borderLeft: '1px solid',
    },
  },
})
```

```ts
// Good
export const baseButton = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      inlineSize: '100%',
      blockSize: 48,
      paddingBlock: 12,
      paddingInline: 16,
      marginBlockStart: 8,
      marginInlineStart: 16,
      insetBlockStart: 0,
      insetInlineStart: 0,
      borderInlineStart: '1px solid',
    },
  },
})
```

参照: `rules/style/css.md` 論理プロパティ

## 8. ❌ リテラル値の直書き

```ts
// Bad
export const baseButton = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      color: '#fff',
      backgroundColor: '#a2beed',
      fontWeight: 700,
      fontSize: 16,
      opacity: 0.4,
    },
  },
})
```

```ts
// Good
import { cssVariables } from '~/styles/variables/cssVariables.css'
import { fontMediumBold } from '~/styles/variables/font.css'

export const baseButton = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      ...fontMediumBold,
      color: cssVariables.color.font.light.hex,
      backgroundColor: cssVariables.color.background.primary.hex,
      opacity: cssVariables.opacity.disabled,
    },
  },
})
```

参照: `rules/style/css.md` CSS 変数 / Mixin

## 9. ❌ ホバーが `getMediaQuery('hover')` 外

```ts
// Bad — タッチデバイスで誤発火
export const baseButton = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      selectors: {
        '&:hover': {
          opacity: 0.6,
        },
      },
    },
  },
})
```

```ts
// Good
import { getMediaQuery } from '~/styles/mixins/mediaQuery.css'

export const baseButton = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      '@media': {
        [getMediaQuery('hover')]: {
          selectors: {
            '&:hover': {
              opacity: 0.6,
            },
          },
        },
      },
    },
  },
})
```

参照: `rules/style/css.md` ホバーは `getMediaQuery('hover')` でラップ

## 10. ❌ メディアクエリの直書き

```ts
// Bad
'@media': {
  '(any-hover: hover)': {
    selectors: { '&:hover': { /* ... */ } },
  },
  '(min-width: 768px)': {
    fontSize: 18,
  },
}
```

```ts
// Good
import { getMediaQuery } from '~/styles/mixins/mediaQuery.css'

'@media': {
  [getMediaQuery('hover')]: {
    selectors: { '&:hover': { /* ... */ } },
  },
  [getMediaQuery('md')]: {  // BREAKPOINTS のキーで指定
    fontSize: 18,
  },
}
```

参照: `rules/style/css.md` メディアクエリ

## 11. ❌ `clsx` の使用

```tsx
// Bad — 既存コードに合わない
import clsx from 'clsx'

className={clsx(
  styles.baseButton,
  isDisabled && styles.baseButton__disabled,
  className,
)}
```

```tsx
// Good — 既存パターン
className={[
  styles.baseButton,
  isDisabled && styles.baseButton__disabled,
  className,
]
  .filter(Boolean)
  .join(' ')}
```

参照: `rules/style/css.md` TS 側でのクラス結合

## 12. ❌ ファイル命名

```
# Bad — hook が kebab-case / PascalCase
app/hooks/use-pagination-scroll.ts
app/hooks/UsePaginationScroll.ts

# Bad — サーバー専用なのに .server.ts サフィックスがない
app/server/api/drinks.ts

# Bad — クライアント専用なのに .client.ts サフィックスがない
app/utils/gtags.ts
```

```
# Good
app/hooks/usePaginationScroll.ts
app/server/api/drinks.server.ts
app/utils/gtags.client.ts
```

参照: `rules/style/naming.md` ファイル / ディレクトリ命名、`rules/style/structure.md` サーバー / クライアント分離

## 13. ❌ 配置場所の取り違え

```
# Bad — 1度しか使わないレイアウト系を ui/ へ
app/components/ui/layouts/SiteHeader/

# Bad — 再利用するボタンを common/ へ
app/components/common/PrimaryButton/

# Bad — HTML 要素を最小限ラップした建材を ui/ へ
app/components/ui/buttons/PrimitiveButton/
```

```
# Good
app/components/common/LayoutHeader/                    # 1度しか使わない→ common
app/components/ui/buttons/BaseButton/                  # 再利用→ ui/<category>/
app/components/primitives/buttons/PrimitiveButton/     # 建材→ primitives/<category>/
```

参照: `rules/style/structure.md` components の 3 階層

## 14. ❌ コンポーネントの `export default`

```tsx
// Bad
const BaseButton = (props: BaseButtonProps) => { /* ... */ }
export default BaseButton
```

```tsx
// Good
export const BaseButton = ({ /* ... */ }: BaseButtonProps) => { /* ... */ }
```

ただし以下は React Router v7 の規約により `export default` が **必須**。指摘対象外:

- `app/routes/**/route.tsx` のページコンポーネント
- `app/entry.client.tsx`、`app/entry.server.tsx`、`app/root.tsx`

参照: `rules/style/structure.md` 名前付きエクスポート

## 15. ❌ パスエイリアスの誤用

```tsx
// Bad — このプロジェクトには存在しないエイリアス
import { BaseButton } from '@/components/ui/buttons/BaseButton'
import { BaseButton } from '@components/buttons/BaseButton'

// Bad — 相対パスで深く辿る
import { BaseButton } from '../../../components/ui/buttons/BaseButton'
```

```tsx
// Good — `~/` のみ使う
import { BaseButton } from '~/components/ui/buttons/BaseButton'
```

参照: `rules/style/structure.md` パスエイリアス

## 16. ❌ 共通型を再定義

```tsx
// Bad — 既に EventTypes['onClickButton'] に定義されているものを毎回書く
type Props = {
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void
}
```

```tsx
// Good
import type { EventTypes } from '~/types/event'

type Props = {
  onClick?: EventTypes['onClickButton']
}
```

```tsx
// Bad — HTML 属性型を独自に定義
type Props = {
  target?: '_self' | '_blank' | '_parent' | '_top'
  buttonType?: 'button' | 'submit' | 'reset'
}
```

```tsx
// Good
import type { AnchorTarget, ButtonType } from '~/types/html'

type Props = {
  target?: AnchorTarget
  buttonType?: ButtonType
}
```

参照: `rules/style/naming.md` 型 / 列挙

## 17. ❌ ハンドラ Props の命名

```tsx
// Bad — Props 名が handle*
type Props = {
  handleChangePage: (newPage: number) => void
  handleClick: () => void
}
```

```tsx
// Good — Props は on*、ローカル関数が handle*
type Props = {
  onChangePage: (newPage: number) => void
  onClick: () => void
}

// 呼び出し側でローカル関数を handle* で書いて渡す
const handleChangePage = (page: number) => { /* ... */ }
<BasePagination onChangePage={handleChangePage} />
```

参照: `rules/style/naming.md` 変数 / 関数

## 18. ❌ ルート規約から外れたファイル配置

```
# Bad — ルートファイル名が route.tsx ではない
app/routes/($lang)._public._layout._index/index.tsx
app/routes/($lang)._public._layout._index/page.tsx

# Bad — flatRoutes 規約に従わないディレクトリ名
app/routes/home/index.tsx
app/routes/drinks/[id].tsx
```

```
# Good
app/routes/($lang)._public._layout._index/route.tsx
app/routes/($lang)._public._layout.drinks._index/route.tsx
app/routes/($lang)._public._layout.drinks.$drinkId._index/route.tsx
```

参照: `rules/style/structure.md` ルートファイルの配置
