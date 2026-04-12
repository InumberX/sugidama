import { Link, useLocation } from 'react-router'

import * as styles from './style.css'

import { PrimitiveButton } from '~/components/primitives/buttons/PrimitiveButton'
import { SvgIcon, type SvgIconVariant } from '~/components/ui/icons/SvgIcon'
import { LayoutInner } from '~/components/ui/layouts/LayoutInner'
import { LANG } from '~/config/consts'
import { CACHE_BUSTER } from '~/config/env'
import { PAGES } from '~/config/paths'
import { getLangRoute } from '~/utils/locale'

type Props = {
  className?: string
  isLogoTitle?: boolean
  lang: string
}

export const LayoutHeader = ({ className, isLogoTitle, lang }: Props) => {
  const location = useLocation()
  const currentUrls = location.pathname.split('/').slice(1)
  const currentUrl = `${lang === LANG.JA && currentUrls.length > 0 ? location.pathname : '/' + currentUrls.slice(1).join('/')}${location.search}${location.hash}`
  const LogoTitle = isLogoTitle ? 'h1' : 'div'
  const globalMenuItems: {
    title: string
    url: string
    icon: SvgIconVariant
  }[] = [
    {
      title: PAGES.SG10_100.getName({
        lang,
      }),
      url: PAGES.SG10_100.getUrl({
        lang,
      }),
      icon: 'home',
    },
    {
      title: PAGES.SG20_100.getName({
        lang,
      }),
      url: PAGES.SG20_100.getUrl({
        lang,
      }),
      icon: 'liquor',
    },
  ]
  const languageItems: {
    id: string
    lang: string
    url: string
    text: string
  }[] = [
    {
      id: LANG.JA,
      lang: LANG.JA,
      url: `${getLangRoute({
        lang: LANG.JA,
      })}${currentUrl}`,
      text: 'JA',
    },
    {
      id: LANG.EN,
      lang: LANG.EN,
      url: `${getLangRoute({
        lang: LANG.EN,
      })}${currentUrl}`,
      text: 'EN',
    },
  ]

  return (
    <header className={[styles.layoutHeader, 'JsHeader', className].filter(Boolean).join(' ')}>
      <span className={[styles.layoutHeaderBar, styles.layoutHeaderBar__top].filter(Boolean).join(' ')} />
      <span className={[styles.layoutHeaderBar, styles.layoutHeaderBar__bottom].filter(Boolean).join(' ')} />
      <span className={[styles.layoutHeaderCorner, styles.layoutHeaderCorner__topLeft].filter(Boolean).join(' ')} />
      <span className={[styles.layoutHeaderCorner, styles.layoutHeaderCorner__topRight].filter(Boolean).join(' ')} />
      <span className={[styles.layoutHeaderCorner, styles.layoutHeaderCorner__bottomLeft].filter(Boolean).join(' ')} />
      <span className={[styles.layoutHeaderCorner, styles.layoutHeaderCorner__bottomRight].filter(Boolean).join(' ')} />
      <div className={styles.layoutHeader_wrapper}>
        <LayoutInner className={styles.layoutHeader_inner}>
          <div className={styles.layoutHeader_container}>
            <div className={styles.layoutHeaderLogo}>
              <LogoTitle className={styles.layoutHeaderLogo_title}>
                <Link
                  to={PAGES.SG10_100.getUrl({
                    lang,
                  })}
                  className={styles.layoutHeaderLogo_link}
                >
                  <img
                    src={`/assets/img/img-logo.webp?${CACHE_BUSTER}`}
                    alt="Sugidama"
                    className={styles.layoutHeaderLogo_image}
                    width={160}
                    height={41}
                  />
                </Link>
              </LogoTitle>
            </div>

            <div className={styles.layoutHeaderMenu}>
              <div className={styles.layoutHeaderMenu_container}>
                <div className={styles.layoutHeaderMenuGlobal}>
                  <div className={styles.layoutHeaderMenuGlobal_container}>
                    <nav className={styles.layoutHeaderMenuGlobal_navigation}>
                      <ul className={styles.layoutHeaderMenuGlobal_items}>
                        {globalMenuItems.map((item, i) => (
                          <li key={i} className={styles.layoutHeaderMenuGlobal_item}>
                            <Link to={item.url} className={styles.layoutHeaderMenuGlobal_link}>
                              <SvgIcon variant={item.icon} className={styles.layoutHeaderMenuGlobal_icon} />
                              <span className={styles.layoutHeaderMenuGlobal_text}>{item.title}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </div>
                </div>
                <div className={styles.layoutHeaderMenuLanguage}>
                  <ul className={styles.layoutHeaderMenuLanguage_items}>
                    {languageItems.map((item, languageIndex) => {
                      return (
                        <li
                          key={`${item.id}-${languageIndex}-${lang}`}
                          className={styles.layoutHeaderMenuLanguage_item}
                        >
                          <div className={styles.layoutHeaderMenuLanguage_contents}>
                            {languageIndex > 0 && (
                              <SvgIcon variant="slash" className={styles.layoutHeaderMenuLanguage_icon} />
                            )}
                            {lang === item.lang ? (
                              <span className={styles.layoutHeaderMenuLanguage_current}>{item.text}</span>
                            ) : (
                              <PrimitiveButton url={item.url} className={styles.layoutHeaderMenuLanguageLink}>
                                <span className={styles.layoutHeaderMenuLanguageLink_text}>{item.text}</span>
                              </PrimitiveButton>
                            )}
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </LayoutInner>
      </div>
    </header>
  )
}
