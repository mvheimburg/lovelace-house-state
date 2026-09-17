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
  show_activity?: boolean;
  show_overlay?: boolean;
  confirm_vacation?: boolean;
}
export type Schedule = {
  type: "off" | "fixed" | "sun";
  time?: string;
  event?: "sunset" | "sunrise";
  offset?: number;
};
export interface RuntimeConfig {
  door_entities: string[];
  gate_entities: string[];
  person_entities: string[];
  scene_map: Record<string, string>;
  auto_return: boolean;
  auto_away: boolean;
  auto_away_grace: number;
  night_schedule: Schedule;
  legacy_mirror?: Record<string, string>;
}
