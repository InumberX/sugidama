// The page every route answers an error with. develop had no error boundary,
// so React Router showed its own bare page; this one keeps the site's header,
// footer and language. It is not a route of its own — app/middleware/error-page.tsx
// renders it in place of any plain-text error response — so it sits beside
// document.tsx rather than in a `-page` directory, which names a route key.
import { css, type Handle } from 'remix/component'

import { routes } from '../routes.ts'
import { BaseButton } from '../ui/buttons/public/base-button/base-button.tsx'
import { LayoutInner } from '../ui/layouts/layout-inner/layout-inner.tsx'
import { LayoutPageWrapper } from '../ui/layouts/layout-page-wrapper/layout-page-wrapper.tsx'
import { LayoutPublic } from '../ui/layouts/layout-public/layout-public.tsx'
import { PageTitle } from '../ui/typographies/page-title/page-title.tsx'
import { ReplaceNewLineText } from '../ui/typographies/replace-new-line-text/replace-new-line-text.tsx'
import { defineMessages, type Lang, toLangParam } from '../utils/i18n.ts'
import { Document } from './document.tsx'
import * as styles from './error-page.styles.ts'

export type ErrorPageProps = {
  lang: Lang
  url: URL
  status: number
}

const MESSAGES = defineMessages({
  ja: {
    notFoundTitle: 'ページが見つかりません',
    notFoundDescription: 'お探しのページは、移動または削除された可能性があります。',
    errorTitle: 'エラーが発生しました',
    errorDescription: '時間をおいて、もう一度お試しください。',
    rejectedDescription: 'このページを表示できませんでした。',
    backToHome: 'ホームに戻る',
  },
  en: {
    notFoundTitle: 'Page not found',
    notFoundDescription: 'The page you are looking for may have been moved or deleted.',
    errorTitle: 'An error occurred',
    errorDescription: 'Please try again later.',
    rejectedDescription: 'This page could not be displayed.',
    backToHome: 'Back to Home',
  },
})

/**
 * A 404 or 410 is a page that is not there; any other 4xx (a 405 for a POST
 * to a page that exists, say) is a request the page refused, and a 5xx is
 * ours — "try again later" is only true of that one.
 */
const isNotFound = (status: number) => status === 404 || status === 410

export function ErrorPage(handle: Handle<ErrorPageProps>) {
  return () => {
    const { lang, url, status } = handle.props
    const messages = MESSAGES[lang]
    const notFound = isNotFound(status)
    const title = notFound ? messages.notFoundTitle : messages.errorTitle
    const description = notFound
      ? messages.notFoundDescription
      : status >= 500
        ? messages.errorDescription
        : messages.rejectedDescription
    const homeHref = routes.home.href({ lang: toLangParam(lang) })

    // No canonical: an error at /drinks?page=0 must not name /drinks, a live
    // page, as the URL it stands for.
    return (
      <Document
        lang={lang}
        url={url}
        meta={{ title, robots: 'noindex, nofollow', canonical: null }}
      >
        {/* The header's language switch rewrites the current path, which for
            an error is the broken one (`/ja/nope` would become `/en/ja/nope`);
            from an error page it leads to the other language's home. */}
        <LayoutPublic lang={lang} url={new URL(homeHref, url)}>
          <LayoutPageWrapper>
            <PageTitle title={title} color="primary" isWrap />
            <LayoutInner>
              <div mix={css(styles.errorPage_container)}>
                <p mix={css(styles.errorPage_description)}>
                  <ReplaceNewLineText text={description} />
                </p>
                <BaseButton url={homeHref} size="large">
                  {messages.backToHome}
                </BaseButton>
              </div>
            </LayoutInner>
          </LayoutPageWrapper>
        </LayoutPublic>
      </Document>
    )
  }
}
