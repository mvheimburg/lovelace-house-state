import type { ColorScheme } from "./color-schemes";
export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
}
export interface HomeAssistant {
  states: Record<string, HassEntity>;
  language?: string;
  locale?: { language?: string };
  /** Sidebar panels this user can open; House State 0.6.0 adds `house-state` for admins. */
  panels?: Record<string, unknown>;
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
