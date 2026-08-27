# Configuration

Most behavior is controlled from the **Settings** modal (top-right **Settings** button) or the header.

## Server port

- **Default:** `8097`.
- **Where:** Settings → **SERVER** → Port input. Changing it restarts the WebSocket server immediately.
- **Persisted:** to `localStorage` under `rnspyDevtoolsPort` (survives app restarts).
- The header's connection chip always shows the current `ws://host:port` to give clients.

The server binds to `0.0.0.0` (all interfaces) and reports its LAN IPv4 (preferring `192.168.*`, `10.*`, `172.16-31.*`) so physical devices can reach it. It also listens on `localhost` for simulators.

## Hidden request rules

Found in Settings → **HIDDEN REQUEST RULES**.

- Add a rule by typing a **name or URL fragment** (e.g. `telemetry`, `/analytics`) and optionally checking **Related** to hide all requests sharing that fragment.
- Matching rows are hidden from the Network list; the filter bar shows a hidden count (`EyeOff N`).
- Rules persist to `localStorage` under `rnspyDevtoolsHiddenRules`.
- Remove a rule with its trash icon.

You can also add a rule instantly by right-clicking a Network row → **Hide "…"**.

## Project root (for "Open in VS Code")

Settings → **PROJECT ROOT**.

- Set the **absolute path** to your RN project (e.g. `/Users/you/projects/my-rn-app`).
- This lets React Native Spy resolve the relative paths in console stack traces and open the exact file:line in VS Code.
- Requires the **`code`** command-line tool on your `PATH` (VS Code → Command Palette → "Shell Command: Install 'code' command in PATH").
- If a frame can't be resolved, you'll see a toast telling you `code` wasn't found.

## Per-device data

- Captured records (console/network/websocket) are persisted to `sessionStorage` under `rnspyDevtoolsRecords`, **debounced 600ms**, so a window reload keeps your data. They are cleared when you close a device tab or use Reset.
- Server logs (the Logs panel) are a rolling **500-entry** buffer in the main process.

## Caps (to keep the UI fast)

| Bucket | Cap | Behavior at cap |
| ------ | --- | --------------- |
| Console logs / device | 2000 | oldest dropped |
| Network requests / device | 2000 | oldest dropped |
| WebSocket frames / connection | 2000 | oldest dropped |
| Server logs | 500 | oldest dropped |

## Reset

Settings → **DANGER ZONE** → **Reset everything** (confirm). This clears captured data, hidden rules, project root, port setting, and connected-device state, returning everything to defaults. This cannot be undone.

## Storage key reference

| Key | Scope | Holds |
| --- | ----- | ----- |
| `rnspyDevtoolsPort` | localStorage | server port |
| `rnspyDevtoolsHiddenRules` | localStorage | hidden-request rules |
| `rnspyDevtoolsRecords` | sessionStorage | per-device console/network/ws records |
