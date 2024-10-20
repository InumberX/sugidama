import * as styles from './style.css'

type Props = {
  className?: string
}

export const LayoutHeader = ({ className }: Props) => {
  return <header className={[styles.layoutHeader, className].filter(Boolean).join(' ')}></header>
}
