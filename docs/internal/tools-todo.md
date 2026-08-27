# Tools Section — Implementation TODO

Static code analysis screen for React Native projects. User picks a folder, gets a
dashboard + charts + a clickable results list that opens files at a line in their editor.

**Status:** planned, not started
**Last updated:** 2026-07-31

---

## Locked decisions

| # | Decision |
| - | -------- |
| 1 | **Checks (6):** broken imports, unused files, unused deps, missing deps, circular deps, `console.*` left in source. *Not building:* TODO/FIXME, large files, unreferenced assets, secret scanning. |
| 2 | **Resolution fidelity:** resolve through real config (tsconfig `paths`, babel aliases, platform extensions, asset variants). Anything still unconfirmed is **skipped, not reported broken**. Bias = false negatives over false positives. |
| 3 | **Unused files:** advisory only. Confidence tiers. **Never** offer delete — no delete IPC at all. |
| 4 | **Charts:** hand-rolled SVG, zero new dependencies. **Nav:** rebuild the vertical icon rail. |
| 5 | **Editors:** auto-detect installed + preference in Settings. Fix the silent-success macOS bug. |

---

## Constraints that will break the feature if missed

Each of these was verified against the actual RN/Expo templates and knip's plugin
definitions. They are not speculative.

- [ ] **expo-router is catastrophic if missed.** `"main": "expo-router/entry"` means every
      file under `src/app/**` (wins) or `app/**` is a route — default-exported,
      filesystem-routed, **imported by nothing**. Naive BFS reports the entire app as
      unused. Treat the routes dir as a root *glob*, not a file list. Honor the
      `["expo-router", { root }]` override.
- [ ] **Bare RN template has no `main` field.** Native hardcodes `index.js`
      (`$ENTRY_FILE` in Xcode, `react { entryFile }` in Gradle). Treating absent `main`
      as an error breaks the most canonical RN shape. Verify `projectSetup.js`
      `findEntryFile` doesn't error on this.
- [ ] **`*.jsbundle` / `*.hbc` are the whole app in one file** (`ios/main.jsbundle`,
      `android/app/src/main/assets/index.android.bundle`). Walking them as source =
      thousands of phantom requires, every dep looks used, multi-MB regex pass. Hard skip.
- [ ] **Modern Expo has no `babel.config.js`, `metro.config.js`, `ios/`, `android/`,
      `index.js`, or `App.tsx`.** Those appear only after `expo prebuild` / `expo customize`.
      Requiring them misdetects every managed project.
- [ ] **Three separate sets, not one skip list.** Conflating them causes most false positives:
      - **walk-skip** — never `readdir` into it
      - **resolve-reachable** — walk-skipped but must still resolve (`node_modules/**`,
        `dist/**`, `expo-env.d.ts`, `.expo/types/**`), or you emit false "broken import"
      - **root-set** — BFS entry points
- [ ] **`.gitignore`: filter the walk, never resolution, never as "unused" evidence.**
      `expo-env.d.ts` is gitignored *and* in tsconfig `include`. `/ios` + `/android` are
      gitignored in the Expo template but hold the authoritative `entryFile`.
- [ ] **Native autolinking is RN-only.** A dep can be 100% native with zero JS, linked by
      mere presence in `package.json`. So `react-native-*` → report at **low** confidence
      with a reason, never high. But don't blanket-whitelist the prefix — real dead deps
      hide there.
- [ ] **Builtin check must run *after* the alias map.** Polyfill collisions (`buffer`,
      `process`, `path`, `crypto`, `stream`, `url`, `events`, `util`, `assert`) are common
      in RN via `extraNodeModules`.
- [ ] **Iterative DFS for cycles.** Recursion blows the stack on a deep RN graph.
- [ ] **`.metroignore` does not exist** (Metro uses `resolver.blockList` regex).
      `.watchmanconfig` is not an ignore file. `node_modules/expo/AppEntry.js` is legacy
      (SDK ≤49) — check `expo-router/entry` first. `.eslintignore` is deprecated in ESLint 9.

> **Calibration:** depcheck needed a hand-written parser per mechanism and still documents
> false alerts. knip has 178 plugins and still lists unused-dependency false positives as a
> standing issue. This is not fully solvable — hence generous whitelists, confidence tiers,
> and no auto-fix.

