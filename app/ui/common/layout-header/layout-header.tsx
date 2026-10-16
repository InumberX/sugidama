// Ported from develop: app/components/common/LayoutHeader
import { css, type Handle } from 'remix/component'

import { routes } from '../../../routes.ts'
import { LANGS, toLangParam, toLangPath } from '../../../utils/i18n.ts'
import { PAGE_NAMES } from '../../../utils/page-names.ts'
import { SvgIcon, type SvgIconVariant } from '../../icons/public/svg-icon/svg-icon.tsx'
import { LayoutInner } from '../../layouts/layout-inner/layout-inner.tsx'
import { PrimitiveButton } from '../../primitives/buttons/public/primitive-button/primitive-button.tsx'
import * as styles from './layout-header.styles.ts'
import type { LayoutHeaderProps } from './layout-header.types.ts'

export type * from './layout-header.types.ts'

/** How each language is labelled in the switch. */
const LANG_LABELS = { ja: 'JA', en: 'EN' } as const

/** The logo's intrinsic size, so it reserves its space before it loads. */
const LOGO = { src: '/assets/img/img-logo.webp', alt: 'Sugidama', width: 160, height: 41 }

export function LayoutHeader(handle: Handle<LayoutHeaderProps>) {
  return () => {
    const { lang, url, isLogoTitle } = handle.props
    const pageNames = PAGE_NAMES[lang]
    const langParam = { lang: toLangParam(lang) }
    const LogoTitle = isLogoTitle ? 'h1' : 'div'
    const globalMenuItems: { title: string; url: string; icon: SvgIconVariant }[] = [
      { title: pageNames.home, url: routes.home.href(langParam), icon: 'home' },
      { title: pageNames.drinks, url: routes.drinks.index.href(langParam), icon: 'liquor' },
    ]

    return (
      <header mix={css(styles.layoutHeader)}>
        <span mix={css({ ...styles.layoutHeaderBar, ...styles.layoutHeaderBar__top })} />
        <span mix={css({ ...styles.layoutHeaderBar, ...styles.layoutHeaderBar__bottom })} />
        <span mix={css({ ...styles.layoutHeaderCorner, ...styles.layoutHeaderCorner__topLeft })} />
        <span mix={css({ ...styles.layoutHeaderCorner, ...styles.layoutHeaderCorner__topRight })} />
        <span
          mix={css({ ...styles.layoutHeaderCorner, ...styles.layoutHeaderCorner__bottomLeft })}
        />
        <span
          mix={css({ ...styles.layoutHeaderCorner, ...styles.layoutHeaderCorner__bottomRight })}
        />
        <div mix={css(styles.layoutHeader_wrapper)}>
          <LayoutInner styleOverrides={styles.layoutHeader_inner}>
            <div mix={css(styles.layoutHeader_container)}>
              <div mix={css(styles.layoutHeaderLogo)}>
                <LogoTitle mix={css(styles.layoutHeaderLogo_title)}>
                  <PrimitiveButton
                    url={routes.home.href(langParam)}
                    styleOverrides={styles.layoutHeaderLogo_link}
                  >
                    <img
                      src={LOGO.src}
                      alt={LOGO.alt}
                      width={LOGO.width}
                      height={LOGO.height}
                      mix={css(styles.layoutHeaderLogo_image)}
                    />
                  </PrimitiveButton>
                </LogoTitle>
              </div>

              <div mix={css(styles.layoutHeaderMenu)}>
                <div mix={css(styles.layoutHeaderMenu_container)}>
                  <div mix={css(styles.layoutHeaderMenuGlobal)}>
                    <div mix={css(styles.layoutHeaderMenuGlobal_container)}>
                      <nav mix={css(styles.layoutHeaderMenuGlobal_navigation)}>
                        <ul mix={css(styles.layoutHeaderMenuGlobal_items)}>
                          {globalMenuItems.map((item) => (
                            <li key={item.url} mix={css(styles.layoutHeaderMenuGlobal_item)}>
                              <PrimitiveButton
                                url={item.url}
                                styleOverrides={styles.layoutHeaderMenuGlobal_link}
                              >
                                <SvgIcon
                                  variant={item.icon}
                                  styleOverrides={styles.layoutHeaderMenuGlobal_icon}
                                />
                                <span mix={css(styles.layoutHeaderMenuGlobal_text)}>
                                  {item.title}
                                </span>
                              </PrimitiveButton>
                            </li>
                          ))}
                        </ul>
                      </nav>
                    </div>
                  </div>

                  <div mix={css(styles.layoutHeaderMenuLanguage)}>
                    <ul mix={css(styles.layoutHeaderMenuLanguage_items)}>
                      {LANGS.map((item, i) => (
                        <li key={item} mix={css(styles.layoutHeaderMenuLanguage_item)}>
                          <div mix={css(styles.layoutHeaderMenuLanguage_contents)}>
                            {i > 0 && (
                              <SvgIcon
                                variant="slash"
                                styleOverrides={styles.layoutHeaderMenuLanguage_icon}
                              />
                            )}
                            {item === lang ? (
                              <span mix={css(styles.layoutHeaderMenuLanguage_current)}>
                                {LANG_LABELS[item]}
                              </span>
                            ) : (
                              <PrimitiveButton
                                url={toLangPath(url, lang, item)}
                                styleOverrides={styles.layoutHeaderMenuLanguageLink}
                              >
                                <span mix={css(styles.layoutHeaderMenuLanguageLink_text)}>
                                  {LANG_LABELS[item]}
                                </span>
                              </PrimitiveButton>
                            )}
                          </div>
                        </li>
                      ))}
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
}
