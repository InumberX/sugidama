import * as styles from './style.css'

import { BaseTag, type BaseTagProps } from '~/components/ui/tags/BaseTag'

type BaseTagListProps = {
  className?: string
  items: BaseTagProps[]
  isNotSemantic?: boolean
  align?: 'left' | 'center' | 'right'
}

export const BaseTagList = ({ className, items, isNotSemantic, align = 'left' }: BaseTagListProps) => {
  const Wrapper = isNotSemantic ? 'span' : 'div'
  const Items = isNotSemantic ? 'span' : 'ul'
  const Item = isNotSemantic ? 'span' : 'li'

  return (
    <Wrapper className={[styles.baseTagList, className].filter(Boolean).join(' ')}>
      <Items className={[styles.baseTagList_items, styles[`baseTagList_items__${align}`]].filter(Boolean).join(' ')}>
        {items.map((item, i) => (
          <Item key={i} className={styles.baseTagList_item}>
            <BaseTag {...item} />
          </Item>
        ))}
      </Items>
    </Wrapper>
  )
}
