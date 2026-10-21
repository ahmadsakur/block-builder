const LOCALE = "en-US";
const MINUS = "−";

const cache = new Map<string, Intl.NumberFormat>();

function numberFormat(options: Intl.NumberFormatOptions) {
  const key = JSON.stringify(options);
  let format = cache.get(key);
  if (!format) {
    format = new Intl.NumberFormat(LOCALE, options);
    cache.set(key, format);
  }
  return format;
}

interface FormatOptions {
  /** @default 1 */
  maximumFractionDigits?: number;
  /** @default 0 */
  minimumFractionDigits?: number;
}

function formatNumber(value: number, options: FormatOptions = {}) {
  return numberFormat({ maximumFractionDigits: 1, ...options }).format(value);
}

function formatCompact(value: number) {
  return numberFormat({ maximumFractionDigits: 1, notation: "compact" }).format(
    value,
  );
}

interface CurrencyOptions extends FormatOptions {
  /** `$48K` instead of `$48,290`. */
  compact?: boolean;
  /** @default 'USD' */
  currency?: string;
}

/** Whole dollars unless `maximumFractionDigits` says otherwise; compact keeps one decimal. */
function formatCurrency(value: number, options: CurrencyOptions = {}) {
  const { compact = false, currency = "USD", ...digits } = options;
  return numberFormat({
    currency,
    maximumFractionDigits: compact ? 1 : 0,
    ...(compact ? { minimumFractionDigits: 0, notation: "compact" } : {}),
    style: "currency",
    ...digits,
  }).format(value);
}

/** Takes a ratio: `0.125` is `12.5%`. */
function formatPercent(ratio: number, options: FormatOptions = {}) {
  return numberFormat({
    maximumFractionDigits: 1,
    style: "percent",
    ...options,
  }).format(ratio);
}

/** A difference with its sign, written with a real minus: `+12`, `−3.5`, `0`. */
function formatSigned(
  value: number,
  format: (value: number) => string = formatNumber,
) {
  if (value === 0) return format(0);
  return `${value > 0 ? "+" : MINUS}${format(Math.abs(value))}`;
}

/** Percentage points: `1.2 pts`, `1 pt`. */
function formatPoints(value: number, options: FormatOptions = {}) {
  const text = formatNumber(value, options);
  return `${text} ${Math.abs(value) === 1 ? "pt" : "pts"}`;
}

const dayFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

const yearFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
  year: "numeric",
});

/** `Mar 3 – 9`, `Mar 28 – Apr 3`, `Dec 28, 2025 – Jan 3, 2026`, read in UTC. */
function formatDateRange({ end, start }: { end: Date; start: Date }) {
  if (start.getUTCFullYear() !== end.getUTCFullYear()) {
    return `${yearFormatter.format(start)} – ${yearFormatter.format(end)}`;
  }
  const first = dayFormatter.format(start);
  if (start.getUTCMonth() !== end.getUTCMonth()) {
    return `${first} – ${dayFormatter.format(end)}`;
  }
  if (start.getUTCDate() !== end.getUTCDate())
    return `${first} – ${end.getUTCDate()}`;
  return first;
}

const dateCache = new Map<string, Intl.DateTimeFormat>();

function dateFormat(options: Intl.DateTimeFormatOptions) {
  const key = JSON.stringify(options);
  let format = dateCache.get(key);
  if (!format) {
    format = new Intl.DateTimeFormat(LOCALE, options);
    dateCache.set(key, format);
  }
  return format;
}

/** The `YYYY-MM-DD` day an instant falls on in `timeZone`. */
function dayIn(date: Date, timeZone: string) {
  const parts = dateFormat({
    day: "2-digit",
    month: "2-digit",
    timeZone,
    year: "numeric",
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((candidate) => candidate.type === type)?.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

/** `Dec 14` in `now`'s year, `Dec 14, 2026` in another or without `now`. A `Date` is read in `timeZone`; a `YYYY-MM-DD` string is that day. */
function formatDay(date: Date | string, now?: Date, timeZone = "UTC") {
  if (typeof date === "string")
    return formatDay(new Date(`${date}T00:00:00Z`), now);
  const sameYear =
    now !== undefined &&
    dayIn(date, timeZone).slice(0, 4) === dayIn(now, timeZone).slice(0, 4);
  return dateFormat({
    day: "numeric",
    month: "short",
    timeZone,
    ...(sameYear ? {} : { year: "numeric" }),
  }).format(date);
}

/** Joins the parts that are set with ` · `. */
function joinDetails(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" · ");
}

export type { CurrencyOptions, FormatOptions };
export {
  dayIn,
  formatCompact,
  formatCurrency,
  formatDateRange,
  formatDay,
  formatNumber,
  formatPercent,
  formatPoints,
  formatSigned,
  joinDetails,
};
