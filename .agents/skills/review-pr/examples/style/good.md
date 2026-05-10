# Good 例（推奨パターン）

レビュー時の正解例。**多くは既存コード（`BaseButton`、`PrimitiveButton`、`ArticleCard`、`LayoutHeader` 等）からの抜粋**だが、一部はルール説明のために簡略化した擬似コード例を含む（特にハンドラ命名の `SomeComponent` 例など、実コードの構造そのままではないもの）。各セクションに対応する実ファイルがある場合はパスをコメントで明示しているので、そちらも併せて参照すること。

## 1. コンポーネントディレクトリ構造

```
app/components/ui/buttons/BaseButton/
├── index.tsx              # 必須・named export
└── style.css.ts           # 必須・Vanilla Extract
```

- `primitives/<category>/PascalCase/`、`ui/<category>/PascalCase/`、`common/PascalCase/` のいずれかに配置
- カテゴリは複数形 kebab-case（`buttons/`、`cards/`、`paginations/`）
- コンポーネントは PascalCase（`BaseButton/`、`ArticleCard/`）
- エントリは `index.tsx` 固定
- スタイルは `style.css.ts` 固定（`*.module.css` ではない）

## 2. コンポーネント実装（命名・Props・Type）

```tsx
// app/components/ui/buttons/BaseButton/index.tsx
import { type ReactNode, useMemo } from 'react'

import * as styles from './style.css'

import { PrimitiveButton, type PrimitiveButtonProps } from '~/components/primitives/buttons/PrimitiveButton'

export type BaseButtonProps = PrimitiveButtonProps & {
  size?: 'large' | 'medium' | 'small'
  variant?: 'contained' | 'outlined'
  color?: 'primary'
  leftElm?: ReactNode
  rightElm?: ReactNode
  children?: ReactNode
}

export const BaseButton = ({
  isDisabled,
  className,
  children,
  leftElm,
  rightElm,
  size = 'medium',
  variant = 'contained',
  color = 'primary',
  ...props
}: BaseButtonProps) => {
  const baseButtonClassName = useMemo(() => {
    return [
      styles.baseButton,
      isDisabled && styles.baseButton__disabled,
      className,
      styles[`baseButton__${size}`],
      styles[`baseButton__${variant}`],
      styles[`baseButton__${color}`],
    ]
      .filter(Boolean)
      .join(' ')
  }, [isDisabled, className, size, variant, color])

  return (
    <PrimitiveButton {...props} className={baseButtonClassName} isDisabled={isDisabled}>
      <span className={styles.baseButton_container}>
        {leftElm}
        <span className={styles.baseButton_text}>{children}</span>
        {rightElm}
      </span>
    </PrimitiveButton>
  )
}
```

ポイント:
- `export type BaseButtonProps`（コンポーネント名 + `Props`）
- `type` を使う（`interface` ではない）
- 共通 Props は `PrimitiveButtonProps` を交差型で再利用
- boolean Props に `is*` プレフィックス: `isDisabled`
- ReactNode スロットに `*Elm` サフィックス: `leftElm`、`rightElm`
- 名前付きエクスポート（`export default` ではない）
- インポート順序: 外部 → 同階層スタイル → プロジェクト内（`~/`）

## 3. ローカル Props 型（同一ファイル内のみで使う）

```tsx
// app/components/common/LayoutHeader/index.tsx
type Props = {
  className?: string
  isLogoTitle?: boolean
  lang: string
}

export const LayoutHeader = ({ className, isLogoTitle, lang }: Props) => {
  // ...
}
```

ポイント:
- 1 ファイル内でしか使わない Props は `type Props = { ... }` で OK（export 不要）
- boolean Props は `is*`（`isLogoTitle`）

## 4. PrimitiveButton（共通型の活用）

