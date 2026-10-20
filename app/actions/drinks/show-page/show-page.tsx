// Ported from develop: app/routes/($lang)._public._layout.drinks.$drinkId._index (SG20_101)
// and `convertDrinkToBaseArticleProps` from app/utils/article.ts
import { css, type Handle } from 'remix/component'

import type { Term } from '../../../data/terms.types.ts'
import { routes } from '../../../routes.ts'
import { BaseButton } from '../../../ui/buttons/public/base-button/base-button.tsx'
import { LayoutInner } from '../../../ui/layouts/layout-inner/layout-inner.tsx'
import { LayoutPageWrapper } from '../../../ui/layouts/layout-page-wrapper/layout-page-wrapper.tsx'
import { LayoutPublic } from '../../../ui/layouts/layout-public/layout-public.tsx'
import { LayoutSection } from '../../../ui/layouts/layout-section/layout-section.tsx'
import { toDrinkTags } from '../../../utils/drink-card.ts'
import { defineMessages, type Lang, toLangParam } from '../../../utils/i18n.ts'
import { Document } from '../../document.tsx'
import type { ArticleInfoItem } from './components/article-info/article-info.types.ts'
import { BaseArticle } from './components/base-article/base-article.tsx'
import type { BaseArticleProps } from './components/base-article/base-article.types.ts'
import { CardRow } from './components/card-row/card-row.tsx'
import type { ShowPageData } from './show-page.data.ts'
import * as styles from './show-page.styles.ts'

export type ShowPageProps = ShowPageData & {
  lang: Lang
  url: URL
}

// develop's locales/<lang>/pages/SG20_101.json, the info titles develop wrote
// into convertDrinkToBaseArticleProps, and the slider's buttons, which develop
// labelled 「前へ」「次へ」 in both languages. The thumbnail labels are new:
// develop's thumbnails were buttons with only the image's alt to name them.
const MESSAGES = defineMessages({
  ja: {
    relatedDrinks: (category: string) => `${category}のお酒`,
    latestDrinks: '新着のお酒',
    backToList: '一覧に戻る',
    category: '種類',
    manufacturer: '製造元',
    abv: 'アルコール度数',
    comment: 'コメント',
    links: 'リンク',
    prevSlide: '前へ',
    nextSlide: '次へ',
    showSlide: (n: number) => `${n}枚目の画像を表示`,
  },
  en: {
    relatedDrinks: (category: string) => `${category} Drinks`,
    latestDrinks: 'Latest Drinks',
    backToList: 'Back to List',
    category: 'Category',
    manufacturer: 'Manufacturer',
    abv: 'Alcohol content',
    comment: 'Comment',
    links: 'Links',
    prevSlide: 'Previous',
    nextSlide: 'Next',
    showSlide: (n: number) => `Show image ${n}`,
  },
})

type Messages = (typeof MESSAGES)[Lang]

export function ShowPage(handle: Handle<ShowPageProps>) {
  return () => {
    const { lang, url, drink, category, categories, tagGroups, related, latest } = handle.props
    const messages = MESSAGES[lang]
    const article = toArticleProps({ drink, lang, category, categories, tagGroups, messages })

    return (
      <Document
        lang={lang}
        url={url}
        meta={{ title: article.title, ogImage: drink.thumbnail ? drink.thumbnail.url : undefined }}
        // The slider does nothing for one image, so it ships no JavaScript then.
        hasClientEntries={article.mainVisuals.length > 1}
      >
        <LayoutPublic lang={lang} url={url}>
          <LayoutPageWrapper isBottomNoSpace>
            <LayoutSection tag="div">
              <LayoutInner>
                <BaseArticle {...article} />
              </LayoutInner>
            </LayoutSection>
            {category && <CardRow title={messages.relatedDrinks(category.label)} cards={related} />}
            <CardRow title={messages.latestDrinks} cards={latest} />
            <LayoutSection tag="div" topSpace="small">
              <LayoutInner>
                <div mix={css(styles.drinkBottom_container)}>
                  <BaseButton
                    url={routes.drinks.index.href({ lang: toLangParam(lang) })}
                    size="large"
                  >
                    {messages.backToList}
                  </BaseButton>
                </div>
              </LayoutInner>
            </LayoutSection>
          </LayoutPageWrapper>
        </LayoutPublic>
      </Document>
    )
  }
}

/** The drink in one language, each fact left out when the CMS has none. */
const toArticleProps = ({
  drink,
  lang,
  category,
  categories,
  tagGroups,
  messages,
}: Pick<ShowPageProps, 'drink' | 'lang' | 'categories' | 'tagGroups'> & {
  category: Term | undefined
  messages: Messages
}): BaseArticleProps => {
  const en = lang === 'en'
  const manufacturer = en ? drink.manufacturer_en : drink.manufacturer
  const comment = en ? drink.comment_en : drink.comment
  const links = drink.links
    .map((link) => ({
      text: en ? link.link_text_en : link.link_text,
      url: en ? link.link_url_en : link.link_url,
    }))
    .filter((link) => link.text && link.url)
  const info: ArticleInfoItem[] = [
    ...(category ? [{ title: messages.category, text: category.label }] : []),
    ...(manufacturer ? [{ title: messages.manufacturer, text: manufacturer }] : []),
    // develop's truthiness check, so a 0% drink shows no strength either.
    ...(drink.abv ? [{ title: messages.abv, text: `${drink.abv}%` }] : []),
    ...(comment ? [{ title: messages.comment, text: comment }] : []),
    ...(links.length > 0 ? [{ title: messages.links, links }] : []),
  ]

  return {
    title: en ? drink.subject_en : drink.subject,
    mainVisuals: drink.main_visuals.map((visual, i) => ({
      src: visual.main_visual_image.url,
      alt: (en ? visual.main_visual_title_en : visual.main_visual_title) ?? '',
      thumbnailLabel: messages.showSlide(i + 1),
    })),
    info,
    tags: toDrinkTags({ drink, lang, categories, tagGroups }),
    sliderMessages: { prev: messages.prevSlide, next: messages.nextSlide },
  }
}
