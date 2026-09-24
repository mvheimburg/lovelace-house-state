import { applyColorScheme } from "./color-schemes";
import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styles } from "./styles";
import { formattingLocale, localize, displayName, fill } from "./localize";
import { icon, hasIcon } from "./icons";
import { chart, timeAt, units } from "./chart";
import {
  RANGES,
  hasHistory,
  historySources,
  loadHistory,
  valueAt,
  type Range,
  type Series,
  type Source,
} from "./history";
import {
  conditionIcon,
  forecastDays,
  forecastType,
  today,
  type ForecastDay,
  type ForecastEntry,
} from "./weather";
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
  /** The forecast subscription: which entity and type it is for, and its days. */
  private forecastKey?: string;
  private forecastUnsub?: Promise<(() => Promise<void> | void) | undefined>;
  @state() private forecast?: ForecastDay[];
  /** History dialog: what it draws, the range, loaded series, hovered time. */
  @state() private historyFor?: Source[];
  @state() private series?: Series[];
  @state() private window?: [number, number];
  @state() private hover?: number;
  @state() private range: Range = 24;
  @state() private historyLoading = false;
  @state() private historyError = "";
  /** Bumped to ignore history replies that arrive after a reset. */
  private historyTicket = 0;
  private plotWidth = 600;
  private resize?: ResizeObserver;
  static styles = styles;

  setConfig(config: CardConfig) {
    if (!config.entity) throw new Error(this.t.entityRequired);
    applyColorScheme(this, config.color_scheme, this.hass);
    if (this.config?.entity !== config.entity) {
      this.lastValid = undefined;
      this.failure = undefined;
      this.confirming = undefined;
    }
    if (
      this.config?.weather !== config.weather ||
      String(this.config?.sensors) !== String(config.sensors)
    )
      this.resetHistory();
    this.config = {
      appearance: "default",
      show_overlay: true,
      confirm_vacation: true,
      show_settings: false,
      show_forecast: false,
      ...config,
    };
    this.setAttribute("data-appearance", this.config.appearance!);
  }
  getCardSize() {
    return (
      6 +
      (this.config?.weather ? (this.config.show_forecast ? 3 : 1) : 0) +
      (this.config?.sensors?.length ? 2 : 0)
    );
  }
  connectedCallback() {
    super.connectedCallback();
    this.subscribeForecast();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.unsubscribeForecast();
    this.resetHistory();
    this.resize?.disconnect();
    this.resize = undefined;
  }
  protected updated() {
    this.subscribeForecast();
    const plot = this.shadowRoot?.querySelector(".history-plot");
    if (!plot || this.resize) return;
    this.resize = new ResizeObserver(([entry]) => {
      const width = Math.round(entry.contentRect.width);
      // Redraw next frame, outside the observer's own layout pass.
      if (width > 0 && Math.abs(width - this.plotWidth) > 4)
        requestAnimationFrame(() => {
          this.plotWidth = width;
          this.requestUpdate();
        });
    });
    this.resize.observe(plot);
  }
  /**
   * Follow the weather entity's forecast while the card is shown: today's
   * high and low come from it, and the forecast row when that is on.
   */
  private subscribeForecast() {
    const id = this.config?.weather;
    const type = id ? forecastType(this.hass?.states?.[id]) : undefined;
    const key = id && type && this.isConnected ? `${id}|${type}` : undefined;
    if (key === this.forecastKey) return;
    this.unsubscribeForecast();
    this.forecastKey = key;
    const connection = this.hass?.connection;
    if (!key || !connection) return;
    this.forecastUnsub = connection
      .subscribeMessage<{ forecast?: ForecastEntry[] }>(
        (message) => {
          if (this.forecastKey === key)
            this.forecast = forecastDays(message.forecast ?? []);
        },
        {
          type: "weather/subscribe_forecast",
          entity_id: id,
          forecast_type: type,
        },
      )
      .catch(() => undefined);
  }
  private unsubscribeForecast() {
    const pending = this.forecastUnsub;
    this.forecastUnsub = undefined;
    this.forecastKey = undefined;
    this.forecast = undefined;
    void pending?.then((unsubscribe) => unsubscribe?.()).catch(() => undefined);
  }
  private moreInfo(entityId: string) {
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId },
        bubbles: true,
        composed: true,
      }),
    );
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
    // The integration's configuration panel when this user has it, else its page.
    const href = this.hass?.panels?.["house-state"]
      ? "/house-state"
      : "/config/integrations/integration/house_state";
    return html`<a
      class="icon settings"
      href=${href}
      aria-label=${this.t.settings}
      title=${this.t.settings}
      >${icon("cog")}</a
    >`;
  }
  /** The cog is optional; a card that cannot show the house always offers it. */
  private header(title: string, failed = false) {
    return html`<div class="header">
      <div class="title">${title}</div>
      ${this.config?.show_settings || failed ? this.settingsLink() : nothing}
    </div>`;
  }
  private number(value: number, digits = 1) {
    try {
      return new Intl.NumberFormat(formattingLocale(this.hass), {
        maximumFractionDigits: digits,
      }).format(value);
    } catch {
      return String(value);
    }
  }
  private temperature(value: unknown, unit: string) {
    const n = Number(value);
    if (value === undefined || value === null || !Number.isFinite(n)) return "";
    return `${this.number(n)}${unit ? ` ${unit}` : ""}`;
  }
  /** A forecast day's temperature, without the unit: "11.3°". */
  private degrees(value?: number) {
    return value === undefined ? "" : `${this.number(value)}°`;
  }
  private condition(state: HassEntity) {
    if (["unavailable", "unknown"].includes(state.state))
      return state.state === "unknown" ? this.t.unknown : this.t.unavailable;
    const formatted = this.hass?.formatEntityState?.(state);
    if (formatted && formatted !== state.state) return formatted;
    return this.t.conditions[state.state] ?? state.state;
  }
  /** A sensor's value as Home Assistant formats it, else locale digits and unit. */
  private sensorValue(state?: HassEntity) {
    if (!state || state.state === "unavailable") return this.t.unavailable;
    if (state.state === "unknown") return this.t.unknown;
    const formatted = this.hass?.formatEntityState?.(state);
    if (formatted) return formatted;
    const n = Number(state.state);
    const unit = state.attributes.unit_of_measurement;
    return `${Number.isFinite(n) && state.state !== "" ? this.number(n, 2) : state.state}${unit ? ` ${unit}` : ""}`;
  }
  private weekday(date: Date) {
    try {
      return new Intl.DateTimeFormat(formattingLocale(this.hass), {
        weekday: "short",
      }).format(date);
    } catch {
      return date.toDateString().slice(0, 3);
    }
  }
  private renderWeather(id: string) {
    const state = this.hass?.states?.[id];
    if (!state)
      return html`<div class="weather missing" data-weather>
        ${this.t.missing}: ${id}
      </div>`;
    const unit = String(state.attributes.temperature_unit ?? "");
    const days = this.forecast ?? [];
    const now = today(days);
    const { icon: name, tone } = conditionIcon(state.state);
    const high = this.temperature(now?.high, unit);
    const low = this.temperature(now?.low, unit);
    return html`<button
        class="weather"
        data-weather
        type="button"
        @click=${() => this.moreInfo(id)}
      >
        <span class="wx-icon wx-${tone}">${icon(name, "wx")}</span>
        <span class="wx-text">
          <span class="wx-condition">${this.condition(state)}</span>
          <span class="wx-place">${this.friendly(id)}</span>
        </span>
        <span class="wx-temps">
          <span class="wx-now"
            >${this.temperature(state.attributes.temperature, unit)}</span
          >
          ${
            high && low
              ? html`<span
                  class="wx-range"
                  title=${fill(this.t.highLow, { high, low })}
                  >${high} / ${low}</span
                >`
              : nothing
          }
        </span>
      </button>
      ${
        this.config.show_forecast && days.length
          ? html`<ol class="forecast" aria-label=${this.t.forecast}>
              ${days.slice(0, 5).map((day) => {
                const c = conditionIcon(day.condition);
                const label = day.condition
                  ? (this.t.conditions[day.condition] ?? day.condition)
                  : "";
                return html`<li class="day" data-day>
                  <span class="day-name">${this.weekday(day.date)}</span>
                  <span
                    class="wx-icon wx-${c.tone}"
                    role="img"
                    aria-label=${label}
                    title=${label}
                    >${icon(c.icon, "wx")}</span
                  >
                  <span class="day-high">${this.degrees(day.high)}</span>
                  <span class="day-low">${this.degrees(day.low)}</span>
                </li>`;
              })}
            </ol>`
          : nothing
      }`;
  }
  private renderSensors(ids: string[]) {
    return html`<div class="sensors">
      ${ids.map((id) => {
        const state = this.hass?.states?.[id];
        const down = !state || state.state === "unavailable";
        const history = hasHistory(state);
        return html`<button
          class="sensor ${down ? "down" : ""}"
          data-sensor=${id}
          type="button"
          aria-haspopup=${history ? "dialog" : nothing}
          title=${history ? this.t.showHistory : ""}
          @click=${() => (history ? this.openHistory(id) : this.moreInfo(id))}
        >
          <span class="sensor-icon"
            >${state ? html`<ha-state-icon .hass=${this.hass} .stateObj=${state}></ha-state-icon>` : nothing}${down ? html`<span class="badge" aria-hidden="true">!</span>` : nothing}</span
          >
          <span class="sensor-name">${this.friendly(id)}</span>
          <span class="sensor-value">${this.sensorValue(state)}</span>
        </button>`;
      })}
    </div>`;
  }
  /** Weather and sensors at the top, when the card is set up with them. */
  private renderOutside() {
    const weather = this.config?.weather;
    const sensors = this.config?.sensors ?? [];
    if (!weather && !sensors.length) return nothing;
    return html`<section class="outside">
      ${weather ? this.renderWeather(weather) : nothing}
      ${sensors.length ? this.renderSensors(sensors) : nothing}
    </section>`;
  }
  /** Drop loaded history and ignore replies still in flight. */
  private resetHistory() {
    this.historyTicket++;
    this.historyFor = this.series = this.window = this.hover = undefined;
    this.historyLoading = false;
    this.historyError = "";
    this.shadowRoot?.querySelector<HTMLDialogElement>("#history")?.close();
  }
  private async openHistory(id: string) {
    if (!this.hass) return;
    this.resetHistory();
    this.historyFor = historySources(
      this.config.sensors ?? [],
      id,
      this.hass.states,
    );
    await this.updateComplete;
    const dialog =
      this.shadowRoot?.querySelector<HTMLDialogElement>("#history");
    if (dialog && !dialog.open) dialog.showModal();
    void this.loadHistory();
  }
  private async loadHistory(range: Range = this.range) {
    const sources = this.historyFor;
    const connection = this.hass?.connection;
    if (!sources) return;
    const ticket = ++this.historyTicket;
    this.range = range;
    this.historyLoading = true;
    this.historyError = "";
    this.hover = undefined;
    const end = Date.now();
    try {
      if (!connection) throw new Error(this.t.unavailable);
      const series = await loadHistory(
        connection,
        sources,
        this.hass.states,
        range,
        end,
      );
      if (ticket !== this.historyTicket) return;
      this.series = series;
      this.window = [end - range * 3_600_000, end];
    } catch (error: any) {
      if (ticket !== this.historyTicket) return;
      this.series = this.window = undefined;
      this.historyError = `${this.t.historyFailed}: ${error?.message || error}`;
    }
    this.historyLoading = false;
  }
  private closeOnBackdrop(e: MouseEvent) {
    if (e.target !== e.currentTarget) return;
    const dialog = e.currentTarget as HTMLDialogElement;
    const r = dialog.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      dialog.close();
  }
  private historyDialog(title: string) {
    if (!this.config?.sensors?.length) return nothing;
    const locale = formattingLocale(this.hass);
    const format = this.hass?.locale?.time_format;
    const hour12 = format === "12" ? true : format === "24" ? false : undefined;
    const time = (ms: number, withDay: boolean) => {
      try {
        return new Intl.DateTimeFormat(
          locale,
          withDay
            ? { weekday: "short", day: "numeric" }
            : { hour: "2-digit", minute: "2-digit", hour12 },
        ).format(ms);
      } catch {
        return new Date(ms).toLocaleTimeString();
      }
    };
    const span = (hours: number) => {
      try {
        return new Intl.NumberFormat(locale, {
          style: "unit",
          unit: hours < 48 ? "hour" : "day",
          unitDisplay: "short",
        }).format(hours < 48 ? hours : hours / 24);
      } catch {
        return hours < 48 ? `${hours} h` : `${hours / 24} d`;
      }
    };
    const number = (value: number, digits: number) =>
      new Intl.NumberFormat(locale, {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      }).format(value);
    const series = this.series;
    const window = this.window;
    const at = this.hover;
    const twoScales = !!series && units(series)[1] !== undefined;
    const close = () =>
      this.shadowRoot?.querySelector<HTMLDialogElement>("#history")?.close();
    return html`<dialog
      id="history"
      aria-labelledby="history-title"
      @click=${this.closeOnBackdrop}
      @close=${() => {
        this.historyTicket++;
        this.historyLoading = false;
        this.hover = undefined;
      }}
    >
      <div class="dialog-top">
        <h2 class="dialog-title" id="history-title">
          ${this.t.history}<span class="subtitle">${title}</span>
        </h2>
        <button
          class="icon"
          data-close-history
          aria-label=${this.t.closeHistory}
          title=${this.t.closeHistory}
          @click=${close}
        >
          ${icon("close")}
        </button>
      </div>
      <div
        class="history-ranges"
        role="group"
        aria-label=${this.t.historyRanges}
      >
        ${RANGES.map(
          (hours) =>
            html`<button
              class="chip ${this.range === hours ? "active" : ""}"
              data-range=${hours}
              aria-pressed=${String(this.range === hours)}
              @click=${() => void this.loadHistory(hours)}
            >
              ${span(hours)}
            </button>`,
        )}
      </div>
      <div
        class="history-plot"
        aria-busy=${String(this.historyLoading)}
        @pointermove=${(e: PointerEvent) => {
          const svg = (e.currentTarget as HTMLElement).querySelector("svg");
          if (!svg || !window) return;
          this.hover = timeAt(e, svg, window[0], window[1], twoScales);
        }}
        @pointerleave=${() => (this.hover = undefined)}
      >
        ${
          this.historyError
            ? html`<div class="feedback failed" role="alert">
                <span class="circ">${icon("warning")}</span>
                <div class="feedback-title">${this.historyError}</div>
              </div>`
            : !series || !window
              ? html`<p class="history-note" role="status">
                  ${this.t.loadingHistory}
                </p>`
              : series.every((s) => s.points.every(([, v]) => v === undefined))
                ? html`<p class="history-note">${this.t.noHistory}</p>`
                : chart(
                    series,
                    window[0],
                    window[1],
                    at,
                    { number, time, label: `${this.t.history}: ${title}` },
                    Math.max(280, this.plotWidth),
                  )
        }
      </div>
      <p class="history-when" aria-live="polite">
        ${at === undefined ? this.t.now : time(at, false)}
      </p>
      <div class="history-legend">
        ${(series ?? []).map((s) => {
          const value =
            at === undefined
              ? s.points[s.points.length - 1]?.[1]
              : valueAt(s, at);
          return html`<button
            class="history-item series-${s.color}"
            data-series=${s.entityId}
            @click=${() => {
              close();
              this.moreInfo(s.entityId);
            }}
          >
            <span class="swatch" aria-hidden="true"></span>
            <span class="label">${this.friendly(s.entityId)}</span>
            <strong
              >${value === undefined ? "—" : `${this.number(value, 2)}${s.unit ? ` ${s.unit}` : ""}`}</strong
            >
          </button>`;
        })}
      </div>
    </dialog>`;
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
        >${this.header(this.config?.name || this.t.title, true)}
        ${this.renderOutside()}
        <div class="error">${this.t.missing}: ${this.config?.entity || ""}</div>
        ${this.historyDialog(this.config?.name || this.t.title)}</ha-card
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
        >${this.header(title, true)} ${this.renderOutside()}
        <div class="error">
          ${this.t.missing}: ${this.config.entity} (${entity.state})
        </div>
        ${this.historyDialog(this.config?.name || this.t.title)}</ha-card
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
      >${this.header(title)} ${this.renderOutside()}
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
      ${this.historyDialog(title)}
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