```tsx
// app/components/primitives/buttons/PrimitiveButton/index.tsx
import { type AriaRole, type AriaAttributes, type ReactNode, useMemo } from 'react'
import { Link } from 'react-router'

import * as styles from './style.css'

import type { EventTypes } from '~/types/event'
import type { ButtonType, AnchorTarget, AnchorRel } from '~/types/html'

export type PrimitiveButtonProps = {
  url?: string
  target?: AnchorTarget
  rel?: AnchorRel
  buttonType?: ButtonType
  isDisabled?: boolean
  className?: string
  children?: ReactNode
  onClick?: EventTypes['onClickButton']
  // ...
}
```

ポイント:
- 共通イベント型を `~/types/event` の `EventTypes` から取得（独自に書かない）
- 共通 HTML 属性型を `~/types/html` から取得（`AnchorTarget`、`AnchorRel`、`ButtonType`）

## 5. Vanilla Extract（camelCase + BEM 風 + @layer）

```ts
// app/components/ui/buttons/BaseButton/style.css.ts
import { style } from '@vanilla-extract/css'

import { getMediaQuery } from '~/styles/mixins/mediaQuery.css'
import { getClampPx } from '~/styles/mixins/size.css'
import { getTransition } from '~/styles/mixins/transition.css'
import { cssVariables } from '~/styles/variables/cssVariables.css'
import { fontLargeBold, fontMediumBold, fontSmallBold } from '~/styles/variables/font.css'
import { cssLayerComponentUiLow } from '~/styles/variables/layers.css'

// Modifier（block + __ + modifier）
export const baseButton__disabled = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      cursor: 'not-allowed',
      opacity: cssVariables.opacity.disabled,
      pointerEvents: 'none',
    },
  },
})

export const baseButton__medium = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      ...fontMediumBold,
      paddingBlock: 14,
      paddingInline: getClampPx(20, 48),
    },
  },
})

export const baseButton__contained = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      borderBlock: 'none',
      borderInline: 'none',

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

// ベース block
export const baseButton = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      alignItems: 'center',
      blockSize: 'auto',
      borderRadius: 'calc(infinity * 1px)',
      display: 'inline-flex',
      inlineSize: 'auto',
      justifyContent: 'center',
      position: 'relative',
      textAlign: 'start',
    },
  },
})

// Element（block + _ + element）
export const baseButton_container = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center',
      position: 'relative',
      zIndex: 3,
    },
  },
})

export const baseButton_text = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      display: 'block',
    },
  },
})
```

ポイント:
- 全て `@layer` で囲む（配置場所に応じたレイヤー定数を使う）
- ベース block: camelCase（`baseButton`）
- Element: シングルアンダースコア（`baseButton_text`、`baseButton_container`）
- Modifier: ダブルアンダースコア（`baseButton__disabled`、`baseButton__medium`、`baseButton__contained`）
- 論理プロパティ（`blockSize`、`inlineSize`、`paddingBlock`、`paddingInline`、`borderBlock`、`borderInline`、`textAlign: 'start'`）
- カラーは `cssVariables.color.*.hex` 経由
- フォントは `fontMediumBold` 等のプリセットをスプレッド
- 流体型値は `getClampPx` / `getClampRem` で
- `:hover` は `getMediaQuery('hover')` 内
- インポートは外部 → 同階層 → `~/` の順

## 6. サブブロックの切り出し

`ArticleCard` は内部に複数の独立した塊（タイトル、説明、サムネイル、タグ）を持つため、サブブロックとして別の camelCase ブロックに分けている:

```ts
// app/components/ui/cards/ArticleCard/style.css.ts
export const articleCard = style({ /* メイン */ })

// 独立した塊はサブブロックに
export const articleCardTitle = style({ /* ... */ })
export const articleCardTitle_text = style({ /* ... */ })

export const articleCardDescription = style({ /* ... */ })
export const articleCardDescription_container = style({ /* ... */ })
export const articleCardDescription_text = style({ /* ... */ })

export const articleCardTags = style({ /* ... */ })

export const articleCardThumbnail = style({ /* ... */ })
export const articleCardThumbnail_container = style({ /* ... */ })
export const articleCardThumbnail_contents = style({ /* ... */ })
export const articleCardThumbnail_image = style({ /* ... */ })
```

