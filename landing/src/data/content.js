// src/data/content.js
// Every string the landing page renders lives here, so copy edits never
// require touching component code. Facts are drawn from the app's own docs
// (docs/features.md, docs/architecture.md, docs/client-sdk.md, docs/configuration.md).

export const PRODUCT = {
  name: 'React Native Spy',
  tagline: 'See everything your React Native app does.',
  description:
    'A lightweight Electron remote debugger for React Native. Console logs, HTTP traffic, live WebSocket frames, device storage and WatermelonDB — across multiple devices at once, with no Metro dependency and nothing added to your package.json.',
  version: '1.0.0',
  license: 'MIT',
  port: 8097,
  // Matches the publish block in electron-builder.yml, which is where
  // electron-updater looks for new versions.
  repo: 'https://github.com/dev-vaibhav0220/React-native-spy'
}

// Headline numbers. Each is a real constant from the codebase, not marketing math.
export const STATS = [
  { value: 6, label: 'Inspector panels', suffix: '' },
  { value: 12, label: 'Copy-as formats', suffix: '' },
  { value: 2000, label: 'Buffered records / device', suffix: '' },
  { value: 0, label: 'Runtime dependencies added', suffix: '' }
]

// The core pitch — why this exists next to Flipper and RN DevTools.
export const PROBLEMS = [
  {
    title: 'RN DevTools still cannot read WebSocket frames',
    body: 'If your app is realtime, the official inspector goes dark exactly where you need it. React Native Spy streams every frame with direction, payload and size.'
  },
  {
    title: 'Flipper is a heavyweight install',
    body: 'Native modules, plugin management, and a footprint that outweighs the three things you actually reach for while building a feature.'
  },
  {
    title: 'One device at a time is not how you ship',
    body: 'iOS and Android simulators plus a physical device is a normal afternoon. Every event here is tagged by device and bucketed into its own tab.'
  }
]

// Six panels, matching the desktop app's tab bar exactly.
export const PANELS = [
  {
    id: 'network',
    icon: 'Globe',
    name: 'Network',
    accent: 'var(--m-post)',
    summary: 'Every fetch and XMLHttpRequest, virtualized and newest-first.',
    points: [
      'Columns for method, URL, status, size and time with colour-coded status classes',
      'Detail pane with Headers, Payload, Response and Timing sub-tabs',
      'Pretty-printed JSON, XML and text bodies',
      'Filter by URL or method, with a live count of rows your rules suppress'
    ],
    footnote: 'Capped at 2000 requests per device — oldest dropped.'
  },
  {
    id: 'websocket',
    icon: 'Radio',
    name: 'WebSocket',
    accent: 'var(--blue)',
    summary: 'The panel RN DevTools does not have. Connections plus a live frame stream.',
    points: [
      'Connection list with URL, status and frame count',
      'Direction arrows: up for send (green), down for receive (blue)',
      'Hide pings to filter heartbeat frames like {"type":6} and {}',
      'Search across frame payloads'
    ],
    footnote: 'Capped at 2000 frames per connection.'
  },
  {
    id: 'console',
    icon: 'Terminal',
    name: 'Console',
    accent: 'var(--accent)',
    summary: 'Five log levels with caller badges that jump to your editor.',
    points: [
      'Level chips for log, info, warn, error and debug with per-level counts',
      'Caller badge on every row, for example App.tsx:42',
      'Click a badge to open the exact file and line in VS Code',
      'Metro /symbolicate resolves minified frames back to source'
    ],
    footnote: 'Requires a project root and the code CLI on your PATH.'
  },
  {
    id: 'storage',
    icon: 'Database',
    name: 'Storage',
    accent: 'var(--purple)',
    summary: 'AsyncStorage and MMKV, readable and editable from the desktop.',
    points: [
      'Browse every key and value on the connected device',
      'Edit values inline with explicit type selection',
      'Remove keys without rebuilding the app',
      'Auto-refresh keeps the table in sync as your app writes'
    ],
    footnote: 'Writes are sent to the device over the same socket.'
  },
  {
    id: 'watermelon',
    icon: 'Table2',
    name: 'WatermelonDB',
    accent: 'var(--red)',
    summary: 'Inspect local database tables without a SQLite client.',
    points: [
      'Table list with row counts',
      'Offset pagination with infinite scroll',
      'Read-only, so inspection can never corrupt local state',
      'Search across the loaded row window'
    ],
    footnote: 'Read-only by design.'
  },
  {
    id: 'logs',
    icon: 'ScrollText',
    name: 'Logs',
    accent: 'var(--amber)',
    summary: 'Server-side activity for when the connection itself is the bug.',
    points: [
      'Client connect and disconnect events',
      'Server start, stop and error entries',
      'Filter by info, warn and error',
      'Clear wipes the buffer'
    ],
    footnote: 'Rolling 500-entry buffer in the main process.'
  }
]

