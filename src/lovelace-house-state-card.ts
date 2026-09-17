import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styles } from "./styles";
import type {
  CardConfig,
  HomeAssistant,
  Overlay,
  Roles,
  RuntimeConfig,
  Schedule,
  StateNode,
} from "./types";
import "./lovelace-house-state-editor";

const copy = <T>(value: T): T => JSON.parse(JSON.stringify(value));
const labels = {
  en: {
    settings: "Settings",
    close: "Close",
    off: "Off",
    apply: "Apply scene now",
    save: "Save",
    cancel: "Cancel",
    tree: "State tree",
    addRoot: "Add root",
    addChild: "Add child",
    remove: "Remove subtree",
    name: "Name",
    id: "ID",
    parent: "Parent",
    scene: "Scene",
    defaultChild: "Default child",
    occupied: "Is someone home?",
    inherit: "Inherit",
    yes: "Yes",
    no: "No",
    initial: "Initial state",
    roles: "Automation roles",
    overlays: "Overlays",
    addOverlay: "Add overlay",
    entities: "Entities",
    automation: "Automation",
    vacationConfirm: "Switch to vacation?",
    arrival: "Arrival",
    departure: "Departure",
    vacation: "Vacation",
    night: "Night",
    door: "Doors",
    gate: "Gates",
    person: "People",
    autoReturn: "Automatic return",
    autoAway: "Automatic away",
    grace: "Away grace (seconds)",
    schedule: "Night schedule",
    missing: "Entity not found",
    newState: "New state",
    newOverlay: "New overlay",
  },
  nb: {
    settings: "Innstillinger",
    close: "Lukk",
    off: "Av",
    apply: "Bruk scene nå",
    save: "Lagre",
    cancel: "Avbryt",
    tree: "Tilstandstre",
    addRoot: "Legg til rot",
    addChild: "Legg til barn",
    remove: "Fjern gren",
    name: "Navn",
    id: "ID",
    parent: "Forelder",
    scene: "Scene",
    defaultChild: "Standardbarn",
    occupied: "Er noen hjemme?",
    inherit: "Arv",
    yes: "Ja",
    no: "Nei",
    initial: "Starttilstand",
    roles: "Automatikkroller",
    overlays: "Overlegg",
    addOverlay: "Legg til overlegg",
    entities: "Entiteter",
    automation: "Automatikk",
    vacationConfirm: "Bytt til ferie?",
    arrival: "Hjemkomst",
    departure: "Avreise",
    vacation: "Ferie",
    night: "Natt",
    door: "Dører",
    gate: "Porter",
    person: "Personer",
    autoReturn: "Automatisk hjemkomst",
    autoAway: "Automatisk borte",
    grace: "Ventetid borte (sekunder)",
    schedule: "Nattplan",
    missing: "Fant ikke entiteten",
    newState: "Ny tilstand",
    newOverlay: "Nytt overlegg",
  },
};

