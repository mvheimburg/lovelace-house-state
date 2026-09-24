import { afterEach, expect, it, vi } from "vitest";
import "../src/lovelace-house-state-card";
import { forecastDays } from "../src/weather";
import type { HomeAssistant } from "../src/types";

const HOUR = 3_600_000;
const tree = [
  {
    id: "home",
    name: "Home",
    parent: null,
    scene: "scene.home",
    default_child: null,
    occupied: true,
  },
];

const day = (offset: number, hour = 12) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};
const FORECAST = [
  { datetime: day(0), condition: "rainy", temperature: 11.3, templow: 6.5 },
  {
    datetime: day(1),
    condition: "partlycloudy",
    temperature: 12.6,
    templow: 5.3,
  },
  { datetime: day(2), condition: "cloudy", temperature: 12.3, templow: 9 },
  { datetime: day(3), condition: "sunny", temperature: 14.3, templow: 7.5 },
  { datetime: day(4), condition: "snowy", temperature: 14.9, templow: 11.5 },
  { datetime: day(5), condition: "fog", temperature: 10, templow: 4 },
];

type Card = HTMLElement & {
  setConfig(c: Record<string, unknown>): void;
  hass: HomeAssistant;
  updateComplete: Promise<boolean>;
};

async function mount(
  card: Record<string, unknown> = {},
  options: { language?: string; fail?: Error; features?: number } = {},
) {
  const now = Date.now();
  const s = (ms: number) => ms / 1000;
  let push: ((m: { forecast: unknown[] }) => void) | undefined;
  const unsubscribe = vi.fn();
  const subscribeMessage = vi.fn(async (callback, message) => {
    push = callback;
    void message;
    return unsubscribe;
  });
  const rows: Record<string, unknown[]> = {
    "sensor.outdoor": [
      { s: "5", lu: s(now - 20 * HOUR) },
      { s: "unavailable", lu: s(now - 12 * HOUR) },
      { s: "8", lu: s(now - 8 * HOUR) },
    ],
    "sensor.indoor": [{ s: "21", lu: s(now - 20 * HOUR) }],
    "sensor.humidity": [{ s: "40", lu: s(now - 20 * HOUR) }],
    "sensor.co2": [
      { s: "650", lu: s(now - 20 * HOUR) },
      { s: "unavailable", lu: s(now - 2 * HOUR) },
    ],
  };
  const history = vi.fn(async (m: Record<string, unknown>) => {
    if (options.fail) throw options.fail;
    return Object.fromEntries(
      (m.entity_ids as string[]).map((id) => [id, rows[id] ?? []]),
    );
  });
  const measured = (name: string, state: string, unit: string) => ({
    state,
    attributes: {
      friendly_name: name,
      unit_of_measurement: unit,
      state_class: "measurement",
    },
  });
  const states: Record<string, { state: string; attributes: object }> = {
    "sensor.house_state": {
      state: "home",
      attributes: {
        friendly_name: "House",
        active_path: ["home"],
        state_tree: tree,
        overlays: [],
        occupied: true,
        config: { state_tree: tree, overlays: [], roles: {} },
      },
    },
    "weather.home": {
      state: "rainy",
      attributes: {
        friendly_name: "Forecast Home",
        temperature: 8.7,
        temperature_unit: "°C",
        supported_features: options.features ?? 1,
      },
    },
    "sensor.outdoor": measured("Outdoor", "9.9", "°C"),
    "sensor.indoor": measured("Indoor", "21.5", "°C"),
    "sensor.humidity": measured("Humidity", "43", "%"),
    "sensor.co2": {
      state: "unavailable",
      attributes: {
        friendly_name: "CO2",
        unit_of_measurement: "ppm",
        state_class: "measurement",
      },
    },
    "sensor.air_quality": {
      state: "good",
      attributes: {
        friendly_name: "Air quality",
        device_class: "enum",
        options: ["good", "poor"],
      },
    },
  };
  const el = document.createElement(
    "lovelace-house-state-card",
  ) as unknown as Card;
  el.hass = {
    states: Object.fromEntries(
      Object.entries(states).map(([entity_id, v]) => [
        entity_id,
        { entity_id, ...v },
      ]),
    ),
    language: options.language ?? "en",
    callService: vi.fn(),
    connection: {
      subscribeMessage,
      sendMessagePromise: history as never,
    },
  } as HomeAssistant;
  el.setConfig({
    type: "custom:lovelace-house-state-card",
    entity: "sensor.house_state",
    ...card,
  });
  document.body.append(el);
  await el.updateComplete;
  const send = async (forecast = FORECAST) => {
    push?.({ forecast });
    await el.updateComplete;
  };
  return {
    el,
    root: el.shadowRoot!,
    subscribeMessage,
    unsubscribe,
    history,
    send,
  };
}
const text = (node: Element | null | undefined) =>
  node?.textContent?.replace(/\s+/g, " ").trim() ?? "";
