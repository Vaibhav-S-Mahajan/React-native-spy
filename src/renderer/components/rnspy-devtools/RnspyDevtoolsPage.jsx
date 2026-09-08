// src/renderer/components/rnspy-devtools/RnspyDevtoolsPage.jsx

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Check, Copy, FolderOpen, Settings, Smartphone, Wifi, Wand2,
} from 'lucide-react'
import toast from 'react-hot-toast'

import {
  BTN_PRIMARY, BTN_GHOST, BADGE_SUCCESS, BADGE_WARNING, BADGE_DANGER,
} from '../../styles/shared'
import ConsoleTab from './ConsoleTab'
import DeviceTabs from './DeviceTabs'
import LogsTab from './LogsTab'
import NetworkTab from './NetworkTab'
import StorageTab from './StorageTab'
import NavigationTab from './NavigationTab'
import WatermelonTab from './WatermelonTab'
import WebSocketTab from './WebSocketTab'
import RnspySettingsModal from './RnspySettingsModal'
import ProjectSetupModal from './ProjectSetupModal'
import UpdateButton from './UpdateButton'
import ThemeMenu from './ThemeMenu'
import IssuesButton from './IssuesButton'
import IssuesModal from './IssuesModal'
import { useIssues } from '../../hooks/useIssues'
import { buildRnClient } from '../../../shared/rnClient'
import { useRnspyDevtools } from '../../hooks/useRnspyDevtools'
import Logo from './Logo'

const TABS = [
  { key: 'network', label: 'Network' },
  { key: 'websocket', label: 'WebSocket' },
  { key: 'console', label: 'Console' },
  { key: 'storage', label: 'Storage' },
  { key: 'watermelon', label: 'WatermelonDB' },
  { key: 'navigation', label: 'Navigation' },
  { key: 'logs', label: 'Logs' },
]

