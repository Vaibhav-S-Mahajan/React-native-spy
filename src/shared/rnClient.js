// src/shared/rnClient.js
// React Native client SDK snippet (template string)
// This code is NOT executed in the desktop app — it's written into the user's
// project (or displayed for them to copy).
//
// Lives in src/shared/ because BOTH the renderer (empty-state snippet) and the
// main process (automatic project setup) need it. electron-vite builds main and
// renderer separately and the `@` alias is renderer-only, so this file must be
// reachable by relative path from both.

// Name of the generated file written into the user's React Native project root.
export const RNSPY_CONNECTION_FILENAME = 'rnspy.connection.js'

// Module specifier used for the injected import in the entry file.
export const RNSPY_CONNECTION_SPECIFIER = './rnspy.connection'

// Marker stamped into every generated/injected line so setup is idempotent and
// the integration can be detected and removed later.
export const RNSPY_MARKER = '@generated-by rnspy-devtools'

// Global the SDK reads to find the app's WatermelonDB Database instance.
// The SDK also proxies the Database constructor, but that only catches databases
// built AFTER the connection file loads. Assigning this global covers the common
// case where the database module is imported by something that runs earlier, and
// it is the only reliable path when Metro inlines the ESM binding for Database.
export const RNSPY_WATERMELON_GLOBAL = '__rnspyWatermelonDB'

/**
 * The dev-only lines appended to the module that constructs the WatermelonDB
 * Database, exposing that instance to the SDK.
 *
 * Wrapped in __DEV__ so a production bundle drops the whole block: Metro replaces
 * __DEV__ with false for release builds and the minifier removes the dead branch,
 * leaving nothing behind. Kept to one statement so removal is an exact-line match.
 */
export function buildWatermelonHookLines(varName) {
  return [
    `// ${RNSPY_MARKER} — dev only. Remove before shipping (see React Native Spy → Remove integration).`,
    `if (typeof __DEV__ !== 'undefined' && __DEV__) { global.${RNSPY_WATERMELON_GLOBAL} = ${varName} }`,
  ]
}

