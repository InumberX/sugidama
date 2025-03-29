import * as styles from './style.css'

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
  return (
    <i
      className={[styles.svgIcon, styles[`svgIcon__${variant}`], className].filter(Boolean).join(' ')}
      title={title}
      aria-label={title}
    />
  )
}
