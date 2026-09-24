import { colorSchemeStyles } from "./color-schemes";
import { css } from "lit";
export const styles = css`
  :host {
    display: block;
    width: 100%;
    box-sizing: border-box;
    color: var(--primary-text-color);
    --hs-text: var(--primary-text-color, #1b1b1a);
    --hs-muted: var(--secondary-text-color, #5b5a55);
    --hs-home: var(--success-color, #2e7d32);
    --hs-away: var(--warning-color, #f59e0b);
    --hs-vacation: var(--orange-color, #ea580c);
    --hs-neutral: var(--primary-color, #03a9f4);
    --hs-overlay: var(--warning-color, #f59e0b);
    --hs-error: var(--error-color, #c62828);
    --hs-surface: var(--ha-card-background, var(--card-background-color, #fff));
    --hs-pill: var(--secondary-background-color, #f3f2ee);
    --hs-radius: 20px;
    --hs-tile: 16px;
    /* The shared history view in House State's colours. */
    --history-series-0: var(--hs-neutral);
    --history-series-1: var(--hs-away);
    --history-series-2: var(--hs-home);
    --history-series-3: var(--purple-color, #8e44ad);
    --history-series-4: var(--hs-vacation);
    --history-text: var(--hs-text);
    --history-muted: var(--hs-muted);
    --history-surface: var(--hs-surface);
    --history-pill: var(--hs-pill);
    --history-accent: var(--hs-neutral);
    --history-tile: var(--hs-tile);
    --history-radius: 24px;
  }
  :host([data-appearance="bubble"]) {
    --hs-surface: var(
      --bubble-main-background-color,
      var(--ha-card-background, var(--card-background-color, #fff))
    );
    --hs-pill: var(
      --bubble-secondary-background-color,
      var(--secondary-background-color, #f3f2ee)
    );
    --hs-radius: var(--bubble-border-radius, 32px);
    --hs-tile: var(--bubble-sub-button-border-radius, 22px);
  }
  * {
    box-sizing: border-box;
  }
  ha-card {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    border-radius: var(--ha-card-border-radius, 16px);
    background: var(--hs-surface);
    --accent: var(--hs-neutral);
  }
  :host([data-appearance="bubble"]) ha-card {
    border: var(--bubble-border, none);
    border-radius: var(--bubble-border-radius, 32px);
    box-shadow: var(--bubble-box-shadow, var(--ha-card-box-shadow));
  }
  ha-card.tone-home {
    --accent: var(--hs-home);
  }
  ha-card.tone-away {
    --accent: var(--hs-away);
  }
  ha-card.tone-vacation {
    --accent: var(--hs-vacation);
  }
  .i {
    width: 22px;
    height: 22px;
    flex-shrink: 0;
  }
  .i.s {
    width: 18px;
    height: 18px;
  }
  .spin {
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .spin {
      animation: none;
    }
  }
  .circ {
    flex: 0 0 44px;
    width: 44px;
    height: 44px;
    border-radius: var(--bubble-icon-border-radius, 50%);
    display: grid;
    place-items: center;
    color: color-mix(in srgb, var(--accent) 75%, var(--hs-text));
    background: color-mix(in srgb, var(--accent) 20%, transparent);
  }
  .circ.big {
    flex-basis: 52px;
    width: 52px;
    height: 52px;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding-left: 8px;
  }
  .title {
    font-size: 17px;
    font-weight: 700;
    color: var(--hs-muted);
  }
  .icon {
    width: 44px;
    height: 44px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    color: var(--hs-muted);
    background: var(--hs-pill);
    text-decoration: none;
  }
  .hero {
    display: flex;
    gap: 14px;
    align-items: center;
    padding: 14px;
    border-radius: var(--hs-radius);
    background: var(--hs-pill);
  }
  .hero-text {
    min-width: 0;
    flex: 1;
  }
  .status {
    font-size: 13px;
    font-weight: 600;
    color: color-mix(in srgb, var(--accent) 65%, var(--hs-text));
  }
  .current {
    font-size: 32px;
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.01em;
    overflow-wrap: anywhere;
  }
  .context {
    font-size: 13px;
    color: var(--hs-muted);
    overflow-wrap: anywhere;
  }
  .segment {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .sublevels {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 6px;
    border-radius: calc(var(--hs-radius) - 2px);
    background: color-mix(in srgb, var(--hs-text) 5%, transparent);
  }
  .pill {
    flex: 1 1 90px;
    min-width: 0;
    min-height: 48px;
    border: 0;
    border-radius: 24px;
    padding: 0 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font: inherit;
    font-weight: 600;
    color: var(--hs-text);
    background: var(--hs-pill);
    cursor: pointer;
    overflow-wrap: anywhere;
  }
  .sub .pill {
    min-height: 44px;
  }
  .pill.active {
    color: color-mix(in srgb, var(--accent) 65%, var(--hs-text));
    background: color-mix(in srgb, var(--accent) 22%, var(--hs-pill));
  }
  /* Darkened so white text keeps 4.5:1 on amber and green alike. */
  .pill.leaf {
    color: #fff;
    background: color-mix(in srgb, var(--accent) 62%, #000);
  }
  .pill.confirming {
    box-shadow: inset 0 0 0 2px var(--hs-vacation);
  }
  .confirm {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 18px;
    border-radius: var(--hs-radius);
    background: color-mix(in srgb, var(--hs-vacation) 18%, var(--hs-pill));
    --accent: var(--hs-vacation);
  }
  .confirm-head {
    display: flex;
    gap: 14px;
    align-items: center;
  }
  .confirm-title {
    font-size: 22px;
    font-weight: 800;
  }
  .effects {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-size: 15px;
  }
  .effects li {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  .effects .i {
    color: color-mix(in srgb, var(--hs-vacation) 75%, var(--hs-text));
  }
  .confirm-actions {
    display: flex;
    gap: 8px;
  }
  .confirm .pill {
    background: var(--hs-surface);
  }
  .confirm .pill.strong {
    font-weight: 800;
    color: #fff;
    background: color-mix(in srgb, var(--hs-vacation) 62%, #000);
  }
  .panel {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 14px;
    border-radius: var(--hs-radius);
    background: var(--hs-pill);
    --accent: var(--hs-muted);
  }
  .panel summary {
    list-style: none;
    cursor: pointer;
    border-radius: calc(var(--hs-radius) - 6px);
  }
  .panel summary::-webkit-details-marker {
    display: none;
  }
  .panel-text {
    flex: 1;
    min-width: 0;
  }
  .chevron {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    color: var(--hs-muted);
    transition: transform 0.2s;
  }
  details[open] .chevron {
    transform: rotate(180deg);
  }
  details:not([open]) {
    gap: 0;
  }
  .panel.on {
    --accent: var(--hs-overlay);
  }
  .panel-head {
    display: flex;
    gap: 14px;
    align-items: center;
  }
  .caption {
    font-size: 13px;
    font-weight: 600;
    color: color-mix(in srgb, var(--accent) 65%, var(--hs-text));
  }
  .panel-value {
    font-size: 22px;
    font-weight: 800;
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .chip {
    min-height: 40px;
    border: 0;
    border-radius: 20px;
    padding: 0 14px;
    font: inherit;
    font-weight: 600;
    font-size: 14px;
    color: var(--hs-text);
    background: color-mix(in srgb, var(--hs-text) 7%, transparent);
    cursor: pointer;
  }
  .chip.active {
    color: color-mix(in srgb, var(--accent) 65%, var(--hs-text));
    background: color-mix(in srgb, var(--accent) 24%, transparent);
    box-shadow: inset 0 0 0 1.5px
      color-mix(in srgb, var(--accent) 60%, transparent);
  }
  .apply {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 10px 18px 10px 10px;
    border: 0;
    border-radius: var(--hs-radius);
    text-align: left;
    font: inherit;
    color: var(--hs-text);
    background: var(--hs-pill);
    cursor: pointer;
    --accent: var(--hs-muted);
  }
  .apply.attention {
    --accent: var(--hs-away);
  }
  .apply-text {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .apply-title {
    font-size: 16px;
    font-weight: 700;
  }
  .apply-hint {
    font-size: 13px;
    color: color-mix(in srgb, var(--accent) 65%, var(--hs-text));
  }
  .feedback {
    display: flex;
    gap: 14px;
    align-items: center;
    padding: 10px 16px 10px 10px;
    border-radius: var(--hs-radius);
    background: var(--hs-pill);
    --accent: var(--hs-muted);
  }
  .feedback.failed {
    --accent: var(--hs-error);
    background: color-mix(in srgb, var(--hs-error) 16%, var(--hs-pill));
  }
  .feedback-title {
    font-size: 15px;
    font-weight: 700;
    overflow-wrap: anywhere;
  }
  .feedback-sub {
    font-size: 13px;
    color: var(--hs-muted);
  }
  .note {
    display: flex;
    gap: 8px;
    align-items: center;
    font-size: 14px;
    padding: 12px 14px;
    border-radius: var(--hs-tile);
    background: color-mix(in srgb, var(--hs-muted) 14%, var(--hs-pill));
  }
  .note.warn {
    background: color-mix(in srgb, var(--hs-error) 16%, var(--hs-pill));
  }
  .error {
    display: flex;
    gap: 8px;
    padding: 0 8px 8px;
    color: var(--error-color);
  }
  button:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
  button:focus-visible,
  a:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }
  /* Outside: weather and sensors at the top of the card. */
  .outside {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .weather {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 10px 14px 10px 10px;
    border: 0;
    border-radius: var(--hs-radius);
    font: inherit;
    text-align: left;
    color: var(--hs-text);
    background: var(--hs-pill);
    cursor: pointer;
  }
  .weather.missing {
    display: block;
    font-size: 14px;
    color: var(--hs-muted);
  }
  .wx-icon {
    display: grid;
    place-items: center;
    color: var(--wx, var(--hs-muted));
  }
  .wx-sun {
    --wx: var(--amber-color, #f59e0b);
  }
  .wx-storm {
    --wx: var(--amber-color, #f59e0b);
  }
  .wx-rain {
    --wx: var(--blue-color, #3b82f6);
  }
  .wx-snow {
    --wx: var(--light-blue-color, #38bdf8);
  }
  .wx-night {
    --wx: var(--indigo-color, #6366f1);
  }
  .wx-alert {
    --wx: var(--hs-error);
  }
  .weather .i.wx {
    width: 44px;
    height: 44px;
    stroke-width: 1.6;
  }
  .wx-text,
  .wx-temps {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .wx-temps {
    align-items: flex-end;
    text-align: right;
  }
  .wx-condition {
    font-size: 20px;
    font-weight: 700;
    overflow-wrap: anywhere;
  }
  .wx-place,
  .wx-range {
    font-size: 13px;
    color: var(--hs-muted);
    font-variant-numeric: tabular-nums;
  }
  .wx-now {
    font-size: 22px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
  .forecast {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(52px, 1fr));
    gap: 4px;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .day {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    font-variant-numeric: tabular-nums;
  }
  .day-name,
  .day-low {
    color: var(--hs-muted);
  }
  .day-high {
    font-weight: 600;
  }
  .sensors {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(96px, 1fr));
    gap: 8px;
  }
  .sensor {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    min-height: 44px;
    padding: 10px 8px;
    border: 0;
    border-radius: var(--hs-tile);
    font: inherit;
    color: var(--hs-text);
    background: var(--hs-pill);
    cursor: pointer;
  }
  .sensor-icon {
    position: relative;
    display: grid;
    place-items: center;
    min-height: 24px;
    color: var(--state-icon-color, var(--hs-muted));
  }
  .badge {
    position: absolute;
    top: -6px;
    right: -12px;
    width: 16px;
    height: 16px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    font-size: 11px;
    font-weight: 800;
    color: #fff;
    background: var(--hs-vacation);
  }
  .sensor-name {
    font-size: 14px;
    font-weight: 700;
    overflow-wrap: anywhere;
  }
  .sensor-value {
    font-size: 13px;
    color: var(--hs-muted);
    font-variant-numeric: tabular-nums;
  }
  @media (max-width: 400px) {
    ha-card {
      padding: 12px;
    }
    .wx-condition {
      font-size: 17px;
    }
    .current {
      font-size: 26px;
    }
  }
  ${colorSchemeStyles}
`;