---

## Phase 1 — Editor support

`src/main/editors.js` (new). Independent; ships value on its own.

- [ ] `EDITORS` table: `{ id, label, bin[], args(file, line, col), scheme }`.
      VS Code, Cursor, Windsurf, Zed, WebStorm, Sublime.
      WebStorm uses `--line N <file>` — a different arg *shape*, so this must be a table
      of functions, not a string swap.
- [ ] `detectEditors()` — probe each binary once, cache. Returns `[{ id, label, path, available }]`.
- [ ] `openInEditor({ file, line, column, projectRoot, editorId })`:
  - [ ] verify the file **exists** first → `{ ok: false, reason: 'file-not-found' }`
  - [ ] drop `shell: true` (a scanned tree can contain `$(...)` in filenames)
  - [ ] don't treat `shell.openExternal` resolution as success when no binary was found
        (fixes the silent macOS failure)
- [ ] Rewire `rnspy:open-in-editor` to delegate here. **Keep the channel name and return
      shape** so `ConsoleTab` / `ClickablePath` keep working.
- [ ] Add `rnspy:detect-editors` + preload wrapper.
- [ ] Persist as `rnspyDevtoolsEditor` in localStorage; EDITOR section in
      `RnspySettingsModal`; matching `removeItem` in `resetAll`.

---

## Phase 2 — Analysis engine

`src/main/codeAnalysis/` (new). Runs in a `worker_thread` — the main process also serves
live device WebSocket traffic, and a blocking scan would stall IPC and jank the UI.
Plain functions, no Electron imports, so it stays harness-testable.

### 2a. `projectProfile.js` — must run first, everything depends on it

- [ ] `kind`: `bare-rn` | `expo-managed` | `expo-router` | `expo-prebuilt`
- [ ] `routesDir`: `src/app` (wins) | `app` | plugin `root` override
- [ ] `aliases` — merge **three** sources: tsconfig/jsconfig `paths` + `baseUrl`,
      babel `module-resolver` `alias`/`root`, jest `moduleNameMapper`.
      Regex-extract only — **never execute** (untrusted user code).
- [ ] `monorepo` detection: `workspaces`, `pnpm-workspace.yaml`, `lerna.json`, `nx.json`,
      `turbo.json`, parent `package.json#workspaces`, symlinked `node_modules`.
      Sets a degraded-confidence flag.
- [ ] `configRefs` — harvest package names from:
  - [ ] babel `presets`/`plugins` — handle array form `[name, opts]`, subpath
        (`react-native-worklets/plugin` → `react-native-worklets`), and implicit
        prefixing (`foo` → `babel-plugin-foo`, `module:foo` → `foo`)
  - [ ] eslint `extends`/`plugins`/`parser` — same implicit-prefix rules
        (`airbnb` → `eslint-config-airbnb`)
  - [ ] jest `preset`, `setupFiles`, `transform`, `moduleNameMapper`, `reporters`,
        `testEnvironment`, and **`transformIgnorePatterns`** (a regex alternation of
        package names — often the only reference to `@react-navigation`, `expo`)
  - [ ] `app.json` / `app.config.*` expo `plugins[]`
  - [ ] prettier `plugins`, tsconfig `extends` + `types`
  - [ ] `package.json#scripts` binaries, with `IGNORED_GLOBAL_BINARIES`
        (`xcodebuild`, `xcrun`, `codesign`, `pod`, `bundle`, `gem`, `node`, `npx`, `git`, …)
        or `"ios": "xcodebuild …"` reports `xcodebuild` as a missing dep.
        Note bin name ≠ package name (`npx commitlint` → `@commitlint/cli`)
  - [ ] Podfile + `settings.gradle` `require.resolve`, `react-native.config.js`
- [ ] `assetRefs` — string paths from `app.json` (`icon`, splash, `adaptiveIcon`
      fore/back/mono, `favicon`, `googleServicesFile`), `expo-font` `fonts[]`,
      `react-native.config.js` `assets[]`
- [ ] `entryFileDeclarations` — `android/app/build.gradle` `react { entryFile }` and
      iOS `project.pbxproj` `$ENTRY_FILE`. Authoritative when present.

### 2b. `walker.js`

