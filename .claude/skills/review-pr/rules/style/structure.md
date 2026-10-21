# ディレクトリ構造規約

ファイルの配置とルート・ハイドレーション・テストの約束ごと。新しいファイルが正しい場所にあるかをレビューする。根拠は `AGENTS.md` と `CLAUDE.md` の該当する節。

## トップレベル構成

```
app/
├── routes.ts          # ルート定義。app の他のモジュールを import しない
├── router.ts          # ミドルウェアの順序、AppContext、router.map
├── env.ts             # process.env を読む唯一のモジュール
├── actions/           # ルートが所有するもの（controller・ページ・その部品）
├── ui/                # 複数のルートエリアが使う UI
├── middleware/        # リクエストの流れに関わるもの（ヘッダー・CSP・言語・エラーページ）
├── data/              # Kuroco API のクライアントとリソース
└── utils/             # どの層にも属さない純粋な関数（最後の手段）
workers/               # Worker のエントリー（app.ts）と前段（handler.ts）
scripts/               # build-client.ts・deploy.sh
public/                # ASSETS がそのまま配信する静的ファイル
test/                  # 共有のフィクスチャとヘルパー（kuroco.ts）
```

- **`app/lib/`・`app/components/`・`app/controllers/` を作らない**（`AGENTS.md`「Build-Out Notes」）
- **`app/` 直下はアプリに 1 つしかない契約だけ**（`routes.ts`・`router.ts`・`env.ts`）
- **`process.env` を読むのは `app/env.ts` だけ**。テストも含め、他は解決済みの定数を import する
- **Worker の `env` 引数から読むバインディングや secret を足したら、`workers/handler.ts` の `WorkerEnv` を手で更新する**。`app/env.ts` に変数を足したら、`wrangler.jsonc` の両環境の `vars` と `.dev.vars.example` にも足す（`workers/wrangler.test.ts` が検査する）。秘密の値は `vars` に入れない

## 置き場所の優先順位

複数の場所に置けるときは上から順に決める（`AGENTS.md`「Placement Precedence」）。

1. 1 つのルートのものは、そのルートの近く（`app/actions/<route-key>/…`）
2. 複数のルートエリアが使う UI は `app/ui/`
3. リクエストの流れに関わるものは `app/middleware/`
4. API・データは `app/data/`
5. どれにも当てはまらない純粋な関数だけ `app/utils/<topic>.ts`。`app/actions/` や描画の API を import しない

**ルートが所有する UI を `app/ui/` に置かない。** 2 つ目のルートエリアが必要としたときに移す。

## ルートとアクション

- **`app/routes.ts` にルートを先に足す**。メソッドを明示し（`get`・`post`・`form`・`resources`）、素の文字列パターンは使わない。パターンはリテラルのまま書く
- **公開ページのパターンには省略できる言語の区切りを付ける**（`/(:lang)`、`/(:lang/)drinks`）。言語つきのルートを持つ controller には `middleware: [lang()]` が要る
- **内部の URL はすべて `routes.<name>.href(...)` で組み立てる**。クエリも `href(params, { searchParams })` で渡す。日本語のリンクには `toLangParam(lang)` を使い、`/ja` を付けない
- **ルートマップ直下のリーフは `app/actions/controller.tsx`**。ネストしたマップは `app/actions/<route-key>/controller.tsx` と、`app/router.ts` の `router.map(routes.<key>, controller)` の行を持つ
- **ルートの葉を `app/router.ts` に直接登録しない**

### `app/actions/` の中

```
app/actions/
  controller.tsx
  <route-key>/                 ルートエリア（controller.tsx を持つ）
    controller.tsx
    <key>-page/                ページ
      <key>-page.tsx
      <key>-page.data.ts       ページを描く前のデータ読み込み（必要なとき）
      <key>-page.styles.ts / .types.ts / .test.tsx
      components/<name>/<name>.tsx          ページの部品
      public/components/<name>/<name>.tsx   ハイドレートする部品
```

- **素のディレクトリはルートエリア、`-page` 付きはページ**。名前はルートマップのキーで、URL のセグメントではない
- **データの読み込みは `<key>-page.data.ts` の 1 つの非同期関数**。ページの props か、代わりに返す `Response` を返す。ページのコンポーネントは props だけで描く
- **エラーは素のテキストか空の `Response` で返す**（`new Response(null, { status })`）。見た目は `app/middleware/error-page.tsx` が付ける。API の失敗は `apiErrorResponse()` を通す

## `app/ui/` の中

