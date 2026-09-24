import { colorSchemeSchema, colorSchemeText } from "./color-schemes";
import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { CardConfig, HomeAssistant } from "./types";
import { localize } from "./localize";
import { historyModeOptions, historyStrings } from "lovelace-card-history";
const schema = (t: ReturnType<typeof localize>, hass: HomeAssistant) => [
  {
    name: "appearance",
    selector: {
      select: {
        options: [
          { value: "default", label: t.defaultAppearance },
          { value: "bubble", label: "Bubble" },
        ],
      },
    },
  },
  colorSchemeSchema(hass),
  {
    name: "entity",
    required: true,
    selector: { entity: { integration: "house_state", domain: "sensor" } },
  },
  { name: "name", selector: { text: {} } },
  { name: "show_overlay", selector: { boolean: {} } },
  { name: "confirm_vacation", selector: { boolean: {} } },
  { name: "show_settings", selector: { boolean: {} } },
  { name: "weather", selector: { entity: { domain: "weather" } } },
  { name: "show_forecast", selector: { boolean: {} } },
  {
    name: "sensors",
    selector: { entity: { domain: "sensor", multiple: true } },
  },
  {
    name: "history",
    selector: {
      select: { options: historyModeOptions(hass), mode: "dropdown" },
    },
  },
];
@customElement("lovelace-house-state-editor")
export class Editor extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private config!: CardConfig;
  setConfig(c: CardConfig) {
    this.config = {
      appearance: "default",
      color_scheme: "home-assistant",
      show_overlay: true,
      confirm_vacation: true,
      show_settings: false,
      show_forecast: false,
      history: "card",
      ...c,
    };
  }
  private changed(e: CustomEvent) {
    e.stopPropagation();
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: { ...this.config, ...e.detail.value } },
        bubbles: true,
        composed: true,
      }),
    );
  }
  render() {
    if (!this.hass || !this.config) return html``;
    return html`<ha-form
      .hass=${this.hass}
      .data=${this.config}
      .schema=${schema(localize(this.hass), this.hass)}
      .computeLabel=${(x: { name: string }) => ({ color_scheme: colorSchemeText(this.hass).label, appearance: localize(this.hass).appearance, entity: localize(this.hass).entityLabel, name: localize(this.hass).name, show_overlay: localize(this.hass).showOverlay, confirm_vacation: localize(this.hass).confirmVacation, show_settings: localize(this.hass).showSettings, weather: localize(this.hass).weatherLabel, show_forecast: localize(this.hass).showForecast, sensors: localize(this.hass).sensorsLabel, history: historyStrings(this.hass).mode })[x.name] || x.name}
      @value-changed=${this.changed}
    ></ha-form>`;
  }
  static styles = css`
    ha-form {
      display: block;
      padding: 8px 0;
    }
  `;
}
