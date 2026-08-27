# Contributing to React Native Spy

Thanks for helping out. This is a small project, so the process is light.

## Getting set up

```bash
git clone https://github.com/dev-vaibhav0220/React-native-spy.git
cd React-native-spy
npm install
npm run dev
```

Node 20 or newer. `npm run dev` opens the Electron app with hot reload for the
renderer. To try your change against a real app, follow
[docs/getting-started.md](./docs/getting-started.md) to connect a React Native
project to it.

The landing page is a separate Vite app in [landing/](./landing):

```bash
cd landing
npm install
npm run dev
```

## Before you open a pull request

Run the same two commands CI runs:

```bash
npm run build
npm run build:unpack
```

The first catches renderer, preload and main build errors. The second catches
`electron-builder` config breakage without producing installers. There is no
test suite yet — if you are adding logic that is worth testing, say so in the PR
and we will figure out the right harness together rather than bolting one on
halfway.

## How the code is laid out

| Path | What lives there |
| ---- | ---------------- |
| `src/main/` | Electron main process: the WebSocket server, updater, project setup |
| `src/preload/` | The context-isolated IPC bridge |
| `src/renderer/` | React UI — one component per inspector panel |
| `src/shared/rnClient.js` | The client snippet injected into the user's RN app |
| `landing/` | Marketing site, deployed to GitHub Pages |
| `docs/` | User-facing documentation |

[docs/architecture.md](./docs/architecture.md) explains how the three processes
talk to each other. Read it before changing anything that crosses a process
boundary.

### One landmine worth knowing about

`src/shared/rnClient.js` builds the client snippet as a single JavaScript
template literal. A stray backtick or `${` inside that template will silently
break the generated snippet. If you touch that file, generate a snippet and
paste it into a real app before opening the PR.

## Style

There is no linter config yet, so match the file you are editing. A few things
the codebase does consistently:

- No semicolons, single quotes, 2-space indent
- Comments explain *why*, not *what* — most files open with a short block
  describing the component's job
- Design tokens live in `src/renderer/styles/theme.css`; use them instead of
  hardcoding colours, and add new themes to `themes.css`

## Commits and pull requests

Commits use [Conventional Commits](https://www.conventionalcommits.org/):
`feat(network): ...`, `fix(console): ...`, `docs: ...`, `chore: ...`.

Keep the PR description focused on what changed and how you verified it. If the
change is visual, a screenshot saves a lot of back-and-forth. Please open an
issue first for anything large or architectural — it is much cheaper to disagree
about an approach before the code exists.

## Reporting bugs

Use the issue templates. The two things that most often decide whether a bug is
fixable are your OS with app version, and whether you can reproduce it in a
fresh RN project. The in-app Logs panel and the DevTools console for the
renderer window are both good sources of detail.

## Security

Do not open a public issue for a security problem. See
[SECURITY.md](./SECURITY.md).