- [ ] Recursive `readdir(withFileTypes)` — one syscall per dir, not a `stat` per entry.
- [ ] Walk-skip set (see appendix).
- [ ] Layer the target's `.gitignore` on top as an *additional* filter. Hand-rolled
      matcher: later rules win, leading `/` anchors, trailing `/` = dirs only, no-slash =
      any depth, `**`, `!` negation.
      Gotcha: you cannot re-include a file whose **parent dir** is excluded — that's why
      the RN template uses `.yarn/*` not `.yarn/` before its `!.yarn/patches` lines.
- [ ] Never-skip override: `expo-env.d.ts`, `.expo/types/**`, `**/*.d.ts`, `.husky/**`,
      `.yarn/patches/**`.
- [ ] `maxFiles` cap + symlink loop guard (realpath set).
      **Walker does not follow symlinks; resolver does.**

### 2c. `resolver.js` — the correctness core

- [ ] Relative/aliased order: exact → **all** platform variants
      (`.ios`/`.android`/`.native`/`.web`/`.windows`/`.macos`/`.default`) ×
      (`.js`/`.jsx`/`.ts`/`.tsx`/`.mjs`/`.cjs`) → plain exts → `/index.*` barrels →
      asset variants (`@2x`/`@3x` + image exts)
- [ ] **Mark all existing platform variants as reached**, not just the first match —
      otherwise the siblings look orphaned.
- [ ] `/index.*` is mandatory: omitting it makes every barrel look orphaned *and* every
      import through one look broken.
- [ ] Bare specifiers: alias map → node builtins → `package.json` deps/devDeps/peerDeps →
      `node_modules` walking **upward** from the importing file (monorepo hoisting).
      Strip deep imports to the package name, respecting `@scope/`.
- [ ] Returns `{ status: 'resolved' | 'broken' | 'skipped', target?, reason? }`.
      `skipped` covers dynamic/computed specifiers, cross-workspace escapes, unbuilt
      sibling `dist/`, and anything alias-shaped we can't confirm.

### 2d. `parse.js`

- [ ] Extract `import` / `require` / `export … from` / dynamic `import()` + line numbers.
- [ ] **Strip comments and string literals first** or comment text yields phantom imports.
- [ ] `splitLines` for CRLF-safe line numbers.
- [ ] Also collect all string literals per file (cheap) to power the "basename appears in
      any string literal" heuristic — kills a large share of the dynamic-require
      false-positive class.

### 2e. `checks.js`

- [ ] **brokenImports** — `status === 'broken'` only. Severity error.
- [ ] **unusedFiles** — BFS from the union root set. Tiers:
  - **Excluded entirely (never shown):** `routesDir/**`, `**/*.d.ts`, `public/**`,
    `__snapshots__/**`, `__mocks__/**` (the dir name *is* the API), anything in
    `assetRefs`, `app-example/**`
  - **Low:** platform-suffixed variants, `__tests__`/`*.test.*`/`*.spec.*`,
    `*.stories.*`, `index.*` barrels, basename appears in any string literal, dirs
    targeted by `require.context` or a template-literal require
  - **Medium:** >50% of directory siblings reachable
  - **High:** plain module, no string mention, siblings reachable, not config-referenced
- [ ] **unusedDeps** — deps − imported − `configRefs` − whitelist (see appendix).
      `react-native-*` → low confidence, "may be native-autolinked".
      `@types/X` → separate sub-reason (X may now ship its own types);
      `IGNORE_DEFINITELY_TYPED = node, bun, jest`.
- [ ] **missingDeps** — imported bare specifiers absent from `package.json`.
      Builtin check **after** the alias map. If monorepo detected → downgrade all to low
      confidence + banner (hoisting otherwise causes mass false positives).
- [ ] **circularDeps** — iterative DFS. Dedupe each cycle by canonical rotation.
- [ ] **consoleUsage** — `console.*` sites + line numbers, reusing the same
      comment/string stripping. UI filters by method. Note `transform-remove-console` in
      babel plugins means they already strip it in release.

### 2f. Root set — union, dedup by realpath, BFS from all at once

- [ ] **expo-router:** every file under `routesDir/**` — a glob, not a file list.
      *Highest-impact rule in the engine.*
- [ ] **bare RN:** `index.{js,ts,tsx,jsx}` + `index.{ios,android,native}.js`; absent
      `main` is fine
