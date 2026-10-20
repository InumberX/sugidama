// The page every route answers an error with. develop had no error boundary,
// so React Router showed its own bare page; this one keeps the site's header,
// footer and language. It is not a route of its own: app/middleware/error-page.tsx
// renders it in place of any plain-text error response.
import { css, type Handle } from 'remix/component'

import { routes } from '../../routes.ts'
import { BaseButton } from '../../ui/buttons/public/base-button/base-button.tsx'
import { LayoutInner } from '../../ui/layouts/layout-inner/layout-inner.tsx'
import { LayoutPageWrapper } from '../../ui/layouts/layout-page-wrapper/layout-page-wrapper.tsx'
import { LayoutPublic } from '../../ui/layouts/layout-public/layout-public.tsx'
import { PageTitle } from '../../ui/typographies/page-title/page-title.tsx'
import { ReplaceNewLineText } from '../../ui/typographies/replace-new-line-text/replace-new-line-text.tsx'
import { defineMessages, type Lang, toLangParam } from '../../utils/i18n.ts'
import { Document } from '../document.tsx'
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
    backToHome: 'ホームに戻る',
  },
  en: {
    notFoundTitle: 'Page not found',
    notFoundDescription: 'The page you are looking for may have been moved or deleted.',
    errorTitle: 'An error occurred',
    errorDescription: 'Please try again later.',
    backToHome: 'Back to Home',
  },
})

/** A 4xx is a page that is not there for the visitor; a 5xx is ours. */
const isServerError = (status: number) => status >= 500

export function ErrorPage(handle: Handle<ErrorPageProps>) {
  return () => {
    const { lang, url, status } = handle.props
    const messages = MESSAGES[lang]
    const title = isServerError(status) ? messages.errorTitle : messages.notFoundTitle
    const description = isServerError(status)
      ? messages.errorDescription
      : messages.notFoundDescription

    return (
      <Document lang={lang} url={url} meta={{ title, robots: 'noindex, nofollow' }}>
        <LayoutPublic lang={lang} url={url}>
          <LayoutPageWrapper>
            <PageTitle title={title} color="primary" isWrap />
            <LayoutInner>
              <div mix={css(styles.errorPage_container)}>
                <p mix={css(styles.errorPage_description)}>
                  <ReplaceNewLineText text={description} />
                </p>
                <BaseButton url={routes.home.href({ lang: toLangParam(lang) })} size="large">
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
