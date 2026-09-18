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
});

const ruled = [
  {
    ...config.overlays[0],
    dates: { type: "fixed", from: "12-01", to: "12-26" },
  },
];
const withRules = {
  overlays: ruled,
  config: { ...config, overlays: ruled },
};

describe("date-driven overlays", () => {
  it("offers automatic only when an overlay carries a rule", async () => {
    const { el } = await setup();
    const plain = [
      ...el.shadowRoot!.querySelectorAll(".overlay option"),
    ] as HTMLOptionElement[];
    expect(plain.map((o) => o.value)).toEqual(["none", "cozy"]);

    const ruledCard = await setup({ ...withRules, overlay_choice: "auto" });
    const options = [
      ...ruledCard.el.shadowRoot!.querySelectorAll(".overlay option"),
    ] as HTMLOptionElement[];
    expect(options.map((o) => o.value)).toEqual(["auto", "none", "cozy"]);
  });
  it("names the rule-selected overlay on the automatic option", async () => {
    const { el } = await setup({
      ...withRules,
      overlay_choice: "auto",
      overlay: "cozy",
      overlay_rule: "cozy",
    });
    const auto = el.shadowRoot!.querySelector(
      '.overlay option[value="auto"]',
    ) as HTMLOptionElement;
    expect(auto.textContent!.trim()).toBe("Automatic · Cozy lights");
  });
  it("reflects the choice rather than the overlay in force", async () => {
    const { el } = await setup({
      ...withRules,
      overlay_choice: "auto",
      overlay: "cozy",
      overlay_rule: "cozy",
    });
    expect(
      (el.shadowRoot!.querySelector(".overlay") as HTMLSelectElement).value,
    ).toBe("auto");
  });
  it("falls back to the overlay when the hub predates rules", async () => {
    const { el } = await setup({ overlay: "cozy" });
    expect(
      (el.shadowRoot!.querySelector(".overlay") as HTMLSelectElement).value,
    ).toBe("cozy");
  });
  it("shows when a manual hold expires", async () => {
    const { el } = await setup({
      ...withRules,
      overlay_choice: "none",
      overlay_hold_until: new Date("2026-12-10T23:00:00Z").toISOString(),
    });
    const status = el.shadowRoot!.querySelector(".status")!.textContent!;
    expect(status).toContain("manual until");
  });
  it("leaves the status clean without a hold", async () => {
    const { el } = await setup(withRules);
    expect(el.shadowRoot!.querySelector(".status")!.textContent).not.toContain(
      "manual until",
    );
  });
});

