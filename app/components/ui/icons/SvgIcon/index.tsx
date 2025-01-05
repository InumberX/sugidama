import * as styles from './style.css'
import iconHome from '~/assets/img/icon-home.svg'
import iconSearch from '~/assets/img/icon-search.svg'
import iconMail from '~/assets/img/icon-mail.svg'
import iconLiquor from '~/assets/img/icon-liquor.svg'
import iconTranslate from '~/assets/img/icon-translate.svg'
import iconKeyboardArrowDown from '~/assets/img/icon-keyboard-arrow-down.svg'
import iconKeyboardArrowLeft from '~/assets/img/icon-keyboard-arrow-left.svg'
import iconKeyboardArrowRight from '~/assets/img/icon-keyboard-arrow-right.svg'
import iconKeyboardArrowUp from '~/assets/img/icon-keyboard-arrow-up.svg'

export type SvgIconVariant =
  | 'home'
  | 'search'
  | 'mail'
  | 'liquor'
  | 'translate'
  | 'keyboardArrowDown'
  | 'keyboardArrowLeft'
  | 'keyboardArrowRight'
  | 'keyboardArrowUp'

type Props = {
  className?: string
  variant: SvgIconVariant
  title?: string
}

export const SvgIcon = ({ className, variant, title }: Props) => {
  let maskImage = ''

  switch (variant) {
    case 'search':
      maskImage = iconSearch
      break
    case 'mail':
      maskImage = iconMail
      break
    case 'liquor':
      maskImage = iconLiquor
      break
    case 'translate':
      maskImage = iconTranslate
      break
    case 'home':
      maskImage = iconHome
      break
    case 'keyboardArrowDown':
      maskImage = iconKeyboardArrowDown
      break
    case 'keyboardArrowLeft':
      maskImage = iconKeyboardArrowLeft
      break
    case 'keyboardArrowRight':
      maskImage = iconKeyboardArrowRight
      break
    case 'keyboardArrowUp':
      maskImage = iconKeyboardArrowUp
      break
    default:
      maskImage = iconHome
      break
  }

  return (
    <i
      className={[styles.svgIcon, styles[`svgIcon__${variant}`], className].filter(Boolean).join(' ')}
      style={{
        WebkitMaskImage: `url(${maskImage})`,
        maskImage: `url(${maskImage})`,
      }}
      title={title}
      aria-label={title}
    />
  )
}
