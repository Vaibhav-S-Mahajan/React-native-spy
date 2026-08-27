/* ═══════════════════════════════════════════════════════════════
   Shared mock harness for all six theme mockups.

   Every theme file loads this and calls mountApp(). The DOM, the data,
   the virtualization, and the interactions are identical across themes —
   only the CSS custom properties differ. That way you compare visual
   language, not content.

   Implements for real (not faked):
     - fixed-height row virtualization with a live in-DOM row counter
     - keyboard grid navigation (roving tabIndex, arrows/Home/End/Enter)
     - new-row flash animation driven by seq comparison
     - streaming console with sticky-bottom tailing + "N new" pill
     - skeleton loading state
     - hover / selected / focus-visible as distinct states
   ═══════════════════════════════════════════════════════════════ */

/* ─── Seeded RNG so every theme shows the identical scene ─── */
function makeRng(seed) {
  let s = seed >>> 0
  return function rng() {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

const HOSTS = ['api.stepron.io', 'cdn.stepron.io', 'auth.stepron.io']
const PATHS = [
  '/v2/users/me', '/v2/feed?page=1', '/v2/feed?page=2', '/v2/orders',
  '/v2/orders/8821/items', '/v2/cart', '/v2/cart/apply-coupon',
  '/v2/products/search?q=shoes', '/v2/products/1042', '/v2/notifications',
  '/v2/session/refresh', '/v2/analytics/batch', '/assets/hero@2x.webp',
  '/assets/icons.woff2', '/v2/config/flags', '/v2/messages/threads',
  '/v2/payments/methods', '/v2/addresses', '/v2/reviews?product=1042',
  '/v2/wishlist',
]
const METHODS = ['GET', 'GET', 'GET', 'POST', 'POST', 'PUT', 'DELETE', 'PATCH']
const STATUSES = [200, 200, 200, 200, 201, 204, 301, 400, 401, 404, 422, 500, 503]

function buildRequests(count) {
  const rng = makeRng(20260731)
  const out = []
  let t = 0
  for (let i = 0; i < count; i++) {
    t += Math.floor(rng() * 900) + 60
    const method = METHODS[Math.floor(rng() * METHODS.length)]
    const path = PATHS[Math.floor(rng() * PATHS.length)]
    const host = HOSTS[Math.floor(rng() * HOSTS.length)]
    const pending = i === count - 1 || (i === count - 3)
    const status = pending ? null : STATUSES[Math.floor(rng() * STATUSES.length)]
    const dur = pending ? null : Math.floor(rng() * 1400) + 12
    const size = pending ? null : Math.floor(rng() * 240000) + 180
    out.push({
      id: 'r' + i, seq: i, method, host, path,
      url: 'https://' + host + path,
      status, duration: dur, size, pending,
      startTime: t,
      reqHeaders: {
        'content-type': 'application/json',
        authorization: 'Bearer eyJhbGciOi…',
        'x-client': 'rnspy/1.0.0',
      },
      resHeaders: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store',
        'x-request-id': 'req_' + (10000 + i),
      },
      reqBody: method === 'GET' ? null : JSON.stringify({ productId: 1042, qty: 2 }, null, 2),
      resBody: JSON.stringify({
        ok: status ? status < 400 : null,
        data: { id: 1042, title: 'Runner Knit Low', price: 4999, currency: 'INR' },
      }, null, 2),
    })
  }
  return out.reverse() // newest first, matching the real app
}

const CONSOLE_SEED = [
  ['log', 'App mounted in 412ms'],
  ['info', 'Connected to ws://192.168.1.24:8097'],
  ['log', 'Hydrating persisted store from AsyncStorage'],
  ['warn', 'Each child in a list should have a unique "key" prop.\n    at FeedList (src/screens/Feed/FeedList.tsx:88:12)'],
  ['log', 'Feed page 1 → 20 items'],
  ['error', "TypeError: Cannot read property 'title' of undefined\n    at ProductCard (src/components/ProductCard.tsx:34:21)\n    at renderWithHooks (node_modules/react-native/…)"],
  ['debug', 'MMKV read: cart.items (2 entries)'],
  ['log', 'Cart total recalculated → ₹9,998'],
  ['info', 'Coupon SAVE10 applied'],
  ['warn', 'Slow render: FeedList took 68ms (budget 16ms)'],
  ['log', 'Prefetching /v2/products/1042'],
  ['error', 'Network request failed: 503 at src/api/client.ts:142:9'],
  ['debug', 'WatermelonDB query: orders where status=pending (4 rows)'],
  ['log', 'Navigated Feed → ProductDetail'],
]

const CONSOLE_STREAM = [
  ['log', 'Scroll velocity 1.8 → prefetch next page'],
  ['debug', 'MMKV write: session.lastSeen'],
  ['log', 'Feed page 2 → 20 items'],
  ['info', 'Token refreshed, expires in 3600s'],
  ['warn', 'Image decode took 92ms for /assets/hero@2x.webp'],
  ['log', 'Added product 1042 to wishlist'],
  ['error', 'Unhandled promise rejection at src/screens/Cart/useCart.ts:57:3'],
  ['log', 'Analytics batch flushed (14 events)'],
]

const DEVICES = [
  { key: 'd1', name: 'iPhone 15 Pro', platform: 'ios', online: true, count: 60 },
  { key: 'd2', name: 'Pixel 8', platform: 'android', online: true, count: 23 },
  { key: 'd3', name: 'iPad Air', platform: 'ios', online: false, count: 8 },
]

const TABS = ['Network', 'WebSocket', 'Console', 'Storage', 'WatermelonDB', 'Logs']

/* ─── Formatting helpers ─── */
function fmtSize(n) {
  if (n == null) return '—'
  if (n < 1024) return n + ' B'
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB'
  return (n / 1048576).toFixed(2) + ' MB'
}
function fmtDur(n) {
  if (n == null) return '—'
  return n < 1000 ? n + ' ms' : (n / 1000).toFixed(2) + ' s'
}
function fmtClock(ms) {
  const d = new Date(1735689600000 + ms)
  const p = (v, n) => String(v).padStart(n, '0')
  return p(d.getHours(), 2) + ':' + p(d.getMinutes(), 2) + ':' + p(d.getSeconds(), 2) + '.' + p(d.getMilliseconds(), 3)
}
function statusClass(s, pending) {
  if (pending) return 'is-pending'
  if (s >= 500) return 'is-err'
  if (s >= 400) return 'is-warn'
  if (s >= 300) return 'is-info'
  return 'is-ok'
}
function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
}