describe("Bokmål presentation with English configuration", () => {
  it("uses hass.language before the legacy locale and switches language without changing state IDs", async () => {
    const { el, callService } = await setup();
    el.hass = { ...el.hass, language: "nb-NO", locale: { language: "en" } };
    await el.updateComplete;
    expect(
      el.shadowRoot
        .querySelector('.overlay option[value="none"]')
        .textContent.trim(),
    ).toBe("Av");
    expect(
      el.shadowRoot.querySelector('[aria-label="Innstillinger"]'),
    ).not.toBeNull();
    expect(el.shadowRoot.querySelector(".status").textContent).toContain(
      "låst opp dør",
    );
    expect(
      el.shadowRoot.querySelector('[data-state="awake"]').textContent,
    ).toBe("Awake");
    el.shadowRoot.querySelector('[data-state="awake"]').click();
    await vi.waitFor(() =>
      expect(callService).toHaveBeenCalledWith("house_state", "set", {
        entity_id: "sensor.house_state",
        state: "awake",
        reason: "user",
      }),
    );
    el.hass = { ...el.hass, language: "en", locale: { language: "nb" } };
    await el.updateComplete;
    expect(
      el.shadowRoot.querySelector('[aria-label="Settings"]'),
    ).not.toBeNull();
  });
  it.each(["nb", "NB_no", "no-NO", "nn"])(
    "supports Norwegian aliases from the legacy locale: %s",
    async (language) => {
      const { el } = await setup();
      el.hass = { ...el.hass, locale: { language } };
      await el.updateComplete;
      expect(
        el.shadowRoot.querySelector('[aria-label="Innstillinger"]'),
      ).not.toBeNull();
    },
  );
  it("falls back to English for unsupported languages", async () => {
    const { el } = await setup();
    el.hass = { ...el.hass, language: "de", locale: { language: "nb" } };
    await el.updateComplete;
    expect(
      el.shadowRoot.querySelector('[aria-label="Settings"]'),
    ).not.toBeNull();
  });
  it("localizes the visual editor without rewriting stored YAML", async () => {
    const editor = document.createElement("lovelace-house-state-editor") as any;
    editor.hass = { states: {}, language: "nb", callService: vi.fn() };
    editor.setConfig({
      type: "custom:lovelace-house-state-card",
      entity: "sensor.house_state",
      appearance: "default",
      name: "Our home",
    });
    document.body.append(editor);
    await editor.updateComplete;
    const form = editor.shadowRoot.querySelector("ha-form");
    expect(form.computeLabel({ name: "appearance" })).toBe("Utseende");
    expect(form.computeLabel({ name: "confirm_vacation" })).toBe(
      "Bekreft ferie",
    );
    expect(form.schema[0].selector.select.options[0]).toEqual({
      value: "default",
      label: "Standard",
    });
    const changed = vi.fn();
    editor.addEventListener("config-changed", changed);
    form.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: { appearance: "bubble" } },
      }),
    );
    expect(changed.mock.calls[0][0].detail.config).toMatchObject({
      entity: "sensor.house_state",
      appearance: "bubble",
      name: "Our home",
    });
    editor.hass = { ...editor.hass, language: "en" };
    await editor.updateComplete;
    expect(form.computeLabel({ name: "appearance" })).toBe("Appearance");
  });
});
it("translates unmodified starter labels but preserves custom names and stored names", async () => {
  const starter = [
    {
      id: "home",
      name: "Home",
      parent: null,
      scene: "",
      default_child: "day",
      occupied: true,
    },
    {
      id: "day",
      name: "Day",
      parent: "home",
      scene: "",
      default_child: null,
      occupied: null,
    },
    {
      id: "away",
      name: "Our cabin",
      parent: null,
      scene: "",
      default_child: null,
      occupied: false,
    },
  ];
  const overlays = [
    { id: "christmas", name: "Christmas", scene: "" },
    { id: "party", name: "Friends visiting", scene: "" },
  ];
  const { el, callService } = await setup({
    state: "day",
    active_path: ["home", "day"],
    state_tree: starter,
    overlays,
    config: {
      ...config,
      state_tree: starter,
      overlays,
      initial_state: "home",
      roles: {
        arrival: "home",
        departure: "away",
        vacation: null,
        night: null,
      },
    },
  });
  el.hass = { ...el.hass, language: "nb" };
  await el.updateComplete;
  expect(el.shadowRoot.querySelector('[data-state="home"]').textContent).toBe(
    "Hjemme",
  );
  expect(el.shadowRoot.querySelector('[data-state="day"]').textContent).toBe(
    "Dag",
  );
  expect(el.shadowRoot.querySelector('[data-state="away"]').textContent).toBe(
    "Our cabin",
  );
  expect(
    el.shadowRoot.querySelector('.overlay option[value="christmas"]')
      .textContent,
  ).toBe("Jul");
  expect(
    el.shadowRoot.querySelector('.overlay option[value="party"]').textContent,
  ).toBe("Friends visiting");
  el.shadowRoot.querySelector('[data-state="day"]').click();
  await vi.waitFor(() =>
    expect(callService).toHaveBeenCalledWith("house_state", "set", {
      entity_id: "sensor.house_state",
      state: "day",
      reason: "user",
    }),
  );
  expect(el.hass.states["sensor.house_state"].attributes.state_tree).toEqual(
    starter,
  );
});