const legend = (root: ShadowRoot) =>
  Array.from(root.querySelectorAll("#history .history-item")).map(text);

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

it("shows no settings cog unless asked, and nothing at the top without weather or sensors", async () => {
  const { el, root } = await mount();
  expect(root.querySelector('a[aria-label="Settings"]')).toBeNull();
  expect(root.querySelector(".outside")).toBeNull();
  el.setConfig({
    type: "custom:lovelace-house-state-card",
    entity: "sensor.house_state",
    show_settings: true,
  });
  await el.updateComplete;
  expect(root.querySelector('a[aria-label="Settings"]')).not.toBeNull();
});

it("shows the weather now with today's high and low, and the forecast only when asked", async () => {
  const { el, root, subscribeMessage, send } = await mount({
    weather: "weather.home",
  });
  expect(subscribeMessage).toHaveBeenCalledTimes(1);
  expect(subscribeMessage.mock.calls[0][1]).toEqual({
    type: "weather/subscribe_forecast",
    entity_id: "weather.home",
    forecast_type: "daily",
  });
  await send();
  const weather = root.querySelector("[data-weather]")!;
  expect(text(weather.querySelector(".wx-condition"))).toBe("Rainy");
  expect(text(weather.querySelector(".wx-place"))).toBe("Forecast Home");
  expect(text(weather.querySelector(".wx-now"))).toBe("8.7 °C");
  expect(text(weather.querySelector(".wx-range"))).toBe("11.3 °C / 6.5 °C");
  expect(weather.querySelector(".wx-range")!.getAttribute("title")).toBe(
    "High 11.3 °C, low 6.5 °C",
  );
  expect(root.querySelector(".forecast")).toBeNull();

  el.setConfig({
    type: "custom:lovelace-house-state-card",
    entity: "sensor.house_state",
    weather: "weather.home",
    show_forecast: true,
  });
  await el.updateComplete;
  const days = root.querySelectorAll("[data-day]");
  expect(days).toHaveLength(5);
  expect(text(days[0].querySelector(".day-high"))).toBe("11.3°");
  expect(text(days[1].querySelector(".day-low"))).toBe("5.3°");
  expect(days[3].querySelector("[role=img]")!.getAttribute("aria-label")).toBe(
    "Sunny",
  );
  // Same entity and type: the subscription is kept.
  expect(subscribeMessage).toHaveBeenCalledTimes(1);

  const info: string[] = [];
  el.addEventListener("hass-more-info", (e) =>
    info.push((e as CustomEvent).detail.entityId),
  );
  (weather as HTMLButtonElement).click();
  expect(info).toEqual(["weather.home"]);
});

