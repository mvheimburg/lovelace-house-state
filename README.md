# House State Card

A compact Home Assistant card for the [`house_state`](https://github.com/mvheimburg/house-state) integration. It renders any configured state tree, selects independent overlays, and keeps everyday controls on the dashboard.

![House State card showing a custom four-level state tree and a Winter lights overlay](images/state-tree.png)

Example with a custom state tree in Bubble appearance.

## Install

Add this repository to HACS as a **Dashboard** repository, install it, and refresh the browser. For manual installation, copy `dist/lovelace-house-state-card.js` to `www/` and register it as a JavaScript module resource.

## Configuration

```yaml
type: custom:lovelace-house-state-card
entity: sensor.house_state
name: Huset
appearance: bubble # default or bubble
show_overlay: true
confirm_vacation: true
```

All card display options are available in the Lovelace visual editor. The integration starts with a Home/Day/Activity example, but none of those names or levels are special.

**House State integration 0.3.0 or later is required for the central configuration flow.** Open **Settings → Devices & services → House State → Configure** to manage the state tree, scenes, default children, occupancy, automation roles, overlays and activation rules, door/gate/person entities, automatic return/away, grace period, night schedule and legacy mirrors through the integration's structured forms. The card's settings cog is a native link to the House State integration page, including while the sensor is unavailable.

The dashboard card contains state selection, optional overlay selection, status, vacation confirmation and **Apply scene now**. That action calls `house_state.apply_scene` with `force: true` to resynchronize devices. The card no longer edits integration configuration or calls `house_state.set_config`. During an integration reload it retains the last valid display with actions disabled; refreshed sensor data restores the controls. State, overlay and scene actions are also disabled while a request is pending.

State changes call `house_state.set` with `{state, reason: user}`. Overlay changes use `{overlay, reason: user}`. The card reads `active_path`, `state_tree`, `overlays`, `overlay_choice`, `overlay_rule`, `overlay_hold_until`, and `config` from the hub sensor.

## Date-driven overlays

Overlays can turn themselves on. In the integration’s **Configure** flow, each overlay has activation settings: manual only, a calendar entity (with an optional summary match), fixed `MM-DD` dates, an offset window around Easter, or an nth weekday counted within a month or before an anchor date — which is how Advent works, being the fourth Sunday before 25 December rather than a fixed Sunday of December. A rule can be limited to when someone is home, to particular states, and given a priority that decides overlapping windows.

The overlay picker on the card then shows **Automatic** alongside the overlay the rules currently pick. Choosing an overlay by hand, or **Off**, outranks the rules until the start of the next local day, and the status line shows when that hold expires. Choosing **Automatic** hands the axis straight back.

The card displays and selects the configured overlays; activation rules are edited centrally in the integration.

The card and visual editor follow Home Assistant's UI language (`hass.language`, with `hass.locale.language` as a fallback). Bokmål is supported for `nb`, `nb-NO` and the Norwegian aliases `no`/`nn`; case and underscore variants are accepted. Other languages fall back to English. Changing language updates the card without changing service IDs, configuration keys or saved settings.

Unmodified starter names such as Home/Day/Away and Christmas display as Hjemme/Dag/Borte and Jul in Bokmål. Custom state, overlay and card names stay exactly as entered. Integration-provided error details retain their original wording. Regional clock formats such as `en-GB` are preserved separately from the English/Bokmål label dictionaries.

Bubble appearance uses the dashboard's `--bubble-*` variables.

## Development

```sh
npm ci
npm test
npm run lint
npm run typecheck
npm run build
```

Version 0.3.0.
