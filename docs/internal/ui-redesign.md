# UI Redesign — React Native Spy

A senior-level audit of the current renderer, followed by a concrete design system
and per-panel plan. Every claim below cites `file:line` from the code as it exists
today, so nothing here is speculative.

Companion deliverable: six standalone theme mockups in `docs/theme-mockups/`. Open
`docs/theme-mockups/index.html` to compare them side by side.

---

## 1. How the app actually works today

Before redesigning anything, here is the full feature surface. The UI has to keep
all of it.

**Shell.** A 40px draggable header (`--header-height`) with logo, connection status
badge, click-to-copy `ws://host:port`, Project button, Settings button, and the new
update button. Below it a 32px panel tab bar (`--tab-height`) with six tabs and live
counts. Below that a 38px device tab strip (`DeviceTabs.jsx:24`) that only renders
when devices exist.

**Six panels.**

| Panel | Data | Virtualized | Row height |
|---|---|---|---|
| Network | HTTP from `fetch` + `XMLHttpRequest` | Yes (`NetworkTab.jsx:118`) | 34px |
| WebSocket | Connections + frame stream | Yes (`WebSocketTab.jsx:161`) | 52 / 28px |
| Console | 5 log levels, stack traces | **No** (`ConsoleTab.jsx:207`) | variable |
| Storage | AsyncStorage + MMKV, editable | **No** (`StorageTab.jsx:361`) | intrinsic |
| WatermelonDB | Tables, paginated rows, read-only | **No** (`WatermelonTab.jsx:269`) | intrinsic |
| Logs | Server activity, 3 levels | Yes (`LogsTab.jsx:47`) | 28px |

**Deep features that must survive a redesign.** 12 copy-as formats in the network
context menu (`utils/curl.js` — cURL bash/PowerShell, fetch, Node fetch, Axios,
HTTPie, raw HTTP, HAR). Metro `/symbolicate` → open-in-VS-Code from a stack frame
(`main/index.js:112`, `ConsoleTab.jsx:99`). Clickable file paths parsed out of
arbitrary log text (`ClickablePath.jsx:20`). Storage mutation with type selection.
Watermelon offset pagination with infinite scroll. Hidden-request rules. Automatic
project setup with a plan/apply preview.

---

## 2. Audit — what's wrong

I grouped findings by severity. Counts are exact, from reading all 14 renderer files.

### P0 — Breaks at scale or shows false information

**2.1 Console isn't virtualized.** `ConsoleTab.jsx:207` maps the entire filtered
array. The console is the highest-volume stream in the app and the buffer holds 2000
entries (`useRnspyDevtools.js:5`). Each row also owns two `useState` hooks
(`ConsoleTab.jsx:323`), so hook count scales linearly with log count. Storage
(`StorageTab.jsx:361`) and Watermelon (`WatermelonTab.jsx:269`) are also unvirtualized
*while polling on 2s and 3s timers* — every tick reflows the whole table.

**2.2 The timing bar always renders 100%.** `NetworkTab.jsx:673` hard-codes
`width: '100%'` on the fill. Every request looks identical regardless of duration.
This is worse than missing — it displays a measurement that doesn't exist.

**2.3 Watermelon search hides its own pagination.** `WatermelonTab.jsx:300` gates the
footer on `&& !search`. Search only filters the ~50 loaded rows
(`WatermelonTab.jsx:100`) while the toolbar advertises the full `{total} rows`. So a
user searching a 10k-row table sees "no results" and has no control left to load more.

**2.4 `loadMore` can deadlock.** `WatermelonTab.jsx:90` sets `loadingRef.current = true`,
cleared only by an effect watching `loadedRows.length` (`:86`). A failed or empty page
never changes that length, so pagination locks permanently with no error surfaced.

**2.5 Optimistic success toasts.** `StorageTab.jsx:154` and `:165` fire
`toast.success` before any device acknowledgement. `onSetValue`/`onRemoveKey` are
fire-and-forget, so the UI claims a write succeeded when it may have failed on device.

**2.6 Destructive delete with no confirmation.** `StorageTab.jsx:397` removes a
storage key immediately, no confirm, no undo. Compare `DeviceTabs.jsx:99`, which does
this correctly with a real warning dialog.

### P1 — Accessibility: the app is effectively mouse-only

