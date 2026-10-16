import * as assert from 'remix/assert'
import { renderToString } from 'remix/component/server'
import { describe, it } from 'remix/test'

import { BasePagination, paginationEntries } from './base-pagination.tsx'
import type { PaginationEntry } from './base-pagination.types.ts'

/** What one width shows: page numbers, and `…` for a gap. */
const at = (entries: PaginationEntry[], width: 'narrow' | 'wide') =>
  entries.filter((entry) => entry[width]).map((entry) => (entry.kind === 'gap' ? '…' : entry.page))

describe('paginationEntries', () => {
  it('lists every page while there are few', () => {
    const entries = paginationEntries(2, 3)
    assert.deepEqual(at(entries, 'narrow'), [1, 2, 3])
    assert.deepEqual(at(entries, 'wide'), [1, 2, 3])
    assert.deepEqual(at(paginationEntries(1, 5), 'wide'), [1, 2, 3, 4, 5])
  })

  it('narrows to the first, current and last page below md, as develop did', () => {
    assert.deepEqual(at(paginationEntries(5, 10), 'narrow'), [1, '…', 5, '…', 10])
    assert.deepEqual(at(paginationEntries(1, 10), 'narrow'), [1, '…', 10])
    assert.deepEqual(at(paginationEntries(2, 10), 'narrow'), [1, 2, '…', 10])
    assert.deepEqual(at(paginationEntries(10, 10), 'narrow'), [1, '…', 10])
  })

  it('keeps one page either side of the current one from md up, as develop did', () => {
    assert.deepEqual(at(paginationEntries(5, 10), 'wide'), [1, '…', 4, 5, 6, '…', 10])
    assert.deepEqual(at(paginationEntries(3, 10), 'wide'), [1, 2, 3, 4, '…', 10])
    assert.deepEqual(at(paginationEntries(8, 10), 'wide'), [1, '…', 7, 8, 9, 10])
  })

  it('has a single page for a single page of results', () => {
    assert.deepEqual(at(paginationEntries(1, 1), 'wide'), [1])
  })
})

describe('BasePagination', () => {
  const render = (currentPage: number, totalPage: number) =>
    renderToString(
      <BasePagination
        currentPage={currentPage}
        totalPage={totalPage}
        hrefFor={(page) => `/drinks?page=${page}`}
        label="ページ送り"
        prevLabel="前へ"
        nextLabel="次へ"
      />
    )

  it('marks the current page and links the others', async () => {
    const html = await render(2, 3)

    assert.match(html, /<nav aria-label="ページ送り">/)
    assert.match(html, /<span aria-current="page"[^>]*>2<\/span>/)
    assert.match(html, /<a href="\/drinks\?page=1"[^>]*>1<\/a>/)
    assert.match(html, /<a href="\/drinks\?page=3" aria-label="次へ"/)
  })

  it('turns a step past either end into a span hidden from assistive technology', async () => {
    const html = await render(1, 1)

    assert.doesNotMatch(html, /aria-label="前へ"|aria-label="次へ"/)
    assert.equal(html.match(/<span aria-hidden="true"/g)?.length, 2)
  })
})
