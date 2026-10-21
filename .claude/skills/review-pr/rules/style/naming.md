# 命名規約（TypeScript / Remix 3）

`app/`・`workers/`・`scripts/` のコードに適用する命名ルール。oxlint・oxfmt で機械的に検出できないものを中心に挙げる。根拠は `CLAUDE.md` の該当する節。

## コンポーネント

- **コンポーネント名は PascalCase、ディレクトリとファイルは kebab-case**（`BaseButton` → `base-button/base-button.tsx`）。エクスポート名とディレクトリ名は同じ語にする
- **コンポーネントは `function` 宣言、それ以外の関数は `const` のアロー関数**（`CLAUDE.md`「Code Conventions」）。`<X />` として使うものだけがコンポーネントで、`RemixNode` を返すだけのヘルパー（`renderMeta()`）は `const`
- **`clientEntry(...)` には名前付き関数を渡す**。`clientEntry` はエクスポート名を関数名から読む。アロー関数だと描画時に例外になるが、typecheck・lint・テストは通ってしまう
- **層ごとの接頭辞**
  - `primitives/` 配下は `Primitive*`（`PrimitiveButton`）
  - `common/` と `layouts/` 配下は `Layout*`（`LayoutHeader`、`LayoutInner`）
  - その他の `ui/` は機能を表す名前（`BaseButton`、`ArticleCard`、`SvgIcon`）
- **参考資料は `Example*`**（`ExampleCopyButton`）。表示する側（`/dev/ui`）が所有し、`app/ui/` には置かない
- **同じファイル内のサブコンポーネントは親の名前を接頭辞にする**（`ArticleCard` 内の `ArticleCardTitle`）

## export

- **名前付き export で統一する**。例外は `controller.tsx` の `export default createController(...)` と、Workers のモジュール形式が求める `workers/app.ts` の `export default { fetch }` だけ
- **`clientEntry` の部品は `export const Name = clientEntry(clientModuleUrl('…'), function Name(…) {…})`**。変数名と関数名を揃える

## Props 型

- **`<ComponentName>Props` で `<name>.types.ts` に置き、`export type`**。コンポーネントは `export type * from './<name>.types.ts'` で再 export する（`app/ui/layouts/layout-inner/layout-inner.tsx`）
- **ファイル内でしか使わない小さな型は `type Props` でよい**（export しない）
- **`type` を使い、`interface` は `declare module` の中だけ**。モジュール拡張には宣言のマージが必要で、`interface` にしかない（`app/router.ts` の `RouterTypes`）

## Props の命名

- **camelCase**
- **boolean は `is*`、何かを持つかどうかは `has*`**（`isDisabled`、`isLogoTitle`、`hasClientEntries`）。HTML 属性に渡すものでも props 名は `is*` にし、内部で `disabled={isDisabled}` と展開する
- **ARIA 属性をそのまま渡す props は `aria*`**（`ariaExpanded`、`ariaCurrent`、`ariaHidden`）。属性との対応が名前でわかるようにする
- **呼び出し側からのスタイルの上書きは `styleOverrides`**。`styles` は各ファイルの名前空間 import が使っているので、props に同じ名前を付けない
- **スロットは `*Elm`**（`leftElm`、`rightElm`）。中身は `children`
- **要素のタグ名を受け取る props は `*Tag`**（`titleTag`、`nonClickableTag`）
- **DOM のイベントは `mix` で付ける**。ボタンのクリックなどは呼び出し側が `mix={on('click', …)}` を渡し、`onClick` のような props を足さない。コンポーネントは `mix` の中身を見られないので、要素の種類（`<a>`・`<button>`）は `url`・`buttonType`・`nonClickableTag` のどれを渡すかで決める（`CLAUDE.md`「What separates the two tiers」）
- **部品が自分の状態の変化を親に伝えるコールバックは `on*`**（`InputCheckbox` の `onToggle(value, checked)`）。親と同じクライアントエントリーの内側でだけ使える。`clientEntry` の props は直列化できる値に限られ、関数を渡すと型エラーになる

## スタイルのレシピ

- **BEM 風。ただし区切りは `_` が要素、`__` が修飾子**（`baseButton_text`、`primitiveButton__disabled`）。BEM 本来とは逆で、JavaScript の識別子に `-` を使えないため
- **`style` 接頭辞を付けない**。名前空間 import（`styles.layoutInner`）が担う
- **バリアントの対応表は `<block><Variants>` の複数形**（`baseButtonSizes`、`layoutInnerSizes`）。各値は名前を持つ修飾子の定数を指す
- 詳細は `rules/style/css.md`

## ファイル / ディレクトリ命名

| 種別 | 形式 | 例 |
|---|---|---|
| コンポーネントのディレクトリ | kebab-case | `base-button/`、`article-card/` |
| コンポーネント本体 | `<name>.tsx`（`index.tsx` は使わない） | `base-button/base-button.tsx` |
| 型 | `<name>.types.ts`（`.tsx` にしない。実行時のものを入れない） | `base-button.types.ts` |
| スタイルのレシピ | `<name>.styles.ts` | `base-button.styles.ts` |
| テスト | `<name>.test.tsx` / `<name>.test.ts` | `base-button.test.tsx` |
| UI のカテゴリ | 複数形の kebab-case | `buttons/`、`cards/`、`lists/` |
| ルートエリア | ルートマップのキー（URL のセグメントではない） | `drinks/` |
| ページ | ルートキー + `-page` | `index-page/`、`show-page/`、`home-page/` |
| ページのデータ読み込み | `<name>-page.data.ts` | `show-page/show-page.data.ts` |
| ミドルウェア・データ・utils | kebab-case の 1 ファイル | `trailing-slash.ts`、`drink-card.ts` |

`*.server.ts` / `*.client.ts` のような環境の接尾辞は使わない。ブラウザに出せるかどうかは `public/` の内側か外側かで決まる（`rules/style/structure.md`）。

## 変数 / 定数

- **変数・関数は camelCase**、boolean の変数も `is*` / `has*`（`hasClientEntries`）
- **モジュールの定数は SCREAMING_SNAKE_CASE**（`SITE_URL`、`MESSAGES`、`PAGE_TITLE`、`MEDIA_QUERY`）
- **ページの文言は `MESSAGES = defineMessages({ ja: {…}, en: {…} })`**、読むときは `MESSAGES[lang]`。ページのタイトルは `PAGE_TITLE`（`CLAUDE.md`「Languages」「Page metadata」）

## アンチパターン（指摘対象）

- ❌ コンポーネントのディレクトリやファイルが PascalCase（`BaseButton/index.tsx`）
- ❌ `index.tsx`、または `style.css.ts`（Vanilla Extract の名残）
- ❌ コンポーネントをアロー関数で定義、または `clientEntry` にアロー関数を渡す
- ❌ ヘルパー関数を `function` 宣言で書く
- ❌ `declare module` の外で `interface`
- ❌ boolean の props に `is*` / `has*` がない（`disabled`、`logoTitle`）。ARIA 属性の `aria*` は除く
- ❌ props に `styles` や `className` を足して上書きさせる（`styleOverrides` にする）
- ❌ 要素の DOM イベントを `onClick` などの props で受ける（呼び出し側が `mix={on(...)}` を渡す）
- ❌ レシピの区切りが BEM 本来のもの（要素に `__`）、または `style` 接頭辞
- ❌ ルートエリアのディレクトリを URL のセグメントで命名する、ページのディレクトリに `-page` がない
- ❌ `*.server.ts` / `*.client.ts` の接尾辞で実行環境を分けようとする
- ❌ `controller.tsx` と `workers/app.ts` 以外で `export default`