**2.7 Zero `aria-*` attributes in the entire renderer.** `role` appears twice
(`ConsoleTab.jsx:412`, `ClickablePath.jsx:113`), both `role="button"` on a `<span>`.

**2.8 No keyboard access to any data row.** Network rows (`NetworkTab.jsx:214`),
console rows (`:329`), WebSocket connections (`WebSocketTab.jsx:205`), Watermelon rows
(`WatermelonTab.jsx:283`), storage rows (`StorageTab.jsx:364`), and device tabs
(`DeviceTabs.jsx:30`) are all `<div>`/`<tr>` with `onClick` and no `tabIndex`, `role`,
or key handler. The entire app's primary interaction is unreachable by keyboard.

**2.9 Hover-only affordances that ignore focus.** Four separate buttons start at
`opacity: 0` and are revealed only by `:hover`: network row actions
(`NetworkTab.jsx:266` + `theme.css:289`), KV copy (`:605` + `theme.css:311`), device
tab close (`DeviceTabs.jsx:89`), and the console row copy button — which isn't even
*mounted* until hover (`ConsoleTab.jsx:387`), making it keyboard-unreachable by
construction.

**2.10 No modal is accessible.** Four modals (`StorageTab.jsx:444`,
`WatermelonTab.jsx:337`, `DeviceTabs.jsx:99`, plus the settings/setup modals) have no
`role="dialog"`, no `aria-modal`, no focus trap, and no focus restore. Two have **no
Escape handler** — `StorageTab.jsx:444` and `WatermelonTab.jsx:337` close only by
backdrop click.

**2.11 `CursorMenu` has no menu semantics.** No `role="menu"`/`menuitem`
(`CursorMenu.jsx:61`), no arrow-key navigation (`:35` handles Escape only), no focus
on open, no focus trap. It's portaled to `document.body` (`:81`), so opening it throws
tab order to the end of the document.

**2.12 Tab-stop explosion.** `ClickablePath.jsx:114` puts `tabIndex={0}` on every
parsed file path in every log line. One 20-frame stack trace injects 20 tab stops.

**2.13 Toggle state invisible to assistive tech.** Level filters in
`ConsoleTab.jsx:150` and `LogsTab.jsx:70` are real `<button>`s but have no
`aria-pressed`; active state is border + background + color only.

**2.14 Color-only signalling.** HTTP status (`NetworkTab.jsx:247`), HTTP method
(`:237`), WebSocket frame direction (`WebSocketTab.jsx:328` — a green row tint),
auto-refresh active state (`StorageTab.jsx:238`, `WatermelonTab.jsx:158`), and console
level filter state all encode meaning in hue alone. `LogsTab.jsx:12` gets this right
with `INF`/`WRN`/`ERR` text tags — that pattern should be universal.

### P2 — Alignment, rhythm, and craft

**2.15 The console gutter is misaligned by 8px.** `ConsoleTab.jsx:363` sets
`marginLeft: 106` on the message body. The columns above it are tag `width: 26`
(`:343`) + `gap: var(--space-2)` = 8px (`:341`) + time `width: 80` (`:350`) = **114px**.
Message text does not line up with the timestamp column. `:379` repeats the same 106.

**2.16 Selected and hover are the same color.** `NetworkTab.jsx:223` uses
`--bg-card-hover` for selected; `:231` uses it for hover. A hovered row is
indistinguishable from the selected row. Same in `WebSocketTab.jsx:212`/`:216`.

**2.17 Four chrome heights, no vertical rhythm.** Header 40px
(`--header-height`), panel tabs 32px (`--tab-height`), device tabs 38px
(`DeviceTabs.jsx:24`), panel toolbars 38px (`NetworkTab.jsx:152`,
`ConsoleTab.jsx:140`, `WebSocketTab.jsx:273`, `StorageTab.jsx:186`,
`WatermelonTab.jsx:127`, `LogsTab.jsx:60`), network column header 24px (`:193`),
detail sub-tabs 26px (`:333`). None are multiples of a common unit.

**2.18 Control heights inside those toolbars: 20, 22, 24, 26, 28, 30px.**
`INPUT_BASE` is 28 (`shared.js:80`) but overridden to 30 (`NetworkTab.jsx:161`), 26
(`StorageTab.jsx:260`), 24 (`:325`). `BTN_GHOST` is 24 (`shared.js:44`),
`BTN_SECONDARY` 28, `ToolbarActions` 30×30. Nothing shares a baseline.

