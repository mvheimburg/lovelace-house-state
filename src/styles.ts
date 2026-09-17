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
  .header,
  .row,
  .dialog-head,
  .dialog-actions {
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
  .segment button,
  .chips button {
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
  .segment button.active,
  .chips button.active {
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
  }
  button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .chips {
    display: flex;
    gap: 6px;
    margin-top: 10px;
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
  dialog {
    color: var(--primary-text-color);
    background: var(--card-background-color);
    border: 0;
    border-radius: 18px;
    padding: 0;
    width: min(680px, calc(100vw - 24px));
    max-height: 90vh;
    box-shadow: 0 12px 40px #0008;
  }
  dialog::backdrop {
    background: #0008;
  }
  .dialog-head {
    position: sticky;
    top: 0;
    background: inherit;
    padding: 16px 20px;
    border-bottom: 1px solid var(--divider-color);
  }
  h2,
  h3 {
    margin: 0;
  }
  .settings {
    padding: 16px 20px;
    overflow: auto;
  }
  .section {
    margin-bottom: 20px;
  }
  .tree-list {
    display: flex;
    flex-direction: column;
    gap: 3px;
    margin-top: 8px;
  }
  .tree-list button {
    display: flex;
    justify-content: space-between;
    border: 0;
    padding-block: 8px;
    background: transparent;
    color: inherit;
    text-align: left;
    border-radius: 8px;
  }
  .tree-list button.active {
    background: var(--secondary-background-color);
  }
  .tree-list small {
    color: var(--secondary-text-color);
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 9px;
  }
  .field {
    display: flex;
    flex-direction: column;
    gap: 5px;
    font-size: 13px;
  }
  .field input,
  .field select {
    padding: 9px;
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    background: var(--secondary-background-color);
    color: inherit;
  }
  .toggle {
    display: flex;
    justify-content: space-between;
    padding: 9px 0;
  }
  .dialog-actions {
    padding: 14px 20px;
    border-top: 1px solid var(--divider-color);
  }
  .primary {
    padding: 10px 14px;
    border: 0;
    border-radius: 10px;
    background: var(--primary-color);
    color: #fff;
  }
  @media (max-width: 500px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }
`;
