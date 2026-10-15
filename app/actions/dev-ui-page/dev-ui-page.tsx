// Development-only gallery. It renders every component in app/ui/ through the
// same server render pipeline the real pages use, so a specimen here cannot
// diverge from what ships.
import { css, type Handle } from 'remix/component'

import { routes } from '../../routes.ts'
import { BaseButton } from '../../ui/buttons/base-button/base-button.tsx'
import { TextButton } from '../../ui/buttons/text-button/text-button.tsx'
import { ArticleCard } from '../../ui/cards/article-card/article-card.tsx'
import * as svgIconStyles from '../../ui/icons/svg-icon/svg-icon.styles.ts'
import { SvgIcon } from '../../ui/icons/svg-icon/svg-icon.tsx'
import type { SvgIconVariant } from '../../ui/icons/svg-icon/svg-icon.types.ts'
import { LayoutInner } from '../../ui/layouts/layout-inner/layout-inner.tsx'
import { LayoutMain } from '../../ui/layouts/layout-main/layout-main.tsx'
import { LayoutPageWrapper } from '../../ui/layouts/layout-page-wrapper/layout-page-wrapper.tsx'
import { LayoutSection } from '../../ui/layouts/layout-section/layout-section.tsx'
import { LayoutWrapper } from '../../ui/layouts/layout-wrapper/layout-wrapper.tsx'
import { ArticleCardList } from '../../ui/lists/article-card-list/article-card-list.tsx'
import { BaseTagList } from '../../ui/lists/base-tag-list/base-tag-list.tsx'
import { PrimitiveButton } from '../../ui/primitives/buttons/primitive-button/primitive-button.tsx'
import { BaseTag } from '../../ui/tags/base-tag/base-tag.tsx'
import { PageTitle } from '../../ui/typographies/page-title/page-title.tsx'
import { ReplaceNewLineText } from '../../ui/typographies/replace-new-line-text/replace-new-line-text.tsx'
import type { Lang } from '../../utils/i18n.ts'
import { Document } from '../document.tsx'
import { Block } from './components/block/block.tsx'
import { Section } from './components/section/section.tsx'
import { Specimen } from './components/specimen/specimen.tsx'
import { Stage } from './components/stage/stage.tsx'
import * as styles from './dev-ui-page.styles.ts'

const PAGE_TITLE = 'UI ギャラリー'

const SVG_ICON_VARIANTS = Object.keys(svgIconStyles.svgIconVariants) as SvgIconVariant[]

/** Sample tags: a category and a tag, both linking to a filtered list. */
const EXAMPLE_TAGS = [
  { url: routes.drinks.index.href(null, { searchParams: { drink: 1 } }), children: 'ビール' },
  { url: routes.drinks.index.href(null, { searchParams: { tag: 1 } }), children: 'すっきり' },
]

/** Sample cards: with and without a thumbnail, a long title, and one without a link. */
const EXAMPLE_CARDS = [
  {
    url: routes.drinks.index.href(),
    title: { text: 'サムネイルなし（空の 16:9 画像）' },
    description: { text: '2024/01/01' },
    tags: EXAMPLE_TAGS,
  },
  {
    url: routes.drinks.index.href(),
    title: {
      text: 'タイトルが長い場合は 3 行で省略される。タイトルが長い場合は 3 行で省略される。タイトルが長い場合は 3 行で省略される。',
    },
    description: { text: '2024/02/02' },
    thumbnail: { src: '/assets/img/img-category-sake.webp', alt: '日本酒' },
  },
  {
    title: { text: 'url なし（リンクにならない）' },
    description: { text: '2024/03/03' },
  },
]