**2.19 Font sizes below the token floor.** `--text-xs` is 12px
(`theme.css:72`), yet `fontSize: 8`, `9`, `10`, and `11` appear inline throughout —
`8` at `WebSocketTab.jsx:230` and `StorageTab.jsx:380`, `9` at `NetworkTab.jsx:171`
and 6 other sites, `10` at 20+ sites. The 3-char type badge
`(entry.type||'string').slice(0,3)` at `StorageTab.jsx:380` renders "boo" at 8px.

**2.20 Four transition durations and four hover mechanisms.** Durations: 60ms
(`NetworkTab.jsx:228`), 80ms (`WebSocketTab.jsx:214`), 100ms (`StorageTab.jsx:207`),
120ms (`shared.js:19`), and none at all on `LogsTab` filters. Hover is implemented as
a CSS class (`theme.css:289`), imperative `style.background` mutation
(`NetworkTab.jsx:231`), React state conditional-mount (`ConsoleTab.jsx:387`), and
React state style swap (`CursorMenu.jsx:113`) — four ways to do one thing.

**2.21 Imperative hover breaks on re-render.** `WebSocketTab.jsx:216` writes hover
into `element.style.background`. Any state update — a new frame arriving, which is
constant — re-renders the row and the inline `background` from `:212` wins, silently
dropping the highlight while the pointer is still there.

**2.22 Index-based keys on virtualized rows.** `key={frameVirt.startIdx + i}`
(`WebSocketTab.jsx:323`) and `key={startIdx + i}` (`LogsTab.jsx:122`) derive the key
from scroll position, so React reuses DOM nodes for different rows as you scroll —
which actively breaks the `userSelect: 'text'` those same rows set (`:143`).

**2.23 Fixed columns too narrow for their content.** An 80px timestamp column holds
`HH:MM:SS.mmm` (12 mono chars) in three places (`WebSocketTab.jsx:335`,
`LogsTab.jsx:136`, `ConsoleTab.jsx:350`) with no overflow handling. A 26px tag column
holds 3 uppercase chars (`LogsTab.jsx:129`). Network's 64px Status/Size/Time tracks
(`NetworkTab.jsx:21`) have no `overflow: hidden`, so long values overflow the grid.

**2.24 Sub-24px hit targets, several destructive.** 22×22 device tab close
(`DeviceTabs.jsx:87`), 24×24 storage delete (`StorageTab.jsx:397`), ~16px network row
action (`:265`), ~14px KV copy (`:604`), 20px detail close (`:317`), 22px console copy
(`ConsoleTab.jsx:392`), ~14px level toggles (`:153`), `padding: '2px 8px'` backend
tabs (`StorageTab.jsx:196`). Also a 1px resizer hit area (`theme.css:248`).

**2.25 Layout shift from live counts.** `LogsTab.jsx:81` and `ConsoleTab.jsx:166`
mount the count badge only when `> 0`, so buttons resize as logs arrive and every
sibling shifts. Digit-width changes (9→10→100) shift again.

### P3 — Missing states and dead code

**2.26 No loading state anywhere.** All six panels are fed by async device
round-trips and none shows a pending indicator. Worse, the empty state renders during
the round-trip, so `StorageTab.jsx:347` shows "No storage backends detected" while the
request is still in flight — a false negative that reads as an error.

**2.27 Empty states don't distinguish "nothing arrived" from "your filter matched
nothing."** `ConsoleTab.jsx:196` and `LogsTab.jsx:106` both key off
`filtered.length === 0` and always say "No console output" / "No server logs", even
with 900 entries and every level deselected. `NetworkTab.jsx:178` has the inverse
bug — gated on `requests.length === 0`, so a filter matching nothing shows a bare
header over an empty scroll area with no message. `WatermelonTab.jsx:262` is the only
one that gets this right.

**2.28 Stale data shown without warning.** `StorageTab.jsx:168` returns a clean
"Device offline" only when there's no cached data. With cached data it renders the
normal UI with controls dimmed and no staleness indicator.

**2.29 Console has no auto-scroll.** `useVirtualRows` already provides `stickyBottom`
and `scrollToBottom` (`useVirtualRows.js:21`, `:94`), and `LogsTab.jsx:47` uses them —
but the console, the panel that most needs tailing, doesn't use the hook at all.
Neither panel that does use `stickyBottom` shows whether tailing is active or offers
a "jump to latest" control.

