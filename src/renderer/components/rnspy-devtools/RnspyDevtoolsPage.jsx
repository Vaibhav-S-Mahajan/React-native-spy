// src/renderer/components/rnspy-devtools/RnspyDevtoolsPage.jsx

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Smartphone } from 'lucide-react'
import toast from 'react-hot-toast'

import AppShell from '../layout/AppShell'
import HeaderBar from '../layout/HeaderBar'
import PanelTabs from '../layout/PanelTabs'
import ConnectPanel from '../panels/ConnectPanel'
import { EmptyState } from '../ui'
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
import IssuesModal from './IssuesModal'
import { useIssues } from '../../hooks/useIssues'
import { useRnspyDevtools } from '../../hooks/useRnspyDevtools'

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
      <div className="flex h-full flex-col bg-app">
        <EmptyState
          icon={Smartphone}
          title="Desktop only"
          description="React Native Spy requires the Electron desktop app."
        />
      </div>
    )
  }

  const connected = status.clientCount > 0
  const running = status.running
  const address = status.address || 'localhost'

  const statusTone = connected ? 'success' : running ? 'warn' : 'danger'

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
    <AppShell
      chrome={
        <>
          <HeaderBar
            statusTone={statusTone}
            statusLabel={statusLabel}
            address={address}
            port={port}
            onCopyConnection={() => {
              navigator.clipboard.writeText(`ws://${address}:${port}`).then(() =>
                toast.success('Copied connection URL'))
            }}
            issues={issues}
            issuesBtnRef={issuesBtnRef}
            onOpenIssues={() => setIssuesOpen(true)}
            onOpenProject={() => setProjectSetupOpen(true)}
            onOpenSettings={() => setSettingsOpen(true)}
          />

          <PanelTabs
            tabs={TABS}
            active={tab}
            counts={tabCounts}
            onSelect={setTab}
          />

          <DeviceTabs
            devices={devices}
            activeKey={activeKey}
            onSelect={setActiveKey}
            onClose={closeDevice}
          />
        </>
      }
    >
      {/* ─── Active Panel ─── */}
      <div className="flex min-h-0 flex-1 flex-col">
        {tab === 'logs' ? (
          <LogsTab
            ref={logsRef}
            logs={serverLogs}
            onClear={() => clearActiveTab(activeKey)}
            onReload={() => handleReload(activeKey)}
            canReload={activeDevice?.online && !reloadingKeys.has(activeKey)}
          />
        ) : !activeDevice ? (
          <ConnectPanel
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
            deviceName={activeDevice.name}
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
    </AppShell>
  )
}
