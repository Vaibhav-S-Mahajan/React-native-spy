# Getting Started

This guide takes you from a fresh clone to a connected React Native app, step by step.

## 1. Prerequisites

- **Node.js 18+** (check with `node -v`)
- **npm** (ships with Node) or your preferred package manager
- A **React Native** app to debug (bare RN or Expo both work)
- The machine running React Native Spy and the device/simulator must be on the **same network** when debugging a physical device

## 2. Install dependencies

```bash
git clone <your-repo-url> react-native-spy
cd react-native-spy
npm install
```

`npm install` also runs the `postinstall` script (`electron-builder install-app-deps`), which prepares native Electron dependencies. On a clean machine this can take a minute.

## 3. Run in development mode

```bash
npm run dev
```

This starts the app via `electron-vite` with hot reload. A window opens:

1. The app launches on the **React Native Spy** route.
2. The WebSocket server starts automatically on `ws://0.0.0.0:8097` (and `ws://localhost:8097`).
3. The header shows a status pill:
   - **green / "N connected"** — at least one RN app is connected
   - **yellow / "Waiting"** — server is up, no client yet
   - **red / "Offline"** — server is not running

## 4. Connect your React Native app

There are two ways to do this. **Automatic** is recommended — the app writes the integration for you. **Manual** is the copy/paste path, kept for cases where you'd rather not let the app touch your repo.

### Option A — Automatic setup (recommended)

1. Click **Project** (folder icon) in the header, or **Set it up for me** in the "Connect your app" empty state.
2. Click **Browse…** and select the folder containing your app's `package.json`.
3. The app verifies it's a React Native project and shows you a **preview of every change** — the files it will create or modify, and the exact lines it will insert.
4. Click **Set up automatically**, then confirm.

Three things happen:

| File | Change |
| ---- | ------ |
| `rnspy.connection.js` | Created in your project root, containing the SDK pre-filled with your host and port |
| `.gitignore` | Gains `rnspy.connection.js` and `*.rnspy.bak` so nothing generated is committed |
| your entry file | Gains `import './rnspy.connection'` as the **first** import |

Every modified file is backed up as `<file>.rnspy.bak` first. Re-running is safe: already-completed steps report **Up to date** and nothing is duplicated. Reload your app (step 4.3) and you're connected.

To undo it, reopen the dialog and click **Remove integration** — that deletes the generated file and strips the import.

> The import is placed above all other imports on purpose. ES imports execute in source order, and the SDK has to patch `console`, `fetch`, `XMLHttpRequest`, and `WebSocket` before any app code or library runs. An import placed lower down means missed early logs and empty panels.

### Option B — Manual setup

#### Step 4.1 — Open the connection snippet

With no device connected, the main area shows a **"Connect your app"** empty state. Click the **Copy** button on the code block. The snippet is auto-generated using your current host (the detected LAN IP) and port, so you usually don't edit it.

#### Step 4.2 — Paste it into your RN entry file

Paste the snippet **as early as possible** in your app's entry file — typically `index.js` or `App.tsx`, before other imports run:

```js
// index.js  (top of the file)
if (__DEV__) {
  ;(function () {
    const RNSPY_HOST = '192.168.1.20'   // ← auto-filled from your desktop
    const RNSPY_PORT = 8097
    // ... rest of the generated snippet ...
  })()
}

// ...your existing app registration (AppRegistry.registerComponent, etc.)...
```

> Why the top? The snippet monkey-patches `console.*`, `fetch`, `XMLHttpRequest`, and `WebSocket`. Patching late means early logs/requests are missed. Putting it first captures everything.

> The `if (__DEV__)` guard ensures the debugger is **never** bundled into a production release. Delete the snippet before shipping, or leave the guard in place.

#### Step 4.3 — Reload the RN app

- **Metro / simulators:** press `R` twice (or use the in-app dev menu → Reload).
- **Physical device on the same Wi-Fi:** the client auto-reconnects every 2 seconds, so a normal reload connects within moments.
- **Expo:** reload from the Expo dev menu / `expo start` → `r`.

#### Step 4.4 — Confirm the connection

Back in React Native Spy, a **device tab** appears under the top tab bar with a green online dot. The **Network / WebSocket / Console / Logs** tabs now populate as your app runs.

If it doesn't appear, see [Troubleshooting](./troubleshooting.md).

## 5. Using the debugger

- Switch panels with the **Network / WebSocket / Console / Logs** tabs.
- Click a device tab to inspect a specific device (multi-device supported).
- Right-click any network row or console line for copy/export actions.
- Use the **Settings** button (top right) to change the port, manage hidden-request rules, set a project root, or reset everything.
- Use the **Project** button (top right) to connect a project folder, re-check an existing integration, or remove it.

> Changing the port in Settings does not rewrite an already-generated `rnspy.connection.js`. Reopen **Project** and apply the pending **Regenerate** step to bring it back in sync.

Detailed panel behavior is in [Features](./features.md).

## 6. Build a distributable

To produce a standalone installer (.dmg / .exe / .AppImage):

```bash
npm run build                 # bundle main + preload + renderer into ./out
npm exec electron-builder     # package per electron-builder.yml targets
```

Outputs land in `./dist`:

| Platform | Target | Output |
| -------- | ------ | ------ |
| macOS    | `dmg`  | `dist/*.dmg` |
| Windows  | `nsis` | `dist/*.exe` |
| Linux    | `AppImage` | `dist/*.AppImage` |

The `appId` (`com.reactnativespy.app`) and `productName` (`React Native Spy`) are configured in `electron-builder.yml`.

## 7. Next steps

- Learn how each panel works: [Features](./features.md)
- Understand the client snippet: [Client SDK](./client-sdk.md)
- Tune behavior: [Configuration](./configuration.md)
