import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { formatPostedDate } from './date.ts'

describe('formatPostedDate', () => {
  it("formats as develop did: yyyy/MM/dd in Japanese, 'MMMM d, yyyy' in English", () => {
    assert.equal(formatPostedDate('2024-03-01T09:00:00+09:00', 'ja'), '2024/03/01')
    assert.equal(formatPostedDate('2024-03-01T09:00:00+09:00', 'en'), 'March 1, 2024')
  })

  it('reads the date in Japan, whatever offset the string carries', () => {
    // 15:30 UTC on Feb 29 is already Mar 1 in Japan.
    assert.equal(formatPostedDate('2024-02-29T15:30:00Z', 'ja'), '2024/03/01')
    assert.equal(formatPostedDate('2024-03-01T23:30:00+09:00', 'ja'), '2024/03/01')
  })

  it('is empty for a missing or unparseable date', () => {
    assert.equal(formatPostedDate(undefined, 'ja'), '')
    assert.equal(formatPostedDate('', 'en'), '')
    assert.equal(formatPostedDate('not a date', 'ja'), '')
  })
})
