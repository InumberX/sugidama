# ディレクトリ構造規約

`app/` 配下のファイル配置に関するルール。新規ファイルが正しい場所に置かれているかをレビューする。

## トップレベル構成

```
app/
├── assets/                # 静的アセット（画像など）
├── components/            # React コンポーネント（3 階層）
│   ├── primitives/        # 最小単位の建材（PrimitiveButton 等）
│   ├── ui/                # 再利用される汎用 UI（カテゴリ分割）
│   └── common/            # サイト全体のレイアウト系（Layout* 等）
├── config/                # 設定値（env, paths, consts）
├── hooks/                 # カスタムフック
├── locales/               # i18n 辞書（ja / en）
├── providers/             # React Context / Provider
├── routes/                # React Router v7 ルート（flatRoutes 規約）
├── server/                # サーバーサイド専用モジュール（*.server.ts）
│   └── api/               # Kuroco CMS への API 呼び出し
├── styles/                # 共通スタイル（CSS 変数、mixin、layer）
│   ├── mixins/            # 関数（getClampPx 等）
│   └── variables/         # createGlobalTheme / globalLayer 等の定義
├── types/                 # TypeScript 型定義
│   └── api/               # quicktype で生成した API レスポンス型
├── utils/                 # 純粋なユーティリティ関数
├── entry.client.tsx       # クライアントエントリ
├── entry.server.tsx       # サーバーエントリ（SSR）
├── i18n.ts                # i18n 設定（クライアント）
├── i18next.server.ts      # i18n 設定（サーバー）
├── root.tsx               # アプリのルート
├── root.css.ts            # ルートのスタイル
└── routes.ts              # flatRoutes 設定
```

> ルート Worker は `workers/app.ts`、設定は `wrangler.jsonc`。新規 Cloudflare バインディングや Workers Secret を増やしたら `app/server/worker-fetch.server.ts` の `WorkerEnv` 型も手動で更新が必要（`CLAUDE.md` 参照）。

## components の 3 階層

| 置き場 | 用途 | 例 | 使うべきレイヤー |
|---|---|---|---|
| `components/primitives/` | HTML 要素を最小限ラップした建材。他のコンポーネントから組み合わせて使う基礎部品 | `PrimitiveButton` | `cssLayerComponentUiPrimitive` |
| `components/ui/` | **複数箇所で再利用される汎用 UI**。カテゴリ別ディレクトリで分類 | `buttons/BaseButton`、`cards/ArticleCard`、`lists/ArticleCardList` | `cssLayerComponentUiLow` / `Middle` / `High`（依存関係に応じて） |
| `components/common/` | サイト全体のレイアウト・レイヤーに関わる **アプリ固有・基本 1 度しか使わない** コンポーネント | `LayoutHeader`、`LayoutFooter`、`LayoutPortal` | `cssLayerComponentCommon` |

判断基準:
- 「HTML 要素を最小限ラップして、他の UI から組み合わせて使う」なら `primitives/`
- 「カードや一覧などで何度も再利用する」なら `ui/<category>/`
- 「サイト全体で 1 つだけ使う・ページ毎に再利用しない」なら `common/`（多くは `Layout*` プレフィックス）

## ui/ 配下のカテゴリ分割

UI コンポーネントは以下のカテゴリのいずれかに配置する。新規カテゴリを追加する場合は、本ファイルに追記する。

```
app/components/ui/
├── alerts/        # 通知・アラート
├── articles/      # 記事表示系
├── buttons/       # ボタン
├── cards/         # カード
├── forms/         # フォーム部品
├── icons/         # アイコン（SvgIcon）
├── layouts/       # レイアウトユーティリティ（LayoutInner、LayoutSection、LayoutPageWrapper 等）
├── lists/         # リスト・一覧
├── paginations/   # ページネーション
├── skeletons/     # ローディング表示
├── tags/          # タグ
├── transitions/   # トランジション
└── typographies/  # テキスト・タイポグラフィ
```

カテゴリ名は **複数形 kebab-case**（`button/` ではなく `buttons/`）。

## primitives/ 配下のカテゴリ分割

```
app/components/primitives/
├── buttons/       # PrimitiveButton
└── skeletons/     # PrimitiveSkeleton 等
```

