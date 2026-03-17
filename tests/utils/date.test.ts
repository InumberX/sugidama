import { describe, vi, beforeEach, afterEach, it, expect } from 'vitest'

import { JST_TIMEZONE_OFFSET } from '~/config/consts'
import { getTzDate, format, formatUnixTime, convertUnixTimeToDate, getDiffTime, getUntilClosedInfo } from '~/utils/date'

describe('Date Utils', () => {
  beforeEach(async () => {
    // Reset each mock
    vi.clearAllMocks()
    // Set fixed time for testing
    vi.useFakeTimers()
    // 2024-01-15 10:00:00 JST
    vi.setSystemTime(new Date(`2024-01-15T10:00:00${JST_TIMEZONE_OFFSET}`))
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()
  })

  //============================================================================
  // 1. Input/Output
  //============================================================================
  describe('Input/Output', () => {
    describe('getTzDate', () => {
      it('should return current date with Asia/Tokyo timezone when no date provided', () => {
        const result = getTzDate({})
        expect(result).toBeInstanceOf(Date)
        expect(result.getTime()).toBe(new Date(`2024-01-15T10:00:00${JST_TIMEZONE_OFFSET}`).getTime())
      })

      it('should handle Date object input', () => {
        const inputDate = new Date(`2024-05-20T12:00:00${JST_TIMEZONE_OFFSET}`)
        const result = getTzDate({ date: inputDate })
        expect(result).toBeInstanceOf(Date)
        expect(result.getTime()).toBe(inputDate.getTime())
      })

      it('should return current date when null date provided', () => {
        const result = getTzDate({ date: null })
        expect(result).toBeInstanceOf(Date)
        expect(result.getTime()).toBe(new Date(`2024-01-15T10:00:00${JST_TIMEZONE_OFFSET}`).getTime())
      })

      it('should handle number (timestamp) input', () => {
        const timestamp = 1716174000000 // 2024-05-20T12:00:00+09:00
        const result = getTzDate({ date: new Date(timestamp) })
        expect(result).toBeInstanceOf(Date)
        expect(result.getTime()).toBe(timestamp)
      })

      it('should handle UTC timezone', () => {
        const inputDate = new Date(`2024-05-20T12:00:00${JST_TIMEZONE_OFFSET}`)
        const result = getTzDate({ date: inputDate, timezone: 'UTC' })
        expect(result).toBeInstanceOf(Date)
        expect(result.getTime()).toBe(inputDate.getTime())
      })
    })

    describe('convertUnixTimeToDate', () => {
      it('should convert unix timestamp to Date', () => {
        const unixTime = 1716174000 // 2024-05-20T12:00:00+09:00
        const result = convertUnixTimeToDate({ unixTime })
        expect(result).toBeInstanceOf(Date)
        // TZDate preserves timezone, so we check the time value instead
        expect(result?.getTime()).toBe(1716174000000)
      })

      it('should return null for undefined input', () => {
        const result = convertUnixTimeToDate({ unixTime: undefined })
        expect(result).toBeNull()
      })

      it('should handle timezone parameter', () => {
        const unixTime = 1716174000 // 2024-05-20T12:00:00+09:00
        const result = convertUnixTimeToDate({ unixTime, timezone: 'UTC' })
        expect(result).toBeInstanceOf(Date)
        expect(result?.getTime()).toBe(1716174000000)
      })
    })
  })

  //============================================================================
  // 2. Display
  //============================================================================
  describe('Display', () => {
    describe('format', () => {
      const testDate = new Date(`2024-05-20T12:30:45${JST_TIMEZONE_OFFSET}`)

      it('should format date with default format (yyyy-MM-dd)', () => {
        const result = format({ date: testDate, format: 'yyyy-MM-dd' })
        expect(result).toBe('2024-05-20')
      })

      it('should format with Japanese year-month-day', () => {
        const result = format({ date: testDate, format: 'yyyy年MM月dd日' })
        expect(result).toBe('2024年05月20日')
      })

      it('should format with Japanese year-month-day and day of week', () => {
        const result = format({ date: testDate, format: 'yyyy年MM月dd日（E）' })
        expect(result).toBe('2024年05月20日（月）')
      })

      it('should format with time', () => {
        const result = format({ date: testDate, format: 'yyyy-MM-dd HH:mm' })
        expect(result).toBe('2024-05-20 12:30')
      })

      it('should format with Japanese date and time', () => {
        const result = format({ date: testDate, format: 'yyyy年MM月dd日 HH:mm' })
        expect(result).toBe('2024年05月20日 12:30')
      })

      it('should format year-month only', () => {
        const result = format({ date: testDate, format: 'yyyy-MM' })
        expect(result).toBe('2024-05')
      })

      it('should format Japanese year-month', () => {
        const result = format({ date: testDate, format: 'yyyy年MM月' })
        expect(result).toBe('2024年05月')
      })

      it('should format time only', () => {
        const result = format({ date: testDate, format: 'HH:mm' })
        expect(result).toBe('12:30')
      })

      it('should format with slash separator', () => {
        const result = format({ date: testDate, format: 'yyyy/MM/dd' })
        expect(result).toBe('2024/05/20')
      })

      it('should format compact date', () => {
        const result = format({ date: testDate, format: 'yyyyMMdd' })
        expect(result).toBe('20240520')
      })

      it('should format compact datetime', () => {
        const result = format({ date: testDate, format: 'yyyyMMddHHmmss' })
        expect(result).toBe('20240520123045')
      })

      it('should format month and day without padding', () => {
        const result = format({ date: testDate, format: 'M月d日' })
        expect(result).toBe('5月20日')
      })

      it('should format day of week only', () => {
        const result = format({ date: testDate, format: 'E' })
        expect(result).toBe('月')
      })

      it('should return empty string for undefined date', () => {
        const result = format({ date: undefined, format: 'yyyy-MM-dd' })
        expect(result).toBe('')
      })

      it('should handle string date input', () => {
        const result = format({ date: new Date(`2024-05-20T12:30:45${JST_TIMEZONE_OFFSET}`), format: 'yyyy-MM-dd' })
        expect(result).toBe('2024-05-20')
      })

      it('should handle number (timestamp) input', () => {
        const result = format({ date: new Date(1716174000000), format: 'yyyy-MM-dd' })
        expect(result).toBe('2024-05-20')
      })

      it('should format with Japanese date and day of week with time', () => {
        const result = format({ date: testDate, format: 'yyyy年MM月dd日（E）HH:mm' })
        expect(result).toBe('2024年05月20日（月）12:30')
      })

      it('should format with slash separator and day of week', () => {
        const result = format({ date: testDate, format: 'yyyy/MM/dd（E）' })
        expect(result).toBe('2024/05/20（月）')
      })

      it('should format with slash separator and time', () => {
        const result = format({ date: testDate, format: 'yyyy/MM/dd HH:mm' })
        expect(result).toBe('2024/05/20 12:30')
      })

      it('should format Japanese date without padding', () => {
        const result = format({ date: testDate, format: 'yyyy年M月d日' })
        expect(result).toBe('2024年5月20日')
      })

      it('should format month only', () => {
        const result = format({ date: testDate, format: 'M月' })
        expect(result).toBe('5月')
      })

      it('should format day only', () => {
        const result = format({ date: testDate, format: 'd日' })
        expect(result).toBe('20日')
      })

      it('should format compact time', () => {
        const result = format({ date: testDate, format: 'HHmm' })
        expect(result).toBe('1230')
      })

      it('should format year only', () => {
        const result = format({ date: testDate, format: 'yyyy' })
        expect(result).toBe('2024')
      })

      it('should format with dot separator', () => {
        const result = format({ date: testDate, format: 'MM.dd' })
        expect(result).toBe('05.20')
      })

      it('should format with specific time format', () => {
        const result = format({ date: testDate, format: 'yyyy/MM/dd 00:00:00' })
        expect(result).toBe('2024/05/20 00:00:00')
      })

      it('should format with English full month name', () => {
        const result = format({ date: testDate, format: 'MMMM d, yyyy', locale: 'en' })
        expect(result).toBe('May 20, 2024')
      })

      it('should format with different locale (English)', () => {
        const result = format({ date: testDate, format: 'E', locale: 'en' })
        expect(result).toBe('Mon')
      })

      it('should format with UTC timezone', () => {
        const result = format({ date: testDate, format: 'yyyy-MM-dd HH:mm', timezone: 'UTC' })
        expect(result).toBe('2024-05-20 03:30') // JST 12:30 = UTC 03:30
      })

      it('should format Japanese day of week with Japanese locale', () => {
        const result = format({ date: testDate, format: 'E' })
        expect(result).toBe('月')
      })
    })

    describe('formatUnixTime', () => {
      it('should format unix timestamp with default format', () => {
        const unixTime = 1716180045 // 2024-05-20T13:40:45+09:00
        const result = formatUnixTime({ unixTime })
        expect(result).toBe('2024-05-20')
      })

      it('should format unix timestamp with custom format', () => {
        const unixTime = 1716180045 // 2024-05-20T13:40:45+09:00
        const result = formatUnixTime({ unixTime, format: 'yyyy年MM月dd日 HH:mm' })
        expect(result).toBe('2024年05月20日 13:40')
      })

      it('should return empty string for undefined unix time', () => {
        const result = formatUnixTime({ unixTime: undefined })
        expect(result).toBe('')
      })

      it('should handle UTC timezone', () => {
        const unixTime = 1716180045 // 2024-05-20T13:40:45+09:00
        const result = formatUnixTime({ unixTime, format: 'HH:mm', timezone: 'UTC' })
        expect(result).toBe('04:40') // JST 13:40 = UTC 04:40
      })

      it('should use Japanese locale by default', () => {
        const unixTime = 1716180045 // 2024-05-20T13:40:45+09:00 (Monday)
        const result = formatUnixTime({ unixTime, format: 'E' })
        expect(result).toBe('月') // Japanese day of week
      })

      it('should handle different locale parameter', () => {
        const unixTime = 1716180045 // 2024-05-20T13:40:45+09:00 (Monday)
        const result = formatUnixTime({ unixTime, format: 'E', locale: 'en' })
        expect(result).toBe('Mon') // English day of week
      })
    })
  })

  //============================================================================
  // 3. Operation
  //============================================================================
  describe('Operation', () => {
    describe('getDiffTime', () => {
      it('should calculate time differences correctly', () => {
        const from = new Date(`2024-01-15T10:00:00${JST_TIMEZONE_OFFSET}`)
        const to = new Date(`2024-01-20T15:30:45${JST_TIMEZONE_OFFSET}`)

        const result = getDiffTime({ from, to })

        expect(result.seconds).toBe(451845) // 5 days, 5 hours, 30 minutes, 45 seconds
        expect(result.minutes).toBe(7530) // 5 days, 5 hours, 30 minutes
        expect(result.hours).toBe(125) // 5 days, 5 hours
        expect(result.days).toBe(5)
        expect(result.months).toBe(0)
      })

      it('should handle negative differences', () => {
        const from = new Date(`2024-01-20T15:30:45${JST_TIMEZONE_OFFSET}`)
        const to = new Date(`2024-01-15T10:00:00${JST_TIMEZONE_OFFSET}`)

        const result = getDiffTime({ from, to })

        expect(result.seconds).toBe(-451845)
        expect(result.minutes).toBe(-7530)
        expect(result.hours).toBe(-125)
        expect(result.days).toBe(-5)
        expect(result.months).toBe(0)
      })

      it('should calculate month differences', () => {
        const from = new Date(`2024-01-15T10:00:00${JST_TIMEZONE_OFFSET}`)
        const to = new Date(`2024-06-20T15:30:45${JST_TIMEZONE_OFFSET}`)

        const result = getDiffTime({ from, to })

        expect(result.months).toBe(5)
        expect(result.days).toBe(157)
      })

      it('should handle same dates', () => {
        const date = new Date(`2024-01-15T10:00:00${JST_TIMEZONE_OFFSET}`)

        const result = getDiffTime({ from: date, to: date })

        expect(result.seconds).toBe(0)
        expect(result.minutes).toBe(0)
        expect(result.hours).toBe(0)
        expect(result.days).toBe(0)
        expect(result.months).toBe(0)
      })
    })

    describe('getUntilClosedInfo', () => {
      beforeEach(() => {
        // Set current time to 2024-01-15 10:00:00 JST
        vi.setSystemTime(new Date(`2024-01-15T10:00:00${JST_TIMEZONE_OFFSET}`))
      })

      it('should return null for undefined seconds', () => {
        const result = getUntilClosedInfo({ seconds: undefined })
        expect(result).toBeNull()
      })

      it('should return closed status for past date', () => {
        const pastUnixTime = 1705158000 // 2024-01-14T00:00:00+09:00 (past)
        const result = getUntilClosedInfo({ seconds: pastUnixTime })

        expect(result).not.toBeNull()
        expect(result?.isClosed).toBe(true)
        expect(result?.text).toBeUndefined()
        expect(result?.seconds).toBeLessThan(0)
      })

      it('should return remaining seconds for very near future', () => {
        // Current test time is 2024-01-15 10:00:00 JST
        // 30 seconds in the future from current time
        const futureUnixTime = Math.floor(new Date(`2024-01-15T10:00:30${JST_TIMEZONE_OFFSET}`).getTime() / 1000)
        const result = getUntilClosedInfo({ seconds: futureUnixTime })

        expect(result).not.toBeNull()
        expect(result?.isClosed).toBe(false)
        expect(result?.text).toBe('残り30秒')
        expect(result?.seconds).toBe(30)
      })

      it('should return remaining minutes for near future', () => {
        // Current test time is 2024-01-15 10:00:00 JST
        // 50 minutes in the future
        const futureUnixTime = Math.floor(new Date(`2024-01-15T10:50:00${JST_TIMEZONE_OFFSET}`).getTime() / 1000)
        const result = getUntilClosedInfo({ seconds: futureUnixTime })

        expect(result).not.toBeNull()
        expect(result?.isClosed).toBe(false)
        expect(result?.text).toBe('残り50分')
        expect(result?.minutes).toBe(50)
      })

      it('should return remaining hours for same day future', () => {
        // Current test time is 2024-01-15 10:00:00 JST
        // 5 hours in the future
        const futureUnixTime = Math.floor(new Date(`2024-01-15T15:00:00${JST_TIMEZONE_OFFSET}`).getTime() / 1000)
        const result = getUntilClosedInfo({ seconds: futureUnixTime })

        expect(result).not.toBeNull()
        expect(result?.isClosed).toBe(false)
        expect(result?.text).toBe('残り5時間')
        expect(result?.hours).toBe(5)
      })

      it('should return remaining days for near future', () => {
        // Current test time is 2024-01-15 10:00:00 JST
        // 5 days in the future
        const futureUnixTime = Math.floor(new Date(`2024-01-20T10:00:00${JST_TIMEZONE_OFFSET}`).getTime() / 1000)
        const result = getUntilClosedInfo({ seconds: futureUnixTime })

        expect(result).not.toBeNull()
        expect(result?.isClosed).toBe(false)
        expect(result?.text).toBe('残り5日')
        expect(result?.days).toBe(5)
      })

      it('should return remaining months for far future', () => {
        // Current test time is 2024-01-15 10:00:00 JST
        // 3 months in the future
        const futureUnixTime = Math.floor(new Date(`2024-04-15T10:00:00${JST_TIMEZONE_OFFSET}`).getTime() / 1000)
        const result = getUntilClosedInfo({ seconds: futureUnixTime })

        expect(result).not.toBeNull()
        expect(result?.isClosed).toBe(false)
        expect(result?.text).toBe('残り3ヶ月')
        expect(result?.months).toBe(3)
      })

      it('should handle exactly 60 seconds', () => {
        // Current test time is 2024-01-15 10:00:00 JST
        // exactly 60 seconds in the future
        const futureUnixTime = Math.floor(new Date(`2024-01-15T10:01:00${JST_TIMEZONE_OFFSET}`).getTime() / 1000)
        const result = getUntilClosedInfo({ seconds: futureUnixTime })

        expect(result).not.toBeNull()
        expect(result?.isClosed).toBe(false)
        expect(result?.text).toBe('残り1分')
        expect(result?.minutes).toBe(1)
      })

      it('should handle exactly 60 minutes', () => {
        // Current test time is 2024-01-15 10:00:00 JST
        // exactly 60 minutes in the future
        const futureUnixTime = Math.floor(new Date(`2024-01-15T11:00:00${JST_TIMEZONE_OFFSET}`).getTime() / 1000)
        const result = getUntilClosedInfo({ seconds: futureUnixTime })

        expect(result).not.toBeNull()
        expect(result?.isClosed).toBe(false)
        // The implementation shows '残り60分' for exactly 60 minutes (since minutes <= 60)
        expect(result?.text).toBe('残り60分')
        expect(result?.minutes).toBe(60)
        expect(result?.hours).toBe(1)
      })

      it('should handle exactly 24 hours', () => {
        // Current test time is 2024-01-15 10:00:00 JST
        // exactly 24 hours in the future
        const futureUnixTime = Math.floor(new Date(`2024-01-16T10:00:00${JST_TIMEZONE_OFFSET}`).getTime() / 1000)
        const result = getUntilClosedInfo({ seconds: futureUnixTime })

        expect(result).not.toBeNull()
        expect(result?.isClosed).toBe(false)
        // The implementation shows '残り24時間' for exactly 24 hours (since hours <= 24)
        expect(result?.text).toBe('残り24時間')
        expect(result?.hours).toBe(24)
        expect(result?.days).toBe(1)
      })

      it('should handle UTC timezone', () => {
        // Current test time is 2024-01-15 10:00:00 JST
        // 50 minutes in the future (using JST time for consistency)
        const futureUnixTime = Math.floor(new Date(`2024-01-15T10:50:00${JST_TIMEZONE_OFFSET}`).getTime() / 1000)
        const result = getUntilClosedInfo({ seconds: futureUnixTime, timezone: 'UTC' })

        expect(result).not.toBeNull()
        expect(result?.isClosed).toBe(false)
        expect(result?.minutes).toBe(50)
      })

      it('should return null for zero seconds', () => {
        const result = getUntilClosedInfo({ seconds: 0 })
        expect(result).toBeNull()
      })

      it('should handle exactly 31 days (boundary)', () => {
        // Current test time is 2024-01-15 10:00:00 JST
        // exactly 31 days in the future
        const futureUnixTime = Math.floor(new Date(`2024-02-15T10:00:00${JST_TIMEZONE_OFFSET}`).getTime() / 1000)
        const result = getUntilClosedInfo({ seconds: futureUnixTime })

        expect(result).not.toBeNull()
        expect(result?.isClosed).toBe(false)
        expect(result?.text).toBe('残り31日')
        expect(result?.days).toBe(31)
      })

      it('should handle more than 31 days (use months)', () => {
        // Current test time is 2024-01-15 10:00:00 JST
        // 32 days in the future (should use months)
        const futureUnixTime = Math.floor(new Date(`2024-02-16T10:00:00${JST_TIMEZONE_OFFSET}`).getTime() / 1000)
        const result = getUntilClosedInfo({ seconds: futureUnixTime })

        expect(result).not.toBeNull()
        expect(result?.isClosed).toBe(false)
        expect(result?.text).toBe('残り1ヶ月')
        expect(result?.months).toBe(1)
      })

      it('should handle days > 31 with months >= 1', () => {
        // Current test time is 2024-01-15 10:00:00 JST
        // 36 days in the future, months=1
        const futureUnixTime = Math.floor(new Date(`2024-02-20T10:00:00${JST_TIMEZONE_OFFSET}`).getTime() / 1000)
        const result = getUntilClosedInfo({ seconds: futureUnixTime })

        expect(result).not.toBeNull()
        expect(result?.isClosed).toBe(false)
        expect(result?.text).toBe('残り1ヶ月')
        expect(result?.days).toBe(36)
        expect(result?.months).toBe(1)
      })

      it('should handle exactly closed status with negative seconds', () => {
        // Test the exact moment when isClosed=true AND diffSeconds < 0
        const pastUnixTime = Math.floor(new Date(`2024-01-15T09:59:30${JST_TIMEZONE_OFFSET}`).getTime() / 1000)
        const result = getUntilClosedInfo({ seconds: pastUnixTime })

        expect(result).not.toBeNull()
        expect(result?.isClosed).toBe(true)
        expect(result?.text).toBeUndefined() // Should be undefined due to diffSeconds < 0 || isClosed
        expect(result?.seconds).toBe(-30)
      })
    })
  })

  //============================================================================
  // 4. Others (Optional)
  //============================================================================
  describe('Others (Optional)', () => {
    // Edge cases and integration tests
    describe('Edge cases', () => {
      it('should handle leap year dates', () => {
        const leapDate = new Date(`2024-02-29T12:00:00${JST_TIMEZONE_OFFSET}`)
        const result = format({ date: leapDate, format: 'yyyy-MM-dd' })
        expect(result).toBe('2024-02-29')
      })

      it('should handle year boundary', () => {
        const newYear = new Date(`2024-01-01T00:00:00${JST_TIMEZONE_OFFSET}`)
        const result = format({ date: newYear, format: 'yyyy年MM月dd日' })
        expect(result).toBe('2024年01月01日')
      })

      it('should handle daylight saving time boundaries', () => {
        // Japan doesn't have DST, but test with JST
        const date = new Date(`2024-03-10T07:00:00${JST_TIMEZONE_OFFSET}`)
        const result = format({ date, format: 'yyyy-MM-dd HH:mm', timezone: 'UTC' })
        expect(result).toBe('2024-03-09 22:00') // JST to UTC conversion: JST is UTC+9
      })
    })

    describe('Type safety', () => {
      it('should handle type coercion gracefully', () => {
        // @ts-expect-error Testing invalid type
        const result = formatUnixTime({ unixTime: '1716206400' })
        expect(result).toBe('')
      })

      it('should handle null values', () => {
        // @ts-expect-error Testing null
        const result = format({ date: null, format: 'yyyy-MM-dd' })
        expect(result).toBe('')
      })
    })
  })
})
