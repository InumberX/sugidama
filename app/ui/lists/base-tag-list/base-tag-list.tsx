// Ported from develop: app/components/ui/lists/BaseTagList
import { css, type Handle } from 'remix/component'

import { BaseTag } from '../../tags/base-tag/base-tag.tsx'
import * as styles from './base-tag-list.styles.ts'
import type { BaseTagListProps } from './base-tag-list.types.ts'

export type * from './base-tag-list.types.ts'

export function BaseTagList(handle: Handle<BaseTagListProps>) {
  return () => {
    const { items, isNotSemantic, align = 'left' } = handle.props
    const Wrapper = isNotSemantic ? 'span' : 'div'
    const Items = isNotSemantic ? 'span' : 'ul'
    const Item = isNotSemantic ? 'span' : 'li'

    return (
      <Wrapper mix={css(styles.baseTagList)}>
        <Items mix={css({ ...styles.baseTagList_items, ...styles.baseTagListAligns[align] })}>
          {items.map((item, i) => (
            <Item key={i} mix={css(styles.baseTagList_item)}>
              <BaseTag {...item} />
            </Item>
          ))}
        </Items>
      </Wrapper>
    )
  }
}
