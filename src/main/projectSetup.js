// src/main/projectSetup.js
// Automatic React Native project integration.
//
// Detects an RN project, then generates a gitignored connection file and wires it
// into the entry file so the user never pastes the SDK snippet by hand.
//
// Everything here is split into a PLAN phase (pure, read-only, returns exactly what
// would change) and an APPLY phase (writes, with backups). The renderer shows the
// plan for confirmation before anything is written. applySetup re-plans internally
// rather than trusting a renderer-supplied plan, so absolute paths from the
// renderer can never redirect a write.

import { promises as fs } from 'node:fs'
import { join, resolve, relative, isAbsolute, basename } from 'node:path'

import {
  buildRnClient,
  buildWatermelonHookLines,
  RNSPY_CONNECTION_FILENAME,
  RNSPY_CONNECTION_SPECIFIER,
  RNSPY_MARKER,
  RNSPY_WATERMELON_GLOBAL,
} from '../shared/rnClient'

const BACKUP_SUFFIX = '.rnspy.bak'

// Entry-file candidates, in resolution order. TS variants included because a
// side-effect-only JS import resolves fine from a TS entry.
const ENTRY_CANDIDATES = [
  'index.js', 'index.jsx', 'index.ts', 'index.tsx',
  'App.js', 'App.jsx', 'App.ts', 'App.tsx',
  'src/index.js', 'src/index.jsx', 'src/index.ts', 'src/index.tsx',
  'src/App.js', 'src/App.jsx', 'src/App.ts', 'src/App.tsx',
]

// pkg.main values that point outside the user's own source and must not be edited.
const NON_EDITABLE_MAIN = /^(?:node_modules\/|expo-router\/|expo\/)/

