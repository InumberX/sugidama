# CSS規約（Vanilla Extract）

`*.css.ts` ファイル（Vanilla Extract）に対する規約。`oxlint`/`oxfmt` で機械的に検出できないルール（とくにエクスポート命名と `@layer` 配置）を中心に列挙する。

## エクスポート命名（camelCase + BEM 風ハイブリッド）

本プロジェクトは **Vanilla Extract** で `style({...})` の戻り値を `export const` するため、JS 識別子の制約から **クラス名は camelCase**。ただし内部に **BEM 風の構造** を持たせている。

| 役割 | 形式 | 例 |
|---|---|---|
| ベースブロック | **camelCase**（コンポーネント名と一致、先頭小文字） | `baseButton`、`articleCard`、`layoutHeader`、`primitiveButton` |
| 要素（Element） | `block_camelCase`（**シングルアンダースコア**） | `baseButton_text`、`baseButton_container`、`articleCardTitle_text`、`layoutHeader_wrapper` |
| 修飾子（Modifier） | `block__camelCase`（**ダブルアンダースコア**） | `baseButton__disabled`、`baseButton__large`、`baseButton__contained`、`baseButton__primary`、`layoutHeaderBar__top` |
| サブブロック | 別の camelCase ブロック（独立した塊） | `articleCardTitle`、`articleCardThumbnail`、`articleCardTags`、`layoutHeaderMenuGlobal`、`layoutHeaderLogo` |
| サブブロックの要素 | `subBlock_camelCase` | `articleCardThumbnail_image`、`layoutHeaderLogo_title`、`layoutHeaderMenuGlobal_navigation` |

> **注意**: 既存コードの中には `articleCardTitle_text` のように「サブブロック + 要素」を 1 階層で書く例が多い。**「Element の Element」を書きたくなったらサブブロックに切る**のが本プロジェクトの判断軸。

### サブブロックを切る目安

ひとつのコンポーネント内で論理的に独立したまとまりがある場合は、`block_sub_xxx` のような深いネストにせず、**新しい camelCase ブロックに分ける**。例えば `ArticleCard` 内のタイトル、説明、サムネイル、タグはそれぞれ独立したサブブロック（`articleCardTitle`、`articleCardDescription`、`articleCardThumbnail`、`articleCardTags`）として記述する。

判断基準:
- 「Element の Element」を書きたくなったら、サブブロックに切る合図
- そのまとまりが他のコンポーネントから視覚的に独立した塊として見えるか

### Modifier の使い方

修飾子は **ベースクラスと組み合わせて指定**する。Vanilla Extract ではテンプレートリテラルで参照する:

```ts
// Good — TS 側で組み合わせ
export const baseButton = ({ isDisabled, size = 'medium', variant = 'contained' }) => {
  return [
    styles.baseButton,
    isDisabled && styles.baseButton__disabled,
    styles[`baseButton__${size}`],
    styles[`baseButton__${variant}`],
  ].filter(Boolean).join(' ')
}
```

```ts
// Good — Modifier の有無で挙動が変わる場合は CSS 側でセレクタ結合
export const baseButton__primary = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      selectors: {
        [`&${baseButton__contained}`]: {
          backgroundColor: 'transparent',
          color: cssVariables.color.font.light.hex,
        },
      },
    },
  },
})
```

## カスケードレイヤー（@layer）

`app/styles/variables/layers.css.ts` で以下の順序で定義済み（後に書かれたものが優先される）:

```
reset → componentUiPrimitive → componentUiLow → componentUiMiddle → componentUiHigh → componentCommon → componentPage → utils
```

エクスポート定数:

| 定数 | 用途 |
|---|---|
| `cssLayerReset` | リセット CSS |
| `cssLayerComponentUiPrimitive` | `app/components/primitives/` 配下 |
| `cssLayerComponentUiLow` | `app/components/ui/` 配下のシンプルな UI（buttons、tags、icons、typographies、簡素な cards） |
| `cssLayerComponentUiMiddle` | `app/components/ui/` 配下で他の low コンポーネントを使う中位レイヤー（lists、複合的な cards、forms 等） |
| `cssLayerComponentUiHigh` | `app/components/ui/` 配下の高位コンポーネント（layouts 等、上位構造を提供するもの） |
| `cssLayerComponentCommon` | `app/components/common/` 配下（`LayoutHeader`、`LayoutFooter`、`LayoutPortal`） |
| `cssLayerComponentPage` | `app/routes/**/style.css.ts`（ページ固有スタイル） |
| `cssLayerUtils` | 補助的な utility |