- [ ] **expo managed:** `main` → `index.js` → `App.*`; legacy `expo/AppEntry.js` →
      synthesize `App.{js,jsx,ts,tsx}` (do **not** follow into `node_modules`)
- [ ] `package.json` `main` / `exports` / `react-native` / `module` / `browser`
- [ ] `entryFileDeclarations` from `build.gradle` / `pbxproj`
- [ ] jest `setupFiles` / `setupFilesAfterEnv` / `globalSetup`, `jest.setup.*`,
      `.detoxrc`, `.storybook/main`, local expo plugin paths (`./plugins/withFoo.js`),
      `scripts/*.js` referenced from `package.json#scripts`, `ReactotronConfig.js`
- [ ] Config files feed `configRefs`/`aliases` **only** — never module-graph roots, or
      `babel.config.js` makes `@react-native/babel-preset` look like an app-code import.

### 2g. `worker.js` + `index.js`

- [ ] Worker posts `{ phase, done, total, file }` progress; parent forwards to renderer.
- [ ] Cancellable via flag + `worker.terminate`.

---

## Phase 3 — IPC + preload

- [ ] `rnspy:pick-analysis-folder` (separate channel from the setup picker so the two
      folders stay independent)
- [ ] `rnspy:run-analysis` `{ dir, checks[] }`
- [ ] `rnspy:cancel-analysis`
- [ ] Push channel `rnspy:analysis-progress`
- [ ] Gate on `detectRnProject`; validate every path with `isInside` before reading
- [ ] Preload: camelCase wrappers + `onAnalysisProgress(cb)` returning an unsubscribe fn
      (matches the existing `onEvent`/`onStatus`/`onLog` convention)

---

## Phase 4 — Nav shell

Independent of Phases 2–3; can land in parallel.

- [ ] Lift shared fs helpers out of `projectSetup.js` into `src/main/fsUtils.js`
      (`readTextIfExists`, `isFile`, `isDirectory`, `isInside`, `splitLines`) and
      re-import them there, so analyzer and setup share one copy.
      Needs a swallow-all-errors read variant — a walk over an arbitrary tree hits
      EACCES/EISDIR.
- [ ] **Re-run the `projectSetup` 70/70 harness after this refactor — must still be 70/70.**
- [ ] `src/renderer/layout/IconRail.jsx` (new) — 48px vertical rail, `--bg-sidebar`,
      top 62px draggable spacer for traffic lights, `IconRailButton`
      `{ icon, label, active, onClick, title }` with an active left-edge accent.
      Entries: `Smartphone` → `/rnspy`, `Wrench` → `/tools`.
- [ ] `App.jsx` → shell: `[IconRail | flex column route outlet]`. `useLocation` for
      active state, `useNavigate` for dispatch. Routes are inline string literals in
      `App.jsx` (the old `constants/routes.js` was deleted as dead code) — either add
      `/tools` inline or reintroduce a routes module if the rail needs shared constants.
- [ ] `RnspyDevtoolsPage.jsx` header: **drop** the 62px spacer (the rail now covers the
      traffic lights), **keep** `titlebar-drag`.
      ⚠️ The header is currently the only draggable region in the app — get this wrong and
      the window stops being draggable.

---

## Phase 5 — Tools screen

`src/renderer/components/tools/`

- [ ] `ToolsPage.jsx` — folder picker, check selection, run/cancel, phase state
- [ ] `ToolCard.jsx` — per-check enable + result counts
- [ ] `Dashboard.jsx` — summary stat tiles
- [ ] `charts/BarChart.jsx` + `charts/DonutChart.jsx` — hand-rolled SVG, ~40 lines each,
      respect `prefers-reduced-motion`
- [ ] `ResultsList.jsx` — virtualized via `useVirtualRows` (`stickyBottom: false`),
      **stable keys** (existing tabs use `key={startIdx + i}`, wrong for a
      sortable/filterable list), severity badge, `file:line`, click → `openInEditor`,
      right-click `CursorMenu` → copy path / copy line / reveal in Finder
- [ ] `ProgressBar.jsx`
- [ ] Export `PathLink` from `ClickablePath.jsx` and reuse it.
      Don't reuse the outer component — it's a text scanner that skips `node_modules`
      paths, which would silently drop rows.
