import { Link } from 'react-router'

import { SvgIcon, type SvgIconVariant } from '~/components/ui/icons/SvgIcon'
import { LayoutInner } from '~/components/ui/layouts/LayoutInner'
import { CACHE_BUSTER } from '~/config/env'
import { PAGES } from '~/config/paths'

import * as styles from './style.css'

type Props = {
  className?: string
  isLogoTitle?: boolean
  lang: string
}

export const LayoutHeader = ({ className, isLogoTitle, lang }: Props) => {
  const LogoTitle = isLogoTitle ? 'h1' : 'div'
  const globalMenuInfos: {
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

  return (
    <header className={[styles.layoutHeader, 'JsHeader', className].filter(Boolean).join(' ')}>
      <div className={styles.layoutHeader_wrapper}>
        <LayoutInner>
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
                        {globalMenuInfos.map((info, i) => (
                          <li key={i} className={styles.layoutHeaderMenuGlobal_item}>
                            <Link to={info.url} className={styles.layoutHeaderMenuGlobal_link}>
                              <SvgIcon variant={info.icon} className={styles.layoutHeaderMenuGlobal_icon} />
                              <span className={styles.layoutHeaderMenuGlobal_text}>{info.title}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </LayoutInner>
      </div>
    </header>
  )
}
