// src/main/routeResolver.js
// Route name → source file resolution for the Navigation panel.
//
// React Navigation's state carries route names and keys, never file paths, so a
// clicked route has to be matched back to a file in the user's project.
//
// Filename guessing alone is not good enough. Real apps put every screen in
// `Something/index.js`, so dozens of candidate files share the same basename and
// the name that identifies the screen lives in the *directory*. Worse, a loose
// content search happily matches the navigator file itself and then confidently
// opens the wrong file.
//
// So resolution is tiered, strongest first, and each tier is authoritative
// rather than heuristic where it can be:
//
//   1. SCREEN MAP     `<Stack.Screen name="X" component={Y} />` pairs a route
//                     with a component binding, and the file's own imports say
//                     where Y lives. This is what the app itself declares.
//   2. IMPORT MAP     The component name (captured by the SDK at runtime) looked
//                     up in every import across the project.
//   3. DECLARATION    A file that declares/exports the component by name.
//   4. FILENAME       Path-based scoring, including `Name/index.js`.
//
// Tiers 1 and 2 resolve import specifiers the way Metro does, including
// directory → `index.js`, which is exactly what makes the `index.js` case work.
// A tier only contributes when it is confident; a miss falls through rather than
// inventing an answer, and unresolvable routes report `not-found` instead of
// opening something plausible-looking.

import { promises as fs } from 'node:fs'
import { basename, dirname, extname, join, relative, resolve, sep } from 'node:path'

import { listSourceFiles, SOURCE_EXT } from './projectSetup'

// ── Tier scores ──────────────────────────────────────
// Gaps are wide so a weaker tier can never outrank a stronger one on tie-breaks.
const SCORE = {
  SCREEN_MAP: 1000,
  IMPORT_MAP: 900,
  DECLARATION: 700,
  FILE_EXACT: 300,      // ProductDetail.tsx
  FILE_DIR_INDEX: 280,  // ProductDetail/index.js  ← the common RN layout
  FILE_SUFFIXED: 260,   // ProductDetailScreen.tsx
  FILE_DIR_NAMED: 240,  // ProductDetail/ProductDetail.tsx
}

// Suffixes stripped when comparing a name to a file/directory, so
// `ProductDetailScreen` still matches a `ProductDetail` folder.
const NAME_SUFFIXES = ['Screen', 'Page', 'View', 'Container', 'Component']

// Screens usually live here; used only to break ties.
const SCREEN_DIR_RE = /(?:^|[\\/])(?:screens?|pages?|views?|features?|modules?)(?:[\\/]|$)/i

// A component name worth searching for. Route names like "fire" or
// "reorder-horizontal" (icon names that leak into `name=` props) must never
// reach the content-search tier, which is what produced wrong matches before.
const COMPONENT_NAME_RE = /^[A-Z][A-Za-z0-9_]*$/

// Metro's resolution order. Platform-specific variants come first, matching what
// the bundler would pick; `.native.js` beats plain `.js` in RN.
const FILE_EXTS = ['.native.js', '.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs']
const INDEX_EXTS = FILE_EXTS

// Scan bounds. Wider than project setup needs: screens sit deep in real trees.
const SCAN_MAX_FILES = 8000
const SCAN_MAX_DEPTH = 14

// Files parsed for imports / screen registrations. Only files that actually
// mention a Screen or an import are read, so this is not the whole tree.
const PARSE_MAX_FILES = 2500

// ── Import statement patterns ────────────────────────
// Default and namespace imports bind a component to a specifier:
//   import X from './path'            import X, { y } from './path'
//   import * as X from './path'       const X = require('./path')
//   export { default as X } from './path'
//   const X = lazy(() => import('./path'))
const IMPORT_PATTERNS = [
  /import\s+([A-Za-z_$][\w$]*)\s*(?:,\s*\{[^}]*\})?\s+from\s*['"]([^'"]+)['"]/g,
  /import\s+\*\s+as\s+([A-Za-z_$][\w$]*)\s+from\s*['"]([^'"]+)['"]/g,
  /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*require\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
  /export\s+\{\s*default\s+as\s+([A-Za-z_$][\w$]*)\s*\}\s*from\s*['"]([^'"]+)['"]/g,
  /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:React\.)?lazy\s*\(\s*\(\s*\)\s*=>\s*import\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
]