### コンポーネントの `style.css.ts` は **必ず `@layer` で囲む**

Vanilla Extract では `style({ '@layer': { [layerVar]: { ...rules } } })` の形で書く:

```ts
// Good — 必ず @layer で囲む
export const baseButton = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      display: 'inline-flex',
      alignItems: 'center',
    },
  },
})
```

```ts
// Bad — レイヤー指定なしの裸ルール
export const baseButton = style({
  display: 'inline-flex',
  alignItems: 'center',
})
```

```ts
// Bad — 配置場所と合わないレイヤー
// app/components/ui/buttons/BaseButton/style.css.ts に componentCommon を使うのは誤り
export const baseButton = style({
  '@layer': {
    [cssLayerComponentCommon]: { ... },
  },
})
```

## 論理プロパティ（Logical Properties）の徹底

本プロジェクトは将来的なロケール拡張・縦書き対応を見据え、**物理プロパティではなく論理プロパティを使う**。

| 物理（NG） | 論理（OK） |
|---|---|
| `width` | `inlineSize` |
| `height` | `blockSize` |
| `paddingTop` / `paddingBottom` | `paddingBlock` / `paddingBlockStart` / `paddingBlockEnd` |
| `paddingLeft` / `paddingRight` | `paddingInline` / `paddingInlineStart` / `paddingInlineEnd` |
| `marginTop` / `marginBottom` | `marginBlock` / `marginBlockStart` / `marginBlockEnd` |
| `marginLeft` / `marginRight` | `marginInline` / `marginInlineStart` / `marginInlineEnd` |
| `top` / `bottom` | `insetBlockStart` / `insetBlockEnd` |
| `left` / `right` | `insetInlineStart` / `insetInlineEnd` |
| `borderTop` / `borderBottom` | `borderBlock` / `borderBlockStart` / `borderBlockEnd` |
| `borderLeft` / `borderRight` | `borderInline` / `borderInlineStart` / `borderInlineEnd` |

例外: `transform`、`backgroundPosition`、`gridTemplateAreas` 等は物理座標が前提。`textAlign: 'start' / 'end'` は論理側を使う（`left` / `right` を避ける）。

## CSS 変数 / Mixin

### 色・フォント・余白のリテラル直書きは避ける

CSS 変数は `app/styles/variables/cssVariables.css.ts` で `createGlobalTheme` 経由で定義され、`cssVariables.*` で参照できる:

```ts
// Good
import { cssVariables } from '~/styles/variables/cssVariables.css'

export const baseButton = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      color: cssVariables.color.font.light.hex,
      backgroundColor: cssVariables.color.background.primary.hex,
      fontWeight: cssVariables.font.weight.bold,
      opacity: cssVariables.opacity.disabled,
    },
  },
})
```

```ts
// Bad — リテラル色や 700 などのマジックナンバーをコンポーネントから直接記述
export const baseButton = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      color: '#fff',
      backgroundColor: '#a2beed',
      fontWeight: 700,
      opacity: 0.4,
    },
  },
})
```

利用可能なトークン（`cssVariables.*`）:
- `color.font.*`、`color.background.*`、`color.border.*`、`color.gradation.*`、`color.util.*`、`color.skeleton.*`（各キーに `.hex` と `.rgb`）
- `font.family.main`、`font.weight.{medium,bold}`
- `opacity.{hover,disabled}`
- `layout.inner.{width,padding,maxWidth}`
- `scale.hover`
- `zIndex.header.{wrapper,global,bar}`
- `leadingTrim`

### 共通フォントプリセットを使う

`app/styles/variables/font.css.ts` に `StyleRule` として用意されたプリセットをスプレッドで適用する:

```ts
import { fontMediumBold, fontLargeBold, fontCaption } from '~/styles/variables/font.css'

export const articleCardTitle_text = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      ...fontMediumBold,
      // 個別調整があれば続けて記述
    },
  },
})
```

