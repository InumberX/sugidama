import { useTranslation } from 'react-i18next'
import { type MetaFunction } from 'react-router'

import type { Route } from './+types/route'
import * as styles from './style.css'

import { LayoutInner } from '~/components/ui/layouts/LayoutInner'
import { LayoutPageWrapper } from '~/components/ui/layouts/LayoutPageWrapper'
import { LayoutSection } from '~/components/ui/layouts/LayoutSection'
import { ReplaceNewLineText } from '~/components/ui/typographies/ReplaceNewLineText'
import { LANG, SITE_NAME_JA, SITE_NAME_EN } from '~/config/consts'
import { CACHE_BUSTER } from '~/config/env'
import { getLang } from '~/utils/locale'
import { getMetadata } from '~/utils/meta'

export const meta: MetaFunction = (args) => {
  return getMetadata({
    args,
  })
}

export async function loader(args: Route.LoaderArgs) {
  const { params } = args
  const lang = getLang(params)

  return {
    lang,
  }
}

export default function PageSG10_100({ loaderData }: Route.ComponentProps) {
  const { lang } = loaderData
  const { t: tPage } = useTranslation('pages/SG10_100')

  return (
    <LayoutPageWrapper>
      <div className={styles.home}>
        <LayoutSection className={styles.homeTitle} tag="div">
          <LayoutInner>
            <div className={styles.homeTitle_container}>
              <h1 className={styles.homeTitleLogo}>
                <img
                  src={`/assets/img/img-logo-site-name.svg?${CACHE_BUSTER}`}
                  alt={lang === LANG.EN ? SITE_NAME_EN : SITE_NAME_JA}
                  className={styles.homeTitleLogo_image}
                  width={480}
                  height={99}
                />
              </h1>
              <div className={styles.homeTitleLead}>
                <p className={styles.homeTitleLead_paragraph}>
                  <ReplaceNewLineText text={tPage('title.lead')} />
                </p>
              </div>
            </div>
          </LayoutInner>
        </LayoutSection>
      </div>
    </LayoutPageWrapper>
  )
}
