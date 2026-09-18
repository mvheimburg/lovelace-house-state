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
  @media (max-width: 400px) {
    ha-card {
      padding: 12px;
    }
    .current {
      font-size: 26px;
    }
  }
`;