export default function RnspyDevtoolsPage() {
  const {
    available, status, port, setPort,
    devices, hiddenRules, addHiddenRule, removeHiddenRule,
    projectRoot, setProjectRoot, openInEditor, symbolicateAndOpen,
    setupHost, pickProjectFolder, planProjectSetup, applyProjectSetup, removeProjectSetup,
    disconnectClientById, closeDevice, clearDeviceCategory,
    reloadDevice,
    readStorage, setStorageValue, removeStorageKey, openStorageInstance,
    readWatermelon, readWatermelonPage,
    readNavigation, openRouteInEditor,
    serverLogs, clearServerLogs, resetAll,
  } = useRnspyDevtools()
  const [tab, setTab] = useState('network')
  const [activeKey, setActiveKey] = useState(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [issuesOpen, setIssuesOpen] = useState(false)
  const [projectSetupOpen, setProjectSetupOpen] = useState(false)
  const [storageAutoRefresh, setStorageAutoRefresh] = useState(true)
  const [watermelonAutoRefresh, setWatermelonAutoRefresh] = useState(true)
  const [navigationAutoRefresh, setNavigationAutoRefresh] = useState(true)
  const [reloadingKeys, setReloadingKeys] = useState(() => new Set())
  const restartClientsRef = useRef(new Map())
  const restartTimersRef = useRef(new Map())
  // Focus returns here when the issues modal closes.
  const issuesBtnRef = useRef(null)

  // Refs exposed by searchable tabs so global shortcuts can focus their filter.
  const networkRef = useRef(null)
  const websocketRef = useRef(null)
  const consoleRef = useRef(null)
  const navigationRef = useRef(null)
  const logsRef = useRef(null)

  useEffect(() => {
    if (!devices.length) {
      if (activeKey !== null) setActiveKey(null)
      return
    }
    if (!activeKey || !devices.some((d) => d.key === activeKey)) {
      setActiveKey(devices[0].key)
    }
  }, [devices, activeKey])

  const activeDevice = useMemo(
    () => devices.find((d) => d.key === activeKey) || null,
    [devices, activeKey],
  )

  // Aggregated across ALL devices, not just the active one — a problem on a
  // background device is still a problem you want to know about.
  const issues = useIssues({ devices, serverLogs })

  if (!available) {
    return (
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 'var(--space-3)', background: 'var(--bg-app)',
        height: '100%', color: 'var(--text-tertiary)', fontFamily: 'var(--font-ui)',
      }}>
        <Smartphone size={24} style={{ opacity: 0.3 }} />
        <div style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--text-secondary)' }}>
          Desktop only
        </div>
        <div style={{ fontSize: 'var(--text-sm)', maxWidth: 340, textAlign: 'center', lineHeight: 'var(--line-height-normal)' }}>
          React Native Spy requires the Electron desktop app.
        </div>
      </div>
    )
  }

  const connected = status.clientCount > 0
  const running = status.running
  const address = status.address || 'localhost'

  const statusBadge = connected
    ? { ...BADGE_SUCCESS, style: BADGE_SUCCESS }
    : running
    ? { ...BADGE_WARNING, style: BADGE_WARNING }
    : { ...BADGE_DANGER, style: BADGE_DANGER }

  const statusLabel = connected
    ? `${status.clientCount} connected`
    : running ? 'Waiting' : 'Offline'

  const tabCounts = {
    network: activeDevice?.networkRequests.length || 0,
    websocket: activeDevice?.wsConnections?.length || 0,
    console: activeDevice?.consoleLogs.length || 0,
    storage: (activeDevice?.storage?.backends || [])
      .reduce((sum, b) => sum + (b.entries?.length || 0), 0),
    watermelon: (activeDevice?.watermelon?.tables || [])
      .reduce((sum, t) => sum + (t.rowCount || 0), 0),
    navigation: activeDevice?.navigation?.history?.length || 0,
    logs: serverLogs.length,
  }

  const clearActiveTab = (key) => {
    if (tab === 'logs') clearServerLogs()
    else clearDeviceCategory(key, tab)
  }

  // Disable a device's Reload button until its app reconnects after a restart.
  const handleReload = useCallback((key) => {
    if (reloadingKeys.has(key)) return
    const deviceClients = (status.clients || [])
      .filter((c) => (c.deviceId || c.name || c.id || 'unknown') === key)
      .map((c) => c.id)
    restartClientsRef.current.set(key, new Set(deviceClients))
    setReloadingKeys((prev) => { const n = new Set(prev); n.add(key); return n })
    reloadDevice(key)
    const timer = setTimeout(() => {
      setReloadingKeys((prev) => { const n = new Set(prev); n.delete(key); return n })
      restartClientsRef.current.delete(key)
      restartTimersRef.current.delete(key)
    }, 8000)
    restartTimersRef.current.set(key, timer)
  }, [reloadDevice, reloadingKeys, status.clients])

  // Global keyboard shortcuts.
  useEffect(() => {
    const isMac = navigator.platform.toLowerCase().includes('mac')
    const mod = (e) => (isMac ? e.metaKey : e.ctrlKey)

    const focusSearch = () => {
      const ref = {
        network: networkRef, websocket: websocketRef, console: consoleRef,
        navigation: navigationRef, logs: logsRef,
      }[tab]
      ref?.current?.focusSearch?.()
    }

    const onKeyDown = (e) => {
      // Ignore shortcuts while typing in inputs, textareas, or contenteditable.
      const tag = (e.target?.tagName || '').toLowerCase()
      const editable = e.target?.isContentEditable
      const typing = tag === 'input' || tag === 'textarea' || tag === 'select' || editable

      // Close modals first regardless of typing state.
      if (e.key === 'Escape') {
        if (projectSetupOpen) { setProjectSetupOpen(false); return }
        if (settingsOpen) { setSettingsOpen(false); return }
        if (issuesOpen) { setIssuesOpen(false); return }
      }

      if (!mod(e)) return

      // Tab switching: Cmd/Ctrl+1..7.
      if (e.key >= '1' && e.key <= '7') {
        const idx = parseInt(e.key, 10) - 1
        if (idx < TABS.length) {
          e.preventDefault()
          setTab(TABS[idx].key)
        }
        return
      }

      switch (e.key.toLowerCase()) {
        case 'k':
          e.preventDefault()
          if (activeKey || tab === 'logs') clearActiveTab(activeKey)
          break
        case 'r':
          e.preventDefault()
          if (activeKey && activeDevice?.online && !reloadingKeys.has(activeKey)) {
            handleReload(activeKey)
          }
          break
        case 'f':
          if (typing) return
          e.preventDefault()
          focusSearch()
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [tab, activeKey, activeDevice?.online, reloadingKeys, projectSetupOpen, settingsOpen, issuesOpen])

  // Re-enable Reload once the app reconnects with a fresh client connection.
  useEffect(() => {
    if (!reloadingKeys.size) return
    for (const key of Array.from(reloadingKeys)) {
      const prev = restartClientsRef.current.get(key)
      if (!prev) continue
      const reconnected = (status.clients || []).some(
        (c) => (c.deviceId || c.name || c.id || 'unknown') === key && !prev.has(c.id),
      )
      if (reconnected) {
        setReloadingKeys((p) => { const n = new Set(p); n.delete(key); return n })
        restartClientsRef.current.delete(key)
        const t = restartTimersRef.current.get(key)
        if (t) { clearTimeout(t); restartTimersRef.current.delete(key) }
      }
    }
  }, [status.clients, reloadingKeys])

  // ── Storage auto-refresh ──
  // While the Storage tab is open, an active device is connected, and
  // auto-refresh is on, poll the device for a fresh snapshot on an interval.
  // The device also pushes snapshots on MMKV changes and after every mutation,
  // so this is a fallback that catches AsyncStorage writes and external changes.
  useEffect(() => {
    if (tab !== 'storage' || !storageAutoRefresh) return undefined
    if (!activeDevice?.online) return undefined
    const key = activeDevice.key
    readStorage(key)
    const timer = setInterval(() => readStorage(key), 2000)
    return () => clearInterval(timer)
  }, [tab, storageAutoRefresh, activeDevice?.online, activeDevice?.key, readStorage])

  // ── WatermelonDB auto-refresh ──
  // Poll the connected device for a fresh DB snapshot while the tab is open.
  useEffect(() => {
    if (tab !== 'watermelon' || !watermelonAutoRefresh) return undefined
    if (!activeDevice?.online) return undefined
    const key = activeDevice.key
    readWatermelon(key)
    const timer = setInterval(() => readWatermelon(key), 3000)
    return () => clearInterval(timer)
  }, [tab, watermelonAutoRefresh, activeDevice?.online, activeDevice?.key, readWatermelon])

  // ── Navigation resync ──
  // The SDK pushes a fresh stack on every route change, so this is only a slow
  // safety net for a state change that arrived while the socket was down.
  useEffect(() => {
    if (tab !== 'navigation' || !navigationAutoRefresh) return undefined
    if (!activeDevice?.online) return undefined
    const key = activeDevice.key
    readNavigation(key)
    const timer = setInterval(() => readNavigation(key), 5000)
    return () => clearInterval(timer)
  }, [tab, navigationAutoRefresh, activeDevice?.online, activeDevice?.key, readNavigation])

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100%', width: '100%',
      background: 'var(--bg-app)',
    }}>
      {/* ─── Header Bar ─── */}
      <div className="titlebar-drag" style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
        padding: '0 var(--space-4)',
        height: 'var(--header-height)',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-sidebar)',
        flexShrink: 0,
      }}>
        {/* macOS traffic light spacer */}
        <div style={{ width: 62, flexShrink: 0 }} />

        {/* Logo / Title */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
        }}>
          <Logo size={18} />
          <span style={{
            fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--text-primary)', fontFamily: 'var(--font-ui)',
          }}>
            React Native Spy
          </span>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 16, background: 'var(--border-subtle)' }} />

        {/* Status badge */}
        <div style={{
          ...statusBadge.style,
          display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)',
        }}>
          <span style={{
            width: 5, height: 5, borderRadius: '50%',
            background: 'currentColor',
          }} />
          {statusLabel}
        </div>

        {/* Connection string — click to copy */}
        <button
          onClick={() => {
            navigator.clipboard.writeText(`ws://${address}:${port}`).then(() =>
              toast.success('Copied connection URL'))
          }}
          title="Click to copy connection URL"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)',
            height: 24, padding: '0 var(--space-2)',
            border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
            background: 'var(--bg-card)', cursor: 'pointer',
            fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)',
            color: 'var(--text-secondary)',
          }}
        >
          <Wifi size={11} color="var(--text-tertiary)" />
          ws://{address}:{port}
        </button>

        <div style={{ flex: 1 }} />

        {/* Update available — renders nothing when there is no update */}
        <UpdateButton />

        {/* Errors + warnings from every source, in one modal */}
        <IssuesButton
          ref={issuesBtnRef}
          errorCount={issues.errorCount}
          warnCount={issues.warnCount}
          total={issues.total}
          onClick={() => setIssuesOpen(true)}
        />

        {/* Theme picker — switch palette on mood */}
        <ThemeMenu />

        {/* Connect a project — folder picker + automatic setup */}
        <button
          onClick={() => setProjectSetupOpen(true)}
          style={{ ...BTN_GHOST, gap: 'var(--space-1)' }}
          title="Connect a React Native project folder"
        >
          <FolderOpen size={12} />
          <span>Project</span>
        </button>

        {/* Settings */}
        <button
          onClick={() => setSettingsOpen(true)}
          style={{ ...BTN_GHOST, gap: 'var(--space-1)' }}
          title="Settings"
        >
          <Settings size={12} />
          <span>Settings</span>
        </button>
      </div>

      {/* ─── Tab Bar ─── */}
      <div style={{
        display: 'flex', alignItems: 'stretch',
        height: 'var(--tab-height)', flexShrink: 0,
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-panel-alt)',
      }}>
        {TABS.map((t) => {
          const active = tab === t.key
          const count = tabCounts[t.key]
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-1)',
                padding: '0 var(--space-4)',
                height: '100%',
                border: 'none',
                borderBottom: active ? '2px solid var(--accent-primary)' : '2px solid transparent',
                background: 'transparent',
                color: active ? 'var(--text-primary)' : 'var(--text-tertiary)',
                fontSize: 'var(--text-sm)',
                fontWeight: active ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
                fontFamily: 'var(--font-ui)',
                cursor: 'pointer',
                transition: 'color 120ms ease',
              }}
            >
              {t.label}
              {count > 0 && (
                <span style={{
                  fontSize: 10, fontWeight: 'var(--font-weight-medium)',
                  fontFamily: 'var(--font-mono)',
                  color: active ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                  marginLeft: 2,
                }}>
                  {count > 999 ? '1k+' : count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* ─── Device Tabs ─── */}
      <DeviceTabs
        devices={devices}
        activeKey={activeKey}
        onSelect={setActiveKey}
        onClose={closeDevice}
      />

      {/* ─── Content Area ─── */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {tab === 'logs' ? (
          <LogsTab
            ref={logsRef}
            logs={serverLogs}
            onClear={() => clearActiveTab(activeKey)}
            onReload={() => handleReload(activeKey)}
            canReload={activeDevice?.online && !reloadingKeys.has(activeKey)}
          />
        ) : !activeDevice ? (
          <ConnectSnippet
            host={address}
            port={port}
            onAutoSetup={() => setProjectSetupOpen(true)}
          />
        ) : tab === 'network' ? (
          <NetworkTab
            ref={networkRef}
            requests={activeDevice.networkRequests}
            hiddenRules={hiddenRules}
            onHideName={addHiddenRule}
            onClear={() => clearActiveTab(activeKey)}
            onReload={() => handleReload(activeKey)}
            canReload={activeDevice?.online && !reloadingKeys.has(activeKey)}
          />
        ) : tab === 'websocket' ? (
          <WebSocketTab
            ref={websocketRef}
            connections={activeDevice.wsConnections || []}
            onClear={() => clearActiveTab(activeKey)}
            onReload={() => handleReload(activeKey)}
            canReload={activeDevice?.online && !reloadingKeys.has(activeKey)}
          />
        ) : tab === 'storage' ? (
          <StorageTab
            storage={activeDevice.storage}
            online={activeDevice?.online}
            onRefresh={() => readStorage(activeKey)}
            onSetValue={(args) => setStorageValue(activeKey, args)}
            onRemoveKey={(args) => removeStorageKey(activeKey, args)}
            onOpenInstance={(id) => openStorageInstance(activeKey, id)}
            autoRefresh={storageAutoRefresh}
            onToggleAutoRefresh={() => setStorageAutoRefresh((v) => !v)}
          />
        ) : tab === 'navigation' ? (
          <NavigationTab
            ref={navigationRef}
            navigation={activeDevice.navigation}
            online={activeDevice?.online}
            onRefresh={() => readNavigation(activeKey)}
            onOpenRoute={openRouteInEditor}
            onClear={() => clearActiveTab(activeKey)}
            onReload={() => handleReload(activeKey)}
            canReload={activeDevice?.online && !reloadingKeys.has(activeKey)}
            autoRefresh={navigationAutoRefresh}
            onToggleAutoRefresh={() => setNavigationAutoRefresh((v) => !v)}
          />
        ) : tab === 'watermelon' ? (
          <WatermelonTab
            watermelon={activeDevice.watermelon}
            online={activeDevice?.online}
            onRefresh={() => readWatermelon(activeKey)}
            onLoadPage={(table, offset, limit) => readWatermelonPage(activeKey, table, offset, limit)}
            autoRefresh={watermelonAutoRefresh}
            onToggleAutoRefresh={() => setWatermelonAutoRefresh((v) => !v)}
          />
        ) : (
          <ConsoleTab
            ref={consoleRef}
            logs={activeDevice.consoleLogs}
            openInEditor={openInEditor}
            symbolicateAndOpen={symbolicateAndOpen}
            onClear={() => clearActiveTab(activeKey)}
            onReload={() => handleReload(activeKey)}
            canReload={activeDevice?.online && !reloadingKeys.has(activeKey)}
          />
        )}
      </div>

      {/* ─── Issues Modal ─── */}
      {issuesOpen && (
        <IssuesModal
          issues={issues.issues}
          errorCount={issues.errorCount}
          warnCount={issues.warnCount}
          bySource={issues.bySource}
          onOpenInEditor={openInEditor}
          returnFocusRef={issuesBtnRef}
          onClose={() => setIssuesOpen(false)}
        />
      )}

      {/* ─── Settings Modal ─── */}
      {settingsOpen && (
        <RnspySettingsModal
          clients={status.clients || []}
          hiddenRules={hiddenRules}
          port={port}
          onSetPort={setPort}
          projectRoot={projectRoot}
          onSetProjectRoot={setProjectRoot}
          onDisconnect={disconnectClientById}
          onReload={reloadDevice}
          onAddRule={addHiddenRule}
          onRemoveRule={removeHiddenRule}
          onReset={() => { resetAll(); setSettingsOpen(false) }}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {/* ─── Project Setup Modal ─── */}
      {projectSetupOpen && (
        <ProjectSetupModal
          projectRoot={projectRoot}
          host={setupHost}
          port={port}
          onPickFolder={pickProjectFolder}
          onPlan={planProjectSetup}
          onApply={applyProjectSetup}
          onRemove={removeProjectSetup}
          onSetProjectRoot={setProjectRoot}
          onOpenFile={(file) => openInEditor(file, 1, 1)}
          onClose={() => setProjectSetupOpen(false)}
        />
      )}
    </div>
  )
}

/* ─── Connect Empty State ─── */
function ConnectSnippet({ host, port, onAutoSetup }) {
  const [copied, setCopied] = useState(false)
  const snippet = useMemo(() => buildRnClient({ host, port }), [host, port])

  const copy = () => {
    navigator.clipboard.writeText(snippet).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div style={{
      flex: 1, overflow: 'auto', background: 'var(--bg-panel)',
      display: 'flex', justifyContent: 'center',
      padding: 'var(--space-8) var(--space-6)',
    }}>
      <div className="animate-slide-up" style={{ maxWidth: 620, width: '100%' }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
          marginBottom: 'var(--space-4)',
        }}>
          <Logo size={22} />
          <div>
            <h2 style={{
              margin: 0, fontSize: 'var(--text-md)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--text-primary)', fontFamily: 'var(--font-ui)',
              lineHeight: 'var(--line-height-tight)',
            }}>
              Connect your app
            </h2>
            <p style={{
              margin: 0, fontSize: 'var(--text-sm)',
              color: 'var(--text-tertiary)', fontFamily: 'var(--font-ui)',
              lineHeight: 'var(--line-height-tight)',
            }}>
              Paste near the top of your React Native entry file
            </p>
          </div>
          <div style={{ flex: 1 }} />
          {/* Automatic path — picks the project folder and wires everything up */}
          <button
            onClick={onAutoSetup}
            style={{ ...BTN_PRIMARY, height: 30 }}
            title="Pick your project folder and set up the connection automatically"
          >
            <Wand2 size={12} />
            Set it up for me
          </button>
        </div>

        {/* Steps */}
        <div style={{
          display: 'flex', gap: 'var(--space-2)',
          marginBottom: 'var(--space-4)',
        }}>
          {['Copy snippet', 'Paste in index.js', 'Reload app'].map((text, i) => (
            <div key={i} style={{
              flex: 1, display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
              padding: 'var(--space-2) var(--space-3)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
              fontSize: 'var(--text-xs)', color: 'var(--text-secondary)',
              fontFamily: 'var(--font-ui)', lineHeight: 'var(--line-height-tight)',
            }}>
              <span style={{
                width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                background: 'var(--status-info-bg)', color: 'var(--status-info-text)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 'var(--font-weight-semibold)',
                fontFamily: 'var(--font-mono)',
              }}>
                {i + 1}
              </span>
              {text}
            </div>
          ))}
        </div>

        {/* Code block */}
        <div style={{
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: 'var(--space-2) var(--space-3)',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-card)',
          }}>
            <span style={{
              fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)',
              color: 'var(--text-tertiary)', fontFamily: 'var(--font-ui)',
            }}>
              rnClient.js
            </span>
            <button onClick={copy} style={{
              ...BTN_GHOST,
              color: copied ? 'var(--status-success-text)' : 'var(--text-tertiary)',
            }}>
              {copied ? <Check size={11} /> : <Copy size={11} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre style={{
            margin: 0, padding: 'var(--space-3)', maxHeight: 360, overflow: 'auto',
            fontSize: 'var(--text-xs)', lineHeight: 'var(--line-height-normal)',
            fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)',
            background: 'var(--bg-code-block)', userSelect: 'text',
          }}>
            {snippet}
          </pre>
        </div>

        {/* Connection hint */}
        <div style={{
          marginTop: 'var(--space-3)',
          display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
          fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)',
          fontFamily: 'var(--font-ui)', lineHeight: 'var(--line-height-tight)',
        }}>
          <Wifi size={11} color="var(--text-tertiary)" />
          <span>
            Same network required · connects to{' '}
            <code style={{
              fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)',
              background: 'var(--bg-code-block)', padding: '1px 4px',
              borderRadius: 3, fontSize: 'var(--text-xs)',
            }}>
              ws://{host}:{port}
            </code>
          </span>
        </div>
      </div>
    </div>
  )
}
