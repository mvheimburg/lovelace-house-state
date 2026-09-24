import {
  PALETTE,
  isMeasurement,
  unitOf,
  type HistoryStates,
  type Source,
} from "lovelace-card-history";

/**
 * What one chart draws: the tapped reading first, the card's other readings
 * in its unit, and those in one more unit on a second scale. A third unit
 * would need a third scale, so it is left out.
 */
export function historySources(
  sensors: string[],
  tapped: string,
  states: HistoryStates,
): Source[] {
  const readings = [
    tapped,
    ...sensors.filter(
      (id) =>
        id !== tapped && id.startsWith("sensor.") && isMeasurement(states[id]),
    ),
  ];
  const first = unitOf(states[tapped]);
  const second = readings
    .map((id) => unitOf(states[id]))
    .find((unit) => unit !== first);
  return readings
    .filter((id) => [first, second].includes(unitOf(states[id])))
    .map((entityId, i) => ({ entityId, color: i % PALETTE }));
}
