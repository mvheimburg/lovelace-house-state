import { css } from "lit";
export const styles = css`
  :host {
    display: block;
    width: 100%;
    box-sizing: border-box;
    color: var(--primary-text-color);
  }
  ha-card {
    box-sizing: border-box;
    width: 100%;
    padding: 18px;
    border-radius: var(--ha-card-border-radius, 12px);
    background: var(--ha-card-background, var(--card-background-color));
  }
  :host([data-appearance="bubble"]) ha-card {
    border-radius: var(--bubble-border-radius, 32px);
    background: var(
      --bubble-main-background-color,
      var(--card-background-color)
    );
    box-shadow: var(--bubble-box-shadow, var(--ha-card-box-shadow));
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
  .title {
    font-size: 18px;
    font-weight: 600;
  }
  .icon {
    display: inline-flex;
    border-radius: 50%;
    text-decoration: none;
    border: 0;
    background: none;
    color: inherit;
    cursor: pointer;
    padding: 8px;
  }
  .segment {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    background: var(--secondary-background-color);
    padding: 4px;
    border-radius: 14px;
    margin-top: 14px;
  }
  .segment button {
    border: 0;
    border-radius: 10px;
    padding: 10px;
    background: transparent;
    color: var(--primary-text-color);
    cursor: pointer;
  }
  .segment button {
    flex: 1 1 96px;
    min-width: 0;
    overflow-wrap: anywhere;
  }
  .segment button.active {
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
  }
  button:disabled,
  select:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .overlay {
    width: 100%;
    margin-top: 12px;
    padding: 9px;
    border: 1px solid var(--divider-color);
    border-radius: 10px;
    background: var(--card-background-color);
    color: inherit;
  }
  .status {
    margin-top: 13px;
    color: var(--secondary-text-color);
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .error {
    display: flex;
    gap: 8px;
    color: var(--error-color);
  }
  .apply {
    margin-top: 12px;
    padding: 10px 14px;
    border: 0;
    border-radius: 10px;
    background: var(--secondary-background-color);
    color: var(--primary-color);
    cursor: pointer;
  }
  button:focus-visible,
  a:focus-visible,
  select:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }
`;