**2.30 Advertised keyboard shortcuts that don't exist.** `⌘⇧C` and `⌘C` hints render
in the network and console context menus (`NetworkTab.jsx:364`, `:385`,
`ConsoleTab.jsx:272`) with no corresponding key handler anywhere.

**2.31 Dead code.** `prettyBody` and `isSignalRFrame` are unused in
`WebSocketTab.jsx:5`, `:56` (the latter a full 9-line function). `Fragment` is
imported unused in `ClickablePath.jsx:5`. `--method-patch` (`theme.css:55`) is never
referenced — `methodColor` maps PATCH to `--method-put` (`NetworkTab.jsx:40`).
`.panel-resizer.active` is styled (`theme.css:257`) but the class is never applied, so
the resizer loses its accent mid-drag. `StorageTab.jsx:241`'s spin animation is a
no-op: the truthy branch sets `animation: 'none'` and the falsy branch sets nothing.

**2.32 Modal overlays are unanchored.** `StorageTab.jsx:447` and
`WatermelonTab.jsx:340` use `position: 'absolute', inset: 0` but no ancestor has
`position: relative` — the only one in `theme.css` is `.panel-resizer` (`:251`). They
look correct only because `html, body, #root { height: 100% }`. That's accidental.
`DeviceTabs.jsx:103` does it properly with `position: fixed`.

**2.33 Duplicated error copy.** The VS Code-not-found string is written out four
times: `ConsoleTab.jsx:107`, `:116`, `:127`, `ClickablePath.jsx:75`.

---

## 3. Design principles

1. **Density without noise.** This is a debugging tool. Maximize rows on screen, but
   every pixel of chrome must earn its place. Target 28px data rows and 32px chrome.
2. **One unit of rhythm: 4px.** Every height, padding, and gap is a multiple of 4.
3. **Never encode meaning in color alone.** Every semantic state gets a glyph, a text
   tag, or a shape in addition to hue.
4. **Keyboard-first.** Every action reachable by mouse is reachable by keyboard.
   Rows are a composite widget with roving `tabIndex`.
5. **Motion clarifies causality, nothing else.** Animate only to show where something
   came from or that it changed. Two durations total. Respect
   `prefers-reduced-motion`.
6. **Four states per surface, always.** Loading, empty, filter-empty, error. No
   surface may conflate them.
7. **Virtualize every unbounded list.** No exceptions.
8. **Honesty.** Never show a measurement that isn't measured, never confirm a write
   that isn't acknowledged.

---

## 4. Token system

Replaces the ad-hoc values. Additive to `theme.css` — nothing here removes an
existing token, so migration can be incremental.

### 4.1 Type scale — enforce a floor of 11px

The current 8px and 9px sizes are unreadable. Nothing goes below 11px, and 11px is
reserved for uppercase micro-labels with letter-spacing.

```css
--text-2xs: 11px;  /* uppercase micro-labels ONLY, needs letter-spacing */
--text-xs:  12px;  /* dense table cells, badges, timestamps */
--text-sm:  13px;  /* default UI text, inputs, buttons */
--text-base:14px;  /* body copy in modals */
--text-md:  15px;  /* section headings */
--text-lg:  20px;  /* page titles, empty-state headings */
--text-mono-xs: 12px;  /* mono floor — never smaller */
```

Migration: `fontSize: 8` and `9` → `--text-2xs`. `fontSize: 10` → `--text-xs` for
data, `--text-2xs` for uppercase labels.

### 4.2 Space and size — 4px grid

```css
--space-1: 4px;   --space-2: 8px;   --space-3: 12px;
--space-4: 16px;  --space-5: 20px;  --space-6: 24px;  --space-8: 32px;

/* Control sizes — three only */
--control-sm: 24px;   /* ghost/inline buttons */
--control-md: 28px;   /* default: inputs, buttons, selects */
--control-lg: 32px;   /* primary actions, icon buttons */

/* Minimum interactive target. Anything smaller gets an invisible
   ::before expanding the hit area to 32px without changing layout. */
--hit-target-min: 32px;

/* Chrome — all multiples of 4 */
--header-height: 40px;
--tabbar-height: 36px;   /* was 32 */
--devicebar-height: 36px; /* was 38 */
--toolbar-height: 36px;   /* was 38, x6 panels */
--colheader-height: 24px;

/* Data rows — one height, shared by every panel */
--row-height: 28px;
--row-height-lg: 52px;   /* two-line rows: WS connection list */
```

