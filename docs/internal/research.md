# DevTools Research — Chrome DevTools Architecture, React Native Debugging & Modern UI Patterns

## Table of Contents

1. [Chrome DevTools Architecture & UI Patterns](#1-chrome-devtools-architecture--ui-patterns)
2. [Existing React Native DevTools Landscape](#2-existing-react-native-devtools-landscape)
3. [Modern UI Patterns for Developer Tools](#3-modern-ui-patterns-for-developer-tools)
4. [React Native Specific Debugging Features](#4-react-native-specific-debugging-features)
5. [Libraries & Approaches for Building DevTools UIs](#5-libraries--approaches-for-building-devtools-uis)
6. [Open Source Projects & References](#6-open-source-projects--references)
7. [Recommended Feature Set for React Native Spy V2](#7-recommended-feature-set-for-react-native-spy-v2)

---

## 1. Chrome DevTools Architecture & UI Patterns

### 1.1 Overall Architecture

Chrome DevTools is a standalone frontend app that communicates with the browser backend via the **Chrome DevTools Protocol (CDP)** — a JSON-based message protocol over WebSocket. This decoupled architecture is a key design principle: the UI is completely separate from the instrumentation layer.

```
┌──────────────┐   WebSocket (JSON)   ┌──────────────────┐
│  DevTools UI  │◄───────────────────►│  Chrome Browser   │
│  (frontend)   │                      │  (CDP Server)     │
└──────────────┘                      └──────────────────┘
```

CDP exposes **domains** (Debugger, Network, DOM, Runtime, Performance, Memory, CSS, etc.), each with **commands** (request/response) and **events** (push notifications). This domain-based protocol design is worth emulating — it cleanly separates concerns and makes the system extensible.

### 1.2 UI Layout Structure

The DevTools UI follows a consistent layout pattern:

```
┌─────────────────────────────────────────────────────────────┐
│  Main Toolbar  (panel tabs, device toggle, settings, dock)  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              Active Panel Area (center)                     │
│                                                             │
│  ┌──────────┬──────────────────────────────────────────┐    │
│  │          │                                          │    │
│  │ Sidebar  │     Main Content                         │    │
│  │ (tree/   │     (table, flame chart, editor,         │    │
│  │  list)   │      DOM tree, etc.)                     │    │
│  │          │                                          │    │
│  │          ├──────────────────────────────────────────┤    │
│  │          │  Detail / Sub-panel (tabs)               │    │
│  └──────────┴──────────────────────────────────────────┘    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  Drawer (toggleable with Esc) — Console, Changes, etc.      │
└─────────────────────────────────────────────────────────────┘
```

Key layout principles:
- **Top tab bar** for switching between major panels
- **Sidebar + main content** split within each panel (resizable)
- **Detail pane** below or to the right of main content (tabbed)
- **Drawer** at the bottom — persistent secondary panels (Console is always accessible)
- **Dockable** — right, bottom, left, or undocked as separate window
- All panels are **resizable** via drag handles

### 1.3 Panel-by-Panel Breakdown

#### Elements Panel
| Section | Description |
|---------|-------------|
| **DOM Tree** (left/main) | Interactive tree view of HTML. Expandable/collapsible nodes, drag-and-drop, inline editing, right-click context menus |
| **Breadcrumb bar** | Ancestor chain of selected element |
| **Styles sidebar** (right) | CSS rules matching selected element, editable in-place, ordered by specificity |
| **Computed tab** | Final computed CSS values + interactive box model diagram (margin/border/padding/content) |
| **Layout tab** | Grid/Flexbox overlay controls |
| **Event Listeners tab** | All JS event listeners on selected element |
| **DOM Breakpoints tab** | Breakpoints on DOM mutations |
| **Properties tab** | JS object properties of selected DOM node |
| **Accessibility tab** | Accessibility tree, ARIA attributes |

#### Console Panel
| Section | Description |
|---------|-------------|
| **Toolbar** | Filter bar (text + log level), execution context selector, settings toggles |
| **Message area** | Scrollable log list with expandable objects, stack traces, rich formatting, source links |
| **Prompt** | Multi-line JS input with autocomplete, `$0`-`$4` element references, `$_` last result |
| **Sidebar** (toggleable) | Groups messages by category: Errors, Warnings, Info, Verbose |

#### Network Panel
| Section | Description |
|---------|-------------|
| **Toolbar** | Record, clear, filter bar (text + type: XHR/JS/CSS/Img/etc.), preserve log, disable cache, throttling |
| **Filmstrip** (optional) | Screenshot timeline of page load |
| **Request table** | Sortable columns: Name, Status, Type, Initiator, Size, Time, Waterfall |
| **Request detail pane** | Tabs: Headers, Payload, Preview, Response, Initiator, Timing, Cookies |
| **Summary bar** | Total requests, data transferred, load timings |

#### Sources Panel
| Section | Description |
|---------|-------------|
| **File navigator sidebar** | Tree view organized by Page/Filesystem/Overrides/Snippets |
| **Editor pane** | Tabbed code editor with syntax highlighting, line numbers, breakpoints, code folding |
| **Debugger sidebar** | Watch expressions, Breakpoints list, Scope variables, Call Stack, XHR breakpoints, Event listener breakpoints |
| **Debugger toolbar** | Resume, Step Over, Step Into, Step Out, Pause on exceptions |

#### Performance Panel
| Section | Description |
|---------|-------------|
| **Toolbar** | Record, reload+profile, clear, screenshots toggle, memory toggle |
| **Overview strip** | Miniature CPU flame chart, FPS bar, NET bar, screenshots filmstrip. Drag to select time range |
| **Flame chart** | Horizontal tracks: Network, Frames, Timings (FP/FCP/LCP), Main thread, Compositor, Raster, GPU |
| **Details pane** | Tabs: Summary (pie chart), Bottom-Up (by function), Call Tree (top-down), Event Log |

#### Memory Panel
| Section | Description |
|---------|-------------|
| **Profile type selector** | Heap Snapshot, Allocation timeline, Allocation sampling |
| **Profile list sidebar** | Saved snapshots with size/timestamp, comparison support |
| **Snapshot view** | Views: Summary (by constructor), Comparison (diff), Containment (reference tree), Statistics (pie) |
| **Retainers pane** | Retaining path from GC root — critical for memory leak detection |

#### Application Panel
| Section | Description |
|---------|-------------|
| **Sidebar tree** | Categories: Manifest, Service Workers, Storage quota |
| **Storage section** | Local Storage, Session Storage, IndexedDB, Cookies (table with all attributes), Cache Storage |
| **Background Services** | Background Fetch/Sync, Notifications, Push Messaging |
| **Frames** | Frame tree with per-frame resources and security info |

#### Security Panel
| Section | Description |
|---------|-------------|
| **Overview** | Overall security state, main origin certificate/connection details |
| **Origin list sidebar** | All contacted origins with security status icons |
| **Origin detail view** | Certificate details, connection protocol/cipher |

#### Lighthouse Panel
| Section | Description |
|---------|-------------|
| **Configuration** | Mode (Navigation/Timespan/Snapshot), Device, Category checkboxes |
| **Report** | Circular gauge scores (0-100), expandable audit sections, metrics, diagnostics |

### 1.4 Additional/Drawer Panels

| Panel | Purpose |
|-------|---------|
| **Animations** | CSS animation/transition timeline |
| **Changes** | Diff view of all DevTools modifications |
| **Coverage** | Used vs unused bytes per JS/CSS file |
| **CSS Overview** | Summary of colors, fonts, media queries |
| **Layers** | 3D visualization of composited layers |
| **Performance Monitor** | Real-time gauges: CPU, heap, DOM nodes, layouts/sec |
| **Rendering** | Paint flashing, layer borders, FPS meter, vision deficiency emulation |
| **Recorder** | Record, replay, export user flows |
| **Sensors** | Emulate geolocation, orientation, touch |

---

## 2. Existing React Native DevTools Landscape

### 2.1 React Native DevTools (Official, Built-in)

**Status:** Primary recommended tool as of React Native 0.76+ (2024-2026). Actively maintained with continuous improvements in 0.83, 0.85, 0.86.

**Architecture:** Built on the Chrome DevTools frontend, communicating with the Hermes JS engine. Requires Hermes.

| Feature | Description |
|---------|-------------|
| **Console** | Log viewer/filter, JS evaluation, object inspection, live expressions |
| **Sources & Breakpoints** | Source file browsing, breakpoints (conditional, logpoints), step debugging, scope/call stack inspection, watch expressions |
| **Network** (since 0.83) | Inspect `fetch()`, `XMLHttpRequest`, `<Image>` requests. Shows timings, headers, response previews, initiator call stacks. 100MB on-device response cache. No WebSocket events yet |
| **Performance** (since 0.83) | Record traces showing JS execution, React performance tracks, network events, User Timings. Supports annotations |
| **Memory** | Heap snapshots, allocation timeline for memory leak detection |
| **React Components** | Component tree inspection, live-edit props/state, on-device element highlighting, element picker, re-render highlighting, Memo badges for React Compiler |
| **React Profiler** | Render timing profiles, component render durations, React commit timings |

**Limitations:** No WebSocket inspection, no response mocking, no network throttling, no AsyncStorage viewer, no Redux integration.

### 2.2 Flipper (Meta, Deprecated in favor of RN DevTools)

**Architecture:** Electron desktop app (React-based UI) with plugin system. Native client SDKs communicate over WebSocket.

| Feature | Description |
|---------|-------------|
| **Layout Inspector** | Visual component/view hierarchy, real-time editing |
| **Network Inspector** | HTTP/HTTPS request/response monitoring |
| **React DevTools** | Integrated component tree inspection |
| **Logs** | Device log viewer (Logcat/Console) |
| **Databases Inspector** | SQLite, SharedPreferences, AsyncStorage browser/editor |
| **Images Plugin** | Image loading, caching, memory usage |
| **Crash Reporter** | Surface crash reports |
| **Hermes Debugger** | JS debugging on Hermes engine |
| **Plugin System** | Extensible with custom plugins (client + desktop side) |

**UI Pattern:** Sidebar for plugin navigation, main content area per plugin, dark mode support. Plugin-based architecture is worth noting.

### 2.3 Reactotron (Infinite Red)

**Architecture:** Desktop app connecting via WebSocket. Timeline-based event stream.

| Feature | Description |
|---------|-------------|
| **Redux Integration** | Live action/payload/state-diff viewing, state snapshots/restore, dispatch actions from desktop |
| **MobX-State-Tree** | MST store observation, action tracking, snapshots |
| **State Subscriptions** | Watch specific state paths |
| **Network Monitoring** | HTTP request/response logging (fetch, axios, Apisauce), timing |
| **Custom Logging** | `Reactotron.log/warn/error` with structured, filterable output |
| **Benchmarking** | `Reactotron.benchmark()` for execution timing |
| **Async Storage** | Browse and edit AsyncStorage contents |
| **Image Overlay** | Overlay design mockups for pixel verification |
| **Timeline View** | Chronological feed of all events (logs, actions, API calls, benchmarks), filterable |
| **Custom Plugins** | Extensible plugin architecture |

### 2.4 Comparison Matrix

| Feature | RN DevTools | Flipper | Reactotron | React Native Spy (Current) |
|---------|:-----------:|:-------:|:----------:|:---------------:|
| Console/Logs | ✅ | ✅ | ✅ | ✅ |
| Network (HTTP) | ✅ | ✅ | ✅ | ✅ |
| WebSocket Inspection | ❌ | ❌ | ❌ | ✅ |
| JS Debugger/Breakpoints | ✅ | ✅ | ❌ | ❌ |
| Component Tree | ✅ | ✅ | ❌ | ❌ |
| Redux/State Inspection | ❌ | ❌ | ✅ | ❌ |
| AsyncStorage Viewer | ❌ | ✅ | ✅ | ❌ |
| Performance Profiling | ✅ | ❌ | ✅ (basic) | ❌ |
| Memory Profiling | ✅ | ❌ | ❌ | ❌ |
| Layout/Visual Inspector | ❌ | ✅ | ❌ | ❌ |
| Database Browser | ❌ | ✅ | ❌ | ❌ |
| Custom Plugins | ❌ | ✅ | ✅ | ❌ |
| Multi-device Support | ❌ | ✅ | ❌ | ✅ |
| Electron-based | ❌ (standalone) | ✅ | ✅ | ✅ (embedded) |
| Dark Theme | ✅ | ✅ | ✅ | ✅ |

---

## 3. Modern UI Patterns for Developer Tools

### 3.1 Layout Patterns

**Panel-based navigation** is the universal standard:
- **Top tab bar** for primary panel switching (Elements, Console, Network, etc.)
- **Sidebar + content** split within panels (resizable, collapsible)
- **Secondary tabs** within panels for sub-views (Headers/Preview/Response in Network detail)
- **Bottom drawer** for persistent utilities (Console always accessible)
- **Nested resizable splits** for complex layouts (horizontal within vertical)

**Key interactions:**
- Drag to resize panels with visual handle indicators
- Double-click handle to collapse/expand
- Layout persistence across sessions (localStorage/sessionStorage)
- Keyboard shortcuts for panel switching
- Panel overflow → horizontal scroll or "more" dropdown

### 3.2 Dark Theme Patterns

Modern DevTools universally default to dark themes:

```
Background hierarchy (dark):
  --bg-base:      #1e1e1e   (deepest background)
  --bg-surface:   #252526   (panels, cards)
  --bg-elevated:  #2d2d2d   (inputs, dropdowns, hover states)
  --bg-overlay:   #333333   (modals, popovers)

Text hierarchy:
  --text-primary:   #e0e0e0  (main text)
  --text-secondary: #a0a0a0  (labels, descriptions)
  --text-muted:     #6a6a6a  (placeholders, disabled)

Semantic colors:
  --accent:   #007acc  (active tabs, links, focus rings)
  --success:  #4ec9b0  (200 OK, connected, passing tests)
  --warning:  #dcdcaa  (warnings, pending states)
  --error:    #f44747  (errors, failed requests)
  --info:     #569cd6  (info badges, HTTP methods)

Border:
  --border:   #3c3c3c  (subtle borders between panels)
```

### 3.3 Data Display Patterns

**Tables (Network requests, logs):**
- Virtualized scrolling for large datasets (react-window, @tanstack/virtual)
- Sortable columns with visual indicators
- Resizable columns
- Row selection with detail pane
- Status-colored badges (green 200, yellow 3xx, red 4xx/5xx)
- Monospaced font for URLs, status codes, sizes
- Alternating row backgrounds (subtle)
- Sticky header row
- Filter bar above table

**Tree views (DOM, component tree, file navigator):**
- Expand/collapse with triangle indicators
- Indentation guides (vertical lines)
- Syntax-colored node names (tags, attributes, values)
- Hover highlights
- Keyboard navigation (arrow keys)
- Search/filter within tree
- Breadcrumb trail for deep navigation

**Code display:**
- Syntax highlighting (language-aware)
- Line numbers
- Code folding
- Search within code (Cmd+F)
- Monospaced font (JetBrains Mono, Fira Code, SF Mono)
- Copy button
- Wrap toggle

**JSON/Object inspection:**
- Collapsible nested objects
- Type-colored values (strings=green, numbers=blue, booleans=purple, null=gray)
- Key highlighting
- Copy path/value on right-click
- Array length badges
- Preview on collapsed (first few properties)

**Log entries:**
- Level-based colors (info=default, warn=yellow bg, error=red bg, debug=muted)
- Timestamp column (relative or absolute, toggleable)
- Stack trace expansion
- Object expansion inline
- Source link (file:line)
- Group similar messages

### 3.4 Interaction Patterns

- **Context menus** (right-click) for advanced actions: copy as cURL, copy response, hide request, etc.
- **Tooltips** for truncated content and icon buttons
- **Command palette** (Cmd+Shift+P) for quick action access
- **Keyboard shortcuts** documented and discoverable
- **Toast notifications** for copy confirmation, status changes
- **Empty states** with helpful instructions and illustrations
- **Loading states** with skeleton screens or spinners
- **Search/filter** in every data-heavy panel

### 3.5 Typography

```
Display/headings: Inter, system-ui (variable weight)
UI labels/buttons: Inter, -apple-system, sans-serif
Code/data:         "JetBrains Mono", "Fira Code", "SF Mono", "Menlo", monospace
```

Font sizes: 11px for data tables, 12px for UI text, 13px for descriptions, 14-18px for headings.

---

## 4. React Native Specific Debugging Features

### 4.1 Essential Features (Must-Have)

| Feature | Description | Priority |
|---------|-------------|----------|
| **Console Logs** | Intercept `console.log/warn/error/info/debug`, structured display with object expansion, level filtering, search | ✅ Already built |
| **Network Inspector (HTTP)** | Intercept `fetch`/`XMLHttpRequest`, show method/URL/status/size/time, detail view with headers/body/response/timing | ✅ Already built |
| **WebSocket Inspector** | Track WS connections lifecycle, show frames (send/recv), message size, connection status | ✅ Already built |
| **Component Tree** | Render tree of React components with props/state inspection, component highlighting in app | 🔴 Critical gap |
| **Redux/State Inspector** | Subscribe to Redux store, show dispatched actions with payloads, state diffs, time-travel | 🔴 High value |
| **AsyncStorage Viewer** | Browse, search, edit, delete AsyncStorage entries | 🔴 High value |
| **Performance Monitor** | Real-time FPS, JS thread usage, memory, re-render count overlay | 🟡 Important |

### 4.2 Advanced Features (High Value)

| Feature | Description |
|---------|-------------|
| **Redux Action Replay** | Dispatch actions from DevTools, snapshot/restore state |
| **Network Request Mocking** | Intercept and return custom responses for testing |
| **Deep Link Testing** | Fire deep links to the app from DevTools |
| **Image/Asset Inspector** | View loaded images, cache status, memory usage |
| **Navigation Inspector** | Track React Navigation state, history, params |
| **Environment Variables** | View/override runtime config |
| **Custom Events/Timelines** | App-defined events displayed on a unified timeline |
| **Crash/Error Reporting** | Unhandled exceptions with stack traces, source maps |
| **Storage Inspector** | SQLite, MMKV, SecureStore browser |
| **Bundle Analyzer** | JS bundle size breakdown |

### 4.3 Client SDK Architecture

The current Rnspy client SDK architecture (monkey-patching + WebSocket transport) is solid and mirrors how Flipper and Reactotron work. To support new features, the SDK would need to be extended:

```
Client SDK Extensions:
├── Console interceptor (✅ exists)
├── Network interceptor - fetch/XHR (✅ exists)
├── WebSocket interceptor (✅ exists)
├── Redux middleware (new)
│   └── Subscribe to store, capture actions/state diffs
├── AsyncStorage bridge (new)
│   └── Wrap AsyncStorage API, forward to DevTools
├── Component tree bridge (new)
│   └── React DevTools protocol or custom fiber walker
├── Performance bridge (new)
│   └── Performance.now(), InteractionManager, frame timing
├── Navigation bridge (new)
│   └── Hook into React Navigation state changes
└── Custom event emitter (new)
    └── User-defined events via DevTools.log(), DevTools.track()
```

---

## 5. Libraries & Approaches for Building DevTools UIs

### 5.1 Layout & Panels

| Library | Purpose | Size | Notes |
|---------|---------|------|-------|
| **react-resizable-panels** | Resizable panel layouts | ~5KB gzip | By Brian Vaughn (React core team). Best choice. Supports nesting, collapsible panels, persistence, imperative API, SSR, accessibility. |
| **allotment** | VS Code-style split views | ~15KB | Good alternative, used by VS Code web |
| **react-split** | Simple split panes | ~3KB | Lighter but fewer features |

**react-resizable-panels** is the clear winner for a DevTools layout. Core API:

```tsx
<PanelGroup direction="horizontal" autoSaveId="devtools">
  <Panel defaultSize={20} minSize={10} collapsible>
    <Sidebar />
  </Panel>
  <PanelResizeHandle />
  <Panel defaultSize={55} minSize={30}>
    <MainContent />
  </Panel>
  <PanelResizeHandle />
  <Panel defaultSize={25} minSize={10} collapsible>
    <DetailPane />
  </Panel>
</PanelGroup>
```

### 5.2 Code & Syntax Highlighting

| Library | Purpose | Notes |
|---------|---------|-------|
| **Prism.js / prism-react-renderer** | Syntax highlighting | Lightweight, good for read-only code display |
| **Shiki** | Syntax highlighting | VS Code's highlighter, TextMate grammars, beautiful output |
| **Monaco Editor** | Full code editor | VS Code's editor, heavy (~2MB), overkill for read-only |
| **CodeMirror 6** | Code editor | Lighter than Monaco, extensible, good for embedded editors |
| **react-syntax-highlighter** | React wrapper | Supports Prism + highlight.js, easy to use |
| **react-json-view-lite** | JSON tree viewer | Lightweight, collapsible JSON display |
| **react-json-tree** | JSON tree viewer | Feature-rich, used by Redux DevTools |

### 5.3 Data Display & Virtualization

| Library | Purpose | Notes |
|---------|---------|-------|
| **@tanstack/react-virtual** | Virtual scrolling | Best-in-class, any list/table/grid |
| **react-window** | Virtual lists | Simpler API, battle-tested |
| **@tanstack/react-table** | Table logic | Headless, sorting/filtering/grouping/column resizing |
| **react-virtuoso** | Virtual list/table | Built-in grouping, sticky headers, reverse scroll (chat) |

### 5.4 Tree Views

| Library | Purpose | Notes |
|---------|---------|-------|
| **react-arborist** | Full tree view | Drag-and-drop, virtualized, keyboard nav, rename |
| **Custom implementation** | DOM-like tree | Chrome DevTools trees are custom-built for maximum control |
| **react-complex-tree** | Advanced tree | Multi-select, drag-and-drop, rename, search |

### 5.5 Icons

| Library | Notes |
|---------|-------|
| **lucide-react** | Clean, consistent icons. Already used in Rnspy |
| **@phosphor-icons/react** | Larger set, multiple weights |
| **react-icons** | Aggregator of many icon sets |

### 5.6 Other Utilities

| Library | Purpose |
|---------|---------|
| **date-fns** or **dayjs** | Timestamp formatting |
| **fuse.js** | Fuzzy search for filters |
| **zustand** | Lightweight state management (if needed beyond hooks) |
| **immer** | Immutable state updates |
| **react-hot-toast** or **sonner** | Toast notifications |
| **cmdk** | Command palette (Cmd+K) |
| **react-hotkeys-hook** | Keyboard shortcut management |
| **diff** or **jsdiff** | Text diff for state comparison |

### 5.7 Recommended Stack for React Native Spy V2

```
Layout:           react-resizable-panels
Virtualization:   @tanstack/react-virtual (or react-window)
Tables:           Custom + virtualization (for maximum control)
Tree views:       Custom implementation (Chrome DevTools style)
Syntax:           react-syntax-highlighter (Prism-based) or Shiki
JSON viewer:      react-json-tree or custom
Icons:            lucide-react (already in use)
State:            React hooks + useReducer (current approach is fine)
Styling:          CSS variables for theming (already in use)
```

---

## 6. Open Source Projects & References

### 6.1 Chrome DevTools Frontend
- **Source:** `chromium.googlesource.com/devtools/devtools-frontend`
- The actual Chrome DevTools UI, open source. Built with custom web components, TypeScript. Study for UI patterns, not for code reuse.

### 6.2 React DevTools
- **Source:** `github.com/facebook/react/tree/main/packages/react-devtools`
- The React component inspector. Built with React. The standalone version can be embedded. Has a well-documented protocol for communicating with React's internals.

### 6.3 Redux DevTools
- **Source:** `github.com/reduxjs/redux-devtools`
- Action list, state tree, diff view, time-travel. Great reference for state inspection UI patterns.

### 6.4 Reactotron
- **Source:** `github.com/infinitered/reactotron`
- Timeline-based event stream UI, Redux integration, network logging. Desktop app built with Electron + React.

### 6.5 Flipper
- **Source:** `github.com/facebook/flipper`
- Plugin-based architecture, layout inspector, database browser. Electron + React.

### 6.6 React Native DevTools
- **Source:** Part of React Native core (0.76+)
- Built on Chrome DevTools frontend, customized for RN. Reference for what the community considers essential.

### 6.7 VS Code
- **Source:** `github.com/microsoft/vscode`
- Best reference for panel layout, resizable views, tree views, command palette, keyboard shortcuts, theming system.

### 6.8 Eruda
- **Source:** `github.com/nicedoc/eruda` (or `github.com/nicedoc/eruda`)
- Mobile web console / DevTools panel that runs in-page. Good reference for mobile-friendly DevTools UI.

---

## 7. Recommended Feature Set for React Native Spy V2

Based on this research, here are the recommended new panels/features to add to the existing React Native Spy, prioritized:

### Phase 1: Core UI Improvements (Enhance existing)

1. **Resizable panel layout** — Replace fixed layout with `react-resizable-panels` for sidebar/content/detail split
2. **Enhanced Network detail** — Add tabbed detail view (Headers, Request Body, Response Body, Timing) like Chrome DevTools
3. **Improved Console** — Add object expansion (JSON tree), level-based background colors, stack traces, source links, search
4. **Request detail formatting** — Syntax-highlighted JSON/XML response bodies, pretty-printed headers
5. **Performance improvements** — Virtual scrolling for all lists (network, console, WebSocket frames)
6. **Keyboard shortcuts** — Cmd+K command palette, Cmd+L clear, Cmd+F search, tab switching

### Phase 2: New Panels

7. **Redux/State Inspector** — New panel showing dispatched actions, state tree, diffs, time-travel. Requires client SDK Redux middleware
8. **AsyncStorage Viewer** — New panel to browse, search, edit, delete AsyncStorage entries. Requires client SDK bridge
9. **Performance Monitor** — Real-time gauges panel showing FPS, JS thread, memory usage, re-render count
10. **Component Tree** — React component tree inspector with props/state. Could integrate React DevTools standalone or build custom

### Phase 3: Advanced

11. **Network Request Mocking** — Intercept and return custom responses
12. **Deep Link Testing** — Fire URLs/deep links to the connected app
13. **Navigation Inspector** — Track React Navigation state and history
14. **Timeline View** — Unified chronological timeline of all events (Reactotron-style)
15. **Plugin System** — Allow users to add custom panels/inspectors

### Architectural Recommendations

1. **Keep the WebSocket transport** — The current Electron main process → WS → RN client architecture is solid and proven
2. **Extend the client SDK incrementally** — Add new interceptors (Redux, AsyncStorage, etc.) as opt-in modules
3. **Use CSS variables for theming** — Already in place, continue this pattern
4. **Adopt react-resizable-panels** — For the panel layout system
5. **Add virtual scrolling** — For any list that can grow past ~100 items
6. **Consider protocol versioning** — As the SDK grows, version the message protocol to handle client/server version mismatches
7. **Add reconnection resilience** — The current architecture handles this; ensure new features degrade gracefully on disconnect

---

## Summary

The current React Native Spy has a **strong foundation** — the WebSocket architecture, multi-device support, and Network/WebSocket/Console panels are solid. The biggest gaps compared to the competition are:

1. **No component tree inspection** (all competitors have this)
2. **No state management debugging** (Reactotron's killer feature)
3. **No storage/AsyncStorage viewer** (Flipper's most-used plugin)
4. **Basic UI layout** (no resizable panels, limited detail views)
5. **No performance monitoring** (real-time gauges)

The recommended approach is to enhance the existing UI with resizable panels and better data display first, then add new panels (Redux, AsyncStorage, Performance) incrementally — each requiring a corresponding client SDK module.
