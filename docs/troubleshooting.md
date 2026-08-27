# Troubleshooting

## The device never appears in React Native Spy

**Symptoms:** status pill stays yellow ("Waiting"); no device tab.

> Most of the causes below are integration mistakes that **automatic setup avoids entirely**. Click **Project** in the header, pick your project folder, and let the app write the integration — it puts the import in the right place and keeps the host/port in sync. See [Getting Started](./getting-started.md#4-connect-your-react-native-app).

1. **Same network (physical devices).** A real phone must be on the same Wi-Fi as the desktop. Simulators use `localhost` and are fine.
2. **Snippet pasted at the very top** of `index.js`/`App.tsx`, before other imports.
3. **Snippet actually executed.** Add a `console.log('rnspy loaded')` inside the IIFE to confirm it runs; check the RN Metro console for snippet errors.
4. **Port matches.** The chip in the header shows `ws://HOST:PORT`. The snippet's `RNSPY_HOST`/`RNSPY_PORT` must match (the app auto-fills them, but a hardcoded/edited value can drift). Change the port in Settings → SERVER if needed.
5. **Firewall.** On macOS/Linux, allow incoming connections on the port (8097). Corporate networks may block peer connections — try a hotspot.
6. **Reload the app** after pasting. The client retries every 2s, but an initial load without the snippet won't connect until reload.

## Connected, but a panel is empty

- **Console empty:** the snippet wasn't loaded before the logs were produced, or logs happened before connect. Reload the app with the snippet in place.
- **Network empty:** the app uses a library that captured the original `fetch`/`WebSocket` before the patch ran. Ensure the snippet is imported **first**.
- **WebSocket empty:** the connection was opened before the snippet loaded, or it's a control socket the debugger excludes.

All three come down to load order. If you pasted manually, the fix is to move the snippet above every other import. Automatic setup does this for you — it inserts `import './rnspy.connection'` as the first import, after only a shebang, leading comments, or `'use strict'`.

## Automatic setup problems

- **"This does not look like a React Native project"** — detection requires `react-native` in `dependencies` or `devDependencies`. Make sure you picked the folder containing your app's `package.json`, not a parent or monorepo root.
- **"Could not find an entry file"** — no `index.js`/`App.js` (or `.jsx`/`.ts`/`.tsx`) was found and `package.json` `main` didn't resolve to a file you own. Paste the snippet manually instead.
- **Everything says "Up to date" but no device appears** — the files are in place, so this is a reload or network issue. See the section above.
- **Port changed and the app stopped connecting** — changing the port in Settings doesn't rewrite an already-generated `rnspy.connection.js`. Reopen **Project** and apply the pending **Regenerate** step.
- **Want your entry file back exactly as it was** — every modified file was backed up next to it as `<file>.rnspy.bak`.

## "VS Code not found" when opening a caller

The **`code`** CLI isn't on your `PATH`.

1. In VS Code: Command Palette → **Shell Command: Install 'code' command in PATH**.
2. Restart the terminal/Electron.
3. Set **Settings → PROJECT ROOT** to your RN project's absolute path so relative stack frames resolve.

## Wrong file opens / path doesn't match

- The stack frame paths are relative to your project. Set **PROJECT ROOT** correctly in Settings.
- Metro often reports paths like `http://localhost:8081/...`; the SDK strips the origin, but if your source lives in a subfolder, point PROJECT ROOT at the folder containing those files.

## Port already in use

If another process holds 8097, the server logs an error and shows red ("Offline").

- Change the port in **Settings → SERVER** to something free (e.g. `9090`), then update the snippet's `RNSPY_PORT` and reload the app.
- Or free the port: `lsof -i :8097` then kill the offending PID.

## Console shows `[unserializable]` or circular objects

The SDK `JSON.stringify`s args defensively. Circular or non-JSON values degrade to `[unserializable]`. This is expected and only affects display, not your app.

## Large apps feel slow

Buffers are capped (2000/device, 500 server logs) and lists are virtualized, so UI stays responsive. If a single connection floods frames, enable **Hide pings** in the WebSocket panel or add **hidden-request rules** in Settings.

## "Desktop only" screen

The debugger's WebSocket server can't run in a browser build — it needs the Electron main process. Run the Electron app (`npm run dev`), not a plain web preview.

## Reset everything

Settings → **DANGER ZONE** → **Reset everything** clears data, rules, project root, and port. If the UI gets into a weird state, this is the fastest recovery.