- [ ] `--chart-1..6` tokens in `theme.css` for **both** themes.
      `--method-*` and `--diff-*` have no light-theme values and would fail contrast.
- [ ] States: idle / scanning / error / no-results / results grouped by check with counts
- [ ] Monorepo banner when the degraded-confidence flag is set

---

## Phase 6 — Docs

- [ ] New `docs/tools.md`
- [ ] `docs/architecture.md` — rail + shell + `codeAnalysis`
- [ ] `docs/features.md`, `docs/configuration.md` (editor preference), `README.md`
- [ ] Fix stale `docs/internal/devtools-reference.md` — `/rnspy-devtools` route and the IconRail references

---

## Verification

Throwaway `.mjs` harness against synthetic fixtures with **known answers**. Assert exact
counts per check — the only way to prove the false-positive bias actually holds.
(`package.json` has no `"type": "module"`, so this needs `.mjs` copies, as with the
`projectSetup` harness.)

- [ ] **A — expo-router.** `main: "expo-router/entry"`, `src/app/_layout.tsx` +
      `src/app/index.tsx` + `src/app/(tabs)/index.tsx` + a component imported by a route.
      **Assert `unusedFiles === 0`.** Highest-value assertion in the suite.
      Variant: both `app/` and `src/app/` present → `src/app/` wins.
- [ ] **B — bare RN with no `main`.** Entry resolves to `index.js`, no error,
      `unusedFiles === 0`.
- [ ] **C — resolution fidelity.** `./Foo` satisfied only by `Foo.ios.tsx` (and assert
      `Foo.android.tsx` also counts as reached); `@/components/X` via tsconfig paths;
      babel `module-resolver` alias; jest `moduleNameMapper`; `require('./img.png')` →
      `img@2x.png`; `./components` → barrel.
      **Assert `brokenImports === 0`**, plus one real `./DoesNotExist` → `1`.
- [ ] **D — dependency mechanisms.** Deps referenced *only* via: babel
      `['module:@react-native/babel-preset']`, array form `[['module-resolver', {…}]]`,
      subpath `react-native-worklets/plugin`, eslint `extends: 'airbnb'`, jest
      `transformIgnorePatterns`, `app.json` plugins, a script binary, a Podfile
      `require.resolve`. Plus `@types/*` and `typescript`.
      **Assert `unusedDeps === 0`**, then one truly dead dep → `1`.
- [ ] **E — missingDeps.** Bare import absent from `package.json` → `1`.
      Dep `buffer` aliased in `extraNodeModules` + `import 'buffer'` → **not** missing.
      `"ios": "xcodebuild …"` → `xcodebuild` not missing.
- [ ] **F — unusedFiles tiers.** `__tests__/x.test.ts`, `*.stories.tsx` → low, not high.
      `__mocks__/pkg.js`, `*.d.ts`, `public/**`, `expo-env.d.ts`, `app.json` assets →
      excluded entirely. Basename in a string literal → low.
      One plain unreferenced module → exactly 1 high.
- [ ] **G — walker.** `ios/main.jsbundle` skipped (assert it's absent *and* that no dep
      became "used" through it). Nested `.gitignore`. `.yarn/*` + `!.yarn/patches`
      re-inclusion. Symlink loop terminates. A `$(...)` filename → injection guard.
- [ ] **H — circularDeps.** 3-file cycle → exactly 1 cycle, reported once (canonical
      rotation, not 3). A 5000-node chain → no stack overflow.
- [ ] **I — parse hygiene.** Import-like string in a `//` comment and in a template
      literal → not reported. `console.log` in a comment → not reported. CRLF file →
      exact line numbers.
- [ ] **J — monorepo.** Parent `workspaces` + hoisted `node_modules` → missingDeps
      downgraded + banner set, **not** dozens of false positives.

Beyond the harness:

- [ ] `npm run build` (catches the `fsUtils` refactor breaking `projectSetup` imports)
- [ ] `npm run dev` — both rail screens, **window draggable on both** (the titlebar
      restructure is the risky bit)
- [ ] Light + dark theme on the charts
- [ ] Cancel mid-scan
- [ ] Scan a large real tree and confirm live device traffic keeps flowing — proves the
      worker isn't blocking the WS server
- [ ] Editor detection: preference persists; a missing editor reports a real error
      instead of silently succeeding

---

## Out of scope

