import type { HassEntity, HomeAssistant } from "./types";

/** Time (ms) and value; `undefined` breaks the line (unavailable). */
export type Point = [number, number | undefined];
export interface Source {
  entityId: string;
  /** Palette slot (.series-0 … .series-4 in styles.ts). */
  color: number;
}
export interface Series extends Source {
  unit: string;
  points: Point[];
}
export const RANGES = [6, 24, 168] as const;
export type Range = (typeof RANGES)[number];
export const PALETTE = 5;

/** Home Assistant's compressed, minimal history row. */
interface Row {
  s: string;
  lu?: number;
  lc?: number;
}

export const isTemperature = (unit: string) => ["°C", "°F", "K"].includes(unit);

function numeric(state: string): number | undefined {
  if (["unavailable", "unknown", ""].includes(state)) return undefined;
  const value = Number(state);
  return Number.isFinite(value) ? value : undefined;
}

const unitOf = (state?: HassEntity) =>
  String(state?.attributes.unit_of_measurement ?? "");

/**
 * A sensor tile opens the history when it is a numeric measurement; a
 * timestamp, duration or enum adds nothing drawn as a line.
 */
export function hasHistory(state: HassEntity | undefined): boolean {
  if (!state || !state.entity_id.startsWith("sensor.")) return false;
  const attributes = state.attributes;
  if (
    ["duration", "timestamp", "date", "enum"].includes(attributes.device_class)
  )
    return false;
  if (!attributes.unit_of_measurement && !attributes.state_class) return false;
  return (
    ["unavailable", "unknown"].includes(state.state) ||
    numeric(state.state) !== undefined
  );
}

/**
 * What one chart draws: the tapped reading first, the card's other readings
 * in its unit, and those in one more unit on a second scale. A third unit
 * would need a third scale, so it is left out.
 */
export function historySources(
  sensors: string[],
  tapped: string,
  states: HomeAssistant["states"],
): Source[] {
  const readings = [
    tapped,
    ...sensors.filter((id) => id !== tapped && hasHistory(states[id])),
  ];
  const first = unitOf(states[tapped]);
  const second = readings
    .map((id) => unitOf(states[id]))
    .find((unit) => unit !== first);
  return readings
    .filter((id) => [first, second].includes(unitOf(states[id])))
    .map((entityId, i) => ({ entityId, color: i % PALETTE }));
}

/**
 * The history of each source over the last `hours`, from Home Assistant's
 * recorder, ending with the current state.
 */
export async function loadHistory(
  connection: NonNullable<HomeAssistant["connection"]>,
  sources: Source[],
  states: HomeAssistant["states"],
  hours: number,
  now = Date.now(),
): Promise<Series[]> {
  const start = now - hours * 3_600_000;
  const reply = sources.length
    ? await connection.sendMessagePromise<Record<string, Row[]>>({
        type: "history/history_during_period",
        start_time: new Date(start).toISOString(),
        entity_ids: sources.map((s) => s.entityId),
        minimal_response: true,
        no_attributes: true,
        significant_changes_only: false,
      })
    : {};
  return sources.map((source) => {
    const current = states[source.entityId];
    const points: Point[] = (reply?.[source.entityId] ?? []).map((row) => [
      Math.max(start, (row.lu ?? row.lc ?? 0) * 1000),
      numeric(row.s),
    ]);
    if (current) points.push([now, numeric(current.state)]);
    return { ...source, unit: unitOf(current), points };
  });
}

/** The value in force at `time`: the last point at or before it. */
export function valueAt(series: Series, time: number): number | undefined {
  let value: number | undefined;
  for (const [t, v] of series.points) {
    if (t > time) break;
    value = v;
  }
  return value;
}

/** Round-number ticks covering [min, max], about `count` of them. */
export function ticks(min: number, max: number, count = 4): number[] {
  const raw = (max - min) / count || 1;
  const power = 10 ** Math.floor(Math.log10(raw));
  const step =
    [1, 2, 2.5, 5, 10].map((m) => m * power).find((s) => s >= raw) ??
    10 * power;
  const out: number[] = [];
  for (let v = Math.floor(min / step) * step; ; v += step) {
    out.push(Number(v.toFixed(6)));
    if (v >= max - 1e-9) break;
  }
  return out;
}