const TEMPLATE = `// ── React Native Spy SDK ─────────────────────────────────
// IMPORTANT: Paste this at the VERY TOP of your entry file (index.js or App.js),
// BEFORE any SignalR or other WebSocket library imports.
// This ensures all WebSocket traffic (including SignalR) is captured.
// Remove before shipping to production.

if (__DEV__) {
  ;(function () {
    const RNSPY_HOST = '__RNSPY_HOST__'
    const RNSPY_PORT = __RNSPY_PORT__
    const RNSPY_URL = 'ws://' + RNSPY_HOST + ':' + RNSPY_PORT

    // ── Device Identity ────────────────────────────
    let deviceId
    try {
      const DeviceInfo = require('react-native-device-info')
      deviceId = DeviceInfo.getUniqueIdSync()
    } catch {
      deviceId = 'rn-' + Math.random().toString(36).slice(2, 10)
    }

    let deviceName = 'React Native'
    let devicePlatform = 'unknown'
    try {
      const { Platform } = require('react-native')
      devicePlatform = Platform.OS || 'unknown'
      const DeviceInfo = require('react-native-device-info')
      deviceName = DeviceInfo.getDeviceNameSync?.() || DeviceInfo.getModel?.() || 'React Native'
    } catch {}

    // ── Storage Bridge (AsyncStorage + MMKV) ───────
    // Resolve AsyncStorage (async, single store) and track every MMKV
    // instance the app creates by wrapping the MMKV constructor. The SDK
    // runs at the top of the entry file, so the wrap is installed before
    // any 'new MMKV()' in app code — that's how instances are auto-detected.
    // Diagnostics travel with every snapshot so the desktop can show WHY a
    // backend is empty instead of silently rendering nothing.
    var storageDiag = {
      asyncResolved: false,
      mmkvResolved: false,
      mmkvError: null,
      notes: [],
    }

    var AsyncStorage = null
    try {
      var asMod = require('@react-native-async-storage/async-storage')
      AsyncStorage = (asMod && asMod.default) || asMod
      storageDiag.asyncResolved = !!(AsyncStorage && AsyncStorage.getAllKeys)
    } catch (e) {
      storageDiag.notes.push('AsyncStorage require failed: ' + ((e && e.message) || 'not installed'))
    }

    var mmkvInstances = []
    var mmkvChangeTimer = null
    var OrigMMKV = null
    var mmkvCreateFn = null
    var defaultMmkvOpened = false

    // WatermelonDB: capture the app's Database instance. It's a reactive SQLite
    // ORM, so unlike key-value stores we read whole tables of records. We can't
    // reliably enumerate a DB that was built before this snippet ran, so we (a)
    // wrap the Database constructor to catch new ones and (b) read a global
    // escape hatch the user can set: global.__rnspyWatermelonDB = database.
    var watermelonDB = null
    var watermelonQ = null // @nozbe/watermelondb Q helpers (skip/take) for paging
    var watermelonDiag = { resolved: false, error: null, notes: [] }

    // Build an MMKV instance through whichever API this app's build exposes:
    // the MMKV class (v2 / standard v3) or the createMMKV factory (builds
    // that export factory functions instead of a class). Same-id instances
    // share native storage, so either path reads the app's real data.
    function createMmkvInstance(id) {
      var wantId = id || 'mmkv.default'
      if (OrigMMKV) return new OrigMMKV({ id: wantId })
      if (mmkvCreateFn) {
        // Factory signature varies: try an object config, then positional id.
        try { return mmkvCreateFn({ id: wantId }) }
        catch (e) { return mmkvCreateFn(wantId) }
      }
      return null
    }

    // Register an MMKV instance for inspection (dedup by id) and subscribe to
    // its change events so the desktop gets a live push when the app writes.
    function trackMmkv(inst, id) {
      if (!inst) return inst
      try {
        inst.__rnspyId = id || 'mmkv.default'
        for (var j = 0; j < mmkvInstances.length; j++) {
          if ((mmkvInstances[j].__rnspyId || 'mmkv.default') === inst.__rnspyId) return inst
        }
        mmkvInstances.push(inst)
        // Push a fresh snapshot when the app mutates this store (debounced).
        if (inst.addOnValueChangedListener) {
          inst.addOnValueChangedListener(function () {
            if (mmkvChangeTimer) return
            mmkvChangeTimer = setTimeout(function () {
              mmkvChangeTimer = null
              sendSnapshot(null, { ok: true, source: 'mmkv-change' })
            }, 300)
          })
        }
      } catch {}
      return inst
    }

    // Wrap the MMKV constructor so any 'new MMKV({ id })' the app creates AFTER
    // this snippet runs is auto-detected (catches named instances too).
    // IMPORTANT: we do NOT construct any MMKV here. MMKV is a JSI/native module;
    // instantiating it at snippet-load time (before the RN runtime is ready) can
    // hard-crash natively — uncatchable by JS try/catch — which shows up as an
    // endless connect→crash→reconnect loop. Defer the default-instance open to
    // the first storage read (see ensureDefaultMmkv), by which point RN is up.
    try {
      var MMKVModule = require('react-native-mmkv')
      // Unwrap CommonJS/ESM interop (real module may sit under .default).
      var mmkvNs = MMKVModule && MMKVModule.default && (MMKVModule.default.MMKV || MMKVModule.default.createMMKV)
        ? MMKVModule.default
        : MMKVModule

      if (mmkvNs && typeof mmkvNs.MMKV === 'function') {
        // Standard: the MMKV class. Wrap the constructor so instances the app
        // creates AFTER this snippet are auto-detected too.
        OrigMMKV = mmkvNs.MMKV
        storageDiag.mmkvResolved = true
        var TrackedMMKV = function (config) {
          var inst = new OrigMMKV(config)
          return trackMmkv(inst, (config && config.id) || 'mmkv.default')
        }
        TrackedMMKV.prototype = OrigMMKV.prototype
        mmkvNs.MMKV = TrackedMMKV
      } else if (mmkvNs && typeof mmkvNs.createMMKV === 'function') {
        // Factory-only build: no class, just createMMKV(). We can still open
        // instances by id; the returned object has the same read/write methods.
        mmkvCreateFn = mmkvNs.createMMKV
        storageDiag.mmkvResolved = true
        storageDiag.notes.push('MMKV resolved via createMMKV factory (no class export)')
      } else {
        // Resolved, but neither a class nor a factory — report the actual shape.
        var shape = mmkvNs ? Object.keys(mmkvNs).slice(0, 10).join(', ') : 'null'
        storageDiag.mmkvError = 'module resolved but no MMKV class or createMMKV (keys: ' + shape + ')'
        storageDiag.notes.push(storageDiag.mmkvError)
      }
    } catch (e) {
      storageDiag.mmkvError = (e && e.message) || 'require failed'
      storageDiag.notes.push('react-native-mmkv require failed: ' + storageDiag.mmkvError)
    }

    // Lazily open the DEFAULT MMKV instance on first read. Same-id instances
    // share the same native storage, so this sees the exact same data as the
    // app's own 'new MMKV()' even if the app created it before this snippet ran
    // (the common 'export const storage = new MMKV()' at module load).
    function ensureDefaultMmkv() {
      if (defaultMmkvOpened || (!OrigMMKV && !mmkvCreateFn)) return
      defaultMmkvOpened = true
      try {
        var inst = createMmkvInstance('mmkv.default')
        if (inst) trackMmkv(inst, 'mmkv.default')
      } catch (e) {
        storageDiag.notes.push('Opening default MMKV failed: ' + ((e && e.message) || 'error'))
      }
    }

    // ── WatermelonDB Bridge ─────────────────────────
    // Wrap @nozbe/watermelondb's Database constructor so any DB the app builds
    // AFTER this snippet is captured. A DB built earlier won't be caught, so the
    // user can expose it via global.__rnspyWatermelonDB — checked on every read.
    try {
      var WMDBModule = require('@nozbe/watermelondb')
      var DatabaseClass = WMDBModule && (WMDBModule.Database || (WMDBModule.default && WMDBModule.default.Database))
      // Query helpers (Q.skip / Q.take) enable efficient server-side paging.
      watermelonQ = (WMDBModule && (WMDBModule.Q || (WMDBModule.default && WMDBModule.default.Q))) || null
      if (typeof DatabaseClass === 'function') {
        watermelonDiag.resolved = true
        // Proxy the constructor so 'new Database(...)' is captured without
        // altering behavior (construct trap forwards to the real class).
        var TrackedDatabase = new Proxy(DatabaseClass, {
          construct: function (target, args, newTarget) {
            var db = Reflect.construct(target, args, newTarget)
            try { if (!watermelonDB) watermelonDB = db } catch {}
            return db
          },
        })
        if (WMDBModule.Database) WMDBModule.Database = TrackedDatabase
        if (WMDBModule.default && WMDBModule.default.Database) WMDBModule.default.Database = TrackedDatabase
      } else {
        watermelonDiag.notes.push('@nozbe/watermelondb resolved but no Database export')
      }
    } catch (e) {
      watermelonDiag.error = (e && e.message) || 'require failed'
    }

    function resolveWatermelonDB() {
      // Prefer an explicitly exposed instance; fall back to the captured one.
      try {
        if (global.__rnspyWatermelonDB) return global.__rnspyWatermelonDB
      } catch {}
      return watermelonDB
    }

    // Serialize a WatermelonDB record's user fields (its _raw column bag),
    // skipping internal sync bookkeeping columns.
    function serializeWmRecord(rec) {
      var raw = (rec && rec._raw) || {}
      var out = {}
      for (var k in raw) {
        if (!Object.prototype.hasOwnProperty.call(raw, k)) continue
        if (k === '_status' || k === '_changed') continue
        var v = raw[k]
        out[k] = (v !== null && typeof v === 'object') ? JSON.stringify(v) : v
      }
      return out
    }

    // Resolve a Collection by table name across Watermelon versions.
    function getWmCollection(db, name) {
      if (db.get) return db.get(name)
      if (db.collections && db.collections.get) return db.collections.get(name)
      return null
    }

    // Enumerate table names from the collections map, falling back to schema.
    function listWmTableNames(db) {
      var names = []
      try {
        var collectionsMap = db.collections && db.collections.map
        if (collectionsMap && typeof collectionsMap.forEach === 'function') {
          collectionsMap.forEach(function (_c, name) { names.push(name) })
        } else if (db.schema && db.schema.tables) {
          for (var t in db.schema.tables) {
            if (Object.prototype.hasOwnProperty.call(db.schema.tables, t)) names.push(t)
          }
        }
      } catch (e) {
        watermelonDiag.notes.push('Enumerating tables failed: ' + ((e && e.message) || 'error'))
      }
      return names
    }

    // Column names for a table, taken from its schema definition (order-stable,
    // available without fetching any rows). '_status'/'_changed' are excluded.
    function wmSchemaColumns(db, name) {
      var cols = []
      try {
        var table = db.schema && db.schema.tables && db.schema.tables[name]
        var colMap = table && table.columns
        if (colMap) {
          if (typeof colMap.forEach === 'function') {
            colMap.forEach(function (_def, key) { cols.push(key) })
          } else {
            for (var k in colMap) {
              if (Object.prototype.hasOwnProperty.call(colMap, k)) cols.push(k)
            }
          }
        }
      } catch {}
      return cols
    }

    // Table metadata only: row count + columns, NO rows. Cheap; sent up front so
    // the desktop can render the table list and lazy-load rows in pages.
    function listWatermelonTables() {
      var db = resolveWatermelonDB()
      if (!db) return Promise.resolve(null)
      var names = listWmTableNames(db)
      if (!names.length) return Promise.resolve([])

      var tasks = names.map(function (name) {
        try {
          var collection = getWmCollection(db, name)
          if (!collection) return Promise.resolve({ table: name, columns: [], rowCount: 0, error: 'collection-not-found' })
          return collection.query().fetchCount().then(function (count) {
            return { table: name, columns: wmSchemaColumns(db, name), rowCount: count || 0 }
          }).catch(function (err) {
            return { table: name, columns: wmSchemaColumns(db, name), rowCount: 0, error: (err && err.message) || 'count-failed' }
          })
        } catch (e) {
          return Promise.resolve({ table: name, columns: [], rowCount: 0, error: (e && e.message) || 'error' })
        }
      })
      return Promise.all(tasks)
    }

    // Fetch one page of rows for a table. Uses Q.skip/Q.take for server-side
    // paging when available; otherwise fetches all and slices (still correct,
    // just less efficient on very large tables).
    var WM_PAGE_SIZE = 50
    function fetchWatermelonPage(name, offset, limit) {
      var db = resolveWatermelonDB()
      if (!db) return Promise.resolve({ table: name, offset: offset, rows: [], total: 0, error: 'no-db' })
      var off = Math.max(0, offset | 0)
      var lim = Math.max(1, (limit | 0) || WM_PAGE_SIZE)

      var collection
      try {
        collection = getWmCollection(db, name)
        if (!collection) return Promise.resolve({ table: name, offset: off, rows: [], total: 0, error: 'collection-not-found' })
      } catch (e) {
        return Promise.resolve({ table: name, offset: off, rows: [], total: 0, error: (e && e.message) || 'error' })
      }

      // watermelonQ is the module's Q helpers; guard because older builds lack skip/take.
      var canPage = watermelonQ && typeof watermelonQ.skip === 'function' && typeof watermelonQ.take === 'function'
      var countP = collection.query().fetchCount().catch(function () { return 0 })
      var rowsP
      try {
        rowsP = canPage
          ? collection.query(watermelonQ.skip(off), watermelonQ.take(lim)).fetch()
          : collection.query().fetch().then(function (all) { return (all || []).slice(off, off + lim) })
      } catch (e) {
        rowsP = Promise.reject(e)
      }

      return Promise.all([rowsP, countP]).then(function (res) {
        var records = res[0] || []
        var total = res[1] || 0
        var rows = records.map(function (r) { return { id: r.id, fields: serializeWmRecord(r) } })
        return { table: name, offset: off, limit: lim, rows: rows, total: total, paged: canPage }
      }).catch(function (err) {
        return { table: name, offset: off, rows: [], total: 0, error: (err && err.message) || 'query-failed' }
      })
    }

    function wmDiag() {
      return {
        resolved: watermelonDiag.resolved,
        error: watermelonDiag.error,
        hasInstance: !!resolveWatermelonDB(),
        notes: watermelonDiag.notes.slice(-6),
      }
    }

    // Send table list (metadata only).
    function sendWatermelonSnapshot(reqId) {
      listWatermelonTables().then(function (tables) {
        send({
          kind: 'watermelon-snapshot', reqId: reqId,
          available: !!resolveWatermelonDB(),
          tables: tables || [],
          diag: wmDiag(),
        })
      }).catch(function (err) {
        send({
          kind: 'watermelon-snapshot', reqId: reqId, available: false, tables: [],
          error: (err && err.message) || 'collect-failed', diag: wmDiag(),
        })
      })
    }

    // Send one page of rows for a table.
    function sendWatermelonPage(reqId, table, offset, limit) {
      fetchWatermelonPage(table, offset, limit).then(function (page) {
        send({ kind: 'watermelon-page', reqId: reqId, available: !!resolveWatermelonDB(), page: page })
      }).catch(function (err) {
        send({
          kind: 'watermelon-page', reqId: reqId, available: false,
          page: { table: table, offset: offset, rows: [], total: 0, error: (err && err.message) || 'page-failed' },
        })
      })
    }

    function readMmkvValue(inst, k) {
      try {
        var s = inst.getString(k)
        if (s !== undefined) return { value: s, type: 'string' }
      } catch {}
      try {
        var n = inst.getNumber(k)
        if (n !== undefined) return { value: n, type: 'number' }
      } catch {}
      try {
        var b = inst.getBoolean(k)
        if (b !== undefined) return { value: b, type: 'boolean' }
      } catch {}
      return { value: '', type: 'string' }
    }

    function collectStorage() {
      var backends = []

      // Open the default MMKV store lazily (safe now: runtime is ready).
      ensureDefaultMmkv()

      // MMKV instances (synchronous)
      var seenIds = {}
      mmkvInstances.forEach(function (inst) {
        try {
          var id = inst.__rnspyId || 'mmkv.default'
          if (seenIds[id]) return
          seenIds[id] = true
          var keys = inst.getAllKeys() || []
          var entries = keys.map(function (k) {
            var r = readMmkvValue(inst, k)
            return { key: k, value: r.value, type: r.type }
          })
          backends.push({ backend: 'mmkv', instanceId: id, label: 'MMKV · ' + id, entries: entries })
        } catch (e) {
          storageDiag.notes.push('Reading MMKV "' + (inst.__rnspyId || '?') + '" failed: ' + ((e && e.message) || 'error'))
        }
      })

      // AsyncStorage (single async store)
      if (AsyncStorage && AsyncStorage.getAllKeys) {
        return AsyncStorage.getAllKeys().then(function (keys) {
          return AsyncStorage.multiGet(keys || []).then(function (pairs) {
            var entries = (pairs || []).map(function (p) {
              return { key: p[0], value: p[1] == null ? null : p[1], type: 'string' }
            })
            backends.unshift({ backend: 'async', instanceId: 'AsyncStorage', label: 'AsyncStorage', entries: entries })
            return backends
          })
        }).catch(function () { return backends })
      }
      return Promise.resolve(backends)
    }

    function coerceMmkv(value, type) {
      if (type === 'number') { var n = Number(value); return isNaN(n) ? 0 : n }
      if (type === 'boolean') return value === true || value === 'true'
      return value == null ? '' : String(value)
    }

    function applyStorageMutation(cmd) {
      // cmd: { command, backend, instanceId, key, value, type }
      if (cmd.backend === 'async') {
        if (!AsyncStorage) return Promise.reject(new Error('AsyncStorage not installed'))
        if (cmd.command === 'storage-remove') return AsyncStorage.removeItem(cmd.key)
        return AsyncStorage.setItem(cmd.key, cmd.value == null ? '' : String(cmd.value))
      }
      if (cmd.backend === 'mmkv') {
        var inst = null
        for (var i = 0; i < mmkvInstances.length; i++) {
          if ((mmkvInstances[i].__rnspyId || 'mmkv.default') === cmd.instanceId) { inst = mmkvInstances[i]; break }
        }
        if (!inst) return Promise.reject(new Error('MMKV instance not found'))
        if (cmd.command === 'storage-remove') { inst.delete(cmd.key); return Promise.resolve() }
        inst.set(cmd.key, coerceMmkv(cmd.value, cmd.type || 'string'))
        return Promise.resolve()
      }
      return Promise.reject(new Error('unknown backend'))
    }

    // Open a named MMKV instance on demand. There is no MMKV API to enumerate
    // instances, so if the app keeps its data in 'new MMKV({ id: "x" })' created
    // before this snippet ran, the user can name that id in the UI and we open
    // it here (same-id instances share native storage, so this reveals its data).
    function openMmkvInstanceById(id) {
      if (!OrigMMKV && !mmkvCreateFn) return { ok: false, error: 'react-native-mmkv not resolved' }
      var wantId = id || 'mmkv.default'
      for (var i = 0; i < mmkvInstances.length; i++) {
        if ((mmkvInstances[i].__rnspyId || 'mmkv.default') === wantId) return { ok: true, already: true }
      }
      try {
        var inst = createMmkvInstance(wantId)
        if (!inst) return { ok: false, error: 'could not create MMKV instance' }
        trackMmkv(inst, wantId)
        return { ok: true }
      } catch (e) {
        return { ok: false, error: (e && e.message) || 'open-failed' }
      }
    }

    function buildDiag() {
      // Snapshot the diagnostics so the desktop can explain empty results.
      return {
        asyncResolved: storageDiag.asyncResolved,
        mmkvResolved: storageDiag.mmkvResolved,
        mmkvError: storageDiag.mmkvError,
        mmkvInstanceCount: mmkvInstances.length,
        notes: storageDiag.notes.slice(-8),
      }
    }

    function sendSnapshot(reqId, mutation) {
      // Reset transient per-read notes (keep resolution errors, which are sticky).
      storageDiag.notes = storageDiag.notes.filter(function (n) {
        return n.indexOf('require failed') !== -1
      })
      collectStorage().then(function (backends) {
        send({ kind: 'storage-snapshot', reqId: reqId, backends: backends, mutation: mutation || null, diag: buildDiag() })
      }).catch(function (err) {
        send({ kind: 'storage-snapshot', reqId: reqId, backends: [], error: (err && err.message) || 'collect-failed', diag: buildDiag() })
      })
    }

    // ── WebSocket Connection ────────────────────────
    let ws = null
    let seq = 0
    const queue = []
    const MAX_QUEUE = 500

    function send(msg) {
      msg.deviceId = deviceId
      msg.timestamp = Date.now()
      msg.id = msg.id || ++seq
      if (ws && ws.readyState === 1) {
        try { ws.send(JSON.stringify(msg)); return } catch {}
      }
      if (queue.length < MAX_QUEUE) queue.push(msg)
    }

    function flush() {
      while (queue.length && ws && ws.readyState === 1) {
        try { ws.send(JSON.stringify(queue.shift())) } catch { break }
      }
    }

    function connect() {
      try {
        const OrigWS = global.__rnspyOrigWS || global.WebSocket
        ws = new OrigWS(RNSPY_URL)
        ws.onopen = function () {
          send({ kind: 'hello', name: deviceName, platform: devicePlatform })
          flush()
        }
        ws.onmessage = function (e) {
          try {
            var msg = JSON.parse(e.data)
            if (msg && msg.kind === 'command') {
              if (msg.command === 'reload') {
                // Try RN DevSettings fast-refresh first, then full reload
                try {
                  var DevSettings = require('react-native/Libraries/Utilities/DevSettings')
                  if (DevSettings && DevSettings.reload) { DevSettings.reload(); return }
                } catch {}
                try {
                  var { DevSettings: DS } = require('react-native')
                  if (DS && DS.reload) { DS.reload(); return }
                } catch {}
              }
              if (msg.command === 'storage-read') {
                sendSnapshot(msg.reqId)
                return
              }
              if (msg.command === 'storage-open-instance') {
                // Open a named MMKV instance the user typed in. Same-id
                // instances share native storage, so this reveals data from a
                // named store the app created before this snippet ran.
                openMmkvInstanceById(msg.instanceId)
                sendSnapshot(msg.reqId)
                return
              }
              if (msg.command === 'watermelon-read') {
                sendWatermelonSnapshot(msg.reqId)
                return
              }
              if (msg.command === 'watermelon-page') {
                sendWatermelonPage(msg.reqId, msg.table, msg.offset, msg.limit)
                return
              }
              if (msg.command === 'storage-set' || msg.command === 'storage-remove') {
                applyStorageMutation(msg)
                  .then(function () { sendSnapshot(msg.reqId, { ok: true, key: msg.key, command: msg.command }) })
                  .catch(function (err) {
                    send({ kind: 'storage-snapshot', reqId: msg.reqId, backends: [],
                           mutation: { ok: false, key: msg.key, command: msg.command, error: (err && err.message) || 'failed' } })
                  })
                return
              }
            }
          } catch {}
        }
        ws.onclose = function () { setTimeout(connect, 2000) }
        ws.onerror = function () {}
      } catch { setTimeout(connect, 2000) }
    }
    connect()

    // ── Patch console.* ────────────────────────────
    // Captures caller file:line:col from Error().stack.
    // Skips 2 internal frames: (1) new Error() itself, (2) the patched console wrapper.
    var SDK_FRAMES_TO_SKIP = 2

    function parseCallerFromStack(stack) {
      if (!stack) return null
      var lines = stack.split('\\n')
      var frameIdx = 0
      for (var i = 1; i < lines.length; i++) {
        var line = lines[i]
        var m = line.match(/(?:at\\s+(?:.*?\\s+)?\\(?|^\\s*)([^()\\s]+?):(\\d+):(\\d+)/)
        if (!m) continue
        frameIdx++
        if (frameIdx <= SDK_FRAMES_TO_SKIP) continue
        var filePath = m[1]
        filePath = filePath.replace(/^https?:\\/\\/[^/]+\\//, '')
        return { file: filePath, line: parseInt(m[2], 10), col: parseInt(m[3], 10) }
      }
      return null
    }

    function stripSdkFrames(stack) {
      if (!stack) return stack
      var lines = stack.split('\\n')
      var result = [lines[0]]
      var frameIdx = 0
      for (var i = 1; i < lines.length; i++) {
        var hasLoc = /:\d+:\d+/.test(lines[i])
        if (hasLoc) {
          frameIdx++
          if (frameIdx <= SDK_FRAMES_TO_SKIP) continue
        }
        result.push(lines[i])
      }
      return result.join('\\n')
    }

    var levels = ['log', 'info', 'warn', 'error', 'debug']
    levels.forEach(function (level) {
      var orig = console[level]
      console[level] = function () {
        orig.apply(console, arguments)
        var args = []
        for (var i = 0; i < arguments.length; i++) {
          try {
            var a = arguments[i]
            if (a instanceof Error) args.push({ message: a.message, stack: a.stack })
            else if (typeof a === 'object' && a !== null) args.push(JSON.parse(JSON.stringify(a)))
            else args.push(a)
          } catch { args.push('[unserializable]') }
        }
        var caller = null
        var rawStack = null
        try {
          var fullStack = new Error().stack
          caller = parseCallerFromStack(fullStack)
          rawStack = stripSdkFrames(fullStack)
        } catch {}
        send({ kind: 'console', level: level, args: args, caller: caller, stack: rawStack })
      }
    })

    // ── Fetch De-duplication ────────────────────────
    var pendingFetches = new Map()
    function markFetch(url, method) {
      var key = (method || 'GET') + ' ' + url
      pendingFetches.set(key, Date.now())
    }
    function claimFetch(url, method) {
      var key = (method || 'GET') + ' ' + url
      var ts = pendingFetches.get(key)
      if (ts && Date.now() - ts < 5000) { pendingFetches.delete(key); return true }
      return false
    }

    // ── Patch fetch ────────────────────────────────
    var origFetch = global.fetch
    global.fetch = function (input, init) {
      var url = typeof input === 'string' ? input : (input && input.url) || ''
      var method = (init && init.method) || (typeof input !== 'string' && input && input.method) || 'GET'
      var id = ++seq
      var startTime = Date.now()
      markFetch(url, method)

      send({ kind: 'network-start', id: id, method: method, url: url, startTime: startTime,
             requestHeaders: (init && init.headers) || {},
             requestBody: init && init.body })

      return origFetch.apply(global, arguments).then(function (response) {
        // The fetch promise resolves once response HEADERS are available, before
        // the body streams in — so this is a real time-to-first-byte, and the
        // remainder is content download. Those two phases drive the waterfall.
        var ttfb = Date.now() - startTime
        var clone = response.clone()
        var headers = {}
        try { clone.headers.forEach(function (v, k) { headers[k] = v }) } catch {}

        return clone.text().then(function (body) {
          send({
            kind: 'network', id: id, method: method, url: url,
            status: response.status, responseHeaders: headers,
            responseBody: body, size: body.length,
            ttfb: ttfb,
            duration: Date.now() - startTime, startTime: startTime,
          })
          return response
        }).catch(function () { return response })
      }).catch(function (err) {
        send({
          kind: 'network', id: id, method: method, url: url,
          status: 0, error: err.message || 'fetch-failed',
          duration: Date.now() - startTime, startTime: startTime,
        })
        throw err
      })
    }

    // ── Patch XMLHttpRequest ────────────────────────
    var OrigXHR = global.XMLHttpRequest
    function PatchedXHR() {
      var xhr = new OrigXHR()
      var meta = { id: ++seq, method: 'GET', url: '', headers: {}, startTime: 0, ttfb: null }

      var origOpen = xhr.open
      xhr.open = function (method, url) {
        meta.method = method; meta.url = url
        return origOpen.apply(xhr, arguments)
      }

      var origSetHeader = xhr.setRequestHeader
      xhr.setRequestHeader = function (k, v) {
        meta.headers[k] = v
        return origSetHeader.apply(xhr, arguments)
      }

      var origSend = xhr.send
      xhr.send = function (body) {
        if (claimFetch(meta.url, meta.method)) return origSend.apply(xhr, arguments)
        meta.startTime = Date.now()
        send({ kind: 'network-start', id: meta.id, method: meta.method, url: meta.url,
               startTime: meta.startTime, requestHeaders: meta.headers, requestBody: body })

        // HEADERS_RECEIVED (readyState 2) is a real time-to-first-byte marker.
        // Captured here so the desktop waterfall can split wait vs download
        // instead of drawing one undifferentiated bar.
        xhr.addEventListener('readystatechange', function () {
          if (xhr.readyState === 2 && meta.ttfb == null) {
            meta.ttfb = Date.now() - meta.startTime
          }
        })

        xhr.addEventListener('loadend', function () {
          var respHeaders = {}
          try {
            var raw = xhr.getAllResponseHeaders() || ''
            raw.split('\\r\\n').forEach(function (line) {
              var idx = line.indexOf(':')
              if (idx > 0) respHeaders[line.slice(0, idx).trim()] = line.slice(idx + 1).trim()
            })
          } catch {}
          var respBody = ''
          var respSize = 0
          var rt = xhr.responseType
          if (!rt || rt === '' || rt === 'text') {
            try { respBody = xhr.responseText || ''; respSize = respBody.length } catch {}
          } else if (rt === 'json') {
            try { respBody = JSON.stringify(xhr.response); respSize = respBody.length } catch {}
          } else if (rt === 'arraybuffer' && xhr.response) {
            respSize = xhr.response.byteLength || 0
            respBody = '[ArrayBuffer ' + respSize + ' bytes]'
          } else if (rt === 'blob' && xhr.response) {
            respSize = xhr.response.size || 0
            respBody = '[Blob ' + respSize + ' bytes, type=' + (xhr.response.type || 'unknown') + ']'
          } else {
            respBody = '[' + (rt || 'unknown') + ' response]'
          }
          send({
            kind: 'network', id: meta.id, method: meta.method, url: meta.url,
            status: xhr.status, responseHeaders: respHeaders,
            responseBody: respBody, size: respSize,
            ttfb: meta.ttfb,
            duration: Date.now() - meta.startTime, startTime: meta.startTime,
          })
        })
        return origSend.apply(xhr, arguments)
      }
      return xhr
    }
    PatchedXHR.prototype = OrigXHR.prototype
    PatchedXHR.UNSENT = 0; PatchedXHR.OPENED = 1
    PatchedXHR.HEADERS_RECEIVED = 2; PatchedXHR.LOADING = 3; PatchedXHR.DONE = 4
    global.XMLHttpRequest = PatchedXHR

    // ── Patch WebSocket (SignalR-compatible) ────────────────────────────
    // Key constraints:
    // 1. Forward ALL constructor args (url, protocols, options) for SignalR auth.
    // 2. Do NOT mutate OrigWebSocket.prototype (shared object) — causes loops.
    // 3. instanceof WebSocket must pass — SignalR checks this.
    // 4. Do not break native host-object property accessors (readyState, url).
    // Uses Symbol.hasInstance so real OrigWebSocket instances pass instanceof.
    var OrigWebSocket = global.WebSocket
    global.__rnspyOrigWS = OrigWebSocket

    // Track if we're inside our own connect() to prevent re-entry
    var insideSpyConnect = false

    function createSocket(url, protocols, options) {
      if (options != null) return new OrigWebSocket(url, protocols, options)
      if (protocols != null) return new OrigWebSocket(url, protocols)
      return new OrigWebSocket(url)
    }

    function interceptSocket(socket, url, protocols) {
      var wsId = ++seq

      send({ kind: 'ws-open', wsId: wsId, url: url, protocols: protocols,
             startTime: Date.now() })

      var origWsSend = socket.send.bind(socket)
      socket.send = function (data) {
        send({ kind: 'ws-frame', wsId: wsId, dir: 'send', data: data,
               size: typeof data === 'string' ? data.length : (data && data.byteLength) || 0 })
        return origWsSend(data)
      }

      socket.addEventListener('message', function (e) {
        var d = e.data
        var sz = typeof d === 'string' ? d.length : (d && d.byteLength) || 0
        send({ kind: 'ws-frame', wsId: wsId, dir: 'recv', data: d, size: sz })
      })

      socket.addEventListener('close', function (e) {
        send({ kind: 'ws-close', wsId: wsId, code: e.code, reason: e.reason,
               wasClean: e.wasClean, endTime: Date.now() })
      })

      socket.addEventListener('error', function () {
        send({ kind: 'ws-error', wsId: wsId, message: 'WebSocket error' })
      })

      return socket
    }

    // The patched constructor — returns a genuine OrigWebSocket instance
    var PatchedWebSocket = function WebSocket(url, protocols, options) {
      var socket = createSocket(url, protocols, options)

      // Skip interception for: our own spy connection, or re-entrant calls
      if (insideSpyConnect) return socket
      if (typeof url === 'string' && url.indexOf(RNSPY_HOST + ':' + RNSPY_PORT) !== -1) return socket

      return interceptSocket(socket, url, protocols)
    }

    // DO NOT assign PatchedWebSocket.prototype = OrigWebSocket.prototype
    // That would let .constructor assignment corrupt the original.
    // Instead, create a NEW prototype object that inherits from OrigWebSocket.prototype
    PatchedWebSocket.prototype = Object.create(OrigWebSocket.prototype)
    // Don't set .constructor — leave it as OrigWebSocket so nothing breaks

    // Static constants
    PatchedWebSocket.CONNECTING = 0
    PatchedWebSocket.OPEN = 1
    PatchedWebSocket.CLOSING = 2
    PatchedWebSocket.CLOSED = 3

    // Make instanceof PatchedWebSocket return true for OrigWebSocket instances
    Object.defineProperty(PatchedWebSocket, Symbol.hasInstance, {
      value: function (instance) {
        return instance instanceof OrigWebSocket
      }
    })

    global.WebSocket = PatchedWebSocket

    // Fix our own connect() to use OrigWebSocket directly and mark re-entry
    var origConnect = connect
    connect = function () {
      insideSpyConnect = true
      try { origConnect() } finally { insideSpyConnect = false }
    }

    // ── SignalR Fallback: patch HubConnectionBuilder.withUrl ──
    // In RN, SignalR resolves WebSocket constructor via options.WebSocket.
    // If SignalR was loaded before this SDK, it may have cached OrigWebSocket.
    // This ensures PatchedWebSocket is injected into the connection options.
    try {
      var origRequire = typeof require !== 'undefined' && require
      if (origRequire) {
        var patchSignalRModule = function (signalr) {
          if (!signalr || !signalr.HubConnectionBuilder) return signalr
          var origWithUrl = signalr.HubConnectionBuilder.prototype.withUrl
          signalr.HubConnectionBuilder.prototype.withUrl = function (url, opts) {
            if (typeof opts === 'object' && opts !== null) {
              opts.WebSocket = opts.WebSocket || PatchedWebSocket
            } else if (typeof opts === 'number' || opts === undefined) {
              opts = { transport: opts, WebSocket: PatchedWebSocket }
            }
            return origWithUrl.call(this, url, opts)
          }
          return signalr
        }

        try { patchSignalRModule(origRequire('@microsoft/signalr')) } catch {}
        try { patchSignalRModule(origRequire('@react-native-community/signalr')) } catch {}
      }
    } catch {}
  })()
}
`

export function buildRnClient({ host = 'localhost', port = 8097 } = {}) {
  return TEMPLATE
    .replace('__RNSPY_HOST__', host)
    .replace('__RNSPY_PORT__', String(port))
}