// `<X.Screen name="Route" component={Component} />`, in either prop order and
// across newlines (the usual formatting). Anchored on `.Screen` so ordinary
// elements carrying a `name` prop are ignored.
const SCREEN_NAME_FIRST_RE =
  /\.Screen\b[^>]{0,400}?\bname\s*=\s*["']([^"']+)["'][^>]{0,400}?\bcomponent\s*=\s*\{\s*([A-Za-z_$][\w$]*)/g
const SCREEN_COMPONENT_FIRST_RE =
  /\.Screen\b[^>]{0,400}?\bcomponent\s*=\s*\{\s*([A-Za-z_$][\w$]*)[^>]{0,400}?\bname\s*=\s*["']([^"']+)["']/g

// Declaration of a component by name, for the DECLARATION tier.
function declarationPattern(name) {
  const n = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(
    '(?:' +
      'export\\s+default\\s+(?:function|class)\\s+' + n + '\\b' +
      '|(?:export\\s+)?(?:function|class)\\s+' + n + '\\b' +
      '|(?:export\\s+)?(?:const|let|var)\\s+' + n + '\\s*[=:]' +
    ')',
  )
}

// Cheap pre-filters so most files are never read twice.
const MENTIONS_IMPORT_RE = /(?:^|\n)\s*(?:import\b|export\s*\{|(?:const|let|var)\s+[A-Za-z_$][\w$]*\s*=\s*require\s*\()/
const MENTIONS_SCREEN_RE = /\.Screen\b/

// ── Cache ────────────────────────────────────────────
// The index is the expensive part; a project's layout does not change while the
// user clicks through a few routes.
const indexCache = new Map()
const CACHE_TTL_MS = 60_000

export function clearRouteCache(projectRoot) {
  if (projectRoot) indexCache.delete(resolve(projectRoot))
  else indexCache.clear()
}

async function isFile(path) {
  try {
    return (await fs.stat(path)).isFile()
  } catch {
    return false
  }
}

/**
 * Resolves a relative import specifier to a real file, the way Metro would:
 * exact path, then each extension, then `<dir>/index.<ext>`.
 *
 * The directory → index step is what makes `import X from './screens/Foo'`
 * resolve to `screens/Foo/index.js`.
 */
async function resolveSpecifier(fromFile, spec) {
  // Bare specifiers are packages, not app source.
  if (!spec || (spec[0] !== '.' && spec[0] !== '/')) return null

  const base = resolve(dirname(fromFile), spec)

  // Already has a usable extension?
  if (extname(base) && await isFile(base)) return base

  for (const ext of FILE_EXTS) {
    if (await isFile(base + ext)) return base + ext
  }
  for (const ext of INDEX_EXTS) {
    const idx = join(base, 'index' + ext)
    if (await isFile(idx)) return idx
  }
  return null
}

/**
 * Builds the project index: which component name maps to which file, and which
 * route name maps to which component.
 *
 * Import bindings are collected per source file and resolved through
 * `resolveSpecifier`, so the map holds real files rather than specifiers.
 */
async function buildIndex(root) {
  const files = await listSourceFiles(root, {
    maxFiles: SCAN_MAX_FILES,
    maxDepth: SCAN_MAX_DEPTH,
  })

  // componentName -> Set<absolute file>
  const importMap = new Map()
  // routeName -> Set<componentName>
  const screenMap = new Map()

  const addImport = (name, file) => {
    if (!importMap.has(name)) importMap.set(name, new Set())
    importMap.get(name).add(file)
  }
  const addScreen = (routeName, componentName) => {
    if (!screenMap.has(routeName)) screenMap.set(routeName, new Set())
    screenMap.get(routeName).add(componentName)
  }

  let parsed = 0
  for (const file of files) {
    if (parsed >= PARSE_MAX_FILES) break

    let content
    try {
      content = await fs.readFile(file, 'utf8')
    } catch {
      continue
    }

    const hasImports = MENTIONS_IMPORT_RE.test(content)
    const hasScreens = MENTIONS_SCREEN_RE.test(content)
    if (!hasImports && !hasScreens) continue
    parsed += 1

    // Local binding -> specifier, for this file only. Screen registrations are
    // resolved against the bindings of the file they appear in, which is what
    // keeps two same-named components in different navigators apart.
    const localSpecs = new Map()
    if (hasImports) {
      for (const pattern of IMPORT_PATTERNS) {
        pattern.lastIndex = 0
        let m
        while ((m = pattern.exec(content)) !== null) {
          localSpecs.set(m[1], m[2])
        }
      }
    }

    // Resolve this file's bindings once, then reuse for its screens.
    const localResolved = new Map()
    for (const [binding, spec] of localSpecs) {
      const target = await resolveSpecifier(file, spec)
      if (!target) continue
      localResolved.set(binding, target)
      addImport(binding, target)
    }

    if (hasScreens) {
      for (const [re, nameIdx, compIdx] of [
        [SCREEN_NAME_FIRST_RE, 1, 2],
        [SCREEN_COMPONENT_FIRST_RE, 2, 1],
      ]) {
        re.lastIndex = 0
        let m
        while ((m = re.exec(content)) !== null) {
          addScreen(m[nameIdx], m[compIdx])
        }
      }
    }
  }

  return { files, importMap, screenMap }
}

async function getIndex(root) {
  const hit = indexCache.get(root)
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.index
  const index = await buildIndex(root)
  indexCache.set(root, { index, at: Date.now() })
  return index
}

// ── Filename scoring ─────────────────────────────────

function stripSuffix(name) {
  for (const suffix of NAME_SUFFIXES) {
    if (name.length > suffix.length && name.endsWith(suffix)) {
      return name.slice(0, -suffix.length)
    }
  }
  return name
}

function nameVariants(name) {
  const bare = stripSuffix(name)
  const out = new Map([[name.toLowerCase(), 'exact']])
  if (!out.has(bare.toLowerCase())) out.set(bare.toLowerCase(), 'suffixed')
  for (const suffix of NAME_SUFFIXES) {
    const v = (bare + suffix).toLowerCase()
    if (!out.has(v)) out.set(v, 'suffixed')
  }
  return out
}

function scoreByPath(file, variants) {
  const ext = extname(file)
  if (!SOURCE_EXT.test(ext)) return 0

  const stem = basename(file, ext).toLowerCase()

  // `Foo/index.js` — the name lives in the directory, so this is checked before
  // the basename (every such file has the same useless stem, "index").
  if (stem === 'index') {
    const parent = basename(dirname(file)).toLowerCase()
    return variants.has(parent) ? SCORE.FILE_DIR_INDEX : 0
  }

  const kind = variants.get(stem)
  if (kind === 'exact') return SCORE.FILE_EXACT
  if (kind === 'suffixed') return SCORE.FILE_SUFFIXED

  if (variants.has(basename(dirname(file)).toLowerCase())) return SCORE.FILE_DIR_NAMED
  return 0
}

/**
 * Line of the component's declaration, so the editor opens at the definition
 * rather than line 1. Best-effort: line 1 when nothing matches.
 */
async function findDeclarationLine(file, names) {
  const candidates = names.filter(Boolean)
  if (!candidates.length) return 1
  let content
  try {
    content = await fs.readFile(file, 'utf8')
  } catch {
    return 1
  }
  const lines = content.split('\n')
  const patterns = candidates.map(declarationPattern)
  for (let i = 0; i < lines.length; i++) {
    for (const p of patterns) {
      if (p.test(lines[i])) return i + 1
    }
  }
  // No named declaration (very common for `export default () => ...`).
  for (let i = 0; i < lines.length; i++) {
    if (/export\s+default/.test(lines[i])) return i + 1
  }
  return 1
}

/**
 * Finds the source file for a route.
 *
 * Returns { ok, file, line, tier, ambiguous, candidates, reason }. `file` is
 * relative to projectRoot (the open-in-editor handler resolves it). `tier` names
 * the evidence used, so the UI can say how the file was found. Never throws for
 * a missing or unreadable project — those come back as a `reason`.
 */
export async function resolveRouteFile({ routeName, componentName, projectRoot } = {}) {
  if (!projectRoot) return { ok: false, reason: 'no-project-root' }
  if (!routeName && !componentName) return { ok: false, reason: 'no-route-name' }

  const root = resolve(projectRoot)
  try {
    if (!(await fs.stat(root)).isDirectory()) {
      return { ok: false, reason: 'project-root-not-a-directory' }
    }
  } catch {
    return { ok: false, reason: 'project-root-missing' }
  }

  let index
  try {
    index = await getIndex(root)
  } catch (err) {
    return { ok: false, reason: 'scan-failed', message: err?.message || String(err) }
  }
  if (!index.files.length) return { ok: false, reason: 'no-source-files' }

  const { files, importMap, screenMap } = index

  // file -> { score, tier }
  const scored = new Map()
  const record = (file, score, tier) => {
    const prev = scored.get(file)
    if (!prev || score > prev.score) scored.set(file, { score, tier })
  }

  // Component bindings worth looking up: what the app registered for this route,
  // plus what the SDK saw rendering it.
  const bindings = new Set()
  if (routeName && screenMap.has(routeName)) {
    for (const b of screenMap.get(routeName)) bindings.add(b)
  }

  // ── Tier 1: the app's own Screen registration ──
  for (const b of bindings) {
    const targets = importMap.get(b)
    if (targets) for (const t of targets) record(t, SCORE.SCREEN_MAP, 'screen-registration')
  }

  // ── Tier 2: component name (from the SDK) in the import map ──
  if (componentName) {
    const targets = importMap.get(componentName)
    if (targets) for (const t of targets) record(t, SCORE.IMPORT_MAP, 'import-map')
    for (const v of [stripSuffix(componentName), componentName + 'Screen']) {
      if (v === componentName) continue
      const alt = importMap.get(v)
      if (alt) for (const t of alt) record(t, SCORE.IMPORT_MAP - 10, 'import-map')
    }
  }
  // The route name is often also the binding name.
  if (routeName && routeName !== componentName) {
    const targets = importMap.get(routeName)
    if (targets) for (const t of targets) record(t, SCORE.IMPORT_MAP - 20, 'import-map')
  }

  // Names usable for content/filename matching. Non-component-looking route
  // names (icon names, kebab-case labels) are excluded from the search tiers so
  // they cannot produce a confident wrong answer.
  const searchNames = []
  if (componentName && COMPONENT_NAME_RE.test(componentName)) searchNames.push(componentName)
  if (routeName && routeName !== componentName && COMPONENT_NAME_RE.test(routeName)) {
    searchNames.push(routeName)
  }
  for (const b of bindings) {
    if (COMPONENT_NAME_RE.test(b) && !searchNames.includes(b)) searchNames.push(b)
  }

  // ── Tier 4: filename scoring ──
  // Run before the declaration search because it needs no file reads.
  if (scored.size === 0 && searchNames.length) {
    for (const name of searchNames) {
      const variants = nameVariants(name)
      for (const file of files) {
        const s = scoreByPath(file, variants)
        if (s > 0) record(file, s, 'filename')
      }
    }
  }

  // ── Tier 3: declaration search ──
  // Only when nothing above matched. Requires a real declaration of the name, so
  // a file that merely registers the route (the navigator) is not a match.
  if (scored.size === 0 && searchNames.length) {
    const patterns = searchNames.map(declarationPattern)
    let read = 0
    for (const file of files) {
      if (read >= 1200) break
      let content
      try {
        content = await fs.readFile(file, 'utf8')
      } catch {
        continue
      }
      read += 1
      if (!patterns.some((p) => p.test(content))) continue
      const bonus = SCREEN_DIR_RE.test(relative(root, file)) ? 5 : 0
      record(file, SCORE.DECLARATION + bonus, 'declaration')
    }
  }

  if (scored.size === 0) {
    return { ok: false, reason: 'not-found', routeName, componentName }
  }

  const ranked = Array.from(scored.entries())
    .map(([file, { score, tier }]) => {
      const rel = relative(root, file)
      // Tie-breakers: a screens/ directory, then a shallower path.
      const tie = (SCREEN_DIR_RE.test(rel) ? 3 : 0) - rel.split(sep).length * 0.1
      return { file, rel, score: score + tie, tier }
    })
    .sort((a, b) => b.score - a.score || a.rel.length - b.rel.length)

  const best = ranked[0]
  const line = await findDeclarationLine(
    best.file,
    [componentName, routeName, ...bindings],
  )

  // Only report ambiguity among equally-strong candidates. A weak runner-up from
  // a lower tier is not a real alternative and should not raise a warning.
  const rivals = ranked.filter((r) => best.score - r.score < 1)

  return {
    ok: true,
    file: best.rel,
    line,
    tier: best.tier,
    ambiguous: rivals.length > 1,
    candidates: rivals.slice(0, 5).map((r) => r.rel),
  }
}
