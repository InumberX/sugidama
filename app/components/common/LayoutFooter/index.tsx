import { LayoutInner } from '~/components/ui/layouts/LayoutInner'
import * as styles from './style.css'

type Props = {
  className?: string
}

export const LayoutFooter = ({ className }: Props) => {
  const currentYear: number = new Date().getFullYear()

  return (
    <footer className={[styles.layoutFooter, className].filter(Boolean).join(' ')}>
      <div className={styles.layoutFooter_wrapper}>
        <LayoutInner>
          <div className={styles.layoutFooterCopy}>
            <p className={styles.layoutFooterCopy_paragraph}>
              <small className={styles.layoutFooterCopy_text} lang="en" translate="no">
                {`Copyright © ${currentYear} N/NE, All rights reserved.`}
              </small>
            </p>
          </div>
        </LayoutInner>
      </div>
    </footer>
  )
}
