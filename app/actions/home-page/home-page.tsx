// Ported from develop: app/routes/($lang)._public._layout._index (SG10_100)
import { css, type Handle } from 'remix/component'

import { SITE_NAME } from '../../env.ts'
import { routes } from '../../routes.ts'
import { BaseButton } from '../../ui/buttons/public/base-button/base-button.tsx'
import { LayoutInner } from '../../ui/layouts/layout-inner/layout-inner.tsx'
import { LayoutPageWrapper } from '../../ui/layouts/layout-page-wrapper/layout-page-wrapper.tsx'
import { LayoutPublic } from '../../ui/layouts/layout-public/layout-public.tsx'
import { LayoutSection } from '../../ui/layouts/layout-section/layout-section.tsx'
import { ArticleCardList } from '../../ui/lists/article-card-list/article-card-list.tsx'
import { PrimitiveButton } from '../../ui/primitives/buttons/public/primitive-button/primitive-button.tsx'
import { PageTitle } from '../../ui/typographies/page-title/page-title.tsx'
import { ReplaceNewLineText } from '../../ui/typographies/replace-new-line-text/replace-new-line-text.tsx'
import { SEARCH_DRINKS_CONDITION_KEY, toDrinkSearchHref } from '../../utils/drink-search.ts'
import { defineMessages, type Lang, toLangParam } from '../../utils/i18n.ts'
import { Document } from '../document.tsx'
import { ArticleCompactCardList } from './components/article-compact-card-list/article-compact-card-list.tsx'
import type { HomePageData } from './home-page.data.ts'
import * as styles from './home-page.styles.ts'

export type HomePageProps = HomePageData & {
  lang: Lang
  url: URL
}

// develop's locales/<lang>/pages/SG10_100.json
const MESSAGES = defineMessages({
  ja: {
    lead: 'このサイトでは、管理人がこれまで飲んできた美味しいお酒を独断と偏見で記録しています。\n銘柄、製造元、味わいの特徴を紹介し、気になるお酒があれば販売サイトもご覧いただけます。\nお酒好き、お酒に興味のある方はぜひご活用ください。',
    newArrivals: '新着のお酒',
    newArrivalsMore: 'もっと見る',
    searchCategory: 'カテゴリから探す',
    searchCategoryMore: '他の条件で検索する',
  },
  en: {
    lead: 'On this site, the owner records delicious drinks enjoyed over the years, based on personal taste and preference.\nIt introduces brands, breweries, and flavor profiles, with links to purchase sites for any drinks that catch your interest.\nIf you love drinks or are curious about them, feel free to explore.',
    newArrivals: 'New Arrivals',
    newArrivalsMore: 'See More',
    searchCategory: 'Search by Category',
    searchCategoryMore: 'Search with Other Filters',
  },
})

/** The site-name logo is the page's `<h1>`; its intrinsic size reserves the space. */
const TITLE_LOGO = { src: '/assets/img/img-logo-site-name.svg', width: 480, height: 99 }

// The home page has no page title of its own: `Document` gets no `meta.title`
// and uses the site's base title, as develop did.
export function HomePage(handle: Handle<HomePageProps>) {
  return () => {
    const { lang, url, cards, compactCards, categories } = handle.props
    const messages = MESSAGES[lang]
    const langParam = { lang: toLangParam(lang) }
    const drinksUrl = routes.drinks.index.href(langParam)

    return (
      <Document lang={lang} url={url}>
        <LayoutPublic lang={lang} url={url}>
          <LayoutPageWrapper>
            <div mix={css(styles.home)}>
              <LayoutSection tag="div" bottomSpace="small">
                <LayoutInner>
                  <div mix={css(styles.homeTitle_container)}>
                    <h1 mix={css(styles.homeTitleLogo)}>
                      <img
                        src={TITLE_LOGO.src}
                        alt={SITE_NAME}
                        width={TITLE_LOGO.width}
                        height={TITLE_LOGO.height}
                        mix={css(styles.homeTitleLogo_image)}
                      />
                    </h1>
                    <div>
                      <p mix={css(styles.homeTitleLead_paragraph)}>
                        <ReplaceNewLineText text={messages.lead} />
                      </p>
                    </div>
                  </div>
                </LayoutInner>
              </LayoutSection>

              <LayoutSection topSpace="small">
                <LayoutInner>
                  <div mix={css(styles.homeNewArrivals_container)}>
                    <PageTitle titleTag="h2" color="primary" title={messages.newArrivals} />
                    <div mix={css(styles.homeNewArrivalsList)}>
                      <div mix={css(styles.homeNewArrivalsList_main)}>
                        <ArticleCardList items={cards} itemSize="twoColumns" />
                      </div>
                      {compactCards.length > 0 && (
                        <div mix={css(styles.homeNewArrivalsList_sub)}>
                          <ArticleCompactCardList items={compactCards} />
                        </div>
                      )}
                    </div>
                    <div mix={css(styles.homeNewArrivals_bottom)}>
                      <BaseButton url={drinksUrl} size="large">
                        {messages.newArrivalsMore}
                      </BaseButton>
                    </div>
                  </div>
                </LayoutInner>
              </LayoutSection>

              <LayoutSection>
                <LayoutInner>
                  <div mix={css(styles.homeSearchCategory_container)}>
                    <PageTitle titleTag="h2" color="primary" title={messages.searchCategory} />
                    <div>
                      <ul mix={css(styles.homeSearchCategoryList_items)}>
                        {categories.map((category) => (
                          <li key={category.id}>
                            <PrimitiveButton
                              url={toDrinkSearchHref(
                                lang,
                                SEARCH_DRINKS_CONDITION_KEY.DRINK,
                                category.id
                              )}
                              styleOverrides={styles.homeSearchCategoryListLink}
                            >
                              <div mix={css(styles.homeSearchCategoryListLink_container)}>
                                <figure mix={css(styles.homeSearchCategoryListLinkThumbnail)}>
                                  <img
                                    src={`/assets/img/img-category-${category.slug}.webp`}
                                    alt=""
                                    mix={css(styles.homeSearchCategoryListLinkThumbnail_image)}
                                  />
                                </figure>
                                <h3 mix={css(styles.homeSearchCategoryListLink_title)}>
                                  {category.label}
                                </h3>
                              </div>
                            </PrimitiveButton>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div mix={css(styles.homeSearchCategory_bottom)}>
                      <BaseButton url={drinksUrl} size="large">
                        {messages.searchCategoryMore}
                      </BaseButton>
                    </div>
                  </div>
                </LayoutInner>
              </LayoutSection>
            </div>
          </LayoutPageWrapper>
        </LayoutPublic>
      </Document>
    )
  }
}