利用可能なプリセット: `fontHeading1`〜`fontHeading4`、`fontMaximumBold`、`fontLarge` / `fontLargeBold`、`fontMedium` / `fontMediumBold`、`fontSmall` / `fontSmallBold`、`fontCaption` / `fontCaptionBold`、`fontMinimum` / `fontMinimumBold`。

### Mixin 関数

`app/styles/mixins/` の関数を活用する:

| Mixin | 用途 |
|---|---|
| `getClampPx(min, max)` | 流体型の px 値（`paddingInline`、`gap` 等） |
| `getClampRem(min, max)` | 流体型の rem 値（`fontSize` 等） |
| `getFontSize(px)` | 固定 px → rem 換算 |
| `getMediaQuery('hover' \| 'print' \| breakpointKey)` | カスタムメディアクエリ生成 |
| `getMediaQueryReverse(breakpointKey)` | 逆方向のメディアクエリ |
| `getContainerQuery(breakpointKey)` / `getContainerQueryReverse` | コンテナクエリ |
| `getTransition([{ property: '...' }])` | トランジション生成 |
| `getLineClamp(n)` | n 行クランプ |

固定ピクセル値の `fontSize: 16` 直書きが見えたら、`fontMediumBold` 等のプリセットや `getClampRem` で置き換えられないか確認する。

## メディアクエリ

`getMediaQuery()` を経由して書く:

```ts
// Good
'@media': {
  [getMediaQuery('hover')]: {
    selectors: {
      '&:hover': { ... },
    },
  },
}
```

`@media (any-hover: hover)` を直書きしない。

## ホバーは `getMediaQuery('hover')` でラップ

タッチデバイスでのホバー誤発火を防ぐため、`:hover` は必ず `getMediaQuery('hover')` 経由のメディアクエリ内に書く。

```ts
// Good
export const baseButton__contained = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      '@media': {
        [getMediaQuery('hover')]: {
          selectors: {
            '&:hover:before': {
              opacity: 0,
            },
          },
        },
      },
    },
  },
})
```

```ts
// Bad — タッチデバイスで誤発火
export const baseButton__contained = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      selectors: {
        '&:hover:before': {
          opacity: 0,
        },
      },
    },
  },
})
```

## TS 側でのクラス結合

`clsx` は使わず、配列 + `filter(Boolean).join(' ')` で結合するのが既存パターン:

```tsx
// Good — 既存スタイル
const baseButtonClassName = useMemo(() => {
  return [
    styles.baseButton,
    isDisabled && styles.baseButton__disabled,
    className,
    styles[`baseButton__${size}`],
    styles[`baseButton__${variant}`],
  ].filter(Boolean).join(' ')
}, [isDisabled, className, size, variant])
```

- ベース・要素は `styles.baseButton`（プロパティアクセス）
- 動的 Modifier は `styles[\`baseButton__${size}\`]`（テンプレートリテラルキー）
- `isDisabled && styles.baseButton__disabled` で条件付き結合

## アンチパターン（指摘対象）

- ❌ エクスポート名が PascalCase（`.BaseButton` のような CSS Modules 風命名）→ `baseButton`
- ❌ Element を ` __` 2 つで区切る（`baseButton__text`）→ Modifier と区別がつかなくなる。Element は `_` 1 つ
- ❌ Modifier を `_` 1 つで書く（`baseButton_disabled`）や 別ブロックとして書く（`baseButtonDisabled`）→ `__camelCase`
- ❌ `@layer` で囲まれていない裸の `style({...})`
- ❌ 配置と合わないレイヤー（`primitives/` で `cssLayerComponentUiLow` を使う等）
- ❌ 物理プロパティ（`width`、`paddingLeft`、`marginTop`、`top`、`left`）の使用
- ❌ リテラルカラー（`#fff`、`rgb(255, 0, 0)`）の直書き → `cssVariables.color.*.hex` を使う
- ❌ マジックナンバーの font-weight（`fontWeight: 700`）→ `cssVariables.font.weight.bold`
- ❌ 固定 `fontSize: 16` 直書き → `fontMediumBold` 等のプリセット、または `getClampRem`／`getFontSize`
- ❌ `:hover` が `getMediaQuery('hover')` 外にある
- ❌ `@media (any-hover: hover)` の直書き（`getMediaQuery('hover')` を使う）
- ❌ `clsx` の使用（既存は配列 + `filter(Boolean).join(' ')`）