Collapsing 38 → 36 and 34 → 28 both tightens rhythm and gains rows on screen.

### 4.3 Semantic surfaces — distinguish hover from selected

The current palette has no distinct selected token, which is the root cause of 2.16.

```css
--bg-row-hover:    #17171b;  /* was bg-card */
--bg-row-selected: #1e2430;  /* NEW — cool-shifted, distinct from hover */
--bg-row-selected-hover: #232a38;  /* NEW */
--border-selected: var(--accent-primary);  /* 2px left bar on selected rows */
```

Selected rows get a 2px left accent bar *and* a distinct background, so selection
survives both hover and colorblindness. `WatermelonTab.jsx:228` already does the left
bar correctly — that pattern generalizes.

### 4.4 Motion — two durations, one easing, plus a reduced-motion escape

```css
--ease: cubic-bezier(0.2, 0, 0.2, 1);
--duration-fast: 100ms;   /* hover, focus, color, background */
--duration-base: 180ms;   /* enter/exit, expand/collapse, layout */

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 1ms !important;
    transition-duration: 1ms !important;
  }
}
```

Replaces the 60/80/100/120ms spread in 2.20. The reduced-motion block is currently
absent entirely.

### 4.5 Elevation and z-index — name the layers

`zIndex: 1300` (`CursorMenu.jsx:65`) and `1000` (`DeviceTabs.jsx:103`) are unnamed
magic numbers.

```css
--z-sticky:   10;   /* sticky table headers */
--z-resizer:  20;
--z-dropdown: 100;
--z-modal:    200;
--z-menu:     300;  /* context menus above modals */
--z-toast:    400;
```

---

## 5. Layout and alignment rules

### 5.1 One column grid per panel, declared once

Network already does this correctly — `COL_GRID` at `NetworkTab.jsx:21` is shared by
header (`:192`) and rows (`:219`), which is why its alignment holds. Generalize it,
and give every fixed track `overflow: hidden` + `text-overflow: ellipsis` (fixes 2.23).

Widen the cramped tracks:

```css
/* Network: method | url | status | size | time | actions */
--grid-network: 64px minmax(0,1fr) 72px 72px 76px 32px;
/* Console / Logs: level | time | message | caller */
--grid-console: 32px 92px minmax(0,1fr) auto;
/* WebSocket frames: dir | time | badge | payload | size */
--grid-wsframe: 20px 92px auto minmax(0,1fr) 64px;
```

92px for a 12-char `HH:MM:SS.mmm` timestamp at 12px mono, with headroom. 32px level
column fits a 3-char tag plus padding.

### 5.2 The console gutter, derived not hand-computed

Replace `marginLeft: 106` (`ConsoleTab.jsx:363`) with a real grid. The message body
becomes `grid-column: 3`, so it aligns with the message header by construction and
can never drift. This kills 2.15 permanently rather than correcting the number.

### 5.3 Toolbars: one layout for all six panels

```
[filters] [divider] [search ......... flex] [count] [divider] [actions]
   36px tall, 12px horizontal padding, 8px gap, all controls 28px
```

Every panel toolbar today has a different mix of 24/26/28/30px controls. One shared
`<PanelToolbar>` component with slots removes the drift and the duplication.

### 5.4 Master-detail: consistent and resizable

WebSocket's pane is drag-resizable (`WebSocketTab.jsx:263`); Watermelon's is locked at
200px (`:202`). Both should be resizable, both should persist width to
`localStorage`, and both should use the same `<SplitPane>`:

