# Sugidama

![GitHub release (with filter)](https://img.shields.io/github/v/release/InumberX/sugidama) ![GitHub Release Date - Published_At](https://img.shields.io/github/release-date/InumberX/sugidama) ![GitHub last commit (by committer)](https://img.shields.io/github/last-commit/InumberX/sugidama) ![GitHub issues](https://img.shields.io/github/issues/InumberX/sugidama) ![GitHub closed issues](https://img.shields.io/github/issues-closed/InumberX/sugidama) ![GitHub pull requests](https://img.shields.io/github/issues-pr/InumberX/sugidama) ![GitHub closed pull requests](https://img.shields.io/github/issues-pr-closed/InumberX/sugidama)

個人開発プロジェクト「Sugidama」のリポジトリです。お酒の情報を Kuroco CMS から取得して、日本語（既定）と英語（`/en/…`）で公開します。

- [DeepWiki のプロジェクトドキュメント](https://deepwiki.com/InumberX/sugidama)

[Remix 3](https://remix.run)（`3.0.0`）で作り、Cloudflare Workers で動かしています。構成は [`inumberx/remix-template`](https://github.com/InumberX/remix-template) に従い、テンプレートと違うところは Workers で動かすための差分です。React Router からの移行の計画と経過は issue #115 にあります。

- **ローカルでも本番と同じランタイムで動かします。** 開発サーバーは `wrangler dev`（workerd）で、Node のサーバーはありません。
- **サーバーのビルドはありません。** Worker は wrangler が TypeScript のまま束ねます。ブラウザ向けのモジュールだけを `scripts/build-client.ts` が事前にコンパイルします。
- **URL の情報源は `app/routes.ts` ひとつです。** `href()` の引数と `context.params` はパターンのリテラル型から導かれます。
- **`/dev/ui` はコンポーネントギャラリーです。** 本番と同じ `context.render()` で描画するので、見本と本番の表示がずれません。

コードの規約と、それぞれの判断の詳しい理由は `CLAUDE.md` にまとまっています。この README は全体像と、判断の要点だけを載せています。

## 必要環境

Node.js **24.3.0 以上**（`.node-version` と `volta` は 24.16.0 に固定）。`remix test`・`remix` CLI・`npm run build-client` は `module.registerHooks` で TypeScript を読み込むため、これより古い Node では動きません。wrangler は `npm run dev` とデプロイの前に `build-client` を実行するので、開発サーバーとデプロイも止まります。

## セットアップ

```sh
npm ci
npm run dev
```

http://localhost:8787 がサイト、http://localhost:8787/dev/ui がコンポーネントギャラリーです。`Ctrl + C` で止まります。

- `.dev.vars` は任意です。`app/env.ts` がすべての変数に既定値を持ち、API はステージングの Kuroco を使います。Basic 認証などを試すときは `.dev.vars.example` を `.dev.vars` にコピーして値を入れます。
- `wrangler dev` は起動時と `app/` の変更時に `npm run build-client` を実行し、ブラウザ向けモジュールを `public/client/` に書き出します。

## コマンド

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | `wrangler dev`（:8787） |
| `npm run build-client` | ブラウザ向けモジュールを `public/client/` にコンパイル（wrangler が dev・deploy の前に自動で実行） |
| `npm test` | `remix test` によるテスト（Node で実行） |
| `npm run typecheck` | `tsc -b` |
| `npm run routes` | ルートを表形式で表示 |
| `npm run bundle` | `wrangler deploy --dry-run` で Worker を束ねるだけ（デプロイしない） |
| `npm run doctor` | `remix doctor` |
| `npm run lint` / `lint-fix` | oxlint（警告もエラー扱い） |
| `npm run format` / `format-fix` | oxfmt |
| `npm run stylelint` / `stylelint-fix` | stylelint（`public/` の CSS） |
| `npm run pre-commit` | typecheck → format-fix → lint-fix → stylelint-fix |
| `npm run deploy-development` / `deploy-production` | `scripts/deploy.sh` でデプロイ |
| `npm run upgrade-check` / `upgrade` | npm-check-updates で依存の更新を確認・反映（反映後は `npm install`） |

1 ファイル・1 テストだけ実行する場合:

```sh
npm test -- app/actions/controller.test.tsx
npm test -- --only 'renders the home page'
```

## ルート

| ルート | メソッド | パス | 担当 |
| --- | --- | --- | --- |
| `home` | GET | `/(:lang)` | `app/actions/controller.tsx` |
| `drinks.index` | GET | `/(:lang/)drinks` | `app/actions/drinks/controller.tsx` |
| `drinks.show` | GET | `/(:lang/)drinks/:drinkId` | `app/actions/drinks/controller.tsx` |
| `robots` | GET | `/robots.txt` | `app/actions/controller.tsx` |
| `sitemap` | GET | `/sitemap.xml` | `app/actions/controller.tsx` |
| `devUi` | GET | `/dev/ui` | `app/actions/controller.tsx`（本番では 404） |

`(:lang)` は省略できる言語の区切りです。省略すると日本語、`en` で英語になります。`/ja/…` は接頭辞のない URL へリダイレクトし、それ以外の値は 404 です。

## ディレクトリ構成

```
app/
  routes.ts                     ルート定義（URL の唯一の情報源）
  router.ts                     ミドルウェアの順序と router.map
  env.ts                        process.env を読む唯一のモジュール
  actions/
    controller.tsx              ルート直下のアクション（home・robots・sitemap・devUi）
    document.tsx                共通の HTML の外枠
    meta.tsx                    サイト全体のメタデータの既定値
    error-page.tsx              エラーのときに表示するページ
    robots.ts, sitemap.ts       robots.txt と sitemap.xml の本体
    home-page/                  ページ（ルートキー + `-page`）
    drinks/                     ルートエリア（controller.tsx を持つ）
      index-page/ show-page/
    dev-ui-page/                コンポーネントギャラリー
    public/entry.ts             ブラウザのランタイムのエントリー
  ui/                           複数のルートで使う UI
    styles/public/              トークン・ブレークポイント・クエリ定数
    types/                      型だけの DOM の語彙
    contexts/                   プロバイダーとフック（CSP の nonce）
    public/                     ハイドレートする部品も使う関数（clientModuleUrl）
    primitives/<category>/      見た目を持たない骨組み
    <category>/                 見た目を持つコンポーネント
  middleware/                   セキュリティヘッダー・CSP・言語・エラーページなど
  data/                         Kuroco API のクライアントとリソース
  utils/                        どの層にも属さない純粋な関数
workers/
  app.ts                        Worker のエントリー
  handler.ts                    Basic 認証 → 静的ファイル → ルーター
scripts/
  build-client.ts               ブラウザ向けモジュールの事前コンパイル
  deploy.sh                     デプロイ（BUILD_ID と DEPLOYED_AT を付ける）
public/                         ASSETS バインディングがそのまま配信するファイル
  static/css/app.css            カスケードレイヤーの順序・リセット・トークン
  static/img/                   画像（`staticUrl()` でキャッシュバスターを付ける。OGP 画像は除く）
  client/                       build-client の出力（Git 管理外）
test/kuroco.ts                  テスト用の API のフィクスチャとモック
wrangler.jsonc                  Worker の設定と環境ごとの vars
```

`app/actions/` の中では、**素のディレクトリはルートエリア**（`controller.tsx` を持ち、`app/router.ts` に `router.map` の行が要る）、**`-page` 付きはページ**です。ページの部品は `components/<name>/<name>.tsx` に、ハイドレートする部品は `public/components/<name>/<name>.tsx` に置きます。コンポーネントのディレクトリは `<name>.tsx`・`<name>.types.ts`・`<name>.styles.ts`・`<name>.test.tsx` に分け、`index.tsx` は使いません。

## 主な判断とその理由

詳しくは `CLAUDE.md` の該当する節を見てください。

- **Node のサーバーを持たない。** テンプレートの `server.ts` と HMR は使わず、ローカルも `wrangler dev` で動かします。Node 専用の API（`node:fs`、`remix/middleware/static`、アセットサーバー）がデプロイ後ではなく手元で失敗するようにするためです。テストは実行時を問わない `router.fetch` と `renderToString` を使うので Node で動きます。（**Commands**・**Cloudflare Workers**）
- **ブラウザ向けモジュールは事前にコンパイルする。** Workers ではリクエストごとにコンパイルできないため、`scripts/build-client.ts` がアセットサーバーを Node で一度だけ動かし、`public/client/` に書き出します。URL はソースのパスそのままで、フィンガープリントと import map はありません。（**Browser JavaScript**）
- **ハイドレートは必要な部品だけ。** ページはサーバーで描画し、GET フォーム・`<details>`・scroll-snap などの HTML と CSS の機能で操作できるようにしています。JavaScript で動かすのは一覧の検索フォームと詳細のスライダーだけです。タブ・アコーディオンは `@remix-run/ui` を試したうえで手作りにしました。（**Browser JavaScript**・**The `app/ui/` layout**）
- **環境ごとの値は `wrangler.jsonc` に置く。** `SITE_URL`・`API_URL` などは公開して問題ない値なのでリポジトリに置き、手元と CI のどちらからデプロイしても同じ Worker になるようにしています。Basic 認証などの秘密の値は Worker の secret にします。`BUILD_ID` と `DEPLOYED_AT` だけはデプロイごとに `scripts/deploy.sh` が付けます。（**Cloudflare Workers**）
- **言語は URL の接頭辞で分ける。** i18next は使わず、各ページとコンポーネントが `defineMessages()` で自分の文言を持ちます。日本語の文言が型を決め、英語の抜けや綴り間違いは型エラーになります。（**Languages**）
- **エラーは同じ見た目のページで返す。** ルートはエラーを素のテキストの応答で返し、`app/middleware/error-page.tsx` がそれをサイトの見た目のエラーページに置き換えます。例外として、描画の前に失敗したもの（`cop()` の 403、例外による 500）、ファイルへの要求の 404、独自の形式を持つ応答（sitemap の XML）は、素のまま返します。Kuroco API の 404 と 410 は、そのページ自身が見つからないときだけそのまま返し、それ以外の 4xx は 502 にします。5xx はそのまま、応答がなければ 500 です。API の文言は訪問者に見せません。（**Error pages**・**Data**）
- **スタイルはレシピを 1 回の `css(...)` にまとめて上書きする。** `css(...)` ごとにできるレイヤーは最初に描画された順に並ぶため、ディスクリプタを重ねると優先順位が描画順で変わります。`.styles.ts` はプレーンなレシピを export し、呼び出し側は `styleOverrides` で上書きします。アプリ全体の上書きは `app.css` のカスケードレイヤーで行います。（**Rules that came from measurement, not taste**・**Global CSS**）
- **セキュリティヘッダーと CSP をルーターで付ける。** ページごとに nonce を作って CSP に入れ、`cop()` で外部からの POST などを拒否します。セッションがないため CSRF トークンはまだ持ちません。（**Security**）

## デプロイ

`develop` への push で `dev-sugidama`（ステージング）、`main` への push で `sugidama`（本番）に GitHub Actions からデプロイされます。手元から行う場合は次のとおりです。

```sh
npm run deploy-development   # dev-sugidama
npm run deploy-production    # sugidama
```

`scripts/deploy.sh` は、コミットしていない変更や Git 管理外のファイルがあると止まります。`BUILD_ID` に入るコミットと、実際に出ていくファイルを一致させるためです。`public/` に Git が無視しているファイル（macOS の `.DS_Store` など）がある場合も止まります。wrangler は `public/` を丸ごとアップロードするためです。`git status` には出ないファイルなので、止まったときはスクリプトが表示するファイルを消してください（`public/client/` は対象外）。

## トラブルシューティング

### 新しく作ったモジュールが `wrangler dev` で 404 になる

`wrangler dev` は `public/` を起動時に一度だけ読みます。開発中に `build-client` が新しいファイルを書き出した場合（新しいモジュールや、新しく import したパッケージ）は、`npm run dev` を再起動してください。既存のファイルの変更はそのまま反映されます。

### `does not provide an export named 'registerHooks'` で失敗する

Node が古いです。`node -v` が `.node-version`（24.16.0）と一致するか確認してください。

## API の型

Kuroco API の型は、各リソースの横の `app/data/<resource>.types.ts` に、サイトが読むフィールドだけを手で書いています。API の日付は JSON の ISO 文字列で、`Date` ではありません。
