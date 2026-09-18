import type { HomeAssistant } from "./types";

const en = {
  settings: "Settings",
  off: "Off",
  apply: "Apply scene now",
  name: "Name",
  overlays: "Overlays",
  vacationTitle: "Switch to {name}?",
  vacationWater: "The water is shut off: {valves}",
  vacationGuest: "A guest visit opens the water while it lasts",
  vacationButton: "Switch to {name}",
  cancel: "Cancel",
  changedAgo: "{reason} {duration} ago",
  someoneHome: "someone is home",
  nobodyHome: "nobody is home",
  guestUntil: "guest until {time}",
  guestIn: "guest visit",
  noRule: "no rule applies now",
  manualChoice: "Chosen manually",
  applyStale: "{name}: the scene has not run yet",
  applyPending: "Waiting to run the scene",
  applyHint: "Run the scenes again",
  switching: "Switching to {name}…",
  applying: "Running the scene…",
  changingOverlay: "Changing the overlay…",
  locked: "Controls are locked until the house responds",
  stillSelected: "{name} is still selected",
  waterFailed: "Water valve problem: {valves}",
  reloading: "Reloading · last known state, controls are off",
  missing: "Entity not found",
  automatic: "Automatic",
  heldUntil: "manual until",
  reason: {
    user: "changed manually",
    door: "door unlocked",
    gate: "gate opened",
    presence: "presence",
    schedule: "schedule",
    service: "service",
  },
  title: "House State",
  appearance: "Appearance",
  defaultAppearance: "Default",
  entityLabel: "House State entity",
  showOverlay: "Show overlay",
  confirmVacation: "Confirm vacation",
  errorPrefix: "Could not update house state",
  entityRequired: "You must define an entity",
  durationDay: "d",
  durationHour: "h",
  durationMinute: "min",
  starterStates: {
    home: "Home",
    day: "Day",
    idle: "None",
    tv: "TV",
    eating: "Eating",
    night: "Night",
    away: "Away",
    vacation: "Vacation",
  },
  starterOverlays: {
    christmas: "Christmas",
    halloween: "Halloween",
    party: "Party",
  },
};
const nb: typeof en = {
  settings: "Innstillinger",
  off: "Av",
  apply: "Bruk scene nå",
  name: "Navn",
  overlays: "Overlegg",
  vacationTitle: "Bytte til {name}?",
  vacationWater: "Vannet stenges: {valves}",
  vacationGuest: "Et gjestebesøk åpner vannet mens det varer",
  vacationButton: "Bytt til {name}",
  cancel: "Avbryt",
  changedAgo: "{reason} for {duration} siden",
  someoneHome: "noen er hjemme",
  nobodyHome: "ingen er hjemme",
  guestUntil: "gjest til {time}",
  guestIn: "gjestebesøk",
  noRule: "ingen regel gjelder nå",
  manualChoice: "Valgt manuelt",
  applyStale: "{name}: scenen er ikke kjørt ennå",
  applyPending: "Venter på å kjøre scenen",
  applyHint: "Kjør scenene på nytt",
  switching: "Bytter til {name} …",
  applying: "Kjører scenen …",
  changingOverlay: "Endrer overlegg …",
  locked: "Knappene er låst til huset svarer",
  stillSelected: "{name} er fortsatt valgt",
  waterFailed: "Problem med vannventil: {valves}",
  reloading: "Laster på nytt · siste kjente tilstand, knappene er av",
  missing: "Fant ikke entiteten",
  automatic: "Automatisk",
  heldUntil: "manuelt til",
  reason: {
    user: "endret manuelt",
    door: "låst opp dør",
    gate: "åpnet port",
    presence: "tilstedeværelse",
    schedule: "tidsplan",
    service: "tjeneste",
  },
  title: "Hustilstand",
  appearance: "Utseende",
  defaultAppearance: "Standard",
  entityLabel: "Hustilstandsentitet",
  showOverlay: "Vis overlegg",
  confirmVacation: "Bekreft ferie",
  errorPrefix: "Kunne ikke oppdatere hustilstanden",
  entityRequired: "Du må angi en entitet",
  durationDay: "d",
  durationHour: "t",
  durationMinute: "min",
  starterStates: {
    home: "Hjemme",
    day: "Dag",
    idle: "Ingen",
    tv: "TV",
    eating: "Spiser",
    night: "Natt",
    away: "Borte",
    vacation: "Ferie",
  },
  starterOverlays: { christmas: "Jul", halloween: "Halloween", party: "Fest" },
};

/** UI language is independent of service tokens and the language of source code. */
export function language(
  hass?: Pick<HomeAssistant, "language" | "locale">,
): "nb" | "en" {
  const value = (hass?.language || hass?.locale?.language || "en")
    .toLowerCase()
    .replace(/_/g, "-");
  return /^(nb|no|nn)(-|$)/.test(value) ? "nb" : "en";
}
/** Keep regional clock conventions separate from the available translations. */
export function formattingLocale(
  hass?: Pick<HomeAssistant, "language" | "locale">,
): string {
  const requested = (hass?.language || hass?.locale?.language || "en")
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/^(no|nn)(-|$)/, "nb$2");
  try {
    return Intl.getCanonicalLocales(requested)[0] || "en";
  } catch {
    return "en";
  }
}
export function localize(
  hass?: Pick<HomeAssistant, "language" | "locale">,
): typeof en {
  return language(hass) === "nb" ? nb : en;
}
/** Only the integration's unmodified starter names are display translations. */
export function displayName(
  hass: HomeAssistant | undefined,
  item: { id: string; name: string },
  kind: "starterStates" | "starterOverlays",
): string {
  const defaults: Record<string, string> = en[kind];
  const translated: Record<string, string> = localize(hass)[kind];
  return defaults[item.id] === item.name ? translated[item.id] : item.name;
}

/** Fill `{name}` placeholders in a dictionary string. */
export function fill(text: string, values: Record<string, string>): string {
  return text.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
}
