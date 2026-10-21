# Bad 例（アンチパターン）

指摘の対象になる書き方と、その直し方。どれも `rules/style/*.md` のアンチパターンの具体例。

## 1. ❌ ディレクトリとファイルの名前

```
# Bad — React Router 版の名残
app/ui/buttons/BaseButton/index.tsx
app/ui/buttons/BaseButton/style.css.ts

# Good
app/ui/buttons/public/base-button/base-button.tsx
app/ui/buttons/public/base-button/base-button.styles.ts
```

## 2. ❌ コンポーネントの書き方が React のまま

```tsx
// Bad — 引数で props を受け取る・フックで状態を持つ
export const Counter = ({ initial }: CounterProps) => {
  const [count, setCount] = useState(initial)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}

// Good — function 宣言、setup の変数、handle.update()
export function Counter(handle: Handle<CounterProps>) {
  let count = handle.props.initial
  return () => (
    <button mix={on('click', () => { count += 1; handle.update() })}>{count}</button>
  )
}
```

## 3. ❌ ディスクリプタを export する・重ねて上書きする

```ts
// Bad — base-button.styles.ts
export const baseButton = css({ display: 'inline-flex' })
```

```tsx
// Bad — 優先順位が描画順で変わる
<button mix={[css(styles.baseButton), css(styleOverrides)]} />
```

```ts
// Good
export const baseButton: StyleRecipe = { display: 'inline-flex' }
```

```tsx
// Good
<button mix={css({ ...styles.baseButton, ...styleOverrides })} />
```

## 4. ❌ 浅いスプレッドで消える宣言

```ts
// Bad — 後ろの [MEDIA_QUERY.SM] が前のブロックを丸ごと置き換え、paddingInline が消える
export const card: StyleRecipe = { [MEDIA_QUERY.SM]: { paddingInline: '16px', gap: '8px' } }
export const card__wide: StyleRecipe = { [MEDIA_QUERY.SM]: { gap: '16px' } }

// Good — 残したい宣言も書き直す
export const card__wide: StyleRecipe = { [MEDIA_QUERY.SM]: { paddingInline: '16px', gap: '16px' } }
```

## 5. ❌ レシピの命名

```ts
// Bad
export const styleArticleCard = { … }        // style 接頭辞
export const articleCard__title = { … }      // 要素に __
export const articleCard_title_text = { … }  // 要素の要素

// Good
export const articleCard = { … }
export const articleCard_title = { … }
export const articleCardTitle_text = { … }   // 別のブロック名にする
```

## 6. ❌ メディアクエリ・ホバー

```ts
// Bad
'@media (min-width: 768px)': { … }
'@media (max-width: 767px)': { … }
'&:hover': { opacity: 0.7 }
const mq = (bp: number) => `@media (width >= ${bp}px)`   // string を返す関数は計算キーにできない

// Good
[MEDIA_QUERY.MD]: { … }
[MEDIA_QUERY_REVERSE.MD]: { … }
[MEDIA_QUERY.HOVER]: { '&:hover': { opacity: 'var(--opacity-hover)' } }
```

## 7. ❌ 物理プロパティ・リテラルの値

```ts
// Bad
{ width: '100%', marginLeft: 'auto', color: '#2f3a3a', fontSize: '14px', WebkitLineClamp: 3 }

// Good
{ inlineSize: '100%', marginInlineStart: 'auto', color: 'var(--color-font-base)',
  ...fontMedium, ...getLineClamp(3) }
```

## 8. ❌ primitive にデザインを持たせる

```ts
// Bad — primitive-button.styles.ts
export const primitiveButton: StyleRecipe = { color: 'var(--color-font-primary)', borderRadius: '8px' }

// Good — primitive はリセットだけ。色や角丸は base-button 側が styleOverrides で渡す
export const primitiveButton: StyleRecipe = { color: 'inherit', font: 'inherit' }
```

## 9. ❌ ルートとリンク

```ts
// Bad
home: '/',                         // メソッドがない（POST や DELETE にも応答する）
drinks: get(`/${DRINKS}`),         // パターンがリテラルでない
```

```tsx
// Bad
<a href={`/en/drinks/${id}`}>…</a>
<a href="/ja/drinks/">…</a>        // /ja と末尾の / は付けない

// Good
<a href={routes.drinks.show.href({ lang: toLangParam(lang), drinkId: id })}>…</a>
```

## 10. ❌ 置き場所

```
# Bad — 一覧ページだけが使うページネーションを app/ui/ へ
app/ui/paginations/base-pagination/

# Good — 2 つ目のルートエリアが使うまではページの近く
app/actions/drinks/index-page/components/base-pagination/

# Bad — 新しい「何でも置き場」
app/lib/  app/components/  app/controllers/  app/helpers.ts
```

## 11. ❌ ページのコンポーネントで API を呼ぶ・エラーを HTML で返す

```tsx
// Bad
async show(context) {
  const result = await getDrinkDetail(context.params.drinkId)
  if (!result.success) return context.render(<p>{result.message}</p>, { status: result.status })
  // …
}

// Good — 読み込みは show-page.data.ts、失敗は素の Response
const data = await loadShowPage(context.lang, context.params.drinkId)
if (data instanceof Response) return data
```

## 12. ❌ ハイドレーション

```tsx
// Bad — import.meta.url は束ねると使えない。アロー関数はエクスポート名がない
export const SearchForm = clientEntry(import.meta.url, (handle: Handle<Props>) => () => …)

// Bad — public/ の外の値を import している（build-client が IMPORT_NOT_ALLOWED で失敗）
// app/actions/drinks/index-page/public/components/search-form/search-form.tsx
import { MESSAGES } from '../../../index-page.tsx'

// Good
export const SearchForm = clientEntry(
  clientModuleUrl('app/actions/drinks/index-page/public/components/search-form/search-form.tsx'),
  function SearchForm(handle: Handle<SearchFormProps>) { … }
)
```

```tsx
// Bad — nonce がないと CSP に止められる
<script>{inline}</script>

// Good
<script nonce={nonce}>{inline}</script>   // nonce は setup で useCspNonce(handle)
```

## 13. ❌ 環境変数とテスト

```ts
// Bad — app/env.ts 以外で process.env を読む
const apiUrl = process.env.API_URL

// Good
import { API_URL } from '../env.ts'
```

```ts
// Bad — 失敗しても npm test が成功になる（lint でも検出）
import { describe, it } from 'node:test'

// Bad — API を使うページなのに mockKuroco がなく、本物の API に通信する
it('renders the list', async () => {
  const response = await router.fetch(new Request('http://localhost/drinks'))
})

// Good
import { describe, it } from 'remix/test'
it('renders the list', async (t) => {
  mockKuroco(t)
  const response = await router.fetch(new Request('http://localhost/drinks'))
})
```