/* ═══ Main mount ═══ */
function mountApp(root) {
  const requests = buildRequests(60)
  // Default to a *completed* request, not a pending one — otherwise the timing
  // bar has no duration to render and the detail pane opens looking broken.
  const firstDoneIdx = Math.max(0, requests.findIndex((r) => !r.pending))
  const state = {
    tab: 'Network',
    device: 'd1',
    selectedId: requests[firstDoneIdx].id,
    activeRow: firstDoneIdx,
    search: '',
    loading: true,
    consoleLogs: CONSOLE_SEED.map((l, i) => ({ id: 'c' + i, level: l[0], msg: l[1], t: i * 640 })),
    streamIdx: 0,
    tailing: true,
    unseen: 0,
    newIds: new Set(),
  }

  root.innerHTML = `
    <div class="app">
      <header class="titlebar">
        <div class="tl-spacer"></div>
        <div class="brand">
          <span class="brand-mark" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 3v18M5 8l7-5 7 5M5 16l7 5 7-5"/></svg>
          </span>
          <span class="brand-name">React Native Spy</span>
        </div>
        <span class="rule" aria-hidden="true"></span>
        <span class="badge is-ok" role="status">
          <span class="dot pulse" aria-hidden="true"></span>2 connected
        </span>
        <button class="chip" type="button" title="Copy connection URL">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12.55a11 11 0 0 1 14 0M8.5 16.4a6 6 0 0 1 7 0M12 20h.01"/></svg>
          ws://192.168.1.24:8097
        </button>
        <div class="grow"></div>
        <button class="btn btn-accent" type="button">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
          Update to 1.1.0
        </button>
        <button class="btn btn-ghost" type="button">Project</button>
        <button class="btn btn-ghost" type="button">Settings</button>
      </header>

      <nav class="tabbar" role="tablist" aria-label="Panels">
        ${TABS.map((t, i) => `
          <button class="tab${t === 'Network' ? ' is-active' : ''}" role="tab"
                  aria-selected="${t === 'Network'}" tabindex="${t === 'Network' ? 0 : -1}"
                  data-tab="${t}">
            ${t}<span class="tab-count">${[60, 4, 14, 12, 5, 31][i]}</span>
          </button>`).join('')}
        <span class="tab-ink" aria-hidden="true"></span>
      </nav>

      <div class="devicebar" role="tablist" aria-label="Devices">
        ${DEVICES.map((d) => `
          <button class="devtab${d.key === 'd1' ? ' is-active' : ''}" role="tab"
                  aria-selected="${d.key === 'd1'}" tabindex="${d.key === 'd1' ? 0 : -1}"
                  data-device="${d.key}" title="${d.name} · ${d.platform}">
            <span class="dot ${d.online ? 'is-live' : 'is-off'}" aria-hidden="true"></span>
            <span class="devtab-name">${d.name}</span>
            <span class="pill">${d.count}</span>
            <span class="devtab-x" role="presentation" title="Close">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </span>
          </button>`).join('')}
      </div>

      <main class="body">
        <section class="pane pane-list" aria-label="Network requests">
          <div class="toolbar">
            <div class="seg" role="group" aria-label="Method filter">
              <button class="seg-btn is-on" type="button" aria-pressed="true">All</button>
              <button class="seg-btn" type="button" aria-pressed="false">XHR</button>
              <button class="seg-btn" type="button" aria-pressed="false">Fetch</button>
            </div>
            <span class="rule" aria-hidden="true"></span>
            <label class="field">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
              <input id="q" type="search" placeholder="Filter requests…" aria-label="Filter requests">
            </label>
            <span class="count" id="shown">60 shown</span>
            <span class="rule" aria-hidden="true"></span>
            <button class="icon-btn is-danger" type="button" aria-label="Clear requests" title="Clear">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
            </button>
            <button class="icon-btn" type="button" aria-label="Reload app" title="Reload app">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
            </button>
          </div>

          <div class="colhead" role="row" aria-hidden="true">
            <span>Method</span><span>URL</span>
            <span class="ta-r">Status</span><span class="ta-r">Size</span>
            <span class="ta-r">Time</span><span></span>
          </div>

          <div class="scroll" id="scroll" role="grid" aria-label="Requests"
               aria-rowcount="60" tabindex="0">
            <div id="pad-top" aria-hidden="true"></div>
            <div id="rows"></div>
            <div id="pad-bot" aria-hidden="true"></div>
          </div>

          <div class="statusline">
            <span class="vmeta">DOM rows <b id="domcount">0</b> / 60</span>
            <span class="vmeta">virtualized</span>
            <div class="grow"></div>
            <span class="vmeta" id="range"></span>
          </div>
        </section>

        <div class="split" role="separator" aria-orientation="vertical"
             aria-label="Resize" tabindex="0"></div>

        <section class="pane pane-detail" aria-label="Request detail">
          <div class="dtabs" role="tablist" aria-label="Detail sections">
            ${['Headers', 'Payload', 'Response', 'Timing'].map((d, i) => `
              <button class="dtab${i === 0 ? ' is-active' : ''}" role="tab"
                      aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${d}</button>`).join('')}
            <div class="grow"></div>
            <button class="icon-btn sm" type="button" aria-label="Close detail" title="Close">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="dbody" id="detail"></div>
        </section>
      </main>

      <section class="console" aria-label="Console">
        <div class="toolbar">
          <div class="seg" role="group" aria-label="Log levels">
            ${['LOG', 'INF', 'WRN', 'ERR', 'DBG'].map((l) => `
              <button class="seg-btn is-on lvl-${l.toLowerCase()}" type="button" aria-pressed="true">
                <span class="tick" aria-hidden="true">✓</span>${l}
              </button>`).join('')}
          </div>
          <span class="rule" aria-hidden="true"></span>
          <span class="count">streaming</span>
          <div class="grow"></div>
          <button class="btn btn-ghost" id="tailbtn" type="button" aria-pressed="true">
            Tailing on
          </button>
        </div>
        <div class="clog" id="clog" role="log" aria-live="polite" aria-label="Console output"></div>
        <button class="jump" id="jump" type="button" hidden>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
          <span id="jumpn">0</span> new
        </button>
      </section>
    </div>
  `

  /* ─── Virtualization (the real thing) ─── */
  const ROW_H = 28
  const OVERSCAN = 6
  const scroll = root.querySelector('#scroll')
  const rowsEl = root.querySelector('#rows')
  const padTop = root.querySelector('#pad-top')
  const padBot = root.querySelector('#pad-bot')
  const domCount = root.querySelector('#domcount')
  const rangeEl = root.querySelector('#range')
  const shownEl = root.querySelector('#shown')

  function visible() {
    const q = state.search.trim().toLowerCase()
    if (!q) return requests
    return requests.filter((r) => r.url.toLowerCase().includes(q) || r.method.toLowerCase().includes(q))
  }

  let raf = null
  function render() {
    const list = visible()
    const total = list.length
    shownEl.textContent = total + ' shown'
    scroll.setAttribute('aria-rowcount', String(total))

    if (state.loading) {
      padTop.style.height = '0px'
      padBot.style.height = '0px'
      rowsEl.innerHTML = Array.from({ length: 14 }, () => `
        <div class="row is-skeleton" aria-hidden="true">
          <span class="sk sk-m"></span><span class="sk sk-u"></span>
          <span class="sk sk-s"></span><span class="sk sk-s"></span><span class="sk sk-s"></span><span></span>
        </div>`).join('')
      domCount.textContent = '0'
      rangeEl.textContent = 'loading…'
      return
    }

    const vh = scroll.clientHeight || 320
    const first = Math.max(0, Math.floor(scroll.scrollTop / ROW_H) - OVERSCAN)
    const last = Math.min(total, Math.ceil((scroll.scrollTop + vh) / ROW_H) + OVERSCAN)

    padTop.style.height = first * ROW_H + 'px'
    padBot.style.height = Math.max(0, (total - last) * ROW_H) + 'px'

    const slice = list.slice(first, last)
    rowsEl.innerHTML = slice.map((r, i) => {
      const idx = first + i
      const sel = r.id === state.selectedId
      const act = idx === state.activeRow
      return `
        <div class="row ${statusClass(r.status, r.pending)}${sel ? ' is-selected' : ''}${state.newIds.has(r.id) ? ' is-new' : ''}"
             role="row" aria-selected="${sel}" aria-rowindex="${idx + 1}"
             tabindex="${act ? 0 : -1}" data-id="${r.id}" data-idx="${idx}">
          <span role="gridcell" class="m m-${r.method.toLowerCase()}">${r.method}</span>
          <span role="gridcell" class="u" title="${esc(r.url)}">
            <span class="u-path">${esc(r.path)}</span>
            <span class="u-host">${esc(r.host)}</span>
          </span>
          <span role="gridcell" class="ta-r st">${r.pending ? '<span class="shimmer">···</span>' : r.status}</span>
          <span role="gridcell" class="ta-r nm">${fmtSize(r.size)}</span>
          <span role="gridcell" class="ta-r nm">${fmtDur(r.duration)}</span>
          <span role="gridcell" class="act">
            <button class="icon-btn xs" type="button" tabindex="-1" aria-label="Row actions" title="Actions">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
            </button>
          </span>
        </div>`
    }).join('')

    domCount.textContent = String(slice.length)
    rangeEl.textContent = `rows ${total ? first + 1 : 0}–${last} of ${total}`
  }

  scroll.addEventListener('scroll', () => {
    if (raf) return
    raf = requestAnimationFrame(() => { raf = null; render() })
  })
  new ResizeObserver(() => render()).observe(scroll)

  /* ─── Detail pane ─── */
  function kv(k, v) {
    return `<div class="kv"><span class="kv-k">${esc(k)}</span><span class="kv-v">${esc(v)}</span></div>`
  }
  function renderDetail() {
    const r = requests.find((x) => x.id === state.selectedId) || requests[0]
    const bar = r.duration ? Math.min(100, Math.round((r.duration / 1400) * 100)) : 0
    root.querySelector('#detail').innerHTML = `
      <div class="dsec">
        <div class="dsec-h">General</div>
        ${kv('URL', r.url)}
        ${kv('Method', r.method)}
        ${kv('Status', r.pending ? 'pending' : r.status)}
        ${kv('Size', fmtSize(r.size))}
        ${kv('Time', fmtDur(r.duration))}
      </div>
      <div class="dsec">
        <div class="dsec-h">Timing</div>
        <div class="track" role="img" aria-label="Duration ${fmtDur(r.duration)}">
          <span class="track-fill" style="width:${bar}%"></span>
        </div>
        <div class="track-legend"><span>0 ms</span><span>${fmtDur(r.duration)}</span></div>
      </div>
      <div class="dsec">
        <div class="dsec-h">Response headers</div>
        ${Object.entries(r.resHeaders).map(([k, v]) => kv(k, v)).join('')}
      </div>
      <div class="dsec">
        <div class="dsec-h">Response body</div>
        <pre class="code">${esc(r.resBody)}</pre>
      </div>
    `
  }

  /* ─── Row interaction: mouse + full keyboard grid ─── */
  rowsEl.addEventListener('click', (e) => {
    const row = e.target.closest('.row')
    if (!row || row.classList.contains('is-skeleton')) return
    state.selectedId = row.dataset.id
    state.activeRow = Number(row.dataset.idx)
    render(); renderDetail()
  })

  scroll.addEventListener('keydown', (e) => {
    const list = visible()
    const max = list.length - 1
    let n = state.activeRow
    if (e.key === 'ArrowDown') n = Math.min(max, n + 1)
    else if (e.key === 'ArrowUp') n = Math.max(0, n - 1)
    else if (e.key === 'Home') n = 0
    else if (e.key === 'End') n = max
    else if (e.key === 'PageDown') n = Math.min(max, n + 10)
    else if (e.key === 'PageUp') n = Math.max(0, n - 10)
    else if (e.key === 'Enter' || e.key === ' ') {
      const r = list[n]; if (r) { state.selectedId = r.id; render(); renderDetail() }
      e.preventDefault(); return
    } else return

    e.preventDefault()
    state.activeRow = n
    const top = n * ROW_H
    if (top < scroll.scrollTop) scroll.scrollTop = top
    else if (top + ROW_H > scroll.scrollTop + scroll.clientHeight) {
      scroll.scrollTop = top + ROW_H - scroll.clientHeight
    }
    render()
    const el = rowsEl.querySelector(`[data-idx="${n}"]`)
    if (el) el.focus({ preventScroll: true })
  })

  root.querySelector('#q').addEventListener('input', (e) => {
    state.search = e.target.value
    state.activeRow = 0
    scroll.scrollTop = 0
    render()
  })

  /* ─── Tab bar: sliding ink + arrow keys ─── */
  const ink = root.querySelector('.tab-ink')
  function moveInk(btn) {
    ink.style.width = btn.offsetWidth + 'px'
    ink.style.transform = `translateX(${btn.offsetLeft}px)`
  }
  const tabs = [...root.querySelectorAll('.tab')]
  tabs.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabs.forEach((b) => {
        b.classList.toggle('is-active', b === btn)
        b.setAttribute('aria-selected', String(b === btn))
        b.tabIndex = b === btn ? 0 : -1
      })
      moveInk(btn)
    })
  })
  root.querySelector('.tabbar').addEventListener('keydown', (e) => {
    const i = tabs.indexOf(document.activeElement)
    if (i < 0) return
    let n = i
    if (e.key === 'ArrowRight') n = (i + 1) % tabs.length
    else if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length
    else return
    e.preventDefault(); tabs[n].focus(); tabs[n].click()
  })

  /* ─── Device tabs ─── */
  const dtabs = [...root.querySelectorAll('.devtab')]
  dtabs.forEach((b) => b.addEventListener('click', () => {
    dtabs.forEach((x) => {
      x.classList.toggle('is-active', x === b)
      x.setAttribute('aria-selected', String(x === b))
      x.tabIndex = x === b ? 0 : -1
    })
  }))

  /* ─── Console stream with sticky-bottom tailing ─── */
  const clog = root.querySelector('#clog')
  const jump = root.querySelector('#jump')
  const jumpN = root.querySelector('#jumpn')
  const tailBtn = root.querySelector('#tailbtn')
  const LVL = { log: 'LOG', info: 'INF', warn: 'WRN', error: 'ERR', debug: 'DBG' }

  function renderConsole() {
    clog.innerHTML = state.consoleLogs.map((l) => {
      const msg = esc(l.msg).replace(
        /((?:src|node_modules)\/[\w@./-]+\.\w{1,5})(?::(\d+))?(?::(\d+))?/g,
        (m, f, ln, c) => `<button class="path" type="button" tabindex="-1" title="Open ${f} in editor">${f}${ln ? ':' + ln : ''}${c ? ':' + c : ''}</button>`
      )
      return `
        <div class="cline lvl-${l.level}${state.newIds.has(l.id) ? ' is-new' : ''}">
          <span class="ctag">${LVL[l.level]}</span>
          <span class="ctime">${fmtClock(l.t)}</span>
          <span class="cmsg">${msg}</span>
        </div>`
    }).join('')
    if (state.tailing) clog.scrollTop = clog.scrollHeight
  }

  clog.addEventListener('scroll', () => {
    const atBottom = clog.scrollHeight - clog.scrollTop - clog.clientHeight < 40
    if (atBottom && !state.tailing) {
      state.tailing = true; state.unseen = 0
      jump.hidden = true
      tailBtn.textContent = 'Tailing on'
      tailBtn.setAttribute('aria-pressed', 'true')
    } else if (!atBottom && state.tailing) {
      state.tailing = false
      tailBtn.textContent = 'Tailing off'
      tailBtn.setAttribute('aria-pressed', 'false')
    }
  })
  jump.addEventListener('click', () => {
    state.tailing = true; state.unseen = 0
    jump.hidden = true
    clog.scrollTop = clog.scrollHeight
    tailBtn.textContent = 'Tailing on'
    tailBtn.setAttribute('aria-pressed', 'true')
  })
  tailBtn.addEventListener('click', () => {
    state.tailing = !state.tailing
    tailBtn.textContent = state.tailing ? 'Tailing on' : 'Tailing off'
    tailBtn.setAttribute('aria-pressed', String(state.tailing))
    if (state.tailing) { state.unseen = 0; jump.hidden = true; clog.scrollTop = clog.scrollHeight }
  })

  /* ─── Boot: skeleton → data, then live stream ─── */
  render()
  renderDetail()
  renderConsole()

  setTimeout(() => {
    state.loading = false
    render()
  }, 900)

  // New console lines every 2.6s, with the flash animation
  setInterval(() => {
    const s = CONSOLE_STREAM[state.streamIdx % CONSOLE_STREAM.length]
    state.streamIdx++
    const id = 'cs' + state.streamIdx
    state.consoleLogs.push({ id, level: s[0], msg: s[1], t: 9000 + state.streamIdx * 730 })
    if (state.consoleLogs.length > 40) state.consoleLogs.shift()
    state.newIds.add(id)
    if (!state.tailing) {
      state.unseen++
      jumpN.textContent = String(state.unseen)
      jump.hidden = false
    }
    renderConsole()
    setTimeout(() => { state.newIds.delete(id); renderConsole() }, 1000)
  }, 2600)

  // A new request arrives every 4.2s so the flash is visible in the grid too
  setInterval(() => {
    if (state.loading) return
    const src = requests[Math.floor(Math.random() * requests.length)]
    const seq = requests[0].seq + 1
    const id = 'rn' + seq
    requests.unshift({
      ...src, id, seq, pending: false,
      status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
      duration: Math.floor(Math.random() * 900) + 30,
      size: Math.floor(Math.random() * 90000) + 400,
      startTime: src.startTime + 1200,
    })
    if (requests.length > 90) requests.pop()
    state.newIds.add(id)
    if (state.selectedId) state.activeRow = Math.min(state.activeRow + 1, requests.length - 1)
    render()
    setTimeout(() => { state.newIds.delete(id); render() }, 1000)
  }, 4200)

  requestAnimationFrame(() => moveInk(root.querySelector('.tab.is-active')))
}

window.mountApp = mountApp