- 8px invisible hit area over the 1px visible line (fixes the 1px target in 2.24)
- `role="separator"`, `aria-valuenow`, arrow-key resize (fixes 2.11's cousin)
- Apply `.active` during drag so the accent holds (fixes the dead class in 2.31)
- Set `user-select: none` on `<body>` during drag
- Replace Network's percentage basis (`NetworkTab.jsx:143`) with `px` + `minmax`, so
  the fixed 280px of grid tracks can't collapse the URL column at 22%

### 5.5 Focus ring that's visible on every surface

`theme.css:198` uses `outline-offset: -1px`, which draws *inside* the element and gets
clipped by neighbours in dense tables.

```css
:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 1px;
  border-radius: var(--radius-sm);
}
/* Dense rows can't afford an outset ring — use an inset shadow instead */
.row:focus-visible {
  outline: none;
  box-shadow: inset 0 0 0 2px var(--accent-primary);
}
```

---

## 6. Animation specification

Motion the app should have, and what each instance is *for*. Everything uses
`--duration-fast` or `--duration-base` and honours `prefers-reduced-motion`.

| Where | Motion | Duration | Why |
|---|---|---|---|
| Row hover | background | fast | Pointer feedback |
| Row select | background + left bar scaleY | fast | Confirm the click landed |
| New row arrives | 120ms accent left-border flash, fading out | base | Draw the eye to new data without moving anything |
| Pending request | shimmer sweep on the status cell | 1.2s loop | Distinguish in-flight from finished |
| Request completes | one-shot background flash in the status color | base | Show the state change |
| Tab switch | 2px underline slides between tabs | base | Show where you came from |
| Panel content swap | 4px slide-up + fade | base | Establish hierarchy |
| Detail pane open | width expand from 0 | base | Show it came from the row |
| Section expand | grid-rows 0fr→1fr | base | Real height animation, no max-height hack |
| Context menu | fade + 2px slide + 0.98→1 scale, origin at cursor | fast | Show it came from the pointer |
| Modal | backdrop fade; card 8px slide-up + 0.98→1 scale | base | Focus attention |
| Toast | slide in from edge | base | Non-blocking notice |
| Auto-refresh active | `RefreshCw` rotates continuously | 2s loop | Fixes the no-op at `StorageTab.jsx:241` |
| Connection status | dot pulses while waiting, steady when connected | 2s loop | Shows liveness |
| Copy success | icon morphs to a check, holds 1.2s, morphs back | fast | Inline confirmation, no toast needed |
| Update download | determinate progress bar | — | Real progress, already wired |
| Skeleton loading | shimmer on placeholder rows | 1.2s loop | Fixes the absent loading state (2.26) |

Two rules: never animate `width`/`height`/`top`/`left` on scroll-adjacent elements
(use `transform`/`opacity`), and never animate anything inside a virtualized row on
scroll — row recycling makes enter animations fire on reused nodes.

### The "new row" flash, concretely

The most valuable animation in a live debugger, and it's absent today. It must not
shift layout:

```css
@keyframes row-enter {
  from { box-shadow: inset 2px 0 0 var(--accent-primary); background: var(--bg-row-hover); }
  to   { box-shadow: inset 2px 0 0 transparent;           background: transparent; }
}
.row--new { animation: row-enter var(--duration-base) var(--ease); }
```

Applied by comparing `seq` against the highest seen on the previous render — not by
index, which recycling would break.

---

## 7. Virtualization strategy

Two panels virtualize, three don't, and one of the three polls every 2 seconds. The
current hook is solid for fixed rows but can't handle the variable-height console.

### 7.1 Fix the existing hook

`useVirtualRows.js` needs three changes:

1. **`endIdx: 60` initial state** (`:22`) renders 60 rows on first paint regardless of
   viewport. Should be 0 until measured, then computed in `useLayoutEffect`.
2. **No scroll reset on dataset change.** When a filter shrinks the list
   (`NetworkTab.jsx:105`), `scrollTop` is untouched and you can be left staring at
   spacers. Reset to 0 when the filter key changes.
3. **Callers must stop using index keys** (2.22). Every row needs a stable id.

### 7.2 Variable-height virtualization for the console

The console can't use fixed rows: messages wrap, stack traces are multi-line, and
warn/error rows cap at 200px (`ConsoleTab.jsx:326`). Plan:

- Estimate height per row from content length; render, then measure with
  `ResizeObserver`; cache real heights in a `Map` keyed by log id
- Maintain a prefix-sum array of offsets for O(log n) binary-search lookup
- Anchor scroll to a row id, not a pixel offset, so measurement corrections don't jump
- Keep the 200px cap with a gradient fade and a two-way expand toggle (2.29's
  "Show more" is one-way at `:377`)

This is the largest single piece of work in the redesign and the highest payoff.

### 7.3 Storage and Watermelon

Both are `<table>` with intrinsic row heights. Two options:

- **Preferred:** switch to a CSS-grid list with a fixed 28px row and a `⌄` expander
  for long values. Enables the standard fixed-height hook, and long JSON stops making
  one row 400px tall.
- **If the table must stay:** `content-visibility: auto` +
  `contain-intrinsic-size: 0 28px` per row. One line, no JS, no virtualization
  bookkeeping, works with `tableLayout: fixed`.

Also fix the polling: pause the interval when the window is hidden
(`document.visibilityState`) and when the tab isn't focused. Right now
`RnspyDevtoolsPage.jsx:165` and `:176` poll forever.

### 7.4 Tailing

`stickyBottom` exists but is invisible. Add a "⬇ N new" pill that appears when the
user scrolls away from the bottom, showing how many rows arrived since. Clicking it
calls the already-exposed `scrollToBottom` (`useVirtualRows.js:94`).

---

## 8. Accessibility plan

Concrete remediation for §2's P1 findings.

**Rows → composite widget.** Wrap each list in `role="grid"` with
`aria-rowcount`, rows as `role="row"` + `aria-selected`, cells as
`role="gridcell"`. Roving `tabIndex`: the container is one tab stop; `↑`/`↓` move the
active row, `Home`/`End` jump, `Enter` opens detail, `Space` selects,
`Shift+F10`/`ContextMenu` opens the row menu. This single change makes the app
keyboard-usable and fixes 2.8.

**Hover-only buttons must respond to focus.** Replace every
`opacity: 0` + `:hover` reveal with:

```css
.row-action { opacity: 0; transition: opacity var(--duration-fast) var(--ease); }
.row:hover .row-action,
.row:focus-within .row-action,
.row-action:focus-visible { opacity: 1; }
```

And mount the console copy button always, rather than conditionally on hover
(`ConsoleTab.jsx:387`), so it can be focused at all.

**One `<Modal>` primitive** replacing four hand-rolled overlays: `role="dialog"`,
`aria-modal="true"`, `aria-labelledby`, focus trap, focus restore on close, Escape to
dismiss, `position: fixed` + a portal (fixes 2.10 and 2.32 together).

**`CursorMenu` → real menu.** `role="menu"`, `role="menuitem"`, `role="separator"` on
dividers, `role="group"` + `aria-labelledby` for `MenuLabel` sections. Focus the first
item on open, `↑`/`↓` to move, `Home`/`End`, type-ahead, Escape closes and restores
focus. Also stop closing on the menu's own scroll (`CursorMenu.jsx:46`) and flip
above the cursor when there's no room below.

**`ClickablePath` → `<button>`, not `role="button"` `<span>`.** Handles `Enter` *and*
`Space` for free. Fixes the tab-stop explosion (2.12) with `tabIndex={-1}` on links,
reachable via the row's own keyboard model instead of the global tab sequence.

**`aria-pressed` on every filter toggle** (`ConsoleTab.jsx:150`, `LogsTab.jsx:70`,
`StorageTab.jsx:195`), plus a check glyph so state isn't color-only.

**`aria-live` for streams.** `role="log"` + `aria-live="polite"` on the console and
logs viewports, `aria-live="assertive"` on error toasts. Announce level names in full
("warning", not "WRN") via `<span class="sr-only">`.

**Labels.** Every search input gets a real `aria-label` — currently none of the six
have one. Modal `<label>`s get `htmlFor`/`id` pairs (`StorageTab.jsx:478` etc. are
decorative today).

**Contrast.** `--text-tertiary: #6c6c76` on `--bg-panel: #111114` is roughly 4.1:1 —
under the 4.5:1 AA threshold for the 12px text it's used for. Lighten to `#82828d`
(~5.4:1). Note full WCAG conformance needs manual testing with real assistive tech and
expert review; this is a token-level fix, not a compliance claim.

---

## 9. Per-panel plan

**Network.** Real timing bar from actual duration, waterfall-style (fixes 2.2).
Sortable column headers — they already look sortable. Status as `badge + code`, method
as a shaped badge (kills color-only). Widen tracks per §5.1. Distinct selected style.
Add a filter-empty state (2.27). Wire the advertised `⌘C`/`⌘⇧C` or drop the hints
(2.30). Move the body copy button out of the `<pre>` overlay (`:633`) into the section
header so it stops covering line one and scrolling away.

**Console.** Variable-height virtualization (§7.2). Grid gutter (§5.2). Sticky-bottom
tailing + "N new" pill. Two-way expand. Level filters get `aria-pressed` + check
glyph. Reserve count-badge width to stop layout shift (2.25). Fix link color: don't
pass row color into `ClickablePath` (`:372`) or links stop looking like links on error
rows. Extract the 4× duplicated VS Code error string (2.33).

**WebSocket.** Move hover to CSS so it survives re-render (2.21). Stable frame keys
(2.22). Direction as arrow + `SEND`/`RECV` text, not a green tint. 92px timestamps.
Delete `prettyBody` and `isSignalRFrame` (2.31). Apply `.active` to the resizer.

**Storage.** Virtualize (§7.3). Confirm before delete (2.6). Await device ack before
the success toast (2.5). Real `<thead>`. Full type labels, not `.slice(0,3)`. Row
hover. A loading state so the first fetch stops reading as "no backends" (2.26).
Uniform 28px controls. Backend tabs need overflow handling.

**WatermelonDB.** Keep pagination visible while searching, and label search as
scoped to loaded rows (2.3). Timeout + error surface on `loadMore` so it can't
deadlock (2.4). Virtualize. Resizable sidebar. Loading state. `tableLayout: fixed` so
the 280px cell cap is actually enforceable.

**Logs.** Filter-aware empty copy (2.27). Stable keys. `aria-pressed`. Expandable
multi-line rows for stack traces (2.23). Search should cover level and tag, not just
`message` (`LogsTab.jsx:41`). Tailing indicator.

**Shell.** Unify chrome to the 36px scale. `role="tablist"`/`tab` on both tab bars
with arrow-key navigation. Device tabs get keyboard access and a focus-visible close
button. Sliding tab underline. A command palette (`⌘K`) would suit this app well —
jump to panel, jump to device, run an action.

---

## 10. Six theme directions

All six are in `docs/theme-mockups/`, each a single self-contained HTML file with no build
step and no network dependency. Every one renders the **same** realistic scene — the
network panel with 60 seeded requests, a live-streaming console, device tabs, a
detail pane — so you're comparing visual language, not content.

Each demonstrates working virtualization (scroll the list; only visible rows are in
the DOM, with a live row counter), the new-row flash, hover/selected/focus states,
skeleton loading, and keyboard row navigation.

| # | Name | Direction |
|---|---|---|
| 1 | **Graphite** | Refined evolution of today's look. Neutral greys, green accent, tightest density. Lowest-risk. |
| 2 | **Midnight** | Deep blue-black, indigo accent, soft elevation. Linear-adjacent, calm on the eyes. |
| 3 | **Terminal** | High-contrast near-black, phosphor green, mono-forward, square corners. Unapologetically a tool. |
| 4 | **Aurora** | Dark slate with a violet→cyan gradient accent, glass surfaces, generous glow. The most "designed". |
| 5 | **Paper** | Light theme done properly. Warm off-white, ink text, restrained colour. For bright rooms. |
| 6 | **Neon Brut** | Brutalist dark. Thick borders, hard shadows, magenta/lime, chunky type. Maximum personality. |

My recommendation: **Midnight** for the product default — it reads as a serious tool,
is easiest on the eyes for long sessions, and its accent leaves red/amber/green free
for semantics. **Graphite** is the safe pick if you want the smallest visual delta.
**Neon Brut** is the boldest and the one most likely to divide opinion.

---

## 11. Sequencing

**Phase 1 — correctness.** Timing bar, Watermelon search/pagination, `loadMore`
deadlock, optimistic toasts, delete confirmation, dead code. Small, high-value, no
visual risk.

**Phase 2 — tokens.** Add the new tokens, migrate sub-11px fonts, unify chrome to 36px
and controls to 24/28/32, one transition scale, `prefers-reduced-motion`.

**Phase 3 — primitives.** `<PanelToolbar>`, `<DataGrid>`, `<Modal>`, `<SplitPane>`,
`<Badge>`, `<EmptyState>` with all four states. Most of §2's inconsistency is six
copies of the same thing drifting apart.

**Phase 4 — virtualization.** Fix the hook, then console variable-height, then storage
and Watermelon, then visibility-aware polling.

**Phase 5 — accessibility.** Grid keyboard model, focus-visible affordances, menu
semantics, aria-live, contrast.

**Phase 6 — motion.** The §6 table, once layout is stable.

Phases 1 and 2 are independent and can ship immediately. Phase 3 unlocks 4–6.
