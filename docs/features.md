# Features Walkthrough

React Native Spy has six panels plus per-device tabs: **Network**, **WebSocket**, **Console**, **Storage**, **WatermelonDB** and **Logs**. All data is grouped per device; switch devices with the tabs under the top bar.

## Top bar

- **Logo + name** — React Native Spy.
- **Status pill** — green (connected), yellow (waiting), red (offline) with a live client count.
- **Connection chip** (`ws://host:port`) — click to copy the exact URL a client should connect to.
- **Settings** — opens the settings modal (see [Configuration](./configuration.md)).

## Device tabs

One tab per connected (or previously connected) device.

- **Online dot** — green when the device's socket is live, gray when disconnected.
- **Name** — from the client's `hello` frame (falls back to device model / `rn-xxxx`).
- **Count badge** — number of captured network requests for that device.
- **Reload** (online only) — tells the app to fast-refresh via RN `DevSettings`.
- **Clear** — clears the **current panel's** data for that device (eraser icon).
- **Close** — removes the device tab and all its captured data (`X` icon).

## Network panel

A virtualized list of HTTP requests (from `fetch` and `XMLHttpRequest`), newest first.

**Columns:** Method · URL (path + query) · Status · Size · Time.

- **Status colors:** green 2xx, blue 3xx, amber 4xx, red 5xx/0, gray while pending (animated `…`).
- **Method colors:** GET green, POST amber, PUT/PATCH purple, DELETE red.
- **Filter bar:** type to filter by URL or method; a hidden-request count shows how many rows are suppressed by your rules.

**Detail pane** (opens on row click, drag the divider to resize):

| Sub-tab | Contents |
| ------- | -------- |
| Headers | General (URL/method/status/size/duration) + request & response headers |
| Payload | Request body (pretty-printed JSON/XML/text) |
| Response | Response body (pretty-printed) |
| Timing | Start time + duration bar |

**Right-click a row** for: copy request details, copy as cURL (bash/PowerShell), copy as fetch/Node fetch/Axios/HTTPie/raw HTTP, copy URL/query params/request & response headers/request & response body, export as a HAR entry or all headers as JSON, and **hide** requests by name or by all related requests.

Records are capped at **2000 per device** (oldest dropped).

## WebSocket panel

Two columns: a **connections** list (left, resizable) and a **frame stream** (right).

- Each connection shows its URL, status (Connected / Closed / Error), and frame count.
- The frame stream shows each message with a direction arrow: **up** = send (green tint), **down** = receive (blue). Each row shows time, payload (pretty-printed, multi-frame messages joined with ` | `), and size.
- **Hide pings** checkbox filters out common heartbeat frames (`{"type":6}`, `{}`).
- Filter box searches frame payloads.

Connection frames are capped at **2000 per connection**.

## Console panel

A virtualized, color-coded log stream.

- **Level chips** (log / info / warn / error / debug) toggle visibility and show per-level counts.
- Each row: level tag · timestamp · message · **caller badge** (e.g. `App.tsx:42`) on the right.
- Click a **caller badge** (or right-click → "Open in VS Code") to jump straight to the source file:line — requires the **Project Root** set in Settings and the `code` CLI on your `PATH` (see [Configuration](./configuration.md)).
- **Search** filters by message text.
- Right-click for copy (message / pretty / with timestamp), copy caller path, and "open in VS Code" entries extracted from the message text.

Logs are capped at **2000 per device**.

## Storage panel

Browse and edit the connected device's key-value stores from the desktop.

- **Backend tabs** — one per store the SDK found: AsyncStorage (a single store) plus every MMKV instance your app creates. MMKV instances are auto-detected by wrapping the `MMKV` constructor, so any `new MMKV()` in app code shows up here.
- **Filter box** searches keys and values.
- **Add a key** with the `+` button, or click any row to **edit it inline**. Values carry an explicit type (string / number / boolean / object), colour-coded by a type badge; numbers and booleans are validated before the write is sent, and JSON-looking strings are parsed-checked.
- **Remove a key** with the trash icon.
- **Auto-refresh** (on by default) re-reads the store every 2s while the tab is open, so the table tracks what your app writes.

Writes are sent to the device over the same socket, so the app sees them immediately. Editing requires the device to be **online**.

## WatermelonDB panel

Inspect a local WatermelonDB database without a SQLite client.

- **Table list** on the left with a row count per table. The largest table is selected by default.
- **Row grid** on the right, with columns from the table schema.
- **Filter rows** searches the currently loaded window (not the whole table).
- **Infinite scroll** loads 50 rows at a time; the footer shows `loaded / total` and a **Load more** button.
- **Auto-refresh** (on by default) re-reads every 3s.

**Read-only by design** — inspection can never corrupt local state.

## Logs panel

Server-side activity: client connect/disconnect, server start/stop, errors. Levels (info/warn/error) are filterable; **Clear** wipes the buffer. Buffer capped at **500 entries**.

## Multi-device

Every event is tagged with the sending device and bucketed into its own tab, so you can debug several simulators/phones side by side without mixing data.
