# Features Walkthrough

React Native Spy has seven panels plus per-device tabs: **Network**, **WebSocket**, **Console**, **Storage**, **WatermelonDB**, **Navigation** and **Logs**. All data is grouped per device; switch devices with the tabs under the top bar.

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

## Navigation panel

Which screen the app is on, how it got there, and where that screen lives in your code.

- **Current screen** — the focused navigator path as a breadcrumb (`Root › Tabs › ProductDetail`), nested navigators included. The focused route is highlighted.
- **Route history** — a virtualized timeline of every route change, oldest first, with the route it came from and its params. Click a row to inspect its params, double-click to open the screen's file.
- **Open in VS Code** — click any route name (in the breadcrumb or the timeline) and the screen's source file opens. This needs a **connected project folder** (top bar → **Project**); without one you get a prompt to set it up.
- **Params** — the selected (or focused) route's params, pretty-printed. Payloads over 4 KB are reported by size rather than sent.
- **Auto** (on by default) re-syncs every 5s. Route changes always arrive live and push instantly; the poll only covers a change that happened while the socket was down.
- **Clear** wipes the timeline, not the current stack — the stack is live device state, not a captured record. History capped at **500 entries** per device.

**Read-only by design** — the panel observes navigation, it never drives it, so inspecting can't put your app in a state its own flow wouldn't produce.

### How a route becomes a file

React Navigation only knows route *names*, never file paths. Rather than guessing from file names, the resolver reads what your app itself declares, in four tiers — strongest first, each falling through only when it has no confident answer:

| Tier | Evidence | Example |
| ---- | -------- | ------- |
| **Screen registration** | `<Stack.Screen name="X" component={Y} />` pairs the route with a component, and that file's imports say where `Y` lives | `name="MyActions"` → `component={MyActions}` → `import MyActions from './src/app/screens/Actions/MyActions'` |
| **Import map** | The component name the SDK captured at runtime, looked up across every import in the project | `MainChat` → `src/app/screens/Chat/MainChat/index.js` |
| **Declaration** | A file that declares or default-exports a component of that name | `function CheckoutFlow()` |
| **File name** | Path scoring, including the `Name/index.js` layout | `ProductDetail/index.js` |

Import specifiers are resolved the way Metro does — extension probing plus directory → `index.js` — which is what makes the very common `Screens/Something/index.js` layout resolve correctly instead of landing on one of the dozens of identically-named `index.js` files.

The file opens at the **component's declaration line**, not line 1.

Two deliberate refusals:

- Route names that don't look like component names (tab icon names like `fire` or `reorder-horizontal`, which legitimately appear in `name=` props) are never filename- or content-matched. They report "no screen file found" rather than confidently opening your navigator file.
- A route whose component isn't imported anywhere reports not-found instead of a plausible-looking guess.

`node_modules`, `ios`, `android` and build output are never searched. When two files are equally strong candidates the best one opens and a toast reports how many matched; when the match came from file-name scoring alone the toast says it was a guess.

**React Navigation only.** Expo Router builds its own navigation container internally, so it isn't supported — the panel says so rather than showing an empty stack.

## Logs panel

Server-side activity: client connect/disconnect, server start/stop, errors. Levels (info/warn/error) are filterable; **Clear** wipes the buffer. Buffer capped at **500 entries**.

## Multi-device

Every event is tagged with the sending device and bucketed into its own tab, so you can debug several simulators/phones side by side without mixing data.
