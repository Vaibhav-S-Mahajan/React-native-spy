# Features Walkthrough

React Native Spy has four main panels plus per-device tabs. All data is grouped per device; switch devices with the tabs under the top bar.

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

**Right-click a row** for: copy request details, copy as cURL (bash/PowerShell), copy as fetch/Node fetch/Axios/HTTPie/raw HTTP, copy URL/query params/headers/body, export as HAR, and **hide** requests by name or by all related requests.

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

## Logs panel

Server-side activity: client connect/disconnect, server start/stop, errors. Levels (info/warn/error) are filterable; **Clear** wipes the buffer. Buffer capped at **500 entries**.

## Multi-device

Every event is tagged with the sending device and bucketed into its own tab, so you can debug several simulators/phones side by side without mixing data.
