# Good 例（推奨パターン）

既存のコードから取った、規約どおりの書き方。コードは要点だけに縮めている。全体は各ファイルを読む。

## 1. コンポーネントのディレクトリ

```
app/ui/buttons/public/base-button/
  base-button.tsx          コンポーネント
  base-button.types.ts     型だけ（BaseButtonProps）
  base-button.styles.ts    レシピ
  base-button.test.tsx     テスト
```

`public/` の中にあるのは、ハイドレートする部品（一覧の検索フォーム）が使うため。

## 2. コンポーネントの実装

```tsx
// app/ui/buttons/public/base-button/base-button.tsx
import { css, type Handle } from 'remix/component'

import { PrimitiveButton } from '../../../primitives/buttons/public/primitive-button/primitive-button.tsx'
import * as styles from './base-button.styles.ts'
import type { BaseButtonProps } from './base-button.types.ts'

export type * from './base-button.types.ts'

export function BaseButton(handle: Handle<BaseButtonProps>) {
  return () => {
    const { size = 'medium', variant = 'contained', color = 'primary', leftElm, rightElm,
      styleOverrides, children, ...forwarded } = handle.props

    return (
      <PrimitiveButton
        {...forwarded}
        styleOverrides={{
          ...styles.baseButton,
          ...styles.baseButtonSizes[size],
          ...styles.baseButtonVariants[variant],
          ...styles.baseButtonColors[color][variant],
          ...(forwarded.isDisabled ? styles.baseButton__disabled : null),
          ...styleOverrides,
        }}
      >
        <span mix={css(styles.baseButton_container)}>
          {leftElm}
          <span mix={css(styles.baseButton_text)}>{children}</span>
          {rightElm}
        </span>
      </PrimitiveButton>
    )
  }
}
```

- `function` 宣言で、`handle.props` から読む。状態は setup の変数に置き、変えたら `handle.update()` を呼ぶ
- 名前空間 import の `styles`、上書きは `styleOverrides`、スロットは `leftElm` / `rightElm`
- レシピを 1 回の `css(...)` にスプレッドしている（ここでは primitive がその `css(...)` を呼ぶ）
- 見た目を決めるのはこの層で、要素の選択とアクセシビリティは `PrimitiveButton` に任せる

## 3. レシピ

```ts
// app/ui/layouts/layout-inner/layout-inner.styles.ts
import { MEDIA_QUERY } from '../../styles/public/media-query.ts'
import type { StyleRecipe } from '../../styles/public/mixins.ts'

export const layoutInner: StyleRecipe = {
  marginInline: 'auto',
  paddingInline: 'var(--layout-inner-padding-xs)',
  inlineSize: '100%',
  [MEDIA_QUERY.SM]: { paddingInline: 'var(--layout-inner-padding-sm)' },
  [MEDIA_QUERY.MD]: { paddingInline: 'var(--layout-inner-padding-md)' },
}

export const layoutInner__large: StyleRecipe = {
  maxInlineSize: 'var(--layout-inner-max-width-large)',
}

export const layoutInnerSizes = { large: layoutInner__large, /* … */ }
```

- プレーンなレシピを export する
- 論理プロパティ、`MEDIA_QUERY` の定数、`app.css` のカスタムプロパティ
- 修飾子は名前を持つ定数で、対応表（`layoutInnerSizes`）はそれを指す

## 4. ホバー

```ts
[MEDIA_QUERY.HOVER]: { '&:hover': { color: 'var(--color-font-primary)' } },
```

## 5. ルートとリンク

```ts
// app/routes.ts
drinks: {
  index: get('/(:lang/)drinks'),
  show: get('/(:lang/)drinks/:drinkId'),
},
```

```tsx
<BaseButton url={routes.drinks.index.href({ lang: toLangParam(lang) })}>…</BaseButton>
```

- メソッドを明示し、パターンはリテラルのまま。公開ページには省略できる言語の区切り
- リンクは `href()` から作り、日本語では `toLangParam` が `/ja` を落とす

## 6. controller・データの読み込み・ページ

```tsx
// app/actions/drinks/controller.tsx
export default createController(routes.drinks, {
  middleware: [lang()],
  actions: {
    async show(context) {
      const data = await loadShowPage(context.lang, context.params.drinkId)
      if (data instanceof Response) return data
      return context.render(<ShowPage lang={context.lang} url={context.url} {...data} />)
    },
  },
})
```

```ts
// app/actions/drinks/show-page/show-page.data.ts
export const loadShowPage = async (lang: Lang, drinkId: string): Promise<ShowPageData | Response> => {
  // 互いに待つ必要のない要求は先にすべて始め、必要な順に待つ
  const termsRequest = getDrinkTerms(lang)
  const latestRequest = getDrinks({ page: 1, pageSize: ROW_SIZE })
  const detailRequest = getDrinkDetail(drinkId)

  const detail = await detailRequest
  if (!detail.success) return apiErrorResponse(detail, { notFound: true })
  const terms = await termsRequest
  if (!terms.success) return apiErrorResponse(terms)
  // …
}
```

- ルートエリアの controller に `lang()`、`app/router.ts` に `router.map(routes.drinks, drinksController)`
- データは `show-page.data.ts` で読み、互いに依存しない API の要求は並行して始める。失敗は素の `Response` で返す。見た目はエラーページのミドルウェアが付ける
- ページのコンポーネントは props だけで描く

## 7. ハイドレートする部品

```tsx
// app/actions/drinks/show-page/public/components/article-slider/article-slider.tsx
export const ArticleSlider = clientEntry(
  clientModuleUrl('app/actions/drinks/show-page/public/components/article-slider/article-slider.tsx'),
  function ArticleSlider(handle: Handle<ArticleSliderProps>) {
    // …
  }
)
```

- ページの `public/components/` の中にあり、実行時の依存もすべて `public/` の内側
- `clientModuleUrl` で自分のファイルを指し、名前付き関数を渡す
- ページは `Document` に `hasClientEntries` を渡す。テストで `rmx-data` の URL を確かめる

## 8. 文言

```ts
// app/actions/drinks/show-page/show-page.tsx（抜粋）
const MESSAGES = defineMessages({
  ja: { relatedDrinks: (category: string) => `${category}のお酒`, latestDrinks: '新着のお酒' },
  en: { relatedDrinks: (category: string) => `${category} Drinks`, latestDrinks: 'Latest Drinks' },
})

const messages = MESSAGES[lang]
messages.relatedDrinks(category.label)
```

- 文言は使う部品の横に置く。日本語が型を決め、英語の抜けは型エラーになる
- ヘッダーのメニューにも出るページ名（「お酒一覧」など）はここに書かず、`PAGE_NAMES[lang]` から読む

## 9. テスト

```ts
import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { drinkDetailFixture, drinkFixture, mockKuroco } from '../../../../test/kuroco.ts'
import { router } from '../../../router.ts'

const kubota = drinkFixture()

describe('drinks.show', () => {
  it('renders a drink', async (t) => {
    mockKuroco(t, { '/drinks/kubota': drinkDetailFixture(kubota) })
    const response = await router.fetch(new Request('http://localhost/drinks/kubota'))
    assert.equal(response.status, 200)
  })
})
```

- 対象の横に置き、`remix/test` と `remix/assert` の名前空間 import を使う
- API を使うページは `mockKuroco(t, …)` を呼ぶ。既定で答えるのは一覧・種類・タグだけで、お酒の詳細などはパスごとに渡す（知らないパスへの要求は例外になる）