// The automatic-setup flow from docs/getting-started.md §4 Option A.
export const SETUP_STEPS = [
  {
    n: '01',
    title: 'Start the desktop app',
    body: 'The WebSocket server comes up automatically on port 8097, bound to 0.0.0.0 so physical devices on your LAN can reach it. The header shows a live status pill.',
    code: `npm install
npm run dev`,
    lang: 'bash'
  },
  {
    n: '02',
    title: 'Point it at your project',
    body: 'Click Project, pick the folder holding your package.json. The app verifies react-native is a dependency and resolves your entry file from package.json main.',
    code: `~/projects/my-rn-app
  ├── package.json      react-native 0.76.5
  ├── App.tsx           entry file, resolved
  └── .gitignore`,
    lang: 'text'
  },
  {
    n: '03',
    title: 'Review every change first',
    body: 'A read-only plan phase computes each change without touching disk. You see the files it will create or modify and the exact lines it will insert, before anything happens.',
    code: `create   rnspy.connection.js      SDK, host and port filled in
append   .gitignore               rnspy.connection.js, *.rnspy.bak
inject   App.tsx                  import './rnspy.connection'`,
    lang: 'text'
  },
  {
    n: '04',
    title: 'Apply, then reload',
    body: 'Each modified file is backed up as .rnspy.bak first, and a failed write rolls back the whole operation. Reload your app and the device tab appears with a green dot.',
    code: `// App.tsx — inserted as the first import
import './rnspy.connection' // @generated-by rnspy-devtools`,
    lang: 'js'
  }
]

// Capability matrix, from the README table plus the panels above.
export const CAPABILITIES = [
  { name: 'Console logs (log / info / warn / error / debug)', spy: true, devtools: true, flipper: true },
  { name: 'Network inspector (fetch + XMLHttpRequest)', spy: true, devtools: true, flipper: true },
  { name: 'WebSocket frame inspector', spy: true, devtools: false, flipper: 'partial' },
  { name: 'Multi-device tabs, side by side', spy: true, devtools: false, flipper: 'partial' },
  { name: 'AsyncStorage / MMKV browse and edit', spy: true, devtools: false, flipper: true },
  { name: 'WatermelonDB table inspector', spy: true, devtools: false, flipper: false },
  { name: 'Copy as cURL, fetch, Axios, HTTPie, HAR', spy: true, devtools: 'partial', flipper: false },
  { name: 'Open stack frame in VS Code', spy: true, devtools: false, flipper: false },
  { name: 'Zero runtime dependencies added', spy: true, devtools: true, flipper: false },
  { name: 'Works without Metro attached', spy: true, devtools: false, flipper: true }
]

// The 12 copy-as formats in the network context menu (utils/curl.js).
export const COPY_FORMATS = [
  'cURL (bash)',
  'cURL (PowerShell)',
  'fetch',
  'Node fetch',
  'Axios',
  'HTTPie',
  'Raw HTTP',
  'HAR export',
  'URL',
  'Query params',
  'Headers',
  'Body'
]

// What the client snippet patches, from docs/client-sdk.md.
export const SDK_PATCHES = [
  {
    target: 'console.*',
    detail: 'log, info, warn, error and debug. Objects are serialized safely, Errors become { message, stack }, and the caller file:line:col is parsed from the stack.'
  },
  {
    target: 'fetch',
    detail: 'Emits network-start then network with status, headers, body, size and duration. The response is cloned, so your app is unaffected.'
  },
  {
    target: 'XMLHttpRequest',
    detail: 'Same fields as fetch. A 5-second pending map de-duplicates the fetch/XHR double-capture.'
  },
  {
    target: 'WebSocket',
    detail: 'Emits ws-open, ws-frame with direction, ws-close and ws-error. The debugger control socket excludes itself.'
  }
]

