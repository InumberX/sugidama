# 移行計画: ESLint + Prettier → oxlint + oxfmt

## 概要

sugidamaプロジェクトのリンター/フォーマッターを、Rust製の高速ツールに完全移行する。

- **ESLint** (v9) → **oxlint** (v1.56.0)
- **Prettier** (v3) → **oxfmt** (v0.41.0)

## 移行方針

参考PR（after_works-v006 #193）と同様に**一括移行（段階移行ではない）**を採用する。
理由: sugidamaは個人プロジェクトであり、段階的移行のオーバーヘッドが不要。

---

## Step 1: oxlint設定ファイルの生成

### 1-1. `@oxlint/migrate` を使ってESLint設定を変換

```bash
npx @oxlint/migrate eslint.config.js
```

これにより `.oxlintrc.json` が自動生成される。

### 1-2. 生成された `.oxlintrc.json` を確認・調整

現在のESLint設定で使用しているプラグイン:
- `eslint-plugin-react` → oxlint組み込み（`react`プラグイン）
- `eslint-plugin-react-hooks` → oxlint組み込み（`react-hooks`プラグイン有効化を確認。ない場合は`react`プラグインに含まれる可能性あり）
- `eslint-plugin-import-x` → oxlint組み込み（`import`プラグイン）
- `typescript-eslint` → oxlint組み込み（`typescript`プラグイン）
- `eslint-config-prettier` → 不要（Prettierとの競合回避用だったため）

確認ポイント:
- `plugins` に `react`, `import`, `typescript` が含まれていること
- `react/jsx-no-target-blank: "off"` が引き継がれていること
- ignoreパターン（`node_modules`, `.cache`, `build`, `public/build`, `.env`）が設定されていること

---

## Step 2: oxfmt設定ファイルの作成

### 2-1. `.prettierrc.json` → `.oxfmtrc.json` への変換

現在のPrettier設定をそのまま移行可能（Prettier互換）。

**現在の `.prettierrc.json`:**
```json
{
  "printWidth": 120,
  "tabWidth": 2,
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "arrowParens": "always",
  "bracketSameLine": false,
  "bracketSpacing": true,
  "jsxSingleQuote": false,
  "useTabs": false
}
```

**新しい `.oxfmtrc.json`:**
```json
{
  "$schema": "./node_modules/oxfmt/configuration_schema.json",
  "printWidth": 120,
  "tabWidth": 2,
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "arrowParens": "always",
  "bracketSameLine": false,
  "bracketSpacing": true,
  "jsxSingleQuote": false,
  "useTabs": false,
  "sortImports": {
    "newlinesBetween": true,
    "groups": [
      ["value-builtin", "value-external"],
      "value-internal",
      ["value-parent", "value-sibling", "value-index"],
      ["type-builtin", "type-external"],
      "type-internal",
      ["type-parent", "type-sibling", "type-index"],
      "unknown"
    ],
    "internalPrefix": ["~/"]
  }
}
```

注意: `sortImports`のグループ構成は、現在のESLintの`import-x/order`設定を再現するように調整する。oxfmtがimportソートを担うため、oxlint側の`import/order`ルールは無効化する。

---

## Step 3: package.json の更新

### 3-1. 依存関係の変更

**削除するdevDependencies:**
- `eslint`
- `@eslint/js`
- `@eslint/compat`
- `eslint-config-prettier`
- `eslint-formatter-junit`
- `eslint-plugin-import-x`
- `eslint-plugin-react`
- `eslint-plugin-react-hooks`
- `typescript-eslint`
- `prettier`
- `globals`

**追加するdevDependencies:**
- `oxlint`
- `oxfmt`

### 3-2. npm scripts の更新

```json
{
  "lint": "oxlint ./{app,tests,stories}/ --max-warnings=0",
  "lint-fix": "oxlint --fix ./{app,tests,stories}/",
  "lint-quiet": "oxlint --quiet ./{app,tests,stories}/",
  "format": "oxfmt --check \"./{app,tests,stories}/**/*.{ts,tsx}\"",
  "format-fix": "oxfmt --write \"./{app,tests,stories}/**/*.{ts,tsx}\"",
  "pre-commit": "npm run typecheck && npm run lint-fix && npm run format-fix"
}
```

注意: oxlintとoxfmtのCLIオプションは実行時に確認し、正確なフラグを使用する。

---

## Step 4: 設定ファイルの削除

- `eslint.config.js` を削除
- `.prettierrc.json` を削除

---

## Step 5: フォーマット・リントの実行と修正

### 5-1. oxfmtでフォーマット

```bash
npx oxfmt --write "./{app,tests,stories}/**/*.{ts,tsx}"
```

importソートの変更により差分が出る可能性がある。

### 5-2. oxlintでリント

```bash
npx oxlint ./{app,tests,stories}/ --max-warnings=0
```

エラーがあれば修正する。

### 5-3. TypeScript型チェック

```bash
npm run typecheck
```

importの並び替えで型エラーが発生しないことを確認。

---

## Step 6: CI設定の更新

### `.github/workflows/push.yml`

lint jobのコマンドが npm scripts 経由であれば変更不要。
直接ESLint/Prettierを呼んでいる箇所があれば修正する。

---

## Step 7: CLAUDE.md の更新

- Code Qualityセクションのツール名を更新（ESLint → oxlint, Prettier → oxfmt）
- 設定ファイルの参照先を更新

---

## リスクと対策

| リスク | 対策 |
|--------|------|
| oxlintがESLintのルールを完全にカバーしていない可能性 | 移行ツールの出力を確認し、未対応ルールをリストアップ。重要なルールは手動で`.oxlintrc.json`に追加 |
| oxfmtのフォーマット結果がPrettierと微妙に異なる可能性 | 差分を確認し、許容範囲か判断。必要に応じて設定調整 |
| `sortImports`の挙動が現在の`import-x/order`と異なる可能性 | グループ設定を調整して現在の順序に近づける |
| `globals` パッケージがESLint以外で使用されている可能性 | 削除前に他の参照がないか確認 |

---

## 参考リンク

- [oxlint公式ドキュメント](https://oxc.rs/docs/guide/usage/linter.html)
- [oxfmt公式ドキュメント](https://oxc.rs/docs/guide/usage/formatter)
- [oxfmt設定リファレンス](https://oxc.rs/docs/guide/usage/formatter/config-file-reference)
- [oxfmt sortImportsドキュメント](https://oxc.rs/docs/guide/usage/formatter/sorting.html)
- [Prettierからの移行ガイド](https://oxc.rs/docs/guide/usage/formatter/migrate-from-prettier)
- [@oxlint/migrate](https://github.com/oxc-project/oxlint-migrate)
- [参考PR: after_works-v006 #193](https://github.com/InumberX/after_works-v006/pull/193)
