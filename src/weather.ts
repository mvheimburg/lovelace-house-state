import type { HassEntity } from "./types";

/** One entry of HA's `weather/subscribe_forecast` reply. */
export interface ForecastEntry {
  datetime: string;
  condition?: string;
  temperature?: number;
  templow?: number;
  is_daytime?: boolean;
}
/** A calendar day of the forecast. */
export interface ForecastDay {
  date: Date;
  condition?: string;
  high?: number;
  low?: number;
}

/** WeatherEntityFeature: which forecasts a weather entity offers. */
const DAILY = 1,
  TWICE_DAILY = 4;

/** The forecast to subscribe to: daily when offered, else day and night. */
export function forecastType(
  state: HassEntity | undefined,
): "daily" | "twice_daily" | undefined {
  const features = Number(state?.attributes.supported_features) || 0;
  if (features & DAILY) return "daily";
  if (features & TWICE_DAILY) return "twice_daily";
  return undefined;
}

const dayKey = (date: Date) =>
  `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

/**
 * Forecast entries folded into local calendar days: the day's high, its low,
 * and the daytime condition. Works for daily and twice-daily forecasts.
 */
export function forecastDays(entries: ForecastEntry[]): ForecastDay[] {
  const days = new Map<string, ForecastDay & { daytime?: boolean }>();
  for (const entry of entries) {
    const date = new Date(entry.datetime);
    if (Number.isNaN(date.getTime())) continue;
    const key = dayKey(date);
    const day = days.get(key) ?? { date };
    const values = [entry.temperature, entry.templow].filter(
      (v): v is number => typeof v === "number" && Number.isFinite(v),
    );
    if (values.length) {
      const high = entry.temperature ?? Math.max(...values);
      const low = entry.templow ?? Math.min(...values);
      day.high = day.high === undefined ? high : Math.max(day.high, high);
      day.low = day.low === undefined ? low : Math.min(day.low, low);
    }
    // The day's own condition, not the night's.
    if (!day.condition || (entry.is_daytime && !day.daytime)) {
      day.condition = entry.condition;
      day.daytime = entry.is_daytime;
    }
    days.set(key, day);
  }
  return [...days.values()].map(({ date, condition, high, low }) => ({
    date,
    condition,
    high,
    low,
  }));
}

/** Today's entry, when the forecast starts today. */
export function today(days: ForecastDay[], now = new Date()) {
  return days.find((d) => dayKey(d.date) === dayKey(now));
}

/** The icon drawn for a condition (icons.ts), and its colour family. */
export function conditionIcon(condition = ""): { icon: string; tone: string } {
  const map: Record<string, [string, string]> = {
    "clear-night": ["wx-night", "night"],
    cloudy: ["wx-cloud", "cloud"],
    exceptional: ["warning", "alert"],
    fog: ["wx-fog", "cloud"],
    hail: ["wx-hail", "rain"],
    lightning: ["wx-lightning", "storm"],
    "lightning-rainy": ["wx-lightning", "storm"],
    partlycloudy: ["wx-partly", "sun"],
    pouring: ["wx-rain", "rain"],
    rainy: ["wx-rain", "rain"],
    snowy: ["wx-snow", "snow"],
    "snowy-rainy": ["wx-snow", "snow"],
    sunny: ["wx-sun", "sun"],
    windy: ["wx-wind", "cloud"],
    "windy-variant": ["wx-wind", "cloud"],
  };
  const [icon, tone] = map[condition] ?? ["wx-cloud", "cloud"];
  return { icon, tone };
}
