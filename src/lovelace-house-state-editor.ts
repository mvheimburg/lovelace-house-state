import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { CardConfig, HomeAssistant } from "./types";
const schema = [
  {
    name: "appearance",
    selector: {
      select: {
        options: [
          { value: "default", label: "Default" },
          { value: "bubble", label: "Bubble" },
        ],
      },
    },
  },
  {
    name: "entity",
    required: true,
    selector: { entity: { integration: "house_state", domain: "sensor" } },
  },
  { name: "name", selector: { text: {} } },
  { name: "show_activity", selector: { boolean: {} } },
  { name: "show_overlay", selector: { boolean: {} } },
  { name: "confirm_vacation", selector: { boolean: {} } },
];
@customElement("lovelace-house-state-editor")
export class Editor extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private config!: CardConfig;
  setConfig(c: CardConfig) {
    this.config = {
      appearance: "default",
      show_activity: true,
      show_overlay: true,
      confirm_vacation: true,
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
      .schema=${schema}
      .computeLabel=${(x: { name: string }) => ({ appearance: "Appearance", entity: "House State entity", name: "Name", show_activity: "Show activity", show_overlay: "Show overlay", confirm_vacation: "Confirm vacation" })[x.name] || x.name}
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