「Element の Element」を書きたくなったら、サブブロックに分割する合図。

## 7. Modifier の TS 側での扱い

```tsx
const baseButtonClassName = useMemo(() => {
  return [
    styles.baseButton,
    isDisabled && styles.baseButton__disabled,
    className,
    styles[`baseButton__${size}`],
    styles[`baseButton__${variant}`],
  ]
    .filter(Boolean)
    .join(' ')
}, [isDisabled, className, size, variant])
```

- ベースクラスは `styles.baseButton`（プロパティアクセス）
- 動的 Modifier は `styles[\`baseButton__${size}\`]`（テンプレートリテラルキー）
- 配列 + `filter(Boolean).join(' ')` で結合（`clsx` は使わない）

## 8. ホバー処理（CSS 側で `articleCard_clickable` を使った例）

```ts
export const articleCardTitle_text = style({
  '@layer': {
    [cssLayerComponentUiLow]: {
      // ...
      transition: getTransition([{ property: 'color' }]),

      '@media': {
        [getMediaQuery('hover')]: {
          selectors: {
            [`&:where(${articleCard}:has(${articleCard_clickable}:hover) &)`]: {
              color: cssVariables.color.font.primary.hex,
            },
          },
        },
      },
    },
  },
})
```

`getMediaQuery('hover')` で囲み、Vanilla Extract の `selectors` でテンプレートリテラルから他クラス参照を組み立てる。

## 9. ハンドラ命名（on* / handle*）

```tsx
// Props 名は on*
type Props = {
  onChangePage: (newPage: number) => void
}

export const SomeComponent = ({ onChangePage }: Props) => {
  // 渡すローカル関数は handle*
  const handleClickItem = (page: number) => {
    onChangePage(page)
  }

  return <button onClick={() => handleClickItem(1)}>...</button>
}
```

## 10. ファイル / ディレクトリ命名

```
app/hooks/usePaginationScroll.ts          # camelCase + use プレフィックス
app/utils/article.ts                      # 単語1つは素朴に
app/utils/date.ts
app/utils/scroll.ts
app/utils/custom-error-message.ts         # 複合語は kebab-case でも OK
app/utils/loader-guards.server.ts         # サーバー専用は .server.ts
app/utils/gtags.client.ts                 # クライアント専用は .client.ts
app/server/api/drinks.server.ts           # API 呼び出し
app/types/event.d.ts                      # 共通型
app/types/html.d.ts
app/config/env.ts
app/config/paths.ts
app/config/consts.ts
```

## 11. 共通コンポーネント vs UI コンポーネント vs Primitives

```
app/components/primitives/buttons/PrimitiveButton/   # HTML をラップした建材

app/components/common/LayoutHeader/                  # サイト全体で1つ→ common
app/components/common/LayoutFooter/
app/components/common/LayoutPortal/

app/components/ui/buttons/BaseButton/                # 再利用→ ui/<category>
app/components/ui/buttons/SvgIconCircleButton/
app/components/ui/buttons/TextButton/
app/components/ui/cards/ArticleCard/
app/components/ui/cards/ArticleCompactCard/
app/components/ui/paginations/BasePagination/
```

## 12. ルートファイル（React Router v7）

```tsx
// app/routes/($lang)._public._layout._index/route.tsx
import type { Route } from './+types/route'
import * as styles from './style.css'

export const meta: MetaFunction = (args) => getMetadata({ args })

export async function loader(args: Route.LoaderArgs) {
  // ...
}

export default function PageSG10_100({ loaderData }: Route.ComponentProps) {
  // ...
}
```

ポイント:
- ディレクトリ名は flatRoutes 規約（`($lang)._public._layout._index/`）
- エントリは `route.tsx`
- 型は `./+types/route` から取得（`Route.LoaderArgs`、`Route.ComponentProps`）
- ページコンポーネントは `export default`（ルート規約のため例外的に許可）
- ページコンポーネントの関数名は PascalCase（既存例: `PageSG10_100`）
