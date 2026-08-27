# React Native Spy

> A lightweight, Electron-based remote debugger for React Native apps.

**React Native Spy** is a desktop app that lets you see exactly what a React Native app is doing in real time — console output, HTTP traffic, and live WebSocket frames — without a native debugger or a Metro dependency. It spins up a tiny WebSocket server, and your RN app connects to it by pasting a short client snippet that monkey-patches `console.*`, `fetch`, `XMLHttpRequest`, and `WebSocket`. Everything is streamed to a Chrome-DevTools-style UI on your desktop.

```
┌────────────────────┐   ws://HOST:PORT   ┌──────────────────────────┐
│  React Native App  │ ─────────────────► │  React Native Spy (Electron)│
│  (client snippet)  │                    │  Console · Network · WS   │
└────────────────────┘                    └──────────────────────────┘
```

## Why React Native Spy?

The official React Native DevTools still can't inspect **WebSocket frames**, and tools like Flipper are heavyweight. React Native Spy focuses on the three things you reach for most while building — **console logs, HTTP traffic, and WebSocket streams** — across **multiple devices at once** — with a zero-config client and a fast dark UI.

| Capability | Status |
| ---------- | ------ |
| Console logs (`log`/`info`/`warn`/`error`/`debug`) | Yes |
| Network inspector (`fetch` + `XMLHttpRequest`) | Yes |
| WebSocket inspector (connections + live frames) | Yes |
| Multi-device support (per-device tabs) | Yes |
| Auto-reconnect client SDK + offline queue | Yes |
| Copy-as-cURL / copy request details | Yes |
| Hidden-request filter rules | Yes |
| "Open in VS Code" from console stack traces | Yes |
| macOS / Windows / Linux builds | Yes |

## Install

Grab a build for your platform from the
[latest release](https://github.com/dev-vaibhav0220/React-native-spy/releases/latest):
`.dmg` for macOS (Apple Silicon or Intel), `.exe` for Windows, `.AppImage` for
Linux.

Builds are **unsigned**, so the first launch needs one extra step: on macOS,
right-click the app and choose Open; on Windows, click "More info" then "Run
anyway" in the SmartScreen dialog.

## Quick start

```bash
npm install
npm run dev
```

Open **React Native Spy**, copy the connection snippet from the empty state,
paste it at the top of your RN entry file, and reload. Full steps are in
[docs/getting-started.md](./docs/getting-started.md).

> **Run it on a network you trust.** The WebSocket server binds to `0.0.0.0` so
> physical devices can reach it, and there is no authentication — anyone on your
> LAN can read the debug stream. See [SECURITY.md](./SECURITY.md).

## Documentation

- [Getting Started](./docs/getting-started.md) — install, run, connect your app, build a release
- [Features Walkthrough](./docs/features.md) — Network, WebSocket, Console, Logs, Devices
- [Client SDK](./docs/client-sdk.md) — how the snippet works and how to embed it
- [Configuration](./docs/configuration.md) — port, hidden rules, project root, settings
- [Architecture](./docs/architecture.md) — main process, preload bridge, renderer, protocol
- [Design System](./docs/design-system.md) — surface layers, tokens, theming
- [Troubleshooting](./docs/troubleshooting.md) — common issues and fixes

## Tech stack

- **Electron** + **electron-vite** for the desktop shell
- **React 18** for the UI
- **ws** for the WebSocket server
- **lucide-react** for icons
- **react-hot-toast** for notifications
- **react-router-dom** for in-app routing

## Repository layout

| Path | Contents |
| ---- | -------- |
| `src/main/` | Electron main process — WebSocket server, updater, project setup |
| `src/preload/` | Context-isolated IPC bridge |
| `src/renderer/` | React UI, one component per inspector panel |
| `src/shared/` | The client snippet injected into your RN app |
| `landing/` | Marketing site, deployed to GitHub Pages |
| `docs/` | User documentation |

## Contributing

Bug reports, features and pull requests are all welcome. Start with
[CONTRIBUTING.md](./CONTRIBUTING.md) — it covers the dev setup, the two commands
CI runs, and how the code is organised. By participating you agree to the
[Code of Conduct](./CODE_OF_CONDUCT.md).

## License

[MIT](./LICENSE) © Vaibhav Mahajan