`primitives/` も `ui/` と同様に複数形 kebab-case のカテゴリ配下に配置する。

## コンポーネントディレクトリの構造

各コンポーネントはディレクトリ単位で完結させる:

```
app/components/ui/buttons/BaseButton/
├── index.tsx              # メインのコンポーネント実装（必須・named export）
└── style.css.ts           # Vanilla Extract スタイル（必須・スタイルなしの場合は空でも作成）
```

派生:
- 子コンポーネントを切り出す場合は同 `index.tsx` 内にローカル定義（`ArticleCard` 内の `ArticleCardTitle` 等）か、独立したコンポーネントとして別ディレクトリに切る
- 型定義をエクスポートする場合は `index.tsx` 内で `export type <Component>Props` を行う

## 関連レイヤーの配置

| ロジック種別 | 置き場 | 命名 |
|---|---|---|
| API 呼び出し（Kuroco CMS） | `app/server/api/<resource>.server.ts` | kebab-case 可、`.server.ts` 必須 |
| API レスポンス型（生成） | `app/types/api/...` | quicktype で生成 |
| カスタムフック | `app/hooks/use<Name>.ts` | **camelCase**、`use` プレフィックス |
| 純粋関数ユーティリティ | `app/utils/<name>.ts` | 短い名前は素朴に、複合語は kebab-case でも camelCase でも既存例あり |
| サーバー専用ユーティリティ | `app/utils/<name>.server.ts` | `.server.ts` サフィックス必須 |
| クライアント専用ユーティリティ | `app/utils/<name>.client.ts` | `.client.ts` サフィックス必須 |
| 設定値 | `app/config/<topic>.ts` | camelCase（`env.ts`、`paths.ts`、`consts.ts`） |
| Provider | `app/providers/<Name>Provider.tsx` または ディレクトリ | PascalCase + Provider サフィックス |
| 型定義 | `app/types/<name>.d.ts` | 短い英単語（`event.d.ts`、`html.d.ts`） |

## Vanilla Extract レイヤー定数の対応

`style.css.ts` を書くとき、ファイルの配置に応じた `@layer` を選ぶ:

| ファイルパス | 使用するレイヤー定数 |
|---|---|
| `app/components/primitives/**/style.css.ts` | `cssLayerComponentUiPrimitive` |
| `app/components/ui/**/style.css.ts`（シンプル） | `cssLayerComponentUiLow` |
| `app/components/ui/**/style.css.ts`（lists・複合 cards 等） | `cssLayerComponentUiMiddle` |
| `app/components/ui/layouts/**/style.css.ts` | `cssLayerComponentUiHigh` |
| `app/components/common/**/style.css.ts` | `cssLayerComponentCommon` |
| `app/routes/**/style.css.ts` | `cssLayerComponentPage` |

詳細は `rules/style/css.md` の「カスケードレイヤー」を参照。

## 名前付きエクスポート

各コンポーネントの `index.tsx` から名前付きエクスポートを行い、外部からは以下のように参照する:

```ts
import { BaseButton } from '~/components/ui/buttons/BaseButton'
import { PrimitiveButton, type PrimitiveButtonProps } from '~/components/primitives/buttons/PrimitiveButton'
```

`index.tsx` に `export default` は使わない（既存コードはコンポーネントを名前付きエクスポート）。

### 例外: React Router v7 のルートエントリ

`app/routes/**/route.tsx` は React Router の規約により**ページコンポーネントを `export default` する**。`meta`・`loader`・`action` 等の標準エクスポートは名前付き。指摘対象から除外する:

```tsx
// app/routes/($lang)._public._layout._index/route.tsx
export const meta: MetaFunction = ...
export async function loader(args: Route.LoaderArgs) { ... }
export default function PageSG10_100({ loaderData }: Route.ComponentProps) { ... }
```

`app/entry.client.tsx`、`app/entry.server.tsx`、`app/root.tsx` も React Router の慣例で `export default` を使う。

## ルートファイルの配置（React Router v7 / flatRoutes）

`app/routes.ts` で `flatRoutes()` を使った file-based routing。ディレクトリ名がそのままルートになる:

