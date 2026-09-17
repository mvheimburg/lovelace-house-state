import { afterEach, describe, expect, it, vi } from "vitest";
import "../src/lovelace-house-state-card";
import type { HomeAssistant } from "../src/types";

const state = (overrides: Record<string, unknown> = {}) => ({
  entity_id: "sensor.house_state",
  state: "home",
  attributes: {
    friendly_name: "House",
    presence: "home",
    mode: "day",
    activity: "none",
    overlay: "none",
    since: new Date(Date.now() - 3_600_000).toISOString(),
    last_changed_by: "door",
    mode_is_available: true,
    activity_is_available: true,
    available_overlays: ["none", "christmas", "halloween", "party"],
    config: {
      door_entities: ["lock.front"],
      gate_entities: [],
      person_entities: [],
      scene_map: { home: "scene.home" },
      auto_return: true,
      auto_away: false,
      auto_away_grace: 300,
      night_schedule: { type: "off" },
      legacy_mirror: {},
    },
    ...overrides,
  },
});
const setup = async (
  attrs: Record<string, unknown> = {},
  config: Record<string, unknown> = {},
) => {
  const callService = vi.fn().mockResolvedValue(undefined);
  const el = document.createElement("lovelace-house-state-card") as any;
  el.hass = {
    states: { "sensor.house_state": state(attrs) },
    locale: { language: "en" },
    callService,
  } satisfies HomeAssistant;
  el.setConfig({
    type: "custom:lovelace-house-state-card",
    entity: "sensor.house_state",
    ...config,
  });
  document.body.append(el);
  await el.updateComplete;
  return { el, callService };
};
afterEach(() => document.body.replaceChildren());