@customElement("lovelace-house-state-card")
export class HouseStateCard extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private config!: CardConfig;
  @state() private busy = false;
  @state() private draft?: RuntimeConfig;
  @state() private selected?: string;
  static styles = styles;

  setConfig(config: CardConfig) {
    if (!config.entity) throw new Error("You must define an entity");
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
    return this.hass?.locale?.language?.toLowerCase().match(/^(nb|no)/)
      ? labels.nb
      : labels.en;
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
      return true;
    } catch (error: any) {
      this.toast(`House State: ${error?.message || error}`);
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
  private duration(s: unknown) {
    const m = Math.floor((Date.now() - new Date(String(s)).getTime()) / 60000);
    if (!Number.isFinite(m) || m < 0) return "";
    return m >= 1440
      ? `${Math.floor(m / 1440)}d ${Math.floor((m % 1440) / 60)}h`
      : m >= 60
        ? `${Math.floor(m / 60)}h ${m % 60}m`
        : `${m}m`;
  }
  private branches(parent: string | null, nodes: StateNode[]) {
    return nodes.filter((n) => n.parent === parent);
  }
  private open(cfg: RuntimeConfig) {
    this.draft = copy(cfg);
    this.selected = cfg.initial_state;
    this.renderRoot.querySelector<HTMLDialogElement>("dialog")?.showModal();
  }
  private close() {
    this.draft = undefined;
    this.renderRoot.querySelector<HTMLDialogElement>("dialog")?.close();
  }
  private patchNode(values: Partial<StateNode>) {
    if (!this.draft || !this.selected) return;
    const state_tree = this.draft.state_tree.map((n) =>
      n.id === this.selected ? { ...n, ...values } : n,
    );
    this.draft = {
      ...this.draft,
      state_tree,
      roles: this.validRoles(this.draft.roles, state_tree),
    };
  }
  private reparent(parent: string | null) {
    if (!this.draft || !this.selected) return;
    const selected = this.selected;
    const state_tree = this.draft.state_tree.map((n) =>
      n.id === selected
        ? { ...n, parent }
        : n.default_child === selected
          ? { ...n, default_child: null }
          : n,
    );
    this.draft = {
      ...this.draft,
      state_tree,
      roles: this.validRoles(this.draft.roles, state_tree),
    };
  }
  private isOccupied(id: string, nodes: StateNode[]) {
    let resolved = nodes.find((n) => n.id === id);
    const seen = new Set<string>();
    while (resolved?.default_child && !seen.has(resolved.id)) {
      seen.add(resolved.id);
      resolved = nodes.find((n) => n.id === resolved!.default_child);
    }
    let node = resolved;
    while (node) {
      if (node.occupied !== null) return node.occupied;
      node = node.parent ? nodes.find((n) => n.id === node!.parent) : undefined;
    }
    return false;
  }
  private validRoles(roles: Roles, nodes: StateNode[]): Roles {
    return Object.fromEntries(
      Object.entries(roles).map(([role, id]) => {
        if (!id) return [role, null];
        const occupied = role === "arrival" || role === "night";
        return [role, this.isOccupied(id, nodes) === occupied ? id : null];
      }),
    ) as unknown as Roles;
  }
  private newId(base: string, nodes: StateNode[]) {
    const slug =
      base
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^([^a-z])/, "s_$1")
        .slice(0, 55) || "state";
    let id = slug,
      i = 2;
    while (nodes.some((n) => n.id === id)) id = `${slug}_${i++}`;
    return id;
  }
  private addNode(parent: string | null) {
    if (!this.draft) return;
    const id = this.newId(
      parent ? "new_state" : "new_root",
      this.draft.state_tree,
    );
    this.draft = {
      ...this.draft,
      state_tree: [
        ...this.draft.state_tree,
        {
          id,
          name: this.t.newState,
          parent,
          scene: "",
          default_child: null,
          occupied: null,
        },
      ],
    };
    this.selected = id;
  }
  private removeNode() {
    if (!this.draft || !this.selected) return;
    const removed = this.descendants(this.selected, this.draft.state_tree);
    if (
      removed.size === this.draft.state_tree.length ||
      !window.confirm(this.t.remove + "?")
    )
      return;
    const state_tree = this.draft.state_tree
      .filter((n) => !removed.has(n.id))
      .map((n) =>
        removed.has(n.default_child || "") ? { ...n, default_child: null } : n,
      );
    const initial_state = removed.has(this.draft.initial_state)
      ? state_tree[0].id
      : this.draft.initial_state;
    const roles = Object.fromEntries(
      Object.entries(this.draft.roles).map(([k, v]) => [
        k,
        v && removed.has(v) ? null : v,
      ]),
    ) as unknown as Roles;
    this.draft = {
      ...this.draft,
      state_tree,
      initial_state,
      roles: this.validRoles(roles, state_tree),
    };
    this.selected = initial_state;
  }
  private async saveDraft() {
    if (!this.draft) return;
    const savedDraft = this.draft;
    const saved = await this.call("set_config", {
      state_tree: savedDraft.state_tree,
      roles: savedDraft.roles,
      initial_state: savedDraft.initial_state,
      overlays: savedDraft.overlays,
    });
    if (saved && this.draft === savedDraft) this.close();
  }
  private saveOption(key: string, value: unknown) {
    void this.call("set_config", { [key]: value });
  }

  render() {
    const entity = this.hass?.states?.[this.config?.entity];
    if (!entity)
      return html`<ha-card
        ><div class="error">
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
        ><div class="error">
          ${this.t.missing}: ${this.config.entity} (${entity.state})
        </div></ha-card
      >`;
    const path: string[] = a.active_path || [];
    const levels = [
      this.branches(null, nodes),
      ...path.map((id) => this.branches(id, nodes)),
    ].filter((x) => x.length);
    const byId = new Map(nodes.map((n) => [n.id, n]));
    return html` <ha-card
        ><div class="header">
          <div class="title">
            ${this.config.name || a.friendly_name || "House State"}
          </div>
          <button
            class="icon"
            aria-label="Settings"
            @click=${() => this.open(cfg)}
          >
            <ha-icon icon="mdi:cog-outline"></ha-icon>
          </button>
        </div>
        ${levels.map((group) => html`<div class="segment">${group.map((n) => html`<button data-state=${n.id} class=${path.includes(n.id) ? "active" : ""} ?disabled=${this.busy} @click=${() => this.selectState(n.id, nodes, cfg.roles)}>${n.name}</button>`)}</div>`)}
        ${
          this.config.show_overlay
            ? html`<select
                class="overlay"
                @change=${(e: Event) => this.call("set", { overlay: (e.target as HTMLSelectElement).value, reason: "user" })}
              >
                <option
                  value="none"
                  ?selected=${(a.overlay || "none") === "none"}
                >
                  ${this.t.off}
                </option>
                ${(a.overlays || cfg.overlays || []).map((o: Overlay) => html`<option value=${o.id} ?selected=${a.overlay === o.id}>${o.name}</option>`)}
              </select>`
            : nothing
        }
        <div class="status">
          ${path.map((id) => byId.get(id)?.name || id).join(" · ")} ·
          ${this.duration(a.since)} · ${a.last_changed_by || ""}
        </div></ha-card
      >${this.settings(cfg)}`;
  }

  private ordered(
    nodes: StateNode[],
    parent: string | null = null,
    depth = 0,
  ): Array<[StateNode, number]> {
    return this.branches(parent, nodes).flatMap((n) => [
      [n, depth] as [StateNode, number],
      ...this.ordered(nodes, n.id, depth + 1),
    ]);
  }
  private settings(cfg: RuntimeConfig) {
    const d = this.draft || cfg,
      t = this.t,
      node = d.state_tree.find((n) => n.id === this.selected),
      blocked = node
        ? this.descendants(node.id, d.state_tree)
        : new Set<string>();
    const sch: Schedule = cfg.night_schedule || { type: "off" };
    return html`<dialog @cancel=${this.close}>
      <div class="dialog-head">
        <h2>${t.settings}</h2>
        <button class="icon" aria-label=${t.close} @click=${this.close}>
          ×
        </button>
      </div>
      <div class="settings">
        <div class="section">
          <div class="row">
            <h3>${t.tree}</h3>
            <button data-action="add-root" @click=${() => this.addNode(null)}>
              ${t.addRoot}
            </button>
          </div>
          <div class="tree-list">
            ${this.ordered(d.state_tree).map(([n, depth]) => html`<button data-node=${n.id} class=${n.id === this.selected ? "active" : ""} style=${`padding-left:${8 + depth * 18}px`} @click=${() => (this.selected = n.id)}>${n.name}<small>${n.id}</small></button>`)}
          </div>
        </div>
        ${
          node
            ? html`<div class="section grid">
                <label class="field"
                  >${t.name}<input
                    name="node-name"
                    .value=${node.name}
                    maxlength="100"
                    @input=${(e: Event) => this.patchNode({ name: (e.target as HTMLInputElement).value })} /></label
                ><label class="field"
                  >${t.id}<input .value=${node.id} disabled /></label
                ><label class="field"
                  >${t.parent}<select
                    @change=${(e: Event) => this.reparent((e.target as HTMLSelectElement).value || null)}
                  >
                    <option value="" ?selected=${node.parent === null}>
                      —
                    </option>
                    ${d.state_tree.filter((n) => !blocked.has(n.id)).map((n) => html`<option value=${n.id} ?selected=${node.parent === n.id}>${n.name}</option>`)}
                  </select></label
                ><label class="field"
                  >${t.scene}<ha-entity-picker
                    .hass=${this.hass}
                    .value=${node.scene}
                    .includeDomains=${["scene"]}
                    allow-custom-entity
                    @value-changed=${(e: CustomEvent) => this.patchNode({ scene: e.detail.value || "" })}
                  ></ha-entity-picker></label
                ><label class="field"
                  >${t.defaultChild}<select
                    @change=${(e: Event) => this.patchNode({ default_child: (e.target as HTMLSelectElement).value || null })}
                  >
                    <option value="" ?selected=${node.default_child === null}>
                      —
                    </option>
                    ${this.branches(node.id, d.state_tree).map((n) => html`<option value=${n.id} ?selected=${node.default_child === n.id}>${n.name}</option>`)}
                  </select></label
                ><label class="field"
                  >${t.occupied}<select
                    @change=${(e: Event) => this.patchNode({ occupied: (e.target as HTMLSelectElement).value === "inherit" ? null : (e.target as HTMLSelectElement).value === "true" })}
                  >
                    <option value="inherit" ?selected=${node.occupied === null}>
                      ${t.inherit}
                    </option>
                    <option value="true" ?selected=${node.occupied === true}>
                      ${t.yes}
                    </option>
                    <option value="false" ?selected=${node.occupied === false}>
                      ${t.no}
                    </option>
                  </select></label
                ><button
                  data-action="add-child"
                  @click=${() => this.addNode(node.id)}
                >
                  ${t.addChild}</button
                ><button
                  data-action="remove-node"
                  ?disabled=${d.state_tree.length === 1}
                  @click=${this.removeNode}
                >
                  ${t.remove}
                </button>
              </div>`
            : nothing
        }
        <div class="section grid">
          <label class="field"
            >${t.initial}<select
              @change=${(e: Event) => (this.draft = { ...d, initial_state: (e.target as HTMLSelectElement).value })}
            >
              ${d.state_tree.map((n) => html`<option value=${n.id} ?selected=${d.initial_state === n.id}>${n.name}</option>`)}
            </select></label
          >${(["arrival", "departure", "vacation", "night"] as const).map(
            (role) =>
              html`<label class="field"
                >${t[role]}<select
                  @change=${(e: Event) => (this.draft = { ...d, roles: { ...d.roles, [role]: (e.target as HTMLSelectElement).value || null } })}
                >
                  <option value="" ?selected=${!d.roles[role]}>—</option>
                  ${d.state_tree.filter((n) => (role === "arrival" || role === "night" ? this.isOccupied(n.id, d.state_tree) : !this.isOccupied(n.id, d.state_tree))).map((n) => html`<option value=${n.id} ?selected=${d.roles[role] === n.id}>${n.name}</option>`)}
                </select></label
              >`,
          )}
        </div>
        <div class="section">
          <div class="row">
            <h3>${t.overlays}</h3>
            <button
              @click=${() => {
                const id = this.newId(
                  "new_overlay",
                  d.overlays.map((o) => ({
                    ...o,
                    parent: null,
                    default_child: null,
                    occupied: null,
                  })),
                );
                this.draft = {
                  ...d,
                  overlays: [
                    ...d.overlays,
                    { id, name: this.t.newOverlay, scene: "" },
                  ],
                };
              }}
            >
              ${t.addOverlay}
            </button>
          </div>
          ${d.overlays.map(
            (o, i) =>
              html`<div class="grid">
                <label class="field"
                  >${t.name}<input
                    .value=${o.name}
                    @input=${(e: Event) => {
                      const overlays = [...d.overlays];
                      overlays[i] = {
                        ...o,
                        name: (e.target as HTMLInputElement).value,
                      };
                      this.draft = { ...d, overlays };
                    }} /></label
                ><label class="field"
                  >${t.scene}<ha-entity-picker
                    .hass=${this.hass}
                    .value=${o.scene}
                    .includeDomains=${["scene"]}
                    @value-changed=${(e: CustomEvent) => {
                      const overlays = [...d.overlays];
                      overlays[i] = { ...o, scene: e.detail.value || "" };
                      this.draft = { ...d, overlays };
                    }}
                  ></ha-entity-picker></label
                ><button
                  @click=${() => (this.draft = { ...d, overlays: d.overlays.filter((x) => x.id !== o.id) })}
                >
                  ${t.remove}
                </button>
              </div>`,
          )}
        </div>
        ${this.operationalSettings(cfg, sch)}
      </div>
      <div class="dialog-actions">
        <button
          data-action="apply-scene"
          @click=${() => this.call("apply_scene", { force: true })}
        >
          ${t.apply}</button
        ><span></span><button @click=${this.close}>${t.cancel}</button
        ><button
          data-action="save"
          class="primary"
          ?disabled=${this.busy}
          @click=${this.saveDraft}
        >
          ${t.save}
        </button>
      </div>
    </dialog>`;
  }

  private operationalSettings(c: RuntimeConfig, sch: Schedule) {
    return html`<div class="section">
        <h3>${this.t.entities}</h3>
        ${[
          ["door_entities", c.door_entities, ["lock"]],
          ["gate_entities", c.gate_entities, ["cover"]],
          ["person_entities", c.person_entities, ["person"]],
        ].map(
          ([key, value, domain]) =>
            html`<label class="field"
              >${(this.t as any)[String(key).replace("_entities", "")]}<ha-selector
                .hass=${this.hass}
                .selector=${{ entity: { multiple: true, domain } }}
                .value=${value || []}
                @value-changed=${(e: CustomEvent) => this.saveOption(String(key), e.detail.value || [])}
              ></ha-selector
            ></label>`,
        )}
      </div>
      <div class="section">
        <h3>${this.t.automation}</h3>
        <label class="toggle"
          >${this.t.autoReturn}<ha-switch
            .checked=${c.auto_return}
            @change=${(e: Event) => this.saveOption("auto_return", (e.target as HTMLInputElement).checked)}
          ></ha-switch></label
        ><label class="toggle"
          >${this.t.autoAway}<ha-switch
            .checked=${c.auto_away}
            @change=${(e: Event) => this.saveOption("auto_away", (e.target as HTMLInputElement).checked)}
          ></ha-switch></label
        ><label class="field"
          >${this.t.grace}<input
            type="number"
            .value=${String(c.auto_away_grace || 300)}
            @change=${(e: Event) => this.saveOption("auto_away_grace", Number((e.target as HTMLInputElement).value))} /></label
        ><label class="field"
          >${this.t.schedule}<select
            @change=${(e: Event) => {
              const type = (e.target as HTMLSelectElement).value;
              this.saveOption(
                "night_schedule",
                type === "fixed"
                  ? { type, time: "22:00:00" }
                  : type === "sun"
                    ? { type, event: "sunset", offset: 0 }
                    : { type: "off" },
              );
            }}
          >
            <option value="off" ?selected=${sch.type === "off"}>Off</option>
            <option value="fixed" ?selected=${sch.type === "fixed"}>
              Fixed
            </option>
            <option value="sun" ?selected=${sch.type === "sun"}>Sun</option>
          </select></label
        >
        ${
          sch.type === "fixed"
            ? html`<label class="field"
                >Time<input
                  type="time"
                  step="1"
                  .value=${sch.time || "22:00:00"}
                  @change=${(e: Event) => {
                    const value = (e.target as HTMLInputElement).value;
                    this.saveOption("night_schedule", {
                      type: "fixed",
                      time: value.length === 5 ? `${value}:00` : value,
                    });
                  }}
              /></label>`
            : nothing
        }
        ${
          sch.type === "sun"
            ? html`<div class="grid">
                <label class="field"
                  >Event<select
                    @change=${(e: Event) => this.saveOption("night_schedule", { ...sch, event: (e.target as HTMLSelectElement).value })}
                  >
                    <option
                      value="sunset"
                      ?selected=${(sch.event || "sunset") === "sunset"}
                    >
                      Sunset
                    </option>
                    <option
                      value="sunrise"
                      ?selected=${sch.event === "sunrise"}
                    >
                      Sunrise
                    </option>
                  </select></label
                ><label class="field"
                  >Offset (seconds)<input
                    type="number"
                    .value=${String(sch.offset || 0)}
                    @change=${(e: Event) => this.saveOption("night_schedule", { ...sch, offset: Number((e.target as HTMLInputElement).value) })}
                /></label>
              </div>`
            : nothing
        }
        <div class="grid">
          ${(["state", "overlay"] as const).map(
            (key) =>
              html`<label class="field"
                >Legacy ${key}<ha-entity-picker
                  .hass=${this.hass}
                  .value=${c.legacy_mirror?.[key] || ""}
                  .includeDomains=${["input_select"]}
                  allow-custom-entity
                  @value-changed=${(e: CustomEvent) => {
                    const mirror = { ...c.legacy_mirror };
                    if (e.detail.value) mirror[key] = e.detail.value;
                    else delete mirror[key];
                    this.saveOption("legacy_mirror", mirror);
                  }}
                ></ha-entity-picker
              ></label>`,
          )}
        </div>
      </div>`;
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