describe("everyday controls and central configuration", () => {
  it("links settings to the integration and exposes no structural or automation editor", async () => {
    const { el, callService } = await setup();
    const link = el.shadowRoot.querySelector('a[aria-label="Settings"]');
    expect(link?.getAttribute("href")).toBe(
      "/config/integrations/integration/house_state",
    );
    expect(el.shadowRoot.querySelector("dialog")).toBeNull();
    expect(el.shadowRoot.querySelector('[data-action="save"]')).toBeNull();
    expect(el.shadowRoot.querySelector("ha-entity-picker")).toBeNull();
    el.shadowRoot.querySelector('[data-action="apply"]').click();
    await vi.waitFor(() =>
      expect(callService).toHaveBeenCalledWith("house_state", "apply_scene", {
        entity_id: "sensor.house_state",
        force: true,
      }),
    );
    expect(
      callService.mock.calls.every(
        (call: unknown[]) => call[1] !== "set_config",
      ),
    ).toBe(true);
  });
  it("keeps the settings link usable with no sensor and no previous snapshot", async () => {
    const { el } = await setup();
    const fresh = document.createElement("lovelace-house-state-card");
    fresh.setConfig({
      type: "custom:lovelace-house-state-card",
      entity: "sensor.missing",
    });
    fresh.hass = { ...el.hass, language: "nb", states: {} };
    document.body.append(fresh);
    await fresh.updateComplete;
    expect(
      fresh
        .shadowRoot!.querySelector('a[aria-label="Innstillinger"]')
        ?.getAttribute("href"),
    ).toBe("/config/integrations/integration/house_state");
    expect(fresh.shadowRoot!.textContent).toContain("Fant ikke entiteten");
    expect(fresh.shadowRoot!.querySelector("[data-state]")).toBeNull();
  });
  it("retains disabled controls across reload and adopts the refreshed configuration", async () => {
    const { el, callService } = await setup({ overlay: "cozy" });
    const previous = el.hass.states["sensor.house_state"];
    el.hass = {
      ...el.hass,
      states: {
        "sensor.house_state": {
          ...previous,
          state: "unavailable",
          attributes: {},
        },
      },
    };
    await el.updateComplete;
    expect(el.shadowRoot.querySelectorAll("[data-state]")).toHaveLength(5);
    expect(el.shadowRoot.querySelector(".overlay").value).toBe("cozy");
    for (const control of el.shadowRoot.querySelectorAll("button, select"))
      expect(control.disabled).toBe(true);
    expect(el.shadowRoot.querySelector("a.icon").getAttribute("href")).toBe(
      "/config/integrations/integration/house_state",
    );
    el.shadowRoot.querySelector('[data-action="apply"]').click();
    expect(callService).not.toHaveBeenCalled();
    const revised = tree.map((node) =>
      node.id === "reading" ? { ...node, name: "Books" } : node,
    );
    el.hass = {
      ...el.hass,
      states: {
        "sensor.house_state": {
          ...previous,
          attributes: { ...previous.attributes, state_tree: revised },
        },
      },
    };
    await el.updateComplete;
    expect(
      el.shadowRoot.querySelector('[data-state="reading"]').textContent,
    ).toBe("Books");
    expect(el.shadowRoot.querySelector('[data-action="apply"]').disabled).toBe(
      false,
    );
  });
  it("disables state, overlay and apply actions until the pending request completes", async () => {
    const { el, callService } = await setup();
    let resolve!: () => void;
    callService.mockImplementationOnce(
      () =>
        new Promise<void>((done) => {
          resolve = done;
        }),
    );
    el.hass = { ...el.hass, language: "nb" };
    await el.updateComplete;
    const apply = el.shadowRoot.querySelector('[data-action="apply"]');
    expect(apply.textContent).toContain("Bruk scene nå");
    apply.click();
    await el.updateComplete;
    for (const control of el.shadowRoot.querySelectorAll("button, select"))
      expect(control.disabled).toBe(true);
    expect(el.shadowRoot.querySelector("a.icon")).not.toBeNull();
    resolve();
    await vi.waitFor(() => expect(apply.disabled).toBe(false));
    expect(callService).toHaveBeenCalledTimes(1);
  });
  it("never retains a snapshot from a different configured entity", async () => {
    const { el } = await setup();
    el.setConfig({
      type: "custom:lovelace-house-state-card",
      entity: "sensor.other",
    });
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("[data-state]")).toBeNull();
    expect(el.shadowRoot.textContent).toContain("sensor.other");
  });
});
it("preserves regional clock formatting independently of dictionary fallback", async () => {
  const held = "2026-12-10T23:05:00Z";
  const { el } = await setup({ overlay_hold_until: held });
  el.hass = { ...el.hass, language: "en_GB", locale: { language: "nb" } };
  await el.updateComplete;
  expect(el.shadowRoot.querySelector(".status").textContent).toContain(
    `manual until ${new Date(held).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`,
  );
  el.hass = { ...el.hass, language: "bad_language_tag" };
  await el.updateComplete;
  expect(el.shadowRoot.querySelector(".status").textContent).toContain(
    "manual until",
  );
});
