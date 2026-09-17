import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styles } from "./styles";
import type {
  CardConfig,
  HomeAssistant,
  RuntimeConfig,
  Schedule,
} from "./types";
import "./lovelace-house-state-editor";
const SCENES = [
  "home",
  "away",
  "vacation",
  "day",
  "night",
  "tv",
  "eating",
  "christmas",
  "halloween",
  "party",
];
const en = {
  home: "Home",
  away: "Away",
  vacation: "Vacation",
  day: "Day",
  night: "Night",
  none: "Off",
  tv: "TV",
  eating: "Eating",
  christmas: "Christmas",
  halloween: "Halloween",
  party: "Party",
  overlay: "Overlay",
  settings: "Settings",
  apply: "Apply scene now",
  close: "Close",
  scenes: "Scenes",
  entities: "Entities",
  automation: "Automation",
  door: "Door entities",
  gate: "Gate entities",
  person: "Person entities",
  autoReturn: "Return automatically",
  autoAway: "Leave automatically",
  grace: "Away grace (seconds)",
  schedule: "Night schedule",
  fixed: "Fixed",
  sun: "Sun",
  event: "Event",
  offset: "Offset (seconds)",
  sunset: "Sunset",
  sunrise: "Sunrise",
  legacy: "Legacy mirror",
  reason: {
    user: "changed manually",
    door: "door unlocked",
    gate: "gate opened",
    presence: "presence",
    schedule: "schedule",
    service: "service",
  },
} as any;
const nb = {
  home: "Hjemme",
  away: "Borte",
  vacation: "Ferie",
  day: "Dag",
  night: "Natt",
  none: "Av",
  tv: "TV",
  eating: "Spise",
  christmas: "Jul",
  halloween: "Halloween",
  party: "Fest",
  overlay: "Overlegg",
  settings: "Innstillinger",
  apply: "Bruk scene nå",
  close: "Lukk",
  scenes: "Scener",
  entities: "Entiteter",
  automation: "Automatikk",
  door: "Dørlåser",
  gate: "Garasjeporter",
  person: "Personer",
  autoReturn: "Automatisk hjemkomst",
  autoAway: "Automatisk borte",
  grace: "Ventetid borte (sekunder)",
  schedule: "Nattplan",
  fixed: "Fast tid",
  sun: "Sol",
  event: "Hendelse",
  offset: "Forskyvning (sekunder)",
  sunset: "Solnedgang",
  sunrise: "Soloppgang",
  legacy: "Eldre speiling",
  reason: {
    user: "endret manuelt",
    door: "låst opp dør",
    gate: "åpnet port",
    presence: "tilstedeværelse",
    schedule: "tidsplan",
    service: "tjeneste",
  },
} as any;
@customElement("lovelace-house-state-card")
export class Card extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private config!: CardConfig;
  @state() private busy = false;
  static styles = styles;
  setConfig(c: CardConfig) {
    if (!c.entity) throw Error("You must define an entity");
    this.config = {
      show_activity: true,
      show_overlay: true,
      confirm_vacation: true,
      appearance: "default",
      ...c,
    };
    this.setAttribute("data-appearance", this.config.appearance!);
  }
  getCardSize() {
    return 4;
  }
  static getConfigElement() {
    return document.createElement("lovelace-house-state-editor");
  }
  static getStubConfig(h?: HomeAssistant) {
    return {
      type: "custom:lovelace-house-state-card",
      entity:
        Object.values(h?.states || {}).find(
          (x) =>
            x.entity_id.startsWith("sensor.") && "presence" in x.attributes,
        )?.entity_id || "sensor.house_state",
    };
  }
  private get t() {
    return this.hass?.locale?.language?.toLowerCase().startsWith("nb") ||
      this.hass?.locale?.language?.toLowerCase().startsWith("no")
      ? nb
      : en;
  }
  private toast(message: string) {
    this.dispatchEvent(
      new CustomEvent("hass-notification", {
        detail: { message },
        bubbles: true,
        composed: true,
      }),
    );
  }
  private async call(service: string, data: Record<string, unknown> = {}) {
    this.busy = true;
    try {
      await this.hass.callService("house_state", service, {
        entity_id: this.config.entity,
        ...data,
      });
    } catch (e: any) {
      this.toast(`House State: ${e?.message || e}`);
    } finally {
      this.busy = false;
    }
  }
  private setAxis(key: string, value: string) {
    if (
      key === "presence" &&
      value === "vacation" &&
      this.config.confirm_vacation &&
      !window.confirm(this.t.vacation + "?")
    )
      return;
    void this.call("set", { [key]: value, reason: "user" });
  }
  private duration(s: any) {
    const ms = Date.now() - new Date(s).getTime();
    if (!Number.isFinite(ms) || ms < 0) return "";
    const m = Math.floor(ms / 60000),
      h = Math.floor(m / 60),
      d = Math.floor(h / 24);
    return d ? `${d}d ${h % 24}h` : h ? `${h}h ${m % 60}m` : `${m}m`;
  }
  private save(key: string, value: unknown) {
    void this.call("set_config", { [key]: value });
  }
  private open() {
    this.renderRoot.querySelector<HTMLDialogElement>("dialog")?.showModal();
  }
  private close() {
    this.renderRoot.querySelector<HTMLDialogElement>("dialog")?.close();
  }
  render() {
    const s = this.hass?.states?.[this.config?.entity];
    if (!s)
      return html`<ha-card
        ><div class="error">
          <ha-icon icon="mdi:alert-circle"></ha-icon>Entity
          ${this.config?.entity || ""} not found
        </div></ha-card
      >`;
    const a = s.attributes,
      t = this.t,
      p = a.presence || s.state,
      m = a.mode || "day",
      act = a.activity || "none",
      ov = a.overlay || "none",
      cfg: RuntimeConfig = a.config || {};
    return html`<ha-card
        ><div class="header">
          <div>
            <div class="title">
              ${this.config.name || a.friendly_name || "House State"}
            </div>
          </div>
          <button class="icon" aria-label="Settings" @click=${this.open}>
            <ha-icon icon="mdi:cog-outline"></ha-icon>
          </button>
        </div>
        <div class="segment presence">
          ${["home", "away", "vacation"].map((x) => html`<button data-value=${x} class=${p === x ? "active" : ""} ?disabled=${this.busy} @click=${() => this.setAxis("presence", x)}>${t[x]}</button>`)}
        </div>
        <div class="segment mode">
          ${["day", "night"].map((x) => html`<button data-value=${x} class=${m === x ? "active" : ""} ?disabled=${this.busy || !a.mode_is_available} @click=${() => this.setAxis("mode", x)}>${t[x]}</button>`)}
        </div>
        ${this.config.show_activity && a.activity_is_available ? html`<div class="chips activities">${["none", "tv", "eating"].map((x) => html`<button data-value=${x} class=${act === x ? "active" : ""} ?disabled=${this.busy} @click=${() => this.setAxis("activity", x)}>${t[x]}</button>`)}</div>` : nothing}
        ${
          this.config.show_overlay
            ? html`<select
                class="overlay"
                aria-label=${t.overlay}
                .value=${ov}
                @change=${(e: Event) => this.setAxis("overlay", (e.target as HTMLSelectElement).value)}
              >
                ${(a.available_overlays || ["none", "christmas", "halloween", "party"]).map((x: string) => html`<option value=${x}>${t[x] || x}</option>`)}
              </select>`
            : nothing
        }
        <div class="status">
          ${t[p] || p}${p === "home" ? ` · ${t[m] || m}` : ""} ·
          ${this.duration(a.since)} ·
          ${t.reason[a.last_changed_by] || a.last_changed_by || ""}
        </div></ha-card
      >${this.settings(cfg)}`;
  }
  private settings(c: RuntimeConfig) {
    const t = this.t,
      sch: Schedule = c.night_schedule || { type: "off" };
    return html`<dialog @cancel=${() => this.close()}>
      <div class="dialog-head">
        <h2>${t.settings}</h2>
        <button class="icon" aria-label=${t.close} @click=${this.close}>
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </div>
      <div class="settings">
        <div class="section">
          <h3>${t.scenes}</h3>
          <div class="grid">
            ${SCENES.map((k) => html`<label class="field">${t[k] || k}<ha-entity-picker .hass=${this.hass} .value=${c.scene_map?.[k] || ""} .includeDomains=${["scene"]} allow-custom-entity @value-changed=${(e: CustomEvent) => this.save("scene_map", { ...c.scene_map, [k]: e.detail.value || "" })}></ha-entity-picker></label>`)}
          </div>
        </div>
        <div class="section">
          <h3>${t.entities}</h3>
          ${[
            ["door_entities", t.door, c.door_entities, ["lock"]],
            ["gate_entities", t.gate, c.gate_entities, ["cover"]],
            ["person_entities", t.person, c.person_entities, ["person"]],
          ].map(
            ([k, l, v, d]) =>
              html`<label class="field"
                >${l}<ha-selector
                  name=${k as string}
                  .hass=${this.hass}
                  .selector=${{ entity: { multiple: true, domain: d } }}
                  .value=${v || []}
                  @value-changed=${(e: CustomEvent) => this.save(k as string, e.detail.value || [])}
                ></ha-selector
              ></label>`,
          )}
        </div>
        <div class="section">
          <h3>${t.automation}</h3>
          <label class="toggle"
            >${t.autoReturn}<ha-switch
              .checked=${!!c.auto_return}
              @change=${(e: Event) => this.save("auto_return", (e.target as HTMLInputElement).checked)}
            ></ha-switch></label
          ><label class="toggle"
            >${t.autoAway}<ha-switch
              .checked=${!!c.auto_away}
              @change=${(e: Event) => this.save("auto_away", (e.target as HTMLInputElement).checked)}
            ></ha-switch></label
          ><label class="field"
            >${t.grace}<input
              name="auto_away_grace"
              type="number"
              min="0"
              .value=${String(c.auto_away_grace ?? 300)}
              @change=${(e: Event) => this.save("auto_away_grace", Number((e.target as HTMLInputElement).value))} /></label
          ><label class="field"
            >${t.schedule}<select
              .value=${sch.type}
              @change=${(e: Event) => this.save("night_schedule", { type: (e.target as HTMLSelectElement).value })}
            >
              <option value="off">${t.none}</option>
              <option value="fixed">${t.fixed}</option>
              <option value="sun">${t.sun}</option>
            </select></label
          >${sch.type === "fixed" ? html`<label class="field">${t.fixed}<input type="time" step="1" .value=${sch.time || "22:00:00"} @change=${(e: Event) => this.save("night_schedule", { ...sch, time: (e.target as HTMLInputElement).value.length === 5 ? (e.target as HTMLInputElement).value + ":00" : (e.target as HTMLInputElement).value })} /></label>` : nothing}${
            sch.type === "sun"
              ? html`<div class="grid">
                  <label class="field"
                    >${t.event}<select
                      .value=${sch.event || "sunset"}
                      @change=${(e: Event) => this.save("night_schedule", { ...sch, event: (e.target as HTMLSelectElement).value })}
                    >
                      <option value="sunset">${t.sunset}</option>
                      <option value="sunrise">${t.sunrise}</option>
                    </select></label
                  ><label class="field"
                    >${t.offset}<input
                      type="number"
                      .value=${String(sch.offset || 0)}
                      @change=${(e: Event) => this.save("night_schedule", { ...sch, offset: Number((e.target as HTMLInputElement).value) })}
                  /></label>
                </div>`
              : nothing
          }
        </div>
        <div class="section">
          <h3>${t.legacy}</h3>
          <div class="grid">
            ${["presence", "mode", "overlay"].map((k) => html`<label class="field">${t[k] || k}<ha-entity-picker .hass=${this.hass} .value=${c.legacy_mirror?.[k] || ""} .includeDomains=${["input_select"]} allow-custom-entity @value-changed=${(e: CustomEvent) => this.save("legacy_mirror", { ...c.legacy_mirror, [k]: e.detail.value || "" })}></ha-entity-picker></label>`)}
          </div>
        </div>
      </div>
      <div class="dialog-actions">
        <button
          data-action="apply-scene"
          class="primary"
          @click=${() => this.call("apply_scene", { force: true })}
        >
          ${t.apply}</button
        ><button @click=${this.close}>${t.close}</button>
      </div>
    </dialog>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "lovelace-house-state-card": Card;
  }
}
const w = window as any;
w.customCards = w.customCards || [];
w.customCards.push({
  type: "lovelace-house-state-card",
  name: "House State Card",
  description: "Control House State",
});
