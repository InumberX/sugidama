// Ported from develop: app/routes/($lang)._public._layout.drinks._index (SG20_100)
import { css, type Handle } from 'remix/component'

import { routes } from '../../../routes.ts'
import { LayoutInner } from '../../../ui/layouts/layout-inner/layout-inner.tsx'
import { LayoutPageWrapper } from '../../../ui/layouts/layout-page-wrapper/layout-page-wrapper.tsx'
import { LayoutPublic } from '../../../ui/layouts/layout-public/layout-public.tsx'
import { PageTitle } from '../../../ui/typographies/page-title/page-title.tsx'
import { SEARCH_DRINKS_CONDITION_KEY, toDrinkSearchListHref } from '../../../utils/drink-search.ts'
import { defineMessages, type Lang, toLangParam } from '../../../utils/i18n.ts'
import { PAGE_NAMES } from '../../../utils/page-names.ts'
import { Document } from '../../document.tsx'
import { SearchDrinksResult } from './components/search-drinks-result/search-drinks-result.tsx'
import type { IndexPageData } from './index-page.data.ts'
import * as styles from './index-page.styles.ts'
import { SearchDrinksForm } from './public/components/search-drinks-form/search-drinks-form.tsx'

export type IndexPageProps = IndexPageData & {
  lang: Lang
  url: URL
}

// develop's locales/<lang>/pages/SG20_100.json and the error title from
// common.json. The pagination labels are new: develop wrote 「前のページへ」
// in both languages.
const MESSAGES = defineMessages({
  ja: {
    reset: '検索条件をリセット',
    keywordTitle: 'キーワード',
    keywordPlaceholder: 'キーワードを入力してください',
    search: '検索',
    conditionsLabel: '検索条件',
    showConditions: '条件を追加',
    hideConditions: '閉じる',
    selectedCount: { before: '（', after: '件選択中）' },
    drink: 'カテゴリ',
    taste: '味わい',
    drinkability: '飲みやすさ',
    noResultTitle: '検索結果がありません。',
    noResultDescription: '検索結果は0件です。\n条件を再度設定して検索してください。',
    errorTitle: '検索結果の取得に失敗しました',
    errorMessageTitle: 'エラーメッセージ：',
    paginationLabel: 'ページ送り',
    prevPage: '前のページへ',
    nextPage: '次のページへ',
  },
  en: {
    reset: 'Reset search conditions',
    keywordTitle: 'Keyword',
    keywordPlaceholder: 'Enter keyword',
    search: 'Search',
    conditionsLabel: 'Search conditions',
    showConditions: 'Add conditions',
    hideConditions: 'Close',
    selectedCount: { before: ' (', after: ' selected)' },
    drink: 'Category',
    taste: 'Taste',
    drinkability: 'Drinkability',
    noResultTitle: 'No search results.',
    noResultDescription: 'No search results.\nPlease set the conditions again and search again.',
    errorTitle: 'Failed to get search results',
    errorMessageTitle: 'Error message: ',
    paginationLabel: 'Pagination',
    prevPage: 'Previous page',
    nextPage: 'Next page',
  },
})

export function IndexPage(handle: Handle<IndexPageProps>) {
  return () => {
    const { lang, url, categories, tagGroups, search, result } = handle.props
    const messages = MESSAGES[lang]
    const title = PAGE_NAMES[lang].drinks
    const listHref = routes.drinks.index.href({ lang: toLangParam(lang) })
    const toOptions = (terms: { id: number; label: string }[]) =>
      terms.map((term) => ({ value: String(term.id), label: term.label }))
    const vocabularies = [
      { name: SEARCH_DRINKS_CONDITION_KEY.DRINK, terms: categories },
      ...tagGroups,
    ] as const

    return (
      <Document lang={lang} url={url} meta={{ title }} hasClientEntries>
        <LayoutPublic lang={lang} url={url}>
          <LayoutPageWrapper>
            <PageTitle title={title} color="primary" isWrap />
            <LayoutInner>
              <div mix={css(styles.drinks_container)}>
                <div mix={css(styles.drinks_side)}>
                  <SearchDrinksForm
                    action={listHref}
                    resetHref={listHref}
                    keyword={search.keyword}
                    conditions={vocabularies.map(({ name, terms }) => {
                      const options = toOptions(terms)
                      return {
                        name,
                        label: messages[name],
                        options,
                        // Only what a checkbox can show: an id with no option
                        // would be counted but could never be unchecked.
                        selected: search[name]
                          .map(String)
                          .filter((id) => options.some((option) => option.value === id)),
                      }
                    })}
                    messages={{
                      reset: messages.reset,
                      keywordTitle: messages.keywordTitle,
                      keywordPlaceholder: messages.keywordPlaceholder,
                      search: messages.search,
                      conditionsLabel: messages.conditionsLabel,
                      showConditions: messages.showConditions,
                      hideConditions: messages.hideConditions,
                      selectedCount: messages.selectedCount,
                    }}
                  />
                </div>
                <div mix={css(styles.drinks_result)}>
                  <SearchDrinksResult
                    result={result}
                    currentPage={search.page}
                    hrefFor={(page) => toDrinkSearchListHref(lang, search, page)}
                    messages={messages}
                  />
                </div>
              </div>
            </LayoutInner>
          </LayoutPageWrapper>
        </LayoutPublic>
      </Document>
    )
  }
}