describe("house state card", () => {
  it("sends atomic state service payloads with the hub target", async () => {
    const { el, callService } = await setup();
    (
      el.shadowRoot!.querySelector('[data-value="night"]') as HTMLElement
    ).click();
    await vi.waitFor(() =>
      expect(callService).toHaveBeenCalledWith("house_state", "set", {
        entity_id: "sensor.house_state",
        mode: "night",
        reason: "user",
      }),
    );
  });
  it("keeps mode visible and disables it while away", async () => {
    const { el } = await setup({
      presence: "away",
      mode: "day",
      mode_is_available: false,
      activity_is_available: false,
    });
    const day = el.shadowRoot!.querySelector('[data-value="day"]');
    expect(day).not.toBeNull();
    expect(day.disabled).toBe(true);
    expect(el.shadowRoot!.querySelector(".activities")).toBeNull();
  });
  it("asks before vacation and does not call when cancelled", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    const { el, callService } = await setup();
    (
      el.shadowRoot!.querySelector('[data-value="vacation"]') as HTMLElement
    ).click();
    expect(window.confirm).toHaveBeenCalled();
    expect(callService).not.toHaveBeenCalled();
  });
  it("surfaces service errors as HA toasts", async () => {
    const { el, callService } = await setup();
    callService.mockRejectedValueOnce(new Error("offline"));
    const event = vi.fn();
    el.addEventListener("hass-notification", event);
    (
      el.shadowRoot!.querySelector('[data-value="away"]') as HTMLElement
    ).click();
    await vi.waitFor(() => expect(event).toHaveBeenCalled());
    expect(event.mock.calls[0][0].detail.message).toContain("offline");
  });
  it("persists every settings field directly through set_config", async () => {
    const { el, callService } = await setup();
    (
      el.shadowRoot!.querySelector('[aria-label="Settings"]') as HTMLElement
    ).click();
    await el.updateComplete;
    const dialog = el.shadowRoot!.querySelector("dialog")!;
    expect(dialog.open).toBe(true);
    const grace = el.shadowRoot!.querySelector(
      '[name="auto_away_grace"]',
    ) as HTMLInputElement;
    grace.value = "420";
    grace.dispatchEvent(new Event("change"));
    await vi.waitFor(() =>
      expect(callService).toHaveBeenCalledWith("house_state", "set_config", {
        entity_id: "sensor.house_state",
        auto_away_grace: 420,
      }),
    );
  });
  it("applies the current scene on demand", async () => {
    const { el, callService } = await setup();
    (
      el.shadowRoot!.querySelector('[aria-label="Settings"]') as HTMLElement
    ).click();
    await el.updateComplete;
    (
      el.shadowRoot!.querySelector('[data-action="apply-scene"]') as HTMLElement
    ).click();
    await vi.waitFor(() =>
      expect(callService).toHaveBeenCalledWith("house_state", "apply_scene", {
        entity_id: "sensor.house_state",
        force: true,
      }),
    );
  });
  it("clears scene slots and persists entity arrays", async () => {
    const { el, callService } = await setup();
    (
      el.shadowRoot!.querySelector('[aria-label="Settings"]') as HTMLElement
    ).click();
    await el.updateComplete;
    const picker = el.shadowRoot!.querySelector("ha-entity-picker")!;
    picker.dispatchEvent(
      new CustomEvent("value-changed", { detail: { value: "" } }),
    );
    const doors = el.shadowRoot!.querySelector('[name="door_entities"]')!;
    doors.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: ["lock.front", "lock.back"] },
      }),
    );
    await vi.waitFor(() =>
      expect(callService).toHaveBeenCalledWith("house_state", "set_config", {
        entity_id: "sensor.house_state",
        door_entities: ["lock.front", "lock.back"],
      }),
    );
    expect(callService).toHaveBeenCalledWith("house_state", "set_config", {
      entity_id: "sensor.house_state",
      scene_map: { home: "" },
    });
  });
  it("persists fixed and sun schedule shapes", async () => {
    let x = await setup({
      config: {
        ...state().attributes.config,
        night_schedule: { type: "fixed", time: "22:00:00" },
      },
    });
    (
      x.el.shadowRoot!.querySelector('[aria-label="Settings"]') as HTMLElement
    ).click();
    await x.el.updateComplete;
    const time = x.el.shadowRoot!.querySelector(
      'input[type="time"]',
    ) as HTMLInputElement;
    time.value = "23:15";
    time.dispatchEvent(new Event("change"));
    await vi.waitFor(() =>
      expect(x.callService).toHaveBeenCalledWith("house_state", "set_config", {
        entity_id: "sensor.house_state",
        night_schedule: { type: "fixed", time: "23:15:00" },
      }),
    );
    document.body.replaceChildren();
    x = await setup({
      config: {
        ...state().attributes.config,
        night_schedule: { type: "sun", event: "sunset", offset: -900 },
      },
    });
    (
      x.el.shadowRoot!.querySelector('[aria-label="Settings"]') as HTMLElement
    ).click();
    await x.el.updateComplete;
    const offset = [
      ...x.el.shadowRoot!.querySelectorAll('input[type="number"]'),
    ].at(-1) as HTMLInputElement;
    offset.value = "600";
    offset.dispatchEvent(new Event("change"));
    await vi.waitFor(() =>
      expect(x.callService).toHaveBeenCalledWith("house_state", "set_config", {
        entity_id: "sensor.house_state",
        night_schedule: { type: "sun", event: "sunset", offset: 600 },
      }),
    );
  });
  it("renders a useful missing hub error", async () => {
    const { el } = await setup();
    el.hass = { ...el.hass, states: {} };
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".error")!.textContent).toContain(
      "sensor.house_state",
    );
  });
  it("editor emits complete card options", async () => {
    const editor = document.createElement("lovelace-house-state-editor") as any;
    editor.hass = { states: {} };
    editor.setConfig({
      type: "custom:lovelace-house-state-card",
      entity: "sensor.house_state",
    });
    document.body.append(editor);
    await editor.updateComplete;
    const fn = vi.fn();
    editor.addEventListener("config-changed", fn);
    editor
      .shadowRoot!.querySelector("ha-form")!
      .dispatchEvent(
        new CustomEvent("value-changed", {
          detail: {
            value: {
              appearance: "bubble",
              show_activity: false,
              show_overlay: false,
              confirm_vacation: false,
            },
          },
        }),
      );
    expect(fn.mock.calls[0][0].detail.config).toMatchObject({
      appearance: "bubble",
      show_activity: false,
      show_overlay: false,
      confirm_vacation: false,
    });
  });
});
