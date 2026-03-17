import { TZDate } from '@date-fns/tz'
import {
  differenceInDays,
  differenceInSeconds,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  format as formatDateFns,
  fromUnixTime,
  isAfter,
} from 'date-fns'
import { ja, enUS } from 'date-fns/locale'

export type FormatDateJa =
  | 'yyyy-MM-dd'
  | 'yyyy-MM-dd HH:mm'
  | 'yyyy年MM月dd日'
  | 'yyyy年MM月dd日 HH:mm'
  | 'yyyy年MM月dd日（E）'
  | 'yyyy年MM月dd日（E）HH:mm'
  | 'yyyy-MM'
  | 'yyyy年MM月'
  | 'HH:mm'
  | 'yyyy/MM/dd（E）'
  | 'yyyy/MM/dd HH:mm'
  | 'yyyy/MM/dd'
  | 'yyyy年M月d日'
  | 'M月d日'
  | 'M月'
  | 'd日'
  | 'yyyyMMdd'
  | 'HHmm'
  | 'yyyyMMddHHmmss'
  | 'yyyy'
  | 'MM.dd'
  | 'E'
  | 'yyyy/MM/dd 00:00:00'
  | 'MMMM d, yyyy'

export type FormatDateTimezone = 'UTC' | 'Asia/Tokyo'

export type FormatLocale = 'ja' | 'en'

export const getTzDate = ({
  date,
  timezone = 'Asia/Tokyo',
}: {
  date?: Date | null
  timezone?: FormatDateTimezone
}): Date => {
  if (!date) {
    return new TZDate(new Date(), timezone)
  }

  return new TZDate(date, timezone)
}

export const format = ({
  date,
  format = 'yyyy-MM-dd',
  timezone = 'Asia/Tokyo',
  locale = 'ja',
}: {
  date?: Date
  format: FormatDateJa
  timezone?: FormatDateTimezone
  locale?: FormatLocale
}) => {
  if (!date) {
    return ''
  }

  const tzDate = getTzDate({ date, timezone })

  return formatDateFns(tzDate, format, {
    locale: locale === 'en' ? enUS : ja,
  })
}

export const formatUnixTime = ({
  unixTime,
  format = 'yyyy-MM-dd',
  timezone,
  locale = 'ja',
}: {
  unixTime: number | undefined
  format?: FormatDateJa
  timezone?: FormatDateTimezone
  locale?: FormatLocale
}): string => {
  if (typeof unixTime !== 'number') {
    return ''
  }
  const date = getTzDate({ date: fromUnixTime(unixTime), timezone })
  return formatDateFns(date, format, {
    locale: locale === 'en' ? enUS : ja,
  })
}

export const convertUnixTimeToDate = ({
  unixTime,
  timezone,
}: {
  unixTime: number | undefined
  timezone?: FormatDateTimezone
}): Date | null => {
  if (typeof unixTime !== 'number') {
    return null
  }
  return getTzDate({ date: fromUnixTime(unixTime), timezone })
}

type DiffTime = {
  seconds: number
  minutes: number
  hours: number
  days: number
  months: number
}

export const getDiffTime = ({
  from,
  to,
}: {
  from: Date
  to: Date
}): {
  seconds: number
  minutes: number
  hours: number
  days: number
  months: number
} => {
  const diffSeconds = differenceInSeconds(to, from)
  const diffMinutes = differenceInMinutes(to, from)
  const diffHours = differenceInHours(to, from)
  const diffDays = differenceInDays(to, from)
  const diffMonths = differenceInMonths(to, from)

  return {
    seconds: diffSeconds,
    minutes: diffMinutes,
    hours: diffHours,
    days: diffDays,
    months: diffMonths,
  }
}

type UntilClosedInfo = DiffTime & {
  isClosed: boolean
  text?: string
}

export const getUntilClosedInfo = ({
  seconds,
  timezone = 'Asia/Tokyo',
}: {
  seconds?: number
  timezone?: FormatDateTimezone
}): UntilClosedInfo | null => {
  if (!seconds) {
    return null
  }

  const now = getTzDate({ timezone })
  const targetDate = getTzDate({ date: fromUnixTime(seconds), timezone })

  const isClosed = isAfter(now, targetDate)
  const diffTime = getDiffTime({ from: now, to: targetDate })
  const { seconds: diffSeconds, minutes: diffMinutes, hours: diffHours, days: diffDays, months: diffMonths } = diffTime
  const text =
    diffSeconds < 0 || isClosed
      ? undefined
      : diffSeconds < 60
        ? `残り${diffSeconds}秒`
        : diffMinutes <= 60
          ? `残り${diffMinutes}分`
          : diffHours <= 24
            ? `残り${diffHours}時間`
            : diffDays <= 31
              ? `残り${diffDays}日`
              : diffMonths
                ? `残り${diffMonths}ヶ月`
                : undefined

  return {
    seconds: diffSeconds,
    minutes: diffMinutes,
    hours: diffHours,
    days: diffDays,
    months: diffMonths,
    isClosed,
    text,
  }
}
