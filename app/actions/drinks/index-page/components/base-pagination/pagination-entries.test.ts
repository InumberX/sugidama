import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import type { PaginationEntry } from './base-pagination.types.ts'
import { paginationEntries } from './pagination-entries.ts'

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
