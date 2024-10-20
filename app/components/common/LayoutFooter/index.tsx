import * as styles from './style.css'

type Props = {
  className?: string
}

export const LayoutFooter = ({ className }: Props) => {
  return <footer className={[styles.layoutFooter, className].filter(Boolean).join(' ')}></footer>
}