// Matches an existing import/require of the connection module, any quote style,
// with or without the .js extension.
const EXISTING_IMPORT_RE =
  /(?:^|\n)\s*(?:import\s+['"]\.\/rnspy\.connection(?:\.js)?['"]|(?:const|let|var)?\s*require\s*\(\s*['"]\.\/rnspy\.connection(?:\.js)?['"]\s*\))/

// Matches the WatermelonDB exposure line so removal can strip it. Kept broad on
// the __DEV__ guard (present or not) but anchored on the global assignment, so it
// can never match unrelated code.
const HOOK_LINE_RE = new RegExp(
  `global\\.${RNSPY_WATERMELON_GLOBAL}\\s*=`,
)

// ── Small fs helpers ─────────────────────────────────

async function readTextIfExists(path) {
  try {
    return await fs.readFile(path, 'utf8')
  } catch (err) {
    if (err.code === 'ENOENT') return null
    throw err
  }
}

async function isFile(path) {
  try {
    const stat = await fs.stat(path)
    return stat.isFile()
  } catch {
    return false
  }
}

async function isDirectory(path) {
  try {
    const stat = await fs.stat(path)
    return stat.isDirectory()
  } catch {
    return false
  }
}

// Guards against a path escaping the project directory (traversal, symlink-ish
// tricks, or a renderer sending an unrelated absolute path).
function isInside(dir, target) {
  const rel = relative(resolve(dir), resolve(target))
  return rel !== '' && !rel.startsWith('..') && !isAbsolute(rel)
}

// ── Line-ending / text preservation ──────────────────

// Returns the dominant line ending so an edited file keeps its original style.
function detectEol(content) {
  const crlf = (content.match(/\r\n/g) || []).length
  const lf = (content.match(/(?<!\r)\n/g) || []).length
  return crlf > lf ? '\r\n' : '\n'
}

function splitLines(content) {
  return content.split(/\r\n|\n/)
}

// ── Detection ────────────────────────────────────────

/**
 * Reads package.json and confirms the folder is a React Native project.
 * Returns { ok: false, reason } for anything unusable so the UI can explain it.
 */
export async function detectRnProject(dir) {
  if (!dir || typeof dir !== 'string') return { ok: false, reason: 'no-directory' }
  if (!(await isDirectory(dir))) return { ok: false, reason: 'not-a-directory' }

  const pkgPath = join(dir, 'package.json')
  const raw = await readTextIfExists(pkgPath)
  if (raw === null) return { ok: false, reason: 'no-package-json', dir }

  let pkg
  try {
    pkg = JSON.parse(raw)
  } catch {
    return { ok: false, reason: 'invalid-package-json', dir }
  }

  const deps = { ...(pkg.devDependencies || {}), ...(pkg.dependencies || {}) }
  const rnVersion = deps['react-native']
  if (!rnVersion) {
    return { ok: false, reason: 'not-react-native', dir, appName: pkg.name || basename(dir) }
  }

  const entry = await findEntryFile(dir, pkg)
  const watermelon = await findWatermelonDatabase(dir, pkg)

  return {
    ok: true,
    dir,
    appName: pkg.name || basename(dir),
    rnVersion,
    isExpo: Boolean(deps.expo),
    entryFile: entry.path,
    entryFileRelative: entry.path ? relative(dir, entry.path) : null,
    entrySource: entry.source,
    hasGitignore: await isFile(join(dir, '.gitignore')),
    watermelon,
    ...(entry.path ? {} : { entryWarning: 'no-entry-file' }),
  }
}

/**
 * Resolves the app's entry file. Prefers package.json "main" when it points at a
 * file the user actually owns; Expo's AppEntry / expo-router entries live in
 * node_modules, so those fall through to the candidate list.
 */
export async function findEntryFile(dir, pkg) {
  const main = typeof pkg?.main === 'string' ? pkg.main.trim() : ''

  if (main && !NON_EDITABLE_MAIN.test(main)) {
    const mainPath = resolve(dir, main)
    if (isInside(dir, mainPath)) {
      if (await isFile(mainPath)) return { path: mainPath, source: 'package.json main' }
      // "main": "index" — try the usual extensions.
      for (const ext of ['.js', '.jsx', '.ts', '.tsx']) {
        if (await isFile(mainPath + ext)) {
          return { path: mainPath + ext, source: 'package.json main' }
        }
      }
    }
  }

  for (const candidate of ENTRY_CANDIDATES) {
    const path = join(dir, candidate)
    if (await isFile(path)) return { path, source: 'convention' }
  }

  return { path: null, source: null }
}

// ── WatermelonDB detection ───────────────────────────

// Directories that never contain the app's own source. Skipped while scanning so
// a large project doesn't pay for walking build output or native folders.
const SKIP_DIRS = new Set([
  'node_modules', '.git', '.expo', '.expo-shared', 'ios', 'android',
  'build', 'dist', 'coverage', '.next', '.yarn', 'vendor', '__tests__',
  '.husky', '.vscode', '.idea', 'Pods',
])

const SOURCE_EXT = /\.(?:js|jsx|ts|tsx|mjs|cjs)$/

// Bounds on the scan so a pathological tree can't stall the picker.
const SCAN_MAX_FILES = 1500
const SCAN_MAX_DEPTH = 8

// A top-level `const database = new Database(` — the assignment must start at
// column 0. That is what makes appending `global.X = database` at the end of the
// module safe: a declaration nested inside a function or factory would not be in
// scope at module evaluation, so those are deliberately not matched.
const WM_TOPLEVEL_DB_RE =
  /^(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*new\s+Database\s*\(/m

// `export default new Database(` / `new Database(` with no binding to reference.
const WM_ANONYMOUS_DB_RE = /^(?:export\s+default\s+)?new\s+Database\s*\(/m

// Cheap pre-filter: only files mentioning Database construction are parsed further.
const WM_MENTIONS_RE = /new\s+Database\s*\(/

/**
 * Recursively lists the project's own source files, breadth-first so shallow
 * (more likely) locations are considered before deep ones.
 */
async function listSourceFiles(dir) {
  const found = []
  let queue = [{ path: dir, depth: 0 }]

  while (queue.length && found.length < SCAN_MAX_FILES) {
    const next = []
    for (const { path, depth } of queue) {
      let entries
      try {
        entries = await fs.readdir(path, { withFileTypes: true })
      } catch {
        continue
      }
      for (const entry of entries) {
        if (found.length >= SCAN_MAX_FILES) break
        const child = join(path, entry.name)
        if (entry.isDirectory()) {
          if (SKIP_DIRS.has(entry.name) || entry.name.startsWith('.')) continue
          if (depth + 1 <= SCAN_MAX_DEPTH) next.push({ path: child, depth: depth + 1 })
        } else if (entry.isFile() && SOURCE_EXT.test(entry.name)) {
          found.push(child)
        }
      }
    }
    queue = next
  }

  return found
}

/**
 * Locates the module that constructs the app's WatermelonDB Database.
 *
 * The SDK proxies the Database constructor, but that only captures databases built
 * after the connection file loads, and it cannot see through Metro's inlining of
 * the imported binding. Assigning the global at the construction site is reliable,
 * so setup does it automatically.
 *
 * Returns { status } where status is:
 *   'not-installed'  — @nozbe/watermelondb is not a dependency; nothing to do
 *   'not-found'      — installed, but no `new Database(` in the app's source
 *   'manual'         — found, but not a top-level binding we can safely reference
 *   'found'          — { path, relativePath, varName, alreadyHooked }
 */
export async function findWatermelonDatabase(dir, pkg) {
  const deps = { ...(pkg?.devDependencies || {}), ...(pkg?.dependencies || {}) }
  if (!deps['@nozbe/watermelondb']) return { status: 'not-installed' }

  const files = await listSourceFiles(dir)
  const anonymous = []

  for (const path of files) {
    // Skip the file we generate ourselves.
    if (basename(path) === RNSPY_CONNECTION_FILENAME) continue

    const content = await readTextIfExists(path)
    if (content === null || !WM_MENTIONS_RE.test(content)) continue

    const match = content.match(WM_TOPLEVEL_DB_RE)
    if (match) {
      return {
        status: 'found',
        path,
        relativePath: relative(dir, path),
        varName: match[1],
        alreadyHooked: content.includes(`global.${RNSPY_WATERMELON_GLOBAL}`),
      }
    }
    if (WM_ANONYMOUS_DB_RE.test(content)) anonymous.push(relative(dir, path))
  }

  if (anonymous.length) return { status: 'manual', candidates: anonymous }
  return { status: 'not-found' }
}

// ── Connection file contents ─────────────────────────

/**
 * Composes the generated module. The shared template carries a "paste this at the
 * top of your entry file" header that no longer applies once it's its own module,
 * so that header is replaced with a generated-file banner.
 */
export function buildConnectionFile({ host, port }) {
  const snippet = buildRnClient({ host, port })

  // Drop the template's leading // comment block.
  const lines = splitLines(snippet)
  let start = 0
  while (start < lines.length && (lines[start].startsWith('//') || lines[start].trim() === '')) {
    start += 1
  }
  const body = lines.slice(start).join('\n')

  const header = [
    `// ${RNSPY_CONNECTION_FILENAME}`,
    `// ${RNSPY_MARKER} — DO NOT EDIT. Regenerated by the React Native Spy desktop app.`,
    '//',
    `// Connects this app to React Native Spy at ws://${host}:${port}`,
    '// Imported as the first import of your entry file so it can patch console,',
    '// fetch, XMLHttpRequest and WebSocket before any app code runs.',
    '//',
    '// ⚠ DEVELOPMENT ONLY — REMOVE BEFORE A PRODUCTION BUILD',
    '//',
    '// This file reads your app\'s storage and database and streams console output,',
    '// network requests and WebSocket frames — including headers, tokens and request',
    '// bodies — in plaintext to a debugger on your local network.',
    '//',
    `// The body is guarded by __DEV__, so Metro strips it from a release bundle. That`,
    '// guard is a safety net, not a substitute for removing it: keep this file out of',
    '// your release branches. Remove it from the desktop app with',
    '// "Remove integration", which deletes this file and the injected import.',
    '//',
    '// This file is gitignored and safe to delete by hand at any time.',
    '',
  ].join('\n')

  return `${header}${body}`
}

// ── Entry-file injection point ───────────────────────

/**
 * Finds the line index where the import should go: after a shebang, any leading
 * comments, and a 'use strict' directive, but before the first real statement.
 * Handles multi-line block comments. Returns { index, preceding }.
 */
export function findInjectionPoint(lines) {
  let i = 0
  const preceding = []

  const take = () => {
    preceding.push(lines[i])
    i += 1
  }

  if (i < lines.length && lines[i].startsWith('#!')) take()

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    if (trimmed === '') { take(); continue }

    if (trimmed.startsWith('//')) { take(); continue }

    if (trimmed.startsWith('/*')) {
      // Consume through the closing delimiter.
      let closed = trimmed.includes('*/') && trimmed.indexOf('*/') > 0
      take()
      while (!closed && i < lines.length) {
        closed = lines[i].includes('*/')
        take()
      }
      continue
    }

    if (/^['"]use strict['"]\s*;?$/.test(trimmed)) { take(); continue }

    break
  }

  // Don't leave the import stranded below trailing blank lines — walk back so it
  // sits directly after the last meaningful leading line.
  while (preceding.length > 0 && preceding[preceding.length - 1].trim() === '') {
    preceding.pop()
    i -= 1
  }

  return { index: i, preceding }
}

function buildImportLine() {
  return `import '${RNSPY_CONNECTION_SPECIFIER}' // ${RNSPY_MARKER} — dev only, safe to delete`
}

// ── Plan ─────────────────────────────────────────────

/**
 * Computes every change without touching disk. Shape is designed for a preview UI:
 * each target reports an `action`, and 'already-present' means nothing to do.
 */
export async function planSetup({ dir, host, port }) {
  const detection = await detectRnProject(dir)
  if (!detection.ok) return detection

  if (!detection.entryFile) {
    return { ok: false, reason: 'no-entry-file', dir, appName: detection.appName }
  }

  const resolvedHost = host || 'localhost'
  const resolvedPort = Number(port) || 8097

  const steps = []
  const backups = []

  // 1. Connection file
  const connectionPath = join(dir, RNSPY_CONNECTION_FILENAME)
  const contents = buildConnectionFile({ host: resolvedHost, port: resolvedPort })
  const existingConnection = await readTextIfExists(connectionPath)

  let connectionAction = 'create'
  if (existingConnection !== null) {
    connectionAction = existingConnection === contents ? 'already-present' : 'overwrite'
  }
  if (connectionAction === 'overwrite') backups.push(connectionPath)

  steps.push({
    id: 'connection',
    label: RNSPY_CONNECTION_FILENAME,
    path: connectionPath,
    relativePath: RNSPY_CONNECTION_FILENAME,
    action: connectionAction,
    detail:
      connectionAction === 'overwrite'
        ? `Regenerated for ws://${resolvedHost}:${resolvedPort}`
        : `Connects to ws://${resolvedHost}:${resolvedPort}`,
    bytes: Buffer.byteLength(contents, 'utf8'),
  })

  // 2. .gitignore
  const gitignorePath = join(dir, '.gitignore')
  const gitignoreRaw = await readTextIfExists(gitignorePath)
  const gitignoreEntries = [RNSPY_CONNECTION_FILENAME, `*${BACKUP_SUFFIX}`]
  const existingIgnoreLines = gitignoreRaw === null
    ? []
    : splitLines(gitignoreRaw).map((l) => l.trim())
  const missingIgnoreEntries = gitignoreEntries.filter((e) => !existingIgnoreLines.includes(e))

  let gitignoreAction = 'append'
  if (gitignoreRaw === null) gitignoreAction = 'create'
  else if (missingIgnoreEntries.length === 0) gitignoreAction = 'already-present'

  steps.push({
    id: 'gitignore',
    label: '.gitignore',
    path: gitignorePath,
    relativePath: '.gitignore',
    action: gitignoreAction,
    detail:
      gitignoreAction === 'already-present'
        ? 'Already ignored'
        : `Add ${missingIgnoreEntries.join(', ')}`,
    lines: missingIgnoreEntries,
  })

  // 3. Entry file
  const entryPath = detection.entryFile
  const entryRaw = await readTextIfExists(entryPath)
  if (entryRaw === null) {
    return { ok: false, reason: 'entry-file-unreadable', dir, appName: detection.appName }
  }

  const importLine = buildImportLine()
  const alreadyImported = EXISTING_IMPORT_RE.test(entryRaw)
  const entryLines = splitLines(entryRaw)
  const { index, preceding } = findInjectionPoint(entryLines)

  if (!alreadyImported) backups.push(entryPath)

  steps.push({
    id: 'entry',
    label: detection.entryFileRelative,
    path: entryPath,
    relativePath: detection.entryFileRelative,
    action: alreadyImported ? 'already-present' : 'inject',
    detail: alreadyImported
      ? 'Import already present'
      : index === 0
        ? 'Insert as the first line'
        : `Insert at line ${index + 1}, after ${preceding.length} leading line(s)`,
    insertAtLine: index + 1,
    lines: [importLine],
  })

  // 4. WatermelonDB hook (only when the project actually uses WatermelonDB)
  //
  // The SDK proxies the Database constructor, but Metro inlines the imported
  // binding, so a database built during module evaluation is often missed. Writing
  // `global.__rnspyWatermelonDB = <db>` at the construction site is what makes the
  // WatermelonDB panel work without the user editing anything by hand.
  const wm = detection.watermelon || { status: 'not-installed' }

  if (wm.status === 'found') {
    const hookLines = buildWatermelonHookLines(wm.varName)
    if (!wm.alreadyHooked) backups.push(wm.path)

    steps.push({
      id: 'watermelon',
      label: wm.relativePath,
      path: wm.path,
      relativePath: wm.relativePath,
      action: wm.alreadyHooked ? 'already-present' : 'append',
      detail: wm.alreadyHooked
        ? 'Database already exposed to the debugger'
        : `Expose "${wm.varName}" so the WatermelonDB panel can read it`,
      lines: wm.alreadyHooked ? [] : hookLines,
      varName: wm.varName,
    })
  } else if (wm.status === 'manual') {
    // Found `new Database(...)` but not as a top-level binding we can reference,
    // so there is nothing safe to append. Report it instead of writing something
    // that might not be in scope.
    steps.push({
      id: 'watermelon',
      label: wm.candidates[0],
      path: null,
      relativePath: wm.candidates[0],
      action: 'manual',
      detail: 'Database is not a top-level variable — expose it yourself (see below)',
      lines: [
        `// ${RNSPY_MARKER} — dev only`,
        `if (__DEV__) { global.${RNSPY_WATERMELON_GLOBAL} = <your database> }`,
      ],
    })
  } else if (wm.status === 'not-found') {
    steps.push({
      id: 'watermelon',
      label: '@nozbe/watermelondb',
      path: null,
      relativePath: '@nozbe/watermelondb',
      action: 'manual',
      detail: 'Installed, but no "new Database(...)" was found in your source',
      lines: [
        `if (__DEV__) { global.${RNSPY_WATERMELON_GLOBAL} = <your database> }`,
      ],
    })
  }

  // 'manual' steps are informational — they describe something the user has to do,
  // so they are neither a pending write nor "up to date".
  const changeCount = steps.filter(
    (s) => s.action !== 'already-present' && s.action !== 'manual',
  ).length

  return {
    ok: true,
    dir,
    appName: detection.appName,
    rnVersion: detection.rnVersion,
    isExpo: detection.isExpo,
    host: resolvedHost,
    port: resolvedPort,
    entryFile: entryPath,
    entryFileRelative: detection.entryFileRelative,
    entrySource: detection.entrySource,
    watermelon: wm,
    steps,
    backups: backups.map((p) => `${relative(dir, p)}${BACKUP_SUFFIX}`),
    changeCount,
    upToDate: changeCount === 0,
  }
}

// ── Apply ────────────────────────────────────────────

/**
 * Applies the setup. Re-plans internally, so the renderer only supplies dir/host/port
 * and cannot influence which paths get written. Backs up every file it modifies and
 * rolls back if a later write fails.
 */
export async function applySetup({ dir, host, port }) {
  const plan = await planSetup({ dir, host, port })
  if (!plan.ok) return plan

  const written = []
  const skipped = []
  const backupsMade = []

  const backup = async (path) => {
    const existing = await readTextIfExists(path)
    if (existing === null) return
    const backupPath = `${path}${BACKUP_SUFFIX}`
    await fs.writeFile(backupPath, existing, 'utf8')
    backupsMade.push({ path, backupPath, original: existing })
  }

  const rollback = async () => {
    for (const entry of backupsMade) {
      try {
        await fs.writeFile(entry.path, entry.original, 'utf8')
      } catch { /* best effort */ }
    }
  }

  try {
    for (const step of plan.steps) {
      if (step.action === 'already-present') {
        skipped.push({ id: step.id, path: step.relativePath, reason: 'already-present' })
        continue
      }

      // 'manual' steps have no path to write — they only carry instructions for the
      // user (e.g. a WatermelonDB database we cannot safely reference). Surfaced in
      // the result so the UI can keep showing them after apply.
      if (step.action === 'manual') {
        skipped.push({
          id: step.id, path: step.relativePath, reason: 'manual',
          detail: step.detail, lines: step.lines || [],
        })
        continue
      }

      // Defense in depth: never write outside the selected project directory.
      if (!isInside(dir, step.path)) {
        await rollback()
        return { ok: false, reason: 'path-outside-project', path: step.path }
      }

      if (step.id === 'connection') {
        await backup(step.path)
        await fs.writeFile(
          step.path,
          buildConnectionFile({ host: plan.host, port: plan.port }),
          'utf8',
        )
      } else if (step.id === 'gitignore') {
        const existing = await readTextIfExists(step.path)
        const eol = existing ? detectEol(existing) : '\n'
        const block = [
          '',
          `# React Native Spy — ${RNSPY_MARKER}`,
          ...step.lines,
        ].join(eol)

        if (existing === null) {
          await fs.writeFile(step.path, `${block.replace(/^\r?\n/, '')}${eol}`, 'utf8')
        } else {
          await backup(step.path)
          const needsEol = existing.length > 0 && !/\r?\n$/.test(existing)
          await fs.writeFile(step.path, `${existing}${needsEol ? eol : ''}${block}${eol}`, 'utf8')
        }
      } else if (step.id === 'entry') {
        const existing = await readTextIfExists(step.path)
        if (existing === null) {
          await rollback()
          return { ok: false, reason: 'entry-file-unreadable', path: step.path }
        }
        await backup(step.path)

        const eol = detectEol(existing)
        const hadTrailingEol = /\r?\n$/.test(existing)
        const lines = splitLines(existing)
        if (hadTrailingEol) lines.pop() // drop the artifact of a trailing newline

        const { index } = findInjectionPoint(lines)
        lines.splice(index, 0, ...step.lines, '')

        await fs.writeFile(
          step.path,
          lines.join(eol) + (hadTrailingEol ? eol : ''),
          'utf8',
        )
      } else if (step.id === 'watermelon') {
        // Appended at the END of the module, not the injection point: the database
        // variable only exists after its own declaration has been evaluated.
        const existing = await readTextIfExists(step.path)
        if (existing === null) {
          await rollback()
          return { ok: false, reason: 'watermelon-file-unreadable', path: step.path }
        }
        await backup(step.path)

        const eol = detectEol(existing)
        const needsEol = existing.length > 0 && !/\r?\n$/.test(existing)
        const block = ['', ...step.lines].join(eol)

        await fs.writeFile(step.path, `${existing}${needsEol ? eol : ''}${block}${eol}`, 'utf8')
      }

      written.push({ id: step.id, path: step.relativePath, action: step.action })
    }
  } catch (err) {
    await rollback()
    return { ok: false, reason: 'write-failed', message: err?.message || String(err) }
  }

  return {
    ok: true,
    dir,
    appName: plan.appName,
    host: plan.host,
    port: plan.port,
    entryFile: plan.entryFile,
    entryFileRelative: plan.entryFileRelative,
    written,
    skipped,
    backups: backupsMade.map((b) => relative(dir, b.backupPath)),
  }
}

// ── Remove ───────────────────────────────────────────

/**
 * Reverses the integration: deletes the connection file and strips the injected
 * import. Leaves the .gitignore entries alone — they're harmless and removing them
 * would risk clobbering unrelated edits.
 */
export async function removeSetup({ dir }) {
  const detection = await detectRnProject(dir)
  if (!detection.ok) return detection

  const removed = []

  const connectionPath = join(dir, RNSPY_CONNECTION_FILENAME)
  if (await isFile(connectionPath)) {
    await fs.unlink(connectionPath)
    removed.push(RNSPY_CONNECTION_FILENAME)
  }

  const entryPath = detection.entryFile
  if (entryPath) {
    const existing = await readTextIfExists(entryPath)
    if (existing !== null && EXISTING_IMPORT_RE.test(existing)) {
      const eol = detectEol(existing)
      const hadTrailingEol = /\r?\n$/.test(existing)
      const lines = splitLines(existing)
      if (hadTrailingEol) lines.pop()

      const kept = lines.filter(
        (line) => !/^\s*(?:import\s+['"]\.\/rnspy\.connection(?:\.js)?['"]|(?:const|let|var)?\s*require\s*\(\s*['"]\.\/rnspy\.connection(?:\.js)?['"]\s*\))/.test(line),
      )

      await fs.writeFile(entryPath, kept.join(eol) + (hadTrailingEol ? eol : ''), 'utf8')
      removed.push(detection.entryFileRelative)
    }
  }

  // WatermelonDB hook. Only lines carrying our marker or the exact global
  // assignment are dropped, so a hand-written exposure the user added themselves
  // (or any unrelated code) is left untouched. Trailing blank lines left behind by
  // the removal are trimmed back to a single newline.
  const wm = detection.watermelon
  if (wm?.status === 'found' && wm.alreadyHooked) {
    const existing = await readTextIfExists(wm.path)
    if (existing !== null) {
      const eol = detectEol(existing)
      const hadTrailingEol = /\r?\n$/.test(existing)
      const lines = splitLines(existing)
      if (hadTrailingEol) lines.pop()

      const kept = lines.filter((line) => {
        if (line.includes(RNSPY_MARKER)) return false
        return !HOOK_LINE_RE.test(line)
      })
      while (kept.length > 0 && kept[kept.length - 1].trim() === '') kept.pop()

      if (kept.length !== lines.length) {
        await fs.writeFile(wm.path, kept.join(eol) + (hadTrailingEol ? eol : ''), 'utf8')
        removed.push(wm.relativePath)
      }
    }
  }

  return { ok: true, dir, removed }
}
