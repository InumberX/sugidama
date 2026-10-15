// Development-only gallery. It renders every component in app/ui/ through the
// same server render pipeline the real pages use, so a specimen here cannot
// diverge from what ships.
import { css, type Handle } from 'remix/component'

import { routes } from '../../routes.ts'
import { BaseButton } from '../../ui/buttons/base-button/base-button.tsx'
import { LayoutInner } from '../../ui/layouts/layout-inner/layout-inner.tsx'
import { LayoutMain } from '../../ui/layouts/layout-main/layout-main.tsx'
import { LayoutPageWrapper } from '../../ui/layouts/layout-page-wrapper/layout-page-wrapper.tsx'
import { LayoutSection } from '../../ui/layouts/layout-section/layout-section.tsx'
import { LayoutWrapper } from '../../ui/layouts/layout-wrapper/layout-wrapper.tsx'
import { PrimitiveButton } from '../../ui/primitives/buttons/primitive-button/primitive-button.tsx'
import type { Lang } from '../../utils/i18n.ts'
import { Document } from '../document.tsx'
import { Block } from './components/block/block.tsx'
import { Section } from './components/section/section.tsx'
import { Specimen } from './components/specimen/specimen.tsx'
import { Stage } from './components/stage/stage.tsx'
import * as styles from './dev-ui-page.styles.ts'

const PAGE_TITLE = 'UI ギャラリー'

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
          <Specimen label="既定（button type=button）">
            <PrimitiveButton>ボタン</PrimitiveButton>
          </Specimen>
          <Specimen label="buttonType=submit">
            <PrimitiveButton buttonType="submit">送信</PrimitiveButton>
          </Specimen>
          <Specimen label="isDisabled">
            <PrimitiveButton isDisabled>無効</PrimitiveButton>
          </Specimen>
          <Specimen label="nonClickableTag=span（不活性）">
            <PrimitiveButton nonClickableTag="span">ラベルのみ</PrimitiveButton>
          </Specimen>
        </Section>

        <Section title="BaseButton" note="プリミティブの上にデザイン判断を載せた層">
          <Specimen label="size=large / medium（既定）/ small">
            <BaseButton size="large">Large</BaseButton>
            <BaseButton>Medium</BaseButton>
            <BaseButton size="small">Small</BaseButton>
          </Specimen>
          <Specimen label="variant=outlined">
            <BaseButton variant="outlined">Outlined</BaseButton>
          </Specimen>
          <Specimen label="url（アンカーとして描画）">
            <BaseButton url={routes.home.href()}>トップへ</BaseButton>
          </Specimen>
          <Specimen label="leftElm / rightElm">
            <BaseButton leftElm={<span aria-hidden="true">←</span>}>戻る</BaseButton>
            <BaseButton rightElm={<span aria-hidden="true">→</span>}>進む</BaseButton>
          </Specimen>
          <Specimen label="isDisabled（contained / outlined / url）">
            <BaseButton isDisabled>無効</BaseButton>
            <BaseButton variant="outlined" isDisabled>
              無効
            </BaseButton>
            <BaseButton url={routes.home.href()} isDisabled>
              無効なリンク
            </BaseButton>
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
