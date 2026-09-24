import type { ColorScheme } from "./color-schemes";
export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
}
export interface HomeAssistant {
  states: Record<string, HassEntity>;
  language?: string;
  /** Sidebar panels this user can open; House State 0.6.0 adds `house-state` for admins. */
  panels?: Record<string, unknown>;
  /** HA's 12/24-hour preference; the card otherwise follows the locale. */
  locale?: { language?: string; time_format?: string };
  /** HA's own state formatting (units, decimals, translated enum states). */
  formatEntityState?(state: HassEntity, value?: string): string;
  connection?: {
    sendMessagePromise<T>(message: Record<string, unknown>): Promise<T>;
    subscribeMessage<T>(
      callback: (message: T) => void,
      message: Record<string, unknown>,
    ): Promise<() => Promise<void> | void>;
  };
  callService(
    domain: string,
    service: string,
    data?: Record<string, unknown>,
  ): Promise<unknown>;
}
export interface CardConfig {
  type: string;
  entity: string;
  name?: string;
  appearance?: "default" | "bubble";
  color_scheme?: ColorScheme;
  show_overlay?: boolean;
  confirm_vacation?: boolean;
  /** The settings cog in the header (off by default). */
  show_settings?: boolean;
  /** A `weather.*` entity shown at the top: now, and today's high and low. */
  weather?: string;
  /** The coming days' forecast under it (off by default). */
  show_forecast?: boolean;
  /** Sensors shown as tiles at the top, each opening its history. */
  sensors?: string[];
}
export interface StateNode {
  id: string;
  name: string;
  parent: string | null;
  scene: string;
  default_child: string | null;
  occupied: boolean | null;
}
export type DateRule =
  | { type: "fixed"; from: string; to: string }
  | { type: "easter"; from: number; to: number }
  | {
      type: "nth_weekday";
      weekday: string;
      nth: number;
      days: number;
      month?: number;
      anchor?: string;
    };
export interface Overlay {
  id: string;
  name: string;
  scene: string;
  calendar?: string;
  match?: string;
  dates?: DateRule;
  when_occupied?: boolean | null;
  when_state?: string[];
  priority?: number;
}
export interface Roles {
  arrival: string | null;
  departure: string | null;
  vacation: string | null;
  night: string | null;
}
export interface RuntimeConfig {
  state_tree: StateNode[];
  initial_state: string;
  overlays: Overlay[];
  roles: Roles;
}