export function DevUiPage(handle: Handle<{ lang: Lang; url: URL }>) {
  return () => (
    <Document
      lang={handle.props.lang}
      url={handle.props.url}
      meta={{ title: PAGE_TITLE, robots: 'noindex, nofollow' }}
    >
      <main mix={css(styles.devUiPage)}>
        {/* The target of the `#top` hash-link specimen below. */}
        <h1 id="top" mix={css(styles.devUiPage_heading)}>
          {PAGE_TITLE}
        </h1>

        <Section title="PrimitiveButton" note="骨組みのみ。色・字送り・モーションを持たない">
          <Specimen label="url（内部リンク）">
            <PrimitiveButton url={routes.home.href()}>トップへ</PrimitiveButton>
          </Specimen>
          <Specimen label="url（外部リンク・data-rmx-document）">
            <PrimitiveButton url="https://remix.run" target="_blank" rel="noopener noreferrer">
              remix.run
            </PrimitiveButton>
          </Specimen>
          <Specimen label="url（ハッシュ）">
            <PrimitiveButton url="#top">ページ先頭へ</PrimitiveButton>
          </Specimen>
          <Specimen label="url + isDisabled（href なし・キーボードでも辿れない）">
            <PrimitiveButton url={routes.home.href()} isDisabled>
              無効なリンク
            </PrimitiveButton>
          </Specimen>
          <Specimen label="buttonType=button">
            <PrimitiveButton buttonType="button">ボタン</PrimitiveButton>
          </Specimen>
          <Specimen label="buttonType=submit">
            <PrimitiveButton buttonType="submit">送信</PrimitiveButton>
          </Specimen>
          <Specimen label="isDisabled">
            <PrimitiveButton buttonType="button" isDisabled>
              無効
            </PrimitiveButton>
          </Specimen>
          <Specimen label="nonClickableTag=span（不活性）">
            <PrimitiveButton nonClickableTag="span">ラベルのみ</PrimitiveButton>
          </Specimen>
        </Section>

        <Section title="BaseButton" note="プリミティブの上にデザイン判断を載せた層">
          <Specimen label="size=large / medium（既定）/ small">
            <BaseButton buttonType="button" size="large">
              Large
            </BaseButton>
            <BaseButton buttonType="button">Medium</BaseButton>
            <BaseButton buttonType="button" size="small">
              Small
            </BaseButton>
          </Specimen>
          <Specimen label="variant=outlined">
            <BaseButton buttonType="button" variant="outlined">
              Outlined
            </BaseButton>
          </Specimen>
          <Specimen label="url（アンカーとして描画）">
            <BaseButton url={routes.home.href()}>トップへ</BaseButton>
          </Specimen>
          <Specimen label="leftElm / rightElm">
            <BaseButton buttonType="button" leftElm={<span aria-hidden="true">←</span>}>
              戻る
            </BaseButton>
            <BaseButton buttonType="button" rightElm={<span aria-hidden="true">→</span>}>
              進む
            </BaseButton>
          </Specimen>
          <Specimen label="isDisabled（contained / outlined / url）">
            <BaseButton buttonType="button" isDisabled>
              無効
            </BaseButton>
            <BaseButton buttonType="button" variant="outlined" isDisabled>
              無効
            </BaseButton>
            <BaseButton url={routes.home.href()} isDisabled>
              無効なリンク
            </BaseButton>
          </Specimen>
        </Section>

        <Section title="TextButton" note="枠を持たない文字だけのボタン。ホバーで下線">
          <Specimen label="size=large / medium（既定）/ small">
            <TextButton url={routes.home.href()} size="large">
              Large
            </TextButton>
            <TextButton url={routes.home.href()}>Medium</TextButton>
            <TextButton url={routes.home.href()} size="small">
              Small
            </TextButton>
          </Specimen>
          <Specimen label="color=primary（既定）/ sub / subDark">
            <TextButton url={routes.home.href()}>primary</TextButton>
            <TextButton url={routes.home.href()} color="sub">
              sub
            </TextButton>
            <TextButton url={routes.home.href()} color="subDark">
              subDark
            </TextButton>
          </Specimen>
          <Specimen label="leftElm（SvgIcon）/ isDisabled">
            <TextButton
              buttonType="button"
              color="subDark"
              leftElm={
                <SvgIcon
                  variant="replay"
                  styleOverrides={{ backgroundColor: 'currentColor', inlineSize: '20px' }}
                />
              }
            >
              条件をクリア
            </TextButton>
            <TextButton buttonType="button" isDisabled>
              無効
            </TextButton>
          </Specimen>
        </Section>

        <Section
          title="SvgIcon"
          note="SVG をマスクにして背景色で塗る。title がなければ装飾として隠す"
        >
          <Specimen label="variant（すべて）">
            {SVG_ICON_VARIANTS.map((variant) => (
              <SvgIcon key={variant} variant={variant} title={variant} />
            ))}
          </Specimen>
          <Specimen label="styleOverrides（色と大きさ）">
            <SvgIcon
              variant="liquor"
              styleOverrides={{ backgroundColor: 'var(--color-font-primary)', inlineSize: '40px' }}
            />
          </Specimen>
        </Section>

        <Section
          title="BaseTag / BaseTagList"
          note="カードと記事の分類。リンクとボタンだけがホバーで反転する"
        >
          <Specimen label="variant=contained（既定）/ outlined">
            <BaseTag url={routes.drinks.index.href()}>contained</BaseTag>
            <BaseTag url={routes.drinks.index.href()} variant="outlined">
              outlined
            </BaseTag>
          </Specimen>
          <Specimen label="nonClickableTag（ホバーしない）/ isDisabled">
            <BaseTag nonClickableTag="span">ラベルのみ</BaseTag>
            <BaseTag url={routes.drinks.index.href()} isDisabled>
              無効
            </BaseTag>
          </Specimen>
          <Specimen label="BaseTagList align=left（既定）/ right">
            <Stage>
              <BaseTagList items={EXAMPLE_TAGS} />
              <BaseTagList items={EXAMPLE_TAGS} align="right" />
            </Stage>
          </Specimen>
        </Section>

        <Section title="Typographies" note="ページの見出しと、改行を含む CMS のテキスト">
          <Specimen label="PageTitle color=dark（既定）/ primary（h2 で表示）">
            <Stage>
              <PageTitle title="お酒一覧" titleTag="h2" />
              <PageTitle title="お酒一覧" titleTag="h2" color="primary" />
            </Stage>
          </Specimen>
          <Specimen label="ReplaceNewLineText（\n を <br> にする）">
            <p>
              <ReplaceNewLineText text={'一行目\n二行目\n<b>タグはエスケープされる</b>'} />
            </p>
          </Specimen>
        </Section>

        <Section
          title="ArticleCard / ArticleCardList"
          note="タイトル・日付・サムネイルが同じページへのリンク"
        >
          <Specimen label="ArticleCard（単体）">
            <Stage>
              <ArticleCard {...EXAMPLE_CARDS[0]} articleTag="div" />
            </Stage>
          </Specimen>
          <Specimen label="ArticleCardList itemSize=medium（既定）">
            <Stage>
              <ArticleCardList items={EXAMPLE_CARDS} />
            </Stage>
          </Specimen>
          <Specimen label="ArticleCardList itemSize=small / twoColumns">
            <Stage>
              <ArticleCardList items={EXAMPLE_CARDS} itemSize="small" />
              <ArticleCardList items={EXAMPLE_CARDS.slice(0, 2)} itemSize="twoColumns" />
            </Stage>
          </Specimen>
        </Section>

        <Section
          title="Layouts"
          note="構造のみを持つ。実寸だと画面を占有するため styles で縮めて表示している"
        >
          <Specimen label="LayoutWrapper（フルハイトの列。ここでは 160px に縮小）">
            <Stage>
              <LayoutWrapper styleOverrides={{ minBlockSize: '160px' }}>
                <Block label="header" />
                <Block label="body" grow />
                <Block label="footer" />
              </LayoutWrapper>
            </Stage>
          </Specimen>

          {/* tag="div": this page already has its <main>, and there may be only one. */}
          <Specimen label="LayoutMain（コンテナを開き、白い面を敷く。ここでは tag=div）">
            <Stage>
              <LayoutMain tag="div">
                <Block label="container-name: layout-main" />
              </LayoutMain>
            </Stage>
          </Specimen>

          <Specimen label="LayoutPageWrapper（ヘッダー分の上下余白）">
            <Stage>
              <LayoutPageWrapper>
                <Block label="page body" />
              </LayoutPageWrapper>
            </Stage>
          </Specimen>

          <Specimen label="LayoutPageWrapper isTopNoSpace / isBottomNoSpace">
            <Stage>
              <LayoutPageWrapper isTopNoSpace>
                <Block label="上余白なし" />
              </LayoutPageWrapper>
              <LayoutPageWrapper isBottomNoSpace>
                <Block label="下余白なし" />
              </LayoutPageWrapper>
            </Stage>
          </Specimen>

          <Specimen label="LayoutSection topSpace / bottomSpace = none / small / medium（既定）">
            <Stage>
              <LayoutSection topSpace="none" bottomSpace="none">
                <Block label="none" />
              </LayoutSection>
              <LayoutSection topSpace="small" bottomSpace="small">
                <Block label="small" />
              </LayoutSection>
              <LayoutSection>
                <Block label="medium" />
              </LayoutSection>
            </Stage>
          </Specimen>

          <Specimen label="LayoutInner size=large（既定）/ full">
            <Stage>
              <LayoutInner>
                <Block label="large" />
              </LayoutInner>
              <LayoutInner size="full">
                <Block label="full" />
              </LayoutInner>
            </Stage>
          </Specimen>

          <Specimen label="入れ子（Wrapper > Main > PageWrapper > Section > Inner）">
            <Stage>
              <LayoutWrapper styleOverrides={{ minBlockSize: '0' }}>
                <LayoutMain tag="div">
                  <LayoutPageWrapper isTopNoSpace isBottomNoSpace>
                    <LayoutSection>
                      <LayoutInner>
                        <Block label="content" />
                      </LayoutInner>
                    </LayoutSection>
                  </LayoutPageWrapper>
                </LayoutMain>
              </LayoutWrapper>
            </Stage>
          </Specimen>
        </Section>
      </main>
    </Document>
  )
}
