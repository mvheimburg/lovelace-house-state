import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styles } from "./styles";
import { formattingLocale, localize, displayName } from "./localize";
import type {
  CardConfig,
  HassEntity,
  HomeAssistant,
  Overlay,
  Roles,
  RuntimeConfig,
  StateNode,
} from "./types";
import "./lovelace-house-state-editor";

@customElement("lovelace-house-state-card")
export class HouseStateCard extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private config!: CardConfig;
  @state() private busy = false;
  private lastValid?: HassEntity;
  static styles = styles;

  setConfig(config: CardConfig) {
    if (!config.entity) throw new Error(this.t.entityRequired);
    if (this.config?.entity !== config.entity) this.lastValid = undefined;
    this.config = {
      appearance: "default",
      show_overlay: true,
      confirm_vacation: true,
      ...config,
    };
    this.setAttribute("data-appearance", this.config.appearance!);
  }
  getCardSize() {
    return 4;
  }
  protected updated() {
    const select =
      this.renderRoot.querySelector<HTMLSelectElement>("select.overlay");
    const entity = this.lastValid;
    // overlay_choice is what is selected on the axis; overlay is what is in force.
    if (select && entity && !this.busy)
      select.value =
        entity.attributes.overlay_choice ?? entity.attributes.overlay ?? "none";
  }
  static getConfigElement() {
    return document.createElement("lovelace-house-state-editor");
  }
  static getStubConfig(hass?: HomeAssistant) {
    const entity = Object.values(hass?.states || {}).find(
      (x) => x.entity_id.startsWith("sensor.") && "active_path" in x.attributes,
    );
    return {
      type: "custom:lovelace-house-state-card",
      entity: entity?.entity_id || "sensor.house_state",
    };
  }
  private get t() {
    return localize(this.hass);
  }
  private stateName(node?: { id: string; name: string }) {
    return node ? displayName(this.hass, node, "starterStates") : undefined;
  }
  private overlayName(overlay: Overlay) {
    return displayName(this.hass, overlay, "starterOverlays");
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
    if (this.busy) return false;
    this.busy = true;
    try {
      await this.hass.callService("house_state", service, {
        entity_id: this.config.entity,
        ...data,
      });
      return true;
    } catch (error: any) {
      this.toast(`${this.t.errorPrefix}: ${error?.message || error}`);
      return false;
    } finally {
      this.busy = false;
    }
  }
  private descendants(id: string, nodes: StateNode[]) {
    const found = new Set([id]);
    let changed = true;
    while (changed) {
      changed = false;
      for (const n of nodes)
        if (n.parent && found.has(n.parent) && !found.has(n.id)) {
          found.add(n.id);
          changed = true;
        }
    }
    return found;
  }
  private selectState(id: string, nodes: StateNode[], roles: Roles) {
    const vacation = roles.vacation;
    let effective = id;
    const seen = new Set<string>();
    while (!seen.has(effective)) {
      seen.add(effective);
      const next = nodes.find((n) => n.id === effective)?.default_child;
      if (!next) break;
      effective = next;
    }
    if (
      this.config.confirm_vacation &&
      vacation &&
      this.descendants(vacation, nodes).has(effective) &&
      !window.confirm(this.t.vacationConfirm)
    )
      return;
    void this.call("set", { state: id, reason: "user" });
  }
  private held(value: unknown) {
    if (!value) return "";
    const at = new Date(String(value));
    if (Number.isNaN(at.getTime())) return "";
    const clock = at.toLocaleTimeString(formattingLocale(this.hass), {
      hour: "2-digit",
      minute: "2-digit",
    });
    return ` · ${this.t.heldUntil} ${clock}`;
  }
  private duration(s: unknown) {
    const m = Math.floor((Date.now() - new Date(String(s)).getTime()) / 60000);
    if (!Number.isFinite(m) || m < 0) return "";
    return m >= 1440
      ? `${Math.floor(m / 1440)}${this.t.durationDay} ${Math.floor((m % 1440) / 60)}${this.t.durationHour}`
      : m >= 60
        ? `${Math.floor(m / 60)}${this.t.durationHour} ${m % 60}${this.t.durationMinute}`
        : `${m}${this.t.durationMinute}`;
  }
  private branches(parent: string | null, nodes: StateNode[]) {
    return nodes.filter((n) => n.parent === parent);
  }
  private settingsLink() {
    return html`<a
      class="icon"
      href="/config/integrations/integration/house_state"
      aria-label=${this.t.settings}
      title=${this.t.settings}
    >
      <ha-icon icon="mdi:cog-outline"></ha-icon>
    </a>`;
  }

  render() {
    const liveEntity = this.hass?.states?.[this.config?.entity];
    const liveNodes =
      liveEntity?.attributes?.state_tree ||
      liveEntity?.attributes?.config?.state_tree;
    const available = Boolean(
      liveEntity &&
      liveEntity.state !== "unavailable" &&
      liveEntity.state !== "unknown" &&
      Array.isArray(liveNodes) &&
      liveNodes.length,
    );
    if (available) this.lastValid = liveEntity;
    const entity = available ? liveEntity : this.lastValid;
    if (!entity)
      return html`<ha-card
        ><div class="header">
          <div class="title">${this.config?.name || this.t.title}</div>
          ${this.settingsLink()}
        </div>
        <div class="error">
          ${this.t.missing}: ${this.config?.entity || ""}
        </div></ha-card
      >`;
    const a = entity.attributes;
    const cfg: RuntimeConfig = a.config || {
      state_tree: a.state_tree,
      overlays: a.overlays,
      roles: {},
      initial_state: a.state,
    };
    const nodes: StateNode[] = a.state_tree || cfg.state_tree || [];
    if (!nodes.length)
      return html`<ha-card
        ><div class="header">
          <div class="title">${this.config?.name || this.t.title}</div>
          ${this.settingsLink()}
        </div>
        <div class="error">
          ${this.t.missing}: ${this.config.entity} (${entity.state})
        </div></ha-card
      >`;
    const path: string[] = a.active_path || [];
    const overlays: Overlay[] = a.overlays || cfg.overlays || [];
    const choice = a.overlay_choice ?? a.overlay ?? "none";
    const ruleOverlay = overlays.find((o) => o.id === a.overlay_rule);
    const ruleName = ruleOverlay ? this.overlayName(ruleOverlay) : undefined;
    const levels = [
      this.branches(null, nodes),
      ...path.map((id) => this.branches(id, nodes)),
    ].filter((x) => x.length);
    const byId = new Map(nodes.map((n) => [n.id, n]));
    return html` <ha-card
      ><div class="header">
        <div class="title">
          ${this.config.name || a.friendly_name || this.t.title}
        </div>
        ${this.settingsLink()}
      </div>
      ${levels.map((group) => html`<div class="segment">${group.map((n) => html`<button data-state=${n.id} class=${path.includes(n.id) ? "active" : ""} ?disabled=${this.busy || !available} @click=${() => this.selectState(n.id, nodes, cfg.roles)}>${this.stateName(n)}</button>`)}</div>`)}
      ${
        this.config.show_overlay
          ? html`<select
              class="overlay"
              aria-label=${this.t.overlays}
              ?disabled=${this.busy || !available}
              @change=${(e: Event) => this.call("set", { overlay: (e.target as HTMLSelectElement).value, reason: "user" })}
            >
              ${
                overlays.some((o) => o.calendar || o.dates)
                  ? html`<option value="auto" ?selected=${choice === "auto"}>
                      ${this.t.automatic}${ruleName ? ` · ${ruleName}` : ""}
                    </option>`
                  : nothing
              }
              <option value="none" ?selected=${choice === "none"}>
                ${this.t.off}
              </option>
              ${overlays.map((o: Overlay) => html`<option value=${o.id} ?selected=${choice === o.id}>${this.overlayName(o)}</option>`)}
            </select>`
          : nothing
      }
      <button
        class="apply"
        data-action="apply"
        type="button"
        ?disabled=${this.busy || !available}
        @click=${() => this.call("apply_scene", { force: true })}
      >
        ${this.t.apply}
      </button>
      <div
        class="status"
        title=${path.map((id) => this.stateName(byId.get(id)) || id).join(" › ")}
      >
        ${this.stateName(byId.get(path[path.length - 1] || "")) || entity.state}
        · ${this.duration(a.since)} ·
        ${(this.t.reason as Record<string, string>)[a.last_changed_by] || a.last_changed_by || ""}${this.held(a.overlay_hold_until)}
      </div></ha-card
    >`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "lovelace-house-state-card": HouseStateCard;
  }
}
const registry = window as any;
registry.customCards = registry.customCards || [];
registry.customCards.push({
  type: "lovelace-house-state-card",
  name: "House State Card",
});