it("uses Bokmål condition names, weekdays and decimal commas", async () => {
  const { root, send } = await mount(
    { weather: "weather.home", show_forecast: true },
    { language: "nb-NO" },
  );
  await send();
  expect(text(root.querySelector(".wx-condition"))).toBe("Regn");
  expect(text(root.querySelector(".wx-now"))).toBe("8,7 °C");
  const first = root.querySelector("[data-day] .day-name")!;
  expect(text(first)).toBe(
    new Intl.DateTimeFormat("nb-NO", { weekday: "short" }).format(new Date()),
  );
});

it("folds a day-and-night forecast into days, and stops following on removal or a new entity", async () => {
  const { el, subscribeMessage, unsubscribe } = await mount(
    { weather: "weather.home" },
    { features: 4 },
  );
  expect(subscribeMessage.mock.calls[0][1].forecast_type).toBe("twice_daily");
  const days = forecastDays([
    {
      datetime: day(0, 7),
      condition: "sunny",
      temperature: 12,
      is_daytime: true,
    },
    {
      datetime: day(0, 20),
      condition: "clear-night",
      temperature: 4,
      is_daytime: false,
    },
  ]);
  expect(days).toHaveLength(1);
  expect(days[0]).toMatchObject({ condition: "sunny", high: 12, low: 4 });

  el.setConfig({
    type: "custom:lovelace-house-state-card",
    entity: "sensor.house_state",
  });
  await el.updateComplete;
  await vi.waitFor(() => expect(unsubscribe).toHaveBeenCalledTimes(1));
  el.setConfig({
    type: "custom:lovelace-house-state-card",
    entity: "sensor.house_state",
    weather: "weather.home",
  });
  await el.updateComplete;
  expect(subscribeMessage).toHaveBeenCalledTimes(2);
  el.remove();
  await vi.waitFor(() => expect(unsubscribe).toHaveBeenCalledTimes(2));
});

it("shows no high and low for a weather entity without a forecast", async () => {
  const { root, subscribeMessage } = await mount(
    { weather: "weather.home" },
    { features: 0 },
  );
  expect(subscribeMessage).not.toHaveBeenCalled();
  expect(root.querySelector(".wx-range")).toBeNull();
  expect(text(root.querySelector(".wx-now"))).toBe("8.7 °C");
});

it("shows sensors as tiles, marks an unavailable one, and opens more-info for a non-measurement", async () => {
  const { el, root } = await mount(
    {
      sensors: ["sensor.outdoor", "sensor.co2", "sensor.air_quality"],
    },
    { language: "nb" },
  );
  const tiles = Array.from(root.querySelectorAll("[data-sensor]"));
  expect(tiles.map((t) => text(t))).toEqual([
    "Outdoor 9,9 °C",
    "! CO2 Utilgjengelig",
    "Air quality good",
  ]);
  expect(tiles[1].classList.contains("down")).toBe(true);
  expect(tiles[0].getAttribute("aria-haspopup")).toBe("dialog");
  expect(tiles[2].hasAttribute("aria-haspopup")).toBe(false);
  const info: string[] = [];
  el.addEventListener("hass-more-info", (e) =>
    info.push((e as CustomEvent).detail.entityId),
  );
  (tiles[2] as HTMLButtonElement).click();
  expect(info).toEqual(["sensor.air_quality"]);
});

