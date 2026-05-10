# 命名規約（TypeScript / React）

`app/` 配下のフロントエンドコードに適用する命名ルール。oxlint・oxfmt で機械的に検出できないものを中心に列挙する。

## コンポーネント

- **コンポーネント名は PascalCase**（例: `BaseButton`、`ArticleCard`、`LayoutHeader`、`PrimitiveButton`）
- **エクスポート名とディレクトリ名を一致させる**（`buttons/BaseButton/index.tsx` → `export const BaseButton`）
- **`common/` 配下のレイアウト系には `Layout` プレフィックスを付ける**（`LayoutHeader`、`LayoutFooter`、`LayoutPortal`）
- **`primitives/` 配下には `Primitive` プレフィックスを付ける**（`PrimitiveButton`）
- **`ui/` 配下では機能ベースの命名**（`BaseButton`、`SvgIconCircleButton`、`ArticleCard`、`SvgIcon`、`BasePagination`）
- **同じファイル内のサブコンポーネントは親コンポーネント名をプレフィックスに付けて衝突を避ける**（`ArticleCard` 内の `ArticleCardTitle`、`ArticleCardThumbnail` 等）

## Props 型

既存コードには 2 つの命名パターンが共存しており、**Props 型を export するか否かで使い分ける**:

- **export して他ファイルから参照する場合**: **`<ComponentName>Props`** で命名し `export type` する
  - 例: `export type BaseButtonProps`、`export type ArticleCardProps`、`export type PrimitiveButtonProps`
  - 主に `components/primitives/`・`components/ui/` 配下の汎用部品で、他のコンポーネントやページから利用する型
- **同一ファイル内でのみ使用するローカル Props 型**: **`type Props = { ... }`** で OK（export しない）
  - 例: `app/components/common/LayoutHeader/index.tsx`、ルートモジュール内の小さなサブコンポーネント等
  - ファイル内で 1 度しか使わない Props 型をわざわざ `<ComponentName>Props` 命名する必要はない
- **同ファイル内にサブ型がある場合は短い型名で OK**（例: `ArticleCard/index.tsx` 内の `TitleProps`・`DescriptionProps`・`ThumbnailProps`）。サブ型は非 export でよい
- **`type` を使う**（`interface` ではなく `type`。`typescript/no-explicit-any` で `any` も禁止）

## Props の命名

- **camelCase で統一**
- **boolean Props は `is*` プレフィックスを付ける**
  - 例: `isDisabled`、`isLogoTitle`、`isExternal`、`isInternalLink`
  - HTML 属性として直接渡すもの（`disabled` 属性など）であっても、Props 名としては `isDisabled` を使い、内部で `disabled={isDisabled}` と展開する
- **イベントハンドラ Props は `on*`**（例: `onClick`、`onChange`、`onChangePage`）
- **ReactNode を受け取るスロット系は `*Elm` サフィックス**（例: `leftElm`、`rightElm`）。`children` は React の慣例どおり `children` のまま
- **HTML 要素タグ名を受ける Props は `*Tag`**（例: `titleTag?: keyof JSX.IntrinsicElements`、`articleTag?: keyof JSX.IntrinsicElements`）
- **共通イベント型は `~/types/event` の `EventTypes` から取得**（例: `onClick?: EventTypes['onClickButton']`）
- **共通 HTML 属性型は `~/types/html` から取得**（例: `target?: AnchorTarget`、`rel?: AnchorRel`、`buttonType?: ButtonType`）

## ファイル / ディレクトリ命名

| 種別 | 形式 | 例 |
|---|---|---|
| コンポーネントディレクトリ | PascalCase | `BaseButton/`、`ArticleCard/`、`LayoutHeader/` |
| コンポーネントエントリファイル | `index.tsx` 固定 | `BaseButton/index.tsx` |
| コンポーネントスタイル | `style.css.ts` 固定（Vanilla Extract） | `BaseButton/style.css.ts` |
| UI カテゴリディレクトリ | 複数形 kebab-case | `buttons/`、`cards/`、`lists/`、`paginations/`、`typographies/` |
| カスタムフック | `useXxx.ts`（**camelCase**、`use` プレフィックス） | `usePaginationScroll.ts` |
| utils 関数ファイル | 単語 1 つなら短い名前、複合語は kebab-case で OK | `article.ts`、`date.ts`、`scroll.ts`、`custom-error-message.ts`、`loader-guards.server.ts` |
| 型定義（.d.ts） | 短い英単語 | `event.d.ts`、`html.d.ts`、`paths.d.ts` |
| 環境別エントリ | `*.server.ts` / `*.client.ts` | `gtags.client.ts`、`csp.server.ts`、`worker-fetch.server.ts` |
| ルートディレクトリ | React Router v7 の flatRoutes 規約 | `($lang)._public._layout._index/`、`($lang)._public._layout.drinks.$drinkId/` |
| ルートエントリ | `route.tsx` 固定 | `($lang)._public._layout._index/route.tsx` |

