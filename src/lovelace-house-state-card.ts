import { applyColorScheme } from "./color-schemes";
import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styles } from "./styles";
import { formattingLocale, localize, displayName, fill } from "./localize";
import { icon, hasIcon } from "./icons";
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

/** A request in flight: what the card says while the house answers. */
type Pending = { kind: "state"; name: string } | { kind: "apply" | "overlay" };
/** Hub colour families; a state's tone follows occupancy and the vacation role. */
type Tone = "home" | "away" | "vacation" | "neutral";

@customElement("lovelace-house-state-card")
export class HouseStateCard extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private config!: CardConfig;
  @state() private busy = false;
  @state() private pending?: Pending;
  @state() private failure?: string;
  /** A vacation-role state waiting for the user's confirmation in the card. */
  @state() private confirming?: string;
  private lastValid?: HassEntity;
  static styles = styles;

  setConfig(config: CardConfig) {
    if (!config.entity) throw new Error(this.t.entityRequired);
    applyColorScheme(this, config.color_scheme, this.hass);
    if (this.config?.entity !== config.entity) {
      this.lastValid = undefined;
      this.failure = undefined;
      this.confirming = undefined;
    }
    this.config = {
      appearance: "default",
      show_overlay: true,
      confirm_vacation: true,
      ...config,
    };
    this.setAttribute("data-appearance", this.config.appearance!);
  }
  getCardSize() {
    return 6;
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
  private friendly(entityId: string) {
    const name = this.hass?.states?.[entityId]?.attributes?.friendly_name;
    return typeof name === "string" && name ? name : entityId;
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
  private async call(
    service: string,
    data: Record<string, unknown>,
    pending: Pending,
  ) {
    if (this.busy) return false;
    this.busy = true;
    this.pending = pending;
    this.failure = undefined;
    try {
      await this.hass.callService("house_state", service, {
        entity_id: this.config.entity,
        ...data,
      });
      return true;
    } catch (error: any) {
      const message = `${this.t.errorPrefix}: ${error?.message || error}`;
      this.failure = message;
      this.toast(message);
      return false;
    } finally {
      this.busy = false;
      this.pending = undefined;
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
  /** Where selecting `id` lands after following default children. */
  private effective(id: string, nodes: StateNode[]) {
    let effective = id;
    const seen = new Set<string>();
    while (!seen.has(effective)) {
      seen.add(effective);
      const next = nodes.find((n) => n.id === effective)?.default_child;
      if (!next) break;
      effective = next;
    }
    return effective;
  }
  private inVacation(id: string, nodes: StateNode[], roles?: Roles) {
    return Boolean(
      roles?.vacation && this.descendants(roles.vacation, nodes).has(id),
    );
  }
  private selectState(id: string, nodes: StateNode[], roles: Roles) {
    if (this.busy) return;
    if (
      this.config.confirm_vacation &&
      this.inVacation(this.effective(id, nodes), nodes, roles)
    ) {
      this.confirming = id;
      return;
    }
    this.setState(id, nodes);
  }
  private setState(id: string, nodes: StateNode[]) {
    this.confirming = undefined;
    const name = this.stateName(nodes.find((n) => n.id === id)) || id;
    void this.call(
      "set",
      { state: id, reason: "user" },
      { kind: "state", name },
    );
  }
  private clock(value: unknown) {
    if (!value) return "";
    const at = new Date(String(value));
    if (Number.isNaN(at.getTime())) return "";
    return at.toLocaleTimeString(formattingLocale(this.hass), {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  private duration(s: unknown) {
    const m = Math.floor((Date.now() - new Date(String(s)).getTime()) / 60000);
    if (!Number.isFinite(m) || m < 0) return "";
    return m >= 1440
      ? `${Math.floor(m / 1440)} ${this.t.durationDay} ${Math.floor((m % 1440) / 60)} ${this.t.durationHour}`
      : m >= 60
        ? `${Math.floor(m / 60)} ${this.t.durationHour} ${m % 60} ${this.t.durationMinute}`
        : `${m} ${this.t.durationMinute}`;
  }
  private branches(parent: string | null, nodes: StateNode[]) {
    return nodes.filter((n) => n.parent === parent);
  }
  private tone(
    leaf: string,
    occupied: unknown,
    nodes: StateNode[],
    roles?: Roles,
  ): Tone {
    if (this.inVacation(leaf, nodes, roles)) return "vacation";
    if (occupied === true) return "home";
    if (occupied === false) return "away";
    return "neutral";
  }
  /** The deepest state on the path that has a starter icon, else by occupancy. */
  private heroIcon(path: string[], tone: Tone) {
    const known = [...path].reverse().find(hasIcon);
    return (
      known ?? (tone === "home" ? "home" : tone === "neutral" ? "home" : tone)
    );
  }
  private settingsLink() {
    return html`<a
      class="icon settings"
      href="/config/integrations/integration/house_state"
      aria-label=${this.t.settings}
      title=${this.t.settings}
      >${icon("cog")}</a
    >`;
  }
  private header(title: string) {
    return html`<div class="header">
      <div class="title">${title}</div>
      ${this.settingsLink()}
    </div>`;
  }

  private renderLevels(
    levels: StateNode[][],
    path: string[],
    nodes: StateNode[],
    roles: Roles,
    disabled: boolean,
  ) {
    const leaf = path[path.length - 1];
    // Compact on purpose: whitespace inside a button would become part of its
    // name, and the state names are compared exactly.
    // prettier-ignore
    const level = (group: StateNode[], depth: number) =>
      html`<div class="segment ${depth ? "sub" : "top"}">${group.map((n) => html`<button data-state=${n.id} class="pill ${path.includes(n.id) ? "active" : ""} ${n.id === leaf ? "leaf" : ""} ${this.confirming === n.id ? "confirming" : ""}" aria-pressed=${path.includes(n.id) ? "true" : "false"} ?disabled=${disabled} @click=${() => this.selectState(n.id, nodes, roles)}>${depth < 2 && hasIcon(n.id) ? icon(n.id, "s") : nothing}${this.stateName(n)}</button>`)}</div>`;
    const [top, ...rest] = levels;
    return html`${top ? level(top, 0) : nothing}
    ${
      rest.length
        ? html`<div class="sublevels">
            ${rest.map((group, i) => level(group, i + 1))}
          </div>`
        : nothing
    }`;
  }
  private renderConfirmation(nodes: StateNode[], cfg: RuntimeConfig) {
    const id = this.confirming;
    if (!id) return nothing;
    const name = this.stateName(nodes.find((n) => n.id === id)) || id;
    const valves: string[] = Array.isArray((cfg as any).water_valves)
      ? (cfg as any).water_valves
      : [];
    return html`<div
      class="confirm"
      role="alertdialog"
      aria-labelledby="vacation-title"
      data-confirm-vacation
    >
      <div class="confirm-head">
        <span class="circ">${icon("vacation")}</span>
        <div id="vacation-title" class="confirm-title">
          ${fill(this.t.vacationTitle, { name })}
        </div>
      </div>
      ${
        valves.length
          ? html`<ul class="effects">
              <li>
                ${icon("water", "s")}${fill(this.t.vacationWater, {
                  valves: valves.map((v) => this.friendly(v)).join(", "),
                })}
              </li>
              <li>${icon("key", "s")}${this.t.vacationGuest}</li>
            </ul>`
          : nothing
      }
      <div class="confirm-actions">
        <button
          class="pill"
          data-cancel
          @click=${() => (this.confirming = undefined)}
        >
          ${this.t.cancel}
        </button>
        <button
          class="pill strong"
          data-confirm
          ?disabled=${this.busy}
          @click=${() => this.setState(id, nodes)}
        >
          ${fill(this.t.vacationButton, { name })}
        </button>
      </div>
    </div>`;
  }
  private renderOverlay(
    a: Record<string, any>,
    overlays: Overlay[],
    disabled: boolean,
  ) {
    const choice = a.overlay_choice ?? a.overlay ?? "none";
    const inForce = overlays.find((o) => o.id === a.overlay);
    const rule = overlays.find((o) => o.id === a.overlay_rule);
    const automatic = overlays.some((o) => o.calendar || o.dates);
    const held = this.clock(a.overlay_hold_until);
    const caption =
      choice === "auto"
        ? `${this.t.automatic} · ${rule ? this.overlayName(rule) : this.t.noRule}`
        : held
          ? `${this.t.manualChoice} · ${this.t.heldUntil} ${held}`
          : this.t.manualChoice;
    const chip = (value: string, label: string) =>
      html`<button
        class="chip ${choice === value ? "active" : ""}"
        data-overlay=${value}
        aria-pressed=${choice === value ? "true" : "false"}
        ?disabled=${disabled}
        @click=${() =>
          choice === value
            ? undefined
            : this.call(
                "set",
                { overlay: value, reason: "user" },
                { kind: "overlay" },
              )}
      >
        ${label}
      </button>`;
    // Closed by default: overlays are occasional, the row still says which
    // one is in force and why. Lit leaves the viewer's open state alone.
    return html`<details class="panel overlay ${inForce ? "on" : ""}">
      <summary class="panel-head">
        <span class="circ">${icon("overlay")}</span>
        <div class="panel-text">
          <div class="caption overlay-caption">
            ${this.t.overlays} · ${caption}
          </div>
          <div class="panel-value">
            ${inForce ? this.overlayName(inForce) : this.t.off}
          </div>
        </div>
        <span class="chevron">${icon("chevron")}</span>
      </summary>
      <div class="chips" role="group" aria-label=${this.t.overlays}>
        ${automatic ? chip("auto", this.t.automatic) : nothing}
        ${chip("none", this.t.off)}
        ${overlays.map((o) => chip(o.id, this.overlayName(o)))}
      </div>
    </details>`;
  }
  private renderApply(
    a: Record<string, any>,
    overlays: Overlay[],
    disabled: boolean,
  ) {
    const inForce = overlays.find((o) => o.id === a.overlay);
    const hint = a.application_pending
      ? this.t.applyPending
      : a.scene_stale
        ? fill(this.t.applyStale, {
            name: inForce ? this.overlayName(inForce) : this.t.title,
          })
        : this.t.applyHint;
    const attention = Boolean(a.application_pending || a.scene_stale);
    return html`<button
      class="apply ${attention ? "attention" : ""}"
      data-action="apply"
      type="button"
      ?disabled=${disabled}
      @click=${() =>
        this.call("apply_scene", { force: true }, { kind: "apply" })}
    >
      <span class="circ">${icon("apply")}</span>
      <span class="apply-text">
        <span class="apply-title">${this.t.apply}</span>
        <span class="apply-hint">${hint}</span>
      </span>
    </button>`;
  }
  private renderFeedback(current: string) {
    if (this.pending) {
      const label =
        this.pending.kind === "state"
          ? fill(this.t.switching, { name: this.pending.name })
          : this.pending.kind === "apply"
            ? this.t.applying
            : this.t.changingOverlay;
      return html`<div class="feedback" role="status">
        <span class="circ">${icon("spinner", "spin")}</span>
        <div>
          <div class="feedback-title">${label}</div>
          <div class="feedback-sub">${this.t.locked}</div>
        </div>
      </div>`;
    }
    if (this.failure)
      return html`<div class="feedback failed" role="alert">
        <span class="circ">${icon("warning")}</span>
        <div>
          <div class="feedback-title">${this.failure}</div>
          <div class="feedback-sub">
            ${fill(this.t.stillSelected, { name: current })}
          </div>
        </div>
      </div>`;
    return nothing;
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
    const title =
      this.config?.name ||
      (entity?.attributes?.friendly_name as string) ||
      this.t.title;
    if (!entity)
      return html`<ha-card
        >${this.header(this.config?.name || this.t.title)}
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
        >${this.header(title)}
        <div class="error">
          ${this.t.missing}: ${this.config.entity} (${entity.state})
        </div></ha-card
      >`;
    const path: string[] = a.active_path || [];
    const overlays: Overlay[] = a.overlays || cfg.overlays || [];
    const roles: Roles = cfg.roles || ({} as Roles);
    const levels = [
      this.branches(null, nodes),
      ...path.map((id) => this.branches(id, nodes)),
    ].filter((x) => x.length);
    const byId = new Map(nodes.map((n) => [n.id, n]));
    const leaf = path[path.length - 1] || "";
    const current = this.stateName(byId.get(leaf)) || entity.state;
    const tone = this.tone(leaf, a.occupied, nodes, roles);
    const disabled = this.busy || !available;
    const reason =
      (this.t.reason as Record<string, string>)[a.last_changed_by] ||
      a.last_changed_by ||
      "";
    const ago = this.duration(a.since);
    const reasonLine = reason
      ? ago
        ? fill(this.t.changedAgo, { reason, duration: ago })
        : reason
      : ago;
    const visitUntil = a.visit ? this.clock(a.visit.expires) : "";
    const context = [
      path.map((id) => this.stateName(byId.get(id)) || id).join(" › "),
      a.occupied === true
        ? this.t.someoneHome
        : a.occupied === false
          ? this.t.nobodyHome
          : "",
      a.visit
        ? visitUntil
          ? fill(this.t.guestUntil, { time: visitUntil })
          : this.t.guestIn
        : "",
    ].filter(Boolean);
    const water = a.water;
    const failedValves =
      water?.status === "failed" && water.valves
        ? Object.entries(water.valves as Record<string, string>)
            .filter(([, s]) => s !== "open" && s !== "closed")
            .map(([id]) => this.friendly(id))
        : [];
    return html`<ha-card class="tone-${tone}"
      >${this.header(title)}
      <div class="hero">
        <span class="circ big">${icon(this.heroIcon(path, tone))}</span>
        <div class="hero-text">
          <div class="status">
            ${reasonLine.charAt(0).toLocaleUpperCase(formattingLocale(this.hass)) + reasonLine.slice(1)}
          </div>
          <div class="current">${current}</div>
          <div class="context" title=${context.join(" · ")}>
            ${context.join(" · ")}
          </div>
        </div>
      </div>
      ${
        !available
          ? html`<div class="note" role="status">${this.t.reloading}</div>`
          : nothing
      }
      ${
        failedValves.length
          ? html`<div class="note warn" role="alert">
              ${icon("water", "s")}
              ${fill(this.t.waterFailed, { valves: failedValves.join(", ") })}
            </div>`
          : nothing
      }
      ${this.renderLevels(levels, path, nodes, roles, disabled)}
      ${this.renderConfirmation(nodes, cfg)}
      ${
        this.config.show_overlay
          ? this.renderOverlay(a, overlays, disabled)
          : nothing
      }
      ${this.renderApply(a, overlays, disabled)} ${this.renderFeedback(current)}
    </ha-card>`;
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
