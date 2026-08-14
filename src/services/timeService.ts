/**
 * Time and Timezone utilities with automatic Daylight Saving Time (DST) support,
 * 12/24-hour formatting, and accurate timezone offsets.
 */

export interface FormattedTimeResult {
  timeString: string;       // e.g. "14:28" or "02:28 PM"
  period?: string;           // "AM" | "PM" if 12-hour format
  hours: string;            // "14" or "02"
  minutes: string;          // "28"
  seconds: string;          // "05"
  dateString: string;       // e.g. "2026/08/14"
  dateYMD: string;          // e.g. "2026/08/14"
  weekdayString: string;    // e.g. "週五" or "Fri"
  weekNumber: number;       // e.g. 33 (第33週 / W33)
  weekNumberString: string; // e.g. "第 33 週" or "Week 33"
  fullWidgetDateLabel: string; // e.g. "2026/08/14 週五 • 第 33 週" or "2026/08/14 Fri • Week 33"
  timezoneName: string;     // e.g. "Asia/Taipei" or "America/New_York"
  isDst: boolean;           // Daylight Saving Time active
  dstOffsetName?: string;   // e.g. "EDT" or "EST"
  utcOffsetString: string;  // e.g. "UTC+8" or "UTC-4"
}

/**
 * Calculate ISO 8601 week number for a given date
 */
export function getISOWeekNumber(date: Date): number {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
  }
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
}

/**
 * Deduce or resolve IANA timezone from timezone string or latitude/longitude
 */
export function resolveTimezone(tz?: string, lat?: number, lon?: number): string {
  if (tz && tz !== 'auto') {
    try {
      // Test if valid IANA timezone
      Intl.DateTimeFormat(undefined, { timeZone: tz });
      return tz;
    } catch (e) {
      // Invalid, continue to coordinate deduction
    }
  }

  if (typeof lat === 'number' && typeof lon === 'number') {
    // Taiwan / Taipei
    if (lat >= 21.8 && lat <= 25.5 && lon >= 119.8 && lon <= 122.2) return 'Asia/Taipei';
    // Japan / Tokyo
    if (lat >= 24 && lat <= 46 && lon >= 123 && lon <= 146) return 'Asia/Tokyo';
    // Hong Kong
    if (lat >= 22.1 && lat <= 22.6 && lon >= 113.8 && lon <= 114.5) return 'Asia/Hong_Kong';
    // South Korea / Seoul
    if (lat >= 33 && lat <= 39 && lon >= 124 && lon <= 131) return 'Asia/Seoul';
    // Singapore
    if (lat >= 1.1 && lat <= 1.5 && lon >= 103.5 && lon <= 104.1) return 'Asia/Singapore';
    // London / UK
    if (lat >= 50 && lat <= 60 && lon >= -8 && lon <= 2) return 'Europe/London';
    // Paris / France
    if (lat >= 42 && lat <= 51 && lon >= -5 && lon <= 9) return 'Europe/Paris';
    // New York / Eastern US
    if (lat >= 38 && lat <= 45 && lon >= -80 && lon <= -70) return 'America/New_York';
    // California / Pacific US
    if (lat >= 32 && lat <= 42 && lon >= -125 && lon <= -114) return 'America/Los_Angeles';
    // Sydney / Australia
    if (lat <= -30 && lat >= -40 && lon >= 145 && lon <= 155) return 'Australia/Sydney';
  }

  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Taipei';
  } catch (e) {
    return 'Asia/Taipei';
  }
}

/**
 * Check if the given date is in Daylight Saving Time (DST) for a specific timezone
 */
export function isDaylightSavingTime(date: Date, timeZone: string): boolean {
  try {
    // Compare offset in January (winter in North hemisphere) vs July (summer)
    const year = date.getFullYear();
    const janDate = new Date(year, 0, 1);
    const julDate = new Date(year, 6, 1);

    const getOffsetMinutes = (d: Date) => {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
      });
      const parts = formatter.formatToParts(d);
      const values: Record<string, number> = {};
      for (const p of parts) {
        if (p.type !== 'literal') values[p.type] = parseInt(p.value, 10);
      }
      const tzDate = new Date(
        Date.UTC(
          values.year,
          values.month - 1,
          values.day,
          values.hour === 24 ? 0 : values.hour,
          values.minute,
          values.second
        )
      );
      return (tzDate.getTime() - d.getTime()) / 60000;
    };

    const janOffset = getOffsetMinutes(janDate);
    const julOffset = getOffsetMinutes(julDate);
    const currentOffset = getOffsetMinutes(date);

    // If Jan and Jul offsets are different, this timezone observes DST.
    // In Northern Hemisphere, summer (July) has higher offset. In Southern, Jan has higher offset.
    const maxOffset = Math.max(janOffset, julOffset);
    const minOffset = Math.min(janOffset, julOffset);

    if (maxOffset === minOffset) {
      return false; // Timezone does not observe DST
    }

    return currentOffset === maxOffset;
  } catch (e) {
    return false;
  }
}

