export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
}
export interface HomeAssistant {
  states: Record<string, HassEntity>;
  locale?: { language?: string };
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
  show_overlay?: boolean;
  confirm_vacation?: boolean;
}
export type Schedule = {
  type: "off" | "fixed" | "sun";
  time?: string;
  event?: "sunset" | "sunrise";
  offset?: number;
};
export interface StateNode {
  id: string;
  name: string;
  parent: string | null;
  scene: string;
  default_child: string | null;
  occupied: boolean | null;
}
export interface Overlay {
  id: string;
  name: string;
  scene: string;
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
  door_entities: string[];
  gate_entities: string[];
  person_entities: string[];
  auto_return: boolean;
  auto_away: boolean;
  auto_away_grace: number;
  night_schedule: Schedule;
  legacy_mirror?: { state?: string; overlay?: string };
}