// Event protocol table from docs/client-sdk.md.
export const PROTOCOL = [
  { kind: 'hello', from: 'connect', fields: 'name, platform' },
  { kind: 'console', from: 'console patch', fields: 'level, args, caller, stack' },
  { kind: 'network-start', from: 'fetch / XHR open', fields: 'id, method, url, requestHeaders, requestBody' },
  { kind: 'network', from: 'fetch / XHR done', fields: 'id, status, responseHeaders, responseBody, size, duration' },
  { kind: 'ws-open', from: 'WS open', fields: 'wsId, url, protocols' },
  { kind: 'ws-frame', from: 'WS message', fields: 'wsId, dir, data, size' },
  { kind: 'ws-close', from: 'WS close', fields: 'wsId, code, reason' },
  { kind: 'ws-error', from: 'WS error', fields: 'wsId' }
]

// Secondary features that matter but do not need a whole section.
export const EXTRAS = [
  {
    icon: 'Rocket',
    title: 'Auto-reconnect with an offline queue',
    body: 'The client retries every 2 seconds and buffers up to 500 events while disconnected, flushing them on reconnect. Reload your app freely.'
  },
  {
    icon: 'EyeOff',
    title: 'Hidden request rules',
    body: 'Silence analytics and telemetry noise by name or URL fragment. The filter bar still shows how many rows are suppressed.'
  },
  {
    icon: 'RefreshCw',
    title: 'Remote reload',
    body: 'Trigger a fast refresh on any connected device from its tab, using RN DevSettings. No reaching for the device.'
  },
  {
    icon: 'ShieldCheck',
    title: 'Dev-only by construction',
    body: 'The whole snippet sits inside an if (__DEV__) guard, so it can never reach a production bundle.'
  },
  {
    icon: 'Undo2',
    title: 'Fully reversible setup',
    body: 'Remove integration deletes the generated file and strips the import. Re-running reports Up to date instead of duplicating lines.'
  },
  {
    icon: 'Gauge',
    title: 'Virtualized and capped',
    body: 'Fixed-height row virtualization plus per-device caps keep the UI responsive at thousands of records.'
  }
]

// Build targets, mirroring the mac/win/linux blocks in electron-builder.yml.
export const PLATFORMS = [
  { name: 'macOS', ext: '.dmg', arch: 'Apple Silicon & Intel', icon: 'Apple' },
  { name: 'Windows', ext: '.exe', arch: '64-bit installer', icon: 'Monitor' },
  { name: 'Linux', ext: '.AppImage', arch: '64-bit', icon: 'Terminal' }
]

export const FAQ = [
  {
    q: 'Does this add anything to my package.json?',
    a: 'No. The client is a self-contained snippet generated by buildRnClient, not an npm package. Automatic setup writes one file, rnspy.connection.js, and gitignores it. Your dependency tree is untouched.'
  },
  {
    q: 'Will it end up in my production build?',
    a: 'The entire snippet is wrapped in if (__DEV__), so it is stripped from release bundles. You can also remove the integration entirely with one click, which deletes the generated file and the import line.'
  },
  {
    q: 'Expo or bare React Native?',
    a: 'Both. The snippet is plain JavaScript that runs through RN require. Detection only requires react-native in your dependencies, and Expo\'s node_modules/expo/AppEntry.js is skipped in favour of your own App.tsx.'
  },
  {
    q: 'Do I need Metro running?',
    a: 'No. The desktop app runs its own WebSocket server and the client connects directly to it. Metro is only involved if you want /symbolicate to resolve minified stack frames.'
  },
  {
    q: 'How does it reach a physical device?',
    a: 'The server binds to 0.0.0.0 and reports your LAN IPv4, preferring 192.168.*, 10.* and 172.16-31.*. It also listens on localhost for simulators. Device and desktop just need to share a network.'
  },
  {
    q: 'What happens to my data?',
    a: 'Nothing leaves your machine. Captured records live in sessionStorage, settings in localStorage, and server logs in a rolling 500-entry in-memory buffer. There is no backend and no telemetry.'
  },
  {
    q: 'Is it safe to point at my repo?',
    a: 'Setup is split into a read-only plan phase and an apply phase, so you approve a preview of every change first. Modified files are backed up as .rnspy.bak, and a failed write rolls the whole operation back.'
  },
  {
    q: 'Why must the import go first?',
    a: 'ES imports run in source order, and the snippet has to patch console, fetch, XMLHttpRequest and WebSocket before any app code or library caches the originals. An import placed lower down means missed early logs and empty panels.'
  }
]

export const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#setup' },
  { label: 'Compare', href: '#compare' },
  { label: 'Protocol', href: '#protocol' },
  { label: 'FAQ', href: '#faq' }
]
