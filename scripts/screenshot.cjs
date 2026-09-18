const { chromium } = require("playwright");
const { readFileSync, mkdirSync } = require("node:fs");
const { resolve } = require("node:path");

const root = resolve(__dirname, "..");

const light = `--primary-text-color: #1b1b1a; --secondary-text-color: #5b5a55; --card-background-color: #fff; --secondary-background-color: #f3f2ee; --primary-color: #1d4ed8; background: #eeede9;`;
const dark = `--primary-text-color: #eceef1; --secondary-text-color: #9aa0aa; --card-background-color: #1a1c20; --secondary-background-color: #22252a; --primary-color: #8ab4f8; --success-color: #6fd39a; --warning-color: #f5c451; --orange-color: #ff9a6b; --bubble-main-background-color: #1a1c20; --bubble-secondary-background-color: #22252a; --bubble-border-radius: 32px; background: #121316;`;

/** Simulated hub states from the integration's starter tree; no live Home Assistant. */
function hub(variant) {
  const node = (id, name, parent, default_child = null, occupied = null) => ({
    id, name, parent, scene: `scene.${id}`, default_child, occupied,
  });
  const tree = [
    node("home", "Home", null, "day", true),
    node("day", "Day", "home", "idle"),
    node("idle", "None", "day"),
    node("tv", "TV", "day"),
    node("eating", "Eating", "day"),
    node("night", "Night", "home"),
    node("away", "Away", null, null, false),
    node("vacation", "Vacation", null, null, false),
  ];
  const overlays = [
    { id: "christmas", name: "Christmas", scene: "scene.christmas", dates: { type: "fixed", from: "12-01", to: "12-26" } },
    { id: "halloween", name: "Halloween", scene: "scene.halloween" },
    { id: "party", name: "Party", scene: "scene.party" },
  ];
  const config = {
    state_tree: tree,
    overlays,
    initial_state: "home",
    roles: { arrival: "home", departure: "away", vacation: "vacation", night: "night" },
    water_valves: ["valve.main_water"],
  };
  const ago = (minutes) => new Date(Date.now() - minutes * 60000).toISOString();
  const attributes =
    variant === "away"
      ? { state: "away", active_path: ["away"], occupied: false, overlay: "none", overlay_choice: "auto", last_changed_by: "presence", since: ago(180) }
      : { state: "tv", active_path: ["home", "day", "tv"], occupied: true, overlay: "christmas", overlay_choice: "auto", overlay_rule: "christmas", scene_stale: true, last_changed_by: "user", since: ago(72) };
  return {
    "sensor.house_state": {
      entity_id: "sensor.house_state",
      state: attributes.state,
      attributes: { friendly_name: "House", state_tree: tree, overlays, config, ...attributes },
    },
    "valve.main_water": { entity_id: "valve.main_water", state: "open", attributes: { friendly_name: "Main tap" } },
  };
}

async function shot(browser, errors, { file, theme, cards }) {
  const page = await browser.newPage({ viewport: { width: 1040, height: 900 }, deviceScaleFactor: 1 });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setContent(`<style>
    body { margin: 0; padding: 28px; font: 15px system-ui, sans-serif; ${theme} }
    main { display: flex; gap: 28px; align-items: flex-start; }
    main > * { flex: 0 0 440px; }
  </style><main></main>`);
  await page.addScriptTag({ type: "module", content: readFileSync(resolve(root, "dist/lovelace-house-state-card.js"), "utf8") });
  await page.evaluate(async (cards) => {
    await customElements.whenDefined("lovelace-house-state-card");
    for (const { states, appearance, click } of cards) {
      const card = document.createElement("lovelace-house-state-card");
      card.setConfig({ type: "custom:lovelace-house-state-card", entity: "sensor.house_state", appearance, name: "Huset" });
      card.hass = { states, language: "nb", locale: { language: "nb" }, callService: () => new Promise(() => {}) };
      document.querySelector("main").append(card);
      await card.updateComplete;
      if (click) {
        card.shadowRoot.querySelector(click).click();
        await card.updateComplete;
      }
    }
  }, cards);
  await page.screenshot({ path: resolve(root, "images", file), fullPage: true });
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const errors = [];
    mkdirSync(resolve(root, "images"), { recursive: true });
    await shot(browser, errors, {
      file: "bubble-night.png",
      theme: dark,
      cards: [
        { states: hub("evening"), appearance: "bubble" },
        { states: hub("away"), appearance: "bubble", click: '[data-state="vacation"]' },
      ],
    });
    await shot(browser, errors, {
      file: "light.png",
      theme: light,
      cards: [
        { states: hub("evening"), appearance: "default" },
        { states: hub("evening"), appearance: "default", click: '[data-state="eating"]' },
      ],
    });
    if (errors.length) throw new Error(`Browser errors: ${errors.join("; ")}`);
    console.log("Wrote images/bubble-night.png and images/light.png with simulated Home Assistant data.");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
