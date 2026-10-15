// Ported from develop: app/components/ui/typographies/ReplaceNewLineText
import type { Handle } from 'remix/component'

import type { ReplaceNewLineTextProps } from './replace-new-line-text.types.ts'

export type * from './replace-new-line-text.types.ts'

/**
 * Line breaks without `innerHTML`: the text stays escaped, and only the
 * newlines turn into elements. `\r\n` counts as one break.
 */
export function ReplaceNewLineText(handle: Handle<ReplaceNewLineTextProps>) {
  return () => (
    <>
      {handle.props.text
        .split(/\r?\n/)
        .flatMap((line, i) => (i === 0 ? [line] : [<br key={i} />, line]))}
    </>
  )
}