/**
 * Format time for a specific timezone taking into account 12/24 hour format,
 * language, and automatic DST computation.
 */
export function formatLocalTime(
  date: Date = new Date(),
  timezone: string = 'Asia/Taipei',
  hour12: boolean = false,
  lang: 'zh' | 'en' = 'zh'
): FormattedTimeResult {
  const safeTz = resolveTimezone(timezone);
  const isDst = isDaylightSavingTime(date, safeTz);

  // Time formatter
  const timeFormatter = new Intl.DateTimeFormat(lang === 'zh' ? 'zh-TW' : 'en-US', {
    timeZone: safeTz,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12,
  });

  const parts = timeFormatter.formatToParts(date);
  let hours = '00';
  let minutes = '00';
  let seconds = '00';
  let period: string | undefined = undefined;

  for (const part of parts) {
    if (part.type === 'hour') hours = part.value;
    if (part.type === 'minute') minutes = part.value;
    if (part.type === 'second') seconds = part.value;
    if (part.type === 'dayPeriod') period = part.value;
  }

  // Date & YYYY/MM/DD Formatter in Target Timezone
  const ymdFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: safeTz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  // en-CA produces "YYYY-MM-DD", convert to "YYYY/MM/DD"
  const dateYMD = ymdFormatter.format(date).replace(/-/g, '/');

  // Weekday Formatter
  const weekdayFormatter = new Intl.DateTimeFormat(lang === 'zh' ? 'zh-TW' : 'en-US', {
    timeZone: safeTz,
    weekday: lang === 'zh' ? 'short' : 'short',
  });
  const weekdayString = weekdayFormatter.format(date);

  // Traditional Month Day String
  const dateFormatter = new Intl.DateTimeFormat(lang === 'zh' ? 'zh-TW' : 'en-US', {
    timeZone: safeTz,
    month: 'short',
    day: 'numeric',
  });
  const monthDayString = dateFormatter.format(date);

  // ISO Week Number for the date in target timezone
  // Derive local date components to compute accurate week number in safeTz
  const localDateParts = ymdFormatter.formatToParts(date);
  const y = parseInt(localDateParts.find((p) => p.type === 'year')?.value || '2026', 10);
  const m = parseInt(localDateParts.find((p) => p.type === 'month')?.value || '1', 10) - 1;
  const d = parseInt(localDateParts.find((p) => p.type === 'day')?.value || '1', 10);
  const localTargetDate = new Date(y, m, d);
  const weekNumber = getISOWeekNumber(localTargetDate);
  const weekNumberString = lang === 'zh' ? `第 ${weekNumber} 週` : `Week ${weekNumber}`;

  // Combined Widget Date Label: e.g. "2026/08/14 週五 • 第 33 週"
  const fullWidgetDateLabel = `${dateYMD} ${weekdayString} • ${weekNumberString}`;

  // UTC offset calculation
  let utcOffsetString = '';
  try {
    const tzNameFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: safeTz,
      timeZoneName: 'shortOffset',
    });
    const tzParts = tzNameFormatter.formatToParts(date);
    const tzPart = tzParts.find((p) => p.type === 'timeZoneName');
    if (tzPart) {
      utcOffsetString = tzPart.value.replace('GMT', 'UTC');
    }
  } catch (e) {
    utcOffsetString = '';
  }

  let timeString = `${hours}:${minutes}`;
  if (hour12 && period) {
    timeString = `${timeString} ${period}`;
  }

  return {
    timeString,
    period,
    hours,
    minutes,
    seconds,
    dateString: dateYMD,
    dateYMD,
    weekdayString,
    weekNumber,
    weekNumberString,
    fullWidgetDateLabel,
    timezoneName: safeTz,
    isDst,
    utcOffsetString: utcOffsetString || 'UTC',
  };
}