```
app/ui/
  styles/public/                      トークン・ブレークポイント・クエリ定数・ミックスイン
  types/                              型だけの DOM の語彙（dom.ts）
  contexts/                           プロバイダーとフック（csp-nonce）
  primitives/<category>/<component>/  見た目を持たない骨組み
  <category>/<component>/             見た目を持つコンポーネント
```

- **`primitives/` はデザインの判断を持たない**。要素の選択・アクセシビリティ属性・UA のリセットだけで、`color` と `font` は `inherit`。トークンを import しない
- **`<category>/` がデザインを決めて primitive に渡す**（`buttons/public/base-button/` → `primitives/buttons/public/primitive-button/`）
- **`layouts/` は構造だけのラッパー**。寸法は `app.css` の `--layout-*` に置く
- **`common/` はヘッダー・フッター**
- **`app/ui/styles/` からコンポーネントを import しない**
- **カテゴリのディレクトリは最初の部品ができたときに作る**。空のディレクトリを先に作らない

## コンポーネントのディレクトリ

| ファイル | 中身 | ハイドレートするとき `public/` の外に置けるか |
|---|---|---|
| `<name>.tsx` | コンポーネント | 置けない |
| `<name>.types.ts` | 型だけ | 置ける（ブラウザ向けの出力から消える） |
| `<name>.styles.ts` | レシピ | 置けない |
| `<name>.test.tsx` | テスト | 対象外 |

## ハイドレーションと `public/`

- **ハイドレートするのはブラウザが本当に必要な部品だけ**。まず HTML（GET フォーム、`<details>`、scroll-snap、`popover`）で動くかを考える（`CLAUDE.md`「Browser JavaScript」）
- **ハイドレートする部品が実行時に使うものは、すべて `public/` の内側に置く**。値の import が外に出ると `npm run build-client` が `IMPORT_NOT_ALLOWED` で失敗する。型だけの import は消えるので対象外
- **クライアントエントリーは `clientEntry(clientModuleUrl('app/…/x.tsx'), function Name(…) {…})`**。`import.meta.url` は wrangler が 1 ファイルに束ねるため使えない。テストで `rmx-data` の URL が自分のファイルを指すことを確かめる
- **クライアントエントリーを描くページは `Document` に `hasClientEntries` を渡す**
- **ハイドレート前に訪問者が変えられる状態（チェック、開閉）は、setup で DOM から読む**
- **`<script>` を書くなら `nonce={useCspNonce(handle)}` を付ける**。付けないと CSP に止められる
- **新しいパッケージをブラウザで使うなら `scripts/build-client.ts` の `allowPackages` に足す**
- **部品の置き場は、ハイドレートする部品が初めて必要としたときに `public/` へ移す**（`buttons/public/`、`icons/public/`）。先回りして移さない

## テスト

- **テストは対象の横に置く**（`<name>.test.tsx`、`app/middleware/*.test.ts`）。ルート直下の `test/` は共有のフィクスチャだけ
- **`remix/test` と `import * as assert from 'remix/assert'` を使う**。`node:test` は失敗しても全体が成功になる（lint でも検出）
- **API を使うページを描くテストは `mockKuroco(t, …)` を呼ぶ**。呼ばないと本物の API に通信する
- **ルートの振る舞いは `router.fetch(new Request(...))` の `Response` で確かめる**。部品は `renderToString`

## アンチパターン（指摘対象）

- ❌ `app/lib/`・`app/components/`・`app/controllers/` の新設、`app/` 直下への 1 つの機能のためのファイル
- ❌ 1 つのルートでしか使わない部品を `app/ui/` に置く
- ❌ `app/env.ts` 以外で `process.env` を読む
- ❌ `routes.ts` に素の文字列パターン、または `routes.ts` から app のモジュールを import する
- ❌ 内部リンクを文字列で書く、日本語のリンクに `/ja` を付ける、末尾に `/` を付ける
- ❌ ネストしたルートマップに `router.map` の行や controller がない、言語つきの controller に `lang()` がない
- ❌ ページのコンポーネントの中で API を呼ぶ（`<key>-page.data.ts` に置く）
- ❌ エラーを HTML で組み立てて返す、API のエラーの文言を訪問者に見せる
- ❌ `primitives/` が色・文字サイズ・トークンを持つ
- ❌ ハイドレートする部品が `public/` の外の値を import する、`clientEntry` に `import.meta.url` を渡す
- ❌ nonce のない `<script>`
- ❌ Node 専用の API（`node:fs`、`remix/middleware/static`、アセットサーバー）を Worker のコードで使う