it("opens a sensor's history with the card's other readings on up to two scales", async () => {
  const { el, root, history } = await mount({
    sensors: [
      "sensor.indoor",
      "sensor.co2",
      "sensor.outdoor",
      "sensor.humidity",
    ],
  });
  root
    .querySelector<HTMLButtonElement>('[data-sensor="sensor.outdoor"]')!
    .click();
  await vi.waitFor(() => expect(legend(root).length).toBeGreaterThan(0));
  expect(root.querySelector<HTMLDialogElement>("#history")!.open).toBe(true);
  // Tapped first; the other temperature; CO₂ is the second unit; humidity would be a third.
  expect(history.mock.calls[0][0]).toMatchObject({
    type: "history/history_during_period",
    entity_ids: ["sensor.outdoor", "sensor.indoor", "sensor.co2"],
    minimal_response: true,
    no_attributes: true,
  });
  expect(legend(root)).toEqual(["Outdoor 9.9 °C", "Indoor 21.5 °C", "CO2 —"]);
  const outdoor = root.querySelector(
    '.history-chart [data-entity="sensor.outdoor"]',
  )!;
  // The unavailable spell splits the line.
  expect(outdoor.getAttribute("d")!.match(/M/g)).toHaveLength(2);
  expect(
    Array.from(root.querySelectorAll(".history-chart .unit")).map(text),
  ).toEqual(["°C", "ppm"]);

  // A third of the way into 24 hours is 16 hours ago.
  const svg = root.querySelector<SVGSVGElement>(".history-chart")!;
  const box = svg.getBoundingClientRect();
  const width = svg.viewBox.baseVal.width;
  root.querySelector(".history-plot")!.dispatchEvent(
    new PointerEvent("pointermove", {
      clientX: box.left + ((44 + (width - 88) / 3) / width) * box.width,
    }),
  );
  await el.updateComplete;
  expect(legend(root).slice(0, 2)).toEqual(["Outdoor 5 °C", "Indoor 21 °C"]);
  expect(text(root.querySelector(".history-when"))).not.toBe("Now");

  root.querySelector<HTMLButtonElement>('[data-range="6"]')!.click();
  await vi.waitFor(() => expect(history).toHaveBeenCalledTimes(2));
  const info: string[] = [];
  el.addEventListener("hass-more-info", (e) =>
    info.push((e as CustomEvent).detail.entityId),
  );
  await vi.waitFor(() => expect(legend(root).length).toBe(3));
  root
    .querySelector<HTMLButtonElement>('[data-series="sensor.indoor"]')!
    .click();
  expect(info).toEqual(["sensor.indoor"]);
  expect(root.querySelector<HTMLDialogElement>("#history")!.open).toBe(false);
});

it("explains a failed history request in Bokmål", async () => {
  const { root } = await mount(
    { sensors: ["sensor.outdoor"] },
    { language: "nb", fail: new Error("Recorder is off") },
  );
  root
    .querySelector<HTMLButtonElement>('[data-sensor="sensor.outdoor"]')!
    .click();
  await vi.waitFor(() =>
    expect(text(root.querySelector("#history [role=alert]"))).toBe(
      "Kunne ikke hente historikk: Recorder is off",
    ),
  );
  expect(Array.from(root.querySelectorAll("[data-range]")).map(text)).toEqual([
    "6 t",
    "24 t",
    "7 d",
  ]);
  expect(
    root.querySelector("[data-close-history]")!.getAttribute("aria-label"),
  ).toBe("Lukk historikk");
});

it("drops a late history reply when the sensors change", async () => {
  const { el, root, history } = await mount({ sensors: ["sensor.outdoor"] });
  let release!: (v: Record<string, unknown[]>) => void;
  history.mockImplementationOnce(
    () => new Promise((resolve) => (release = resolve)),
  );
  root
    .querySelector<HTMLButtonElement>('[data-sensor="sensor.outdoor"]')!
    .click();
  await vi.waitFor(() => expect(history).toHaveBeenCalledTimes(1));
  el.setConfig({
    type: "custom:lovelace-house-state-card",
    entity: "sensor.house_state",
    sensors: ["sensor.indoor"],
  });
  release({ "sensor.outdoor": [] });
  await el.updateComplete;
  expect(root.querySelector<HTMLDialogElement>("#history")!.open).toBe(false);
  expect(legend(root)).toEqual([]);
});

it("keeps the settings cog and the top section when the house entity is missing", async () => {
  const { el, root } = await mount({
    entity: "sensor.gone",
    sensors: ["sensor.outdoor"],
  });
  void el;
  expect(root.querySelector('a[aria-label="Settings"]')).not.toBeNull();
  expect(root.querySelector('[data-sensor="sensor.outdoor"]')).not.toBeNull();
});