| パターン | 意味 |
|---|---|
| `($lang)` | optional な language param（`/`、`/en/...`） |
| `_public` | public ルートグループ（パスに含まれない） |
| `_layout` | レイアウトラッパー（パスに含まれない） |
| `_index` | index ルート |
| `$drinkId` | dynamic セグメント |

例:
- `($lang)._public._layout._index/route.tsx` → `/`、`/en/`
- `($lang)._public._layout.drinks._index/route.tsx` → `/drinks`、`/en/drinks`
- `($lang)._public._layout.drinks.$drinkId._index/route.tsx` → `/drinks/:drinkId`

新規ルートを追加する際は、ディレクトリ命名がこのパターンに沿っているか確認する。

## サーバー / クライアント分離

- **`*.server.ts` / `*.server.tsx`**: サーバーでしか実行しないモジュール（API 呼び出し、CSP、CSRF、Worker 設定）
- **`*.client.ts` / `*.client.tsx`**: クライアントでしか実行しないモジュール（GA、ブラウザ API 専用）
- **`app/server/` 配下**: 全てサーバー専用扱い

ブラウザ専用 API（`window`、`document`）を `*.server.ts` の外で参照する場合、ガードや動的 import を使う。

## パスエイリアス

`tsconfig.json` の `paths` で定義されているのは **次の 2 つのみ**:

| エイリアス | 解決先 | 用途 |
|---|---|---|
| `~/*` | `./app/*` | アプリケーションコード全般（コンポーネント・hooks・utils・types・config 等） |
| `~/+types/*` | `./.react-router/types/app/+types/*` | **React Router v7 が自動生成するルート型の参照専用**。`app/utils/meta.ts` 等で `import type { Route } from '~/+types/root'` のように使用 |

`~/+types/*` は React Router の typegen で生成される型ファイル（`Route.LoaderArgs`、`Route.ComponentProps`、`Route.MetaArgs` 等）を参照するための専用エイリアス。手書きする型を `~/+types/` 配下に置いてはいけない。生成系なので `.react-router/` ディレクトリを git にコミットしない（gitignore 済み）。

```ts
// Good — 通常のアプリケーションコード
import { BaseButton } from '~/components/ui/buttons/BaseButton'

// Good — React Router 生成型の参照（ルートファイルや、ルート型を扱う共通 utility 内）
import type { Route } from '~/+types/root'
import type { Route } from './+types/route'  // ルートファイル内では相対パスが慣例

// Bad — 未定義のエイリアスを使用
import { BaseButton } from '@/components/ui/buttons/BaseButton'
import { BaseButton } from '@components/buttons/BaseButton'
import { BaseButton } from '#components/buttons/BaseButton'
```

## アンチパターン（指摘対象）

- ❌ 1 度しか使わないアプリ固有コンポーネントを `ui/` に置く（→ `common/` へ）
- ❌ 再利用される汎用コンポーネントを `common/` に置く（→ `ui/<category>/` へ）
- ❌ HTML 要素を最小限ラップした建材を `ui/` に置く（→ `primitives/` へ）
- ❌ `ui/` や `primitives/` 直下にコンポーネントディレクトリを置く（→ 必ずカテゴリ配下に）
- ❌ カテゴリディレクトリが単数形（`button/`、`card/`） や PascalCase（`Buttons/`）
- ❌ コンポーネントエントリが `index.tsx` 以外（`BaseButton.tsx`、`Component.tsx`）
- ❌ コンポーネントスタイルが `style.css.ts` 以外（`BaseButton.css.ts`、`styles.css.ts`、`index.module.css`）
- ❌ hook ファイルが kebab-case（→ `useXxx.ts` の camelCase）
- ❌ サーバー専用モジュールに `.server.ts` サフィックスがない
- ❌ クライアント専用モジュールに `.client.ts` サフィックスがない
- ❌ `~/` / `~/+types/` 以外のプレフィックスを使ったパスエイリアス（`@/`、`@components/`、`#/` 等）の使用
- ❌ `export default` でのコンポーネントエクスポート（`route.tsx`・`entry.*`・`root.tsx` は除く）
- ❌ ルートファイルが flatRoutes 規約から外れている
- ❌ Vanilla Extract のレイヤー指定が配置場所と合っていない（`components/primitives/` で `cssLayerComponentCommon` を使う等）
