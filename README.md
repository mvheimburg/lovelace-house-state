# House State Card

A compact Home Assistant card for the [`house_state`](https://github.com/mvheimburg/house-state) integration. It keeps presence and day/night controls in a stable layout, shows activities only during day mode, manages seasonal overlays, and exposes all runtime integration settings.

## Install

Add this repository to HACS as a **Dashboard** repository, install it, and refresh the browser. For manual installation, copy `dist/lovelace-house-state-card.js` to `www/` and register it as a JavaScript module resource.

## Configuration

```yaml
type: custom:lovelace-house-state-card
entity: sensor.house_state
name: Huset
appearance: bubble       # default or bubble
show_activity: true
show_overlay: true
confirm_vacation: true
```

All options are available in the visual editor. The settings dialog edits scene mappings, door/gate/person entities, return and away automation, the grace period, and fixed or sun-based night schedules. **Apply scene now** calls `house_state.apply_scene` with `force: true` to resynchronize devices.

The UI follows Home Assistant's English or Norwegian locale. Bubble appearance uses the dashboard's `--bubble-*` variables.

## Development

```sh
npm ci
npm test
npm run lint
npm run typecheck
npm run build
```

Version 0.1.0.
