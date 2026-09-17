# House State Card

A compact Home Assistant card for the [`house_state`](https://github.com/mvheimburg/house-state) integration. It renders any configured state tree, manages independent overlays, and exposes the integration's runtime settings.

## Install

Add this repository to HACS as a **Dashboard** repository, install it, and refresh the browser. For manual installation, copy `dist/lovelace-house-state-card.js` to `www/` and register it as a JavaScript module resource.

## Configuration

```yaml
type: custom:lovelace-house-state-card
entity: sensor.house_state
name: Huset
appearance: bubble       # default or bubble
show_overlay: true
confirm_vacation: true
```

All card options are available in the visual editor. The integration starts with a Home/Day/Activity example, but none of those names or levels are special. In the settings dialog you can add roots or children, rename and reparent states, choose a scene and default child, and say whether each branch means someone is home. Automation roles point arrival, departure, vacation and night behavior at whichever nodes you choose.

Tree changes stay in a local draft until **Save** sends `state_tree`, `roles`, `initial_state`, and `overlays` together. Removing a node removes its descendants after confirmation and clears references to them. The dialog also configures custom overlays, door/gate/person entities, return and away automation, the grace period, and the night schedule. **Apply scene now** calls `house_state.apply_scene` with `force: true` to resynchronize devices.

State changes call `house_state.set` with `{state, reason: user}`. Overlay changes use `{overlay, reason: user}`. The card reads `active_path`, `state_tree`, `overlays`, and `config` from the hub sensor.

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