- Deleting or auto-fixing anything (read-only advisory, decision #3)
- Real monorepo/workspace support — detect and degrade only
- Full Metro resolution (haste, `extraNodeModules` edge cases, custom `resolverMainFields`)
- Executing `babel.config.js` / `metro.config.js` / `app.config.js` (untrusted — regex only)
- Type checking, lint rules, dead code *within* a file, unused exports
- Watch mode / re-analyze on change
- Persisting results across restarts

---

## Appendix A — walk-skip globs

```
**/node_modules/**          # but MUST stay resolve-reachable
.git/**                     # except .git/hooks
.expo/**                    # except .expo/types/**
.expo-shared/**
ios/Pods/**
ios/build/**
**/DerivedData/**
**/*.xcodeproj/**           # these are directories
**/*.xcworkspace/**
android/build/**
android/**/build/**         # recursive — library modules have their own
android/.gradle/**
android/.cxx/**
android/.kotlin/**
**/vendor/bundle/**
.yarn/cache/**
.yarn/unplugged/**
.pnpm-store/**
.turbo/**
.nx/cache/**
.next/**
**/coverage/**
.nyc_output/**
.husky/_/**                 # NOT .husky itself — hooks reference npm binaries
dist/**                     # walk-skip only; valid monorepo import target
build/**
web-build/**
app-example/**              # expo reset-project output; real source, parked
public/**                   # Metro web static host, URL-referenced only
**/*.jsbundle               # CRITICAL — the whole app in one file
**/*.hbc
**/*.map
**/*.orig.*
```

Metro/Jest caches live in `os.tmpdir()`, not the project — don't bother matching them.
What *does* land in-project: `.metro-health-check*`, `node_modules/.cache/**`,
`*.tsbuildinfo`.

## Appendix B — unused-dependency whitelist

Pattern-matched (survives new packages):

```
^@types/            ^@babel/              ^babel-plugin-      ^babel-preset-
^@react-native/     ^@react-native-community/cli               ^metro($|-)
^@expo/             ^eslint($|-)          ^@typescript-eslint/
^jest($|-)          ^@testing-library/    ^@sentry/           ^reactotron-
```

Explicit names:

```
typescript  prettier  react  react-native  react-dom  react-native-web
react-native-svg-transformer  react-native-worklets  patch-package  pod-install
husky  lint-staged  detox  sharp-cli  expo-router  babel-preset-expo  jest-expo
react-test-renderer  @babel/runtime
```

⚠️ Do **not** blanket-whitelist `^react-native-` — that's where genuinely dead deps hide.
Report them at low confidence with "may be native-autolinked".

## Appendix C — load-bearing files that look orphaned

| Pattern | Why it's reachable |
| ------- | ------------------ |
| `app/**`, `src/app/**` | expo-router filesystem routes — imported by nothing |
| `**/*.{ios,android,native,web,windows,macos,default}.{js,jsx,ts,tsx}` | only one variant matches the literal specifier |
| `**/__tests__/**`, `*.test.*`, `*.spec.*` | invoked by the runner |
| `**/__mocks__/**` | dir name + filename *are* the API (jest automock) |
| `**/*.d.ts`, `expo-env.d.ts`, `.expo/types/**` | ambient, via tsconfig `include` |
| `**/index.*` barrels | reached by directory specifiers |
| `public/**` | Metro web static host, URL-referenced |
| assets in `app.json` | `icon`, splash, `adaptiveIcon`, `favicon`, `googleServicesFile` |
| fonts by string | `react-native.config.js` `assets`, `expo-font` `fonts[]` |
| `jest.setup.*`, `.detoxrc`, `plugins/withFoo.js`, `scripts/*.js` | config-only entry points |
| `.storybook/**`, `*.stories.*` | collected by a `require.context` glob |
| `global.css` | referenced only from `metro.config.js` via `withNativeWind` |
| computed requires | `require(\`./locales/${lang}.json\`)`, `require.context(...)` |

## Appendix D — sources

react-native-community/template · expo-template-default ·
expo-template-bare-minimum · knip `src/constants.ts` + plugin docs (react-native, expo,
metro, babel, jest) + handling-issues guide · depcheck README · Expo docs (router
core-concepts, src-directory, metro, babel, monorepos, easignore) ·
Reanimated 4 getting-started
