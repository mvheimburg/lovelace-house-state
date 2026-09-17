import { afterEach, describe, expect, it, vi } from "vitest";
import "../src/lovelace-house-state-card";
import type { HomeAssistant } from "../src/types";
const tree = [
  {
    id: "present",
    name: "Here",
    parent: null,
    scene: "scene.home",
    default_child: "awake",
    occupied: true,
  },
  {
    id: "awake",
    name: "Awake",
    parent: "present",
    scene: "",
    default_child: "quiet",
    occupied: null,
  },
  {
    id: "quiet",
    name: "Quiet",
    parent: "awake",
    scene: "",
    default_child: "reading",
    occupied: null,
  },
  {
    id: "reading",
    name: "Reading",
    parent: "quiet",
    scene: "",
    default_child: null,
    occupied: null,
  },
  {
    id: "trip",
    name: "On a trip",
    parent: null,
    scene: "scene.trip",
    default_child: "long_trip",
    occupied: false,
  },
  {
    id: "long_trip",
    name: "Long trip",
    parent: "trip",
    scene: "",
    default_child: null,
    occupied: null,
  },
];
const config = {
  state_tree: tree,
  initial_state: "present",
  overlays: [{ id: "cozy", name: "Cozy lights", scene: "scene.cozy" }],
  roles: { arrival: "present", departure: null, vacation: "trip", night: null },
  door_entities: [],
  gate_entities: [],
  person_entities: [],
  auto_return: true,
  auto_away: false,
  auto_away_grace: 300,
  night_schedule: { type: "off" },
  legacy_mirror: {},
};
const setup = async (attributes: Record<string, unknown> = {}) => {
  const callService = vi.fn().mockResolvedValue(undefined);
  const el = document.createElement("lovelace-house-state-card") as any;
  el.hass = {
    states: {
      "sensor.house_state": {
        entity_id: "sensor.house_state",
        state: "reading",
        attributes: {
          friendly_name: "House",
          state: "reading",
          active_path: ["present", "awake", "quiet", "reading"],
          state_tree: tree,
          overlays: config.overlays,
          overlay: "none",
          occupied: true,
          since: new Date(Date.now() - 3600000).toISOString(),
          last_changed_by: "door",
          config,
          ...attributes,
        },
      },
    },
    locale: { language: "en" },
    callService,
  } satisfies HomeAssistant;
  el.setConfig({
    type: "custom:lovelace-house-state-card",
    entity: "sensor.house_state",
  });
  document.body.append(el);
  await el.updateComplete;
  return { el, callService };
};
afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});
describe("configurable tree card", () => {
  it("renders every active path level from configurable names", async () => {
    const { el } = await setup();
    expect(
      [...el.shadowRoot!.querySelectorAll(".segment")].map((x: any) =>
        x.textContent.trim(),
      ),
    ).toEqual(["HereOn a trip", "Awake", "Quiet", "Reading"]);
  });
  it("selects arbitrary states with a user reason", async () => {
    const { el, callService } = await setup();
    el.shadowRoot!.querySelector('[data-state="awake"]').click();
    await vi.waitFor(() =>
      expect(callService).toHaveBeenCalledWith("house_state", "set", {
        entity_id: "sensor.house_state",
        state: "awake",
        reason: "user",
      }),
    );
  });
  it("confirms vacation role descendants", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    const { el, callService } = await setup({
      state: "present",
      active_path: ["present"],
    });
    el.shadowRoot!.querySelector('[data-state="trip"]').click();
    expect(window.confirm).toHaveBeenCalled();
    expect(callService).not.toHaveBeenCalled();
  });
  it("confirms when a selected ancestor defaults into vacation", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    const nodes = [
      ...tree.map((n) => (n.id === "trip" ? { ...n, parent: "travel" } : n)),
      {
        id: "travel",
        name: "Travel",
        parent: null,
        scene: "",
        default_child: "trip",
        occupied: false,
      },
    ];
    const { el, callService } = await setup({
      state_tree: nodes,
      config: { ...config, state_tree: nodes },
    });
    el.shadowRoot!.querySelector('[data-state="travel"]').click();
    expect(window.confirm).toHaveBeenCalled();
    expect(callService).not.toHaveBeenCalled();
  });
  it("renders and selects custom overlays by name", async () => {
    const { el, callService } = await setup();
    const s = el.shadowRoot!.querySelector(".overlay") as HTMLSelectElement;
    expect(s.textContent).toContain("Cozy lights");
    s.value = "cozy";
    s.dispatchEvent(new Event("change"));
    await vi.waitFor(() =>
      expect(callService).toHaveBeenCalledWith("house_state", "set", {
        entity_id: "sensor.house_state",
        overlay: "cozy",
        reason: "user",
      }),
    );
  });
  it("initializes dynamic selects from configuration", async () => {
    const { el } = await setup({ overlay: "cozy" });
    expect(
      (el.shadowRoot!.querySelector(".overlay") as HTMLSelectElement).value,
    ).toBe("cozy");
    el.shadowRoot!.querySelector('[aria-label="Settings"]').click();
    await el.updateComplete;
    const values = [
      ...el.shadowRoot!.querySelectorAll(".section.grid select"),
    ].map((x: any) => x.value);
    expect(values).toContain("present");
    expect(values).toContain("trip");
  });
  it("saves the entire structural draft atomically", async () => {
    const { el, callService } = await setup();
    el.shadowRoot!.querySelector('[aria-label="Settings"]').click();
    await el.updateComplete;
    el.shadowRoot!.querySelector('[data-action="add-root"]').click();
    await el.updateComplete;
    const n = el.shadowRoot!.querySelector(
      '[name="node-name"]',
    ) as HTMLInputElement;
    n.value = "Guests";
    n.dispatchEvent(new Event("input"));
    el.shadowRoot!.querySelector('[data-action="save"]').click();
    await vi.waitFor(() =>
      expect(callService).toHaveBeenCalledWith(
        "house_state",
        "set_config",
        expect.objectContaining({
          entity_id: "sensor.house_state",
          state_tree: expect.arrayContaining([
            expect.objectContaining({ name: "Guests", parent: null }),
          ]),
          roles: config.roles,
          initial_state: "present",
          overlays: config.overlays,
        }),
      ),
    );
  });
  it("removes subtrees and clears role references", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    const { el, callService } = await setup();
    el.shadowRoot!.querySelector('[aria-label="Settings"]').click();
    await el.updateComplete;
    el.shadowRoot!.querySelector('[data-node="trip"]').click();
    await el.updateComplete;
    el.shadowRoot!.querySelector('[data-action="remove-node"]').click();
    await el.updateComplete;
    el.shadowRoot!.querySelector('[data-action="save"]').click();
    await vi.waitFor(() =>
      expect(callService).toHaveBeenCalledWith(
        "house_state",
        "set_config",
        expect.objectContaining({
          roles: expect.objectContaining({ vacation: null }),
          state_tree: expect.not.arrayContaining([
            expect.objectContaining({ id: "trip" }),
          ]),
        }),
      ),
    );
  });
  it("does not remove the last remaining tree through its root", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    const only = [
      {
        id: "root",
        name: "Root",
        parent: null,
        scene: "",
        default_child: "child",
        occupied: true,
      },
      {
        id: "child",
        name: "Child",
        parent: "root",
        scene: "",
        default_child: null,
        occupied: null,
      },
    ];
    const { el } = await setup({
      state_tree: only,
      active_path: ["root", "child"],
      config: { ...config, state_tree: only, initial_state: "root" },
    });
    el.shadowRoot!.querySelector('[aria-label="Settings"]').click();
    await el.updateComplete;
    el.shadowRoot!.querySelector('[data-node="root"]').click();
    await el.updateComplete;
    el.shadowRoot!.querySelector('[data-action="remove-node"]').click();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelectorAll("[data-node]")).toHaveLength(2);
  });
  it("keeps an invalid draft open when atomic save fails", async () => {
    const { el, callService } = await setup();
    callService.mockRejectedValueOnce(new Error("invalid tree"));
    el.shadowRoot!.querySelector('[aria-label="Settings"]').click();
    await el.updateComplete;
    el.shadowRoot!.querySelector('[data-action="save"]').click();
    await vi.waitFor(() => expect(callService).toHaveBeenCalled());
    expect(el.shadowRoot!.querySelector("dialog").open).toBe(true);
  });
  it("surfaces service failures", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    const { el, callService } = await setup();
    callService.mockRejectedValueOnce(new Error("offline"));
    const fn = vi.fn();
    el.addEventListener("hass-notification", fn);
    el.shadowRoot!.querySelector('[data-state="trip"]').click();
    await vi.waitFor(() => expect(fn).toHaveBeenCalled());
    expect(fn.mock.calls[0][0].detail.message).toContain("offline");
  });
  it("restores the authoritative overlay after a rejected change", async () => {
    const { el, callService } = await setup({ overlay: "none" });
    callService.mockRejectedValueOnce(new Error("offline"));
    const select = el.shadowRoot!.querySelector(
      ".overlay",
    ) as HTMLSelectElement;
    select.value = "cozy";
    select.dispatchEvent(new Event("change"));
    await vi.waitFor(() => expect(callService).toHaveBeenCalled());
    await vi.waitFor(() => expect(select.value).toBe("none"));
  });
  it("preserves an open draft through a temporary unavailable hub reload", async () => {
    const { el } = await setup();
    el.shadowRoot!.querySelector('[aria-label="Settings"]').click();
    await el.updateComplete;
    const name = el.shadowRoot!.querySelector(
      '[name="node-name"]',
    ) as HTMLInputElement;
    name.value = "Draft name";
    name.dispatchEvent(new Event("input"));
    await el.updateComplete;
    el.hass = {
      ...el.hass,
      states: {
        "sensor.house_state": {
          entity_id: "sensor.house_state",
          state: "unavailable",
          attributes: { friendly_name: "House" },
        },
      },
    };
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector("dialog").open).toBe(true);
    expect(
      (el.shadowRoot!.querySelector('[name="node-name"]') as HTMLInputElement)
        .value,
    ).toBe("Draft name");
    el.hass = {
      ...el.hass,
      states: {
        "sensor.house_state": {
          entity_id: "sensor.house_state",
          state: "reading",
          attributes: {
            state: "reading",
            active_path: ["present", "awake", "quiet", "reading"],
            state_tree: tree,
            overlays: config.overlays,
            overlay: "none",
            config,
          },
        },
      },
    };
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector("dialog").open).toBe(true);
    expect(
      (el.shadowRoot!.querySelector('[name="node-name"]') as HTMLInputElement)
        .value,
    ).toBe("Draft name");
  });
  it("shows a configured zero-second away grace", async () => {
    const { el } = await setup({ config: { ...config, auto_away_grace: 0 } });
    el.shadowRoot!.querySelector('[aria-label="Settings"]').click();
    await el.updateComplete;
    const inputs = [
      ...el.shadowRoot!.querySelectorAll('input[type="number"]'),
    ] as HTMLInputElement[];
    expect(inputs.some((input) => input.value === "0")).toBe(true);
  });
});