> **注意**: `hooks/` のファイルは **camelCase**（`usePaginationScroll.ts`）であり、kebab-case ではない。新規 hook を `use-xxx.ts` で書いていたら指摘対象。

## 変数 / 関数

- **変数・関数は camelCase**
- **定数（コンパイル時固定値、env 由来）は SCREAMING_SNAKE_CASE**
  - 例: `CACHE_BUSTER`、`SITE_URL`、`SITE_NAME`、`API_URL`、`LANG`、`PAGES`、`SEARCH_DRINKS_CONDITION_KEY`（`~/config/env`、`~/config/consts`、`~/config/paths` 参照）
- **boolean ローカル変数も `is*` を推奨**（`isExternal`、`isInternalLink`、`isClickable`）
- **イベントハンドラの命名**:
  - **コンポーネント内のローカル関数は `handle*`**（例: `handleChangePage`、`handleClickYear`）
  - **コールバック Props は `on*`**（例: `onClick`、`onChange`、`onChangePage`）

  使用例: `<BasePagination onChangePage={handleChangePage} />` — Props 名は `on*`、渡すローカル関数は `handle*`

## 型 / 列挙

- **型エイリアスは PascalCase**（例: `EventTypes`、`ButtonType`、`AnchorTarget`、`AnchorRel`）
- **共通型は `~/types/` 配下に集約**してインポートして使う（`~/types/event`、`~/types/html`）
- **API レスポンス型は `~/types/api/` 配下**（quicktype で生成）
- **Props 型をローカルファイル内で定義する場合と、共通型を再利用する場合を意識的に分ける**（汎用属性は共通型から）

## ルートファイルの export

React Router v7 のファイル規約により、**ルートエントリ（`route.tsx`）はコンポーネントを `export default` する**。これは指摘対象外。

```tsx
// app/routes/($lang)._public._layout._index/route.tsx
export const meta: MetaFunction = ...
export async function loader(args: Route.LoaderArgs) { ... }
export default function PageSG10_100({ loaderData }: Route.ComponentProps) { ... }
```

ルート関数名は **`Page<画面ID>`** または機能を表す PascalCase（既存例: `PageSG10_100`）。

## インポート順序

oxfmt の `sortImports` で自動整形される領域だが、レビュー時に違反が混入していないかは見る価値がある。`.oxfmtrc.json` で定義されているグループ順:

1. 外部パッケージ（`react`、`react-router`、`@vanilla-extract/css` 等）と builtin
2. 空行
3. 親・兄弟・index（`./style.css`、`./+types/route` 等）
4. 空行
5. プロジェクト内モジュール（`~/components/...`、`~/types/...`、`~/config/...`、`~/server/...`、`~/utils/...`、`~/styles/...`）

`internalPrefix` は `["~/"]` のみ。**他のエイリアス（`@/` 等）は存在しないので、もし出現したら誤り**。

## アンチパターン（指摘対象）

- ❌ コンポーネント名が camelCase / kebab-case（`baseButton` / `base-button`）
- ❌ export する Props 型名がコンポーネント名と乖離している（`export type ButtonProps` for `BaseButton` 等。ローカル `type Props` は対象外）
- ❌ `interface` で Props を定義（`type` で統一）
- ❌ boolean Props に `is*` がない（`disabled`、`logoTitle` のまま）
- ❌ コンポーネントディレクトリが kebab-case（`base-button/`）
- ❌ hook ファイルが kebab-case / PascalCase（`use-pagination-scroll.ts` / `UsePaginationScroll.ts` ではなく `usePaginationScroll.ts`）
- ❌ HTML 属性そのままの名前を Props に使う（`disabled` → `isDisabled` に揃える）
- ❌ コールバック Props 名が `handle*`（→ `on*` に揃える。ローカル関数側は `handle*` のままで OK）
- ❌ `~/` 以外のパスエイリアスを使用（このプロジェクトでは `~/` のみ定義）
- ❌ `route.tsx` 以外のコンポーネントで `export default` を使う（名前付きエクスポートで統一）
- ❌ 共通型を再定義（`onClick: (e: React.MouseEvent...) => void` を毎回書かず `EventTypes['onClickButton']` を使う）
