<img src="images/icon.png" alt="" width="96" align="right">

# House State Card

A compact Home Assistant card for the [`house_state`](https://github.com/mvheimburg/house-state) integration. It renders any configured state tree, selects independent overlays, and keeps everyday controls on the dashboard.

![House State card in Bubble appearance on a dark theme: a normal evening with a pending Christmas scene, and the in-card vacation confirmation](images/bubble-night.png)

![The same card on a light theme, and while a state change is pending](images/light.png)

The images use the production bundle with simulated Home Assistant states.

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

**House State integration 0.3.0 or later is required for the central configuration flow.** Open **Settings → Devices & services → House State → Configure** to manage the state tree, scenes, default children, occupancy, automation roles, overlays and activation rules, door/gate/person entities, automatic return/away, grace period, night schedule and legacy mirrors through the integration's structured forms. The card's settings cog opens the **House State** configuration panel (integration 0.6.0 or later, administrators), which shows the whole setup at once; otherwise it links to the House State integration page. It works while the sensor is unavailable too.

The dashboard card contains status, state selection, optional overlay selection, vacation confirmation and **Apply scene now**.

### What the card shows (0.4.0)

- **Status first.** The current state in large type with why and when it changed ("Changed manually 1 h 12 min ago"), the path through the tree, whether someone is home, and an active guest visit with its end time. The card's colour follows the house: occupied, away, or in the vacation role's branch.
- **States as pills.** The top level is one row; deeper levels sit together below it. The path in force is tinted and the current state is filled. The integration's starter states (Home, Day, TV, Eating, Night, Away, Vacation) get icons; custom states show their names only.
- **Overlay.** Folded by default into one row: the overlay in force and why (Automatic with the rule that picked it, or chosen manually and until when). Tap it to show one chip per choice (0.4.1).
- **Vacation confirmation inside the card.** Choosing a state in the vacation role's branch opens a panel naming the state and, when water valves are configured, that the water is shut off and that a guest visit opens it again. Nothing is sent until you confirm.
- **Apply scene now** says when the selected scene has not run yet (`scene_stale`) or is waiting to run (`application_pending`).
- **Feedback.** While a request is pending the card says what it is doing and locks its controls; a failure stays visible in the card (and as a Home Assistant notification) with the state that is still selected. A water valve House State could not move is reported. That action calls `house_state.apply_scene` with `force: true` to resynchronize devices. The card no longer edits integration configuration or calls `house_state.set_config`. During an integration reload it retains the last valid display with actions disabled; refreshed sensor data restores the controls. State, overlay and scene actions are also disabled while a request is pending.

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
node scripts/screenshot.cjs
```

Version 0.4.0.

## Color schemes

Choose **Color scheme** in the card's visual editor. The setting is per card and
works with both **Default** and **Bubble** appearance, including in-card dialogs.
Every card supplied by this package offers the same choices:

| Scheme | YAML value | Palette |
| --- | --- | --- |
| Home Assistant (default) | `home-assistant` | Follows your dashboard theme and Bubble color variables |
| Bright | `bright` | White surfaces with blue accents |
| Warm | `warm` | Ivory surfaces with warm brown accents |
| Mint | `mint` | Pale green surfaces with green accents |
| Sky | `sky` | Pale blue surfaces with blue accents |
| Lavender | `lavender` | Pale purple surfaces with purple accents |

For example, add these options to your existing card configuration:

```yaml
appearance: bubble
color_scheme: mint
```

The five light schemes stay light even on a dark dashboard and override inherited
colors only within this card. Status colors retain their meaning (green for
success, amber for warnings and red for errors). Remove `color_scheme` or choose
**Home Assistant** to follow the dashboard again. Existing configurations keep
their current appearance. Scheme names and the editor label support English and
Norwegian Bokmål; YAML values remain unchanged in either language. Static
card-picker metadata remains English because it has no Home Assistant language
context.
