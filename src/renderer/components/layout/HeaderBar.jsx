// src/renderer/components/layout/HeaderBar.jsx
// Top chrome: identity on the left, session state in the middle, global actions
// on the right. Presentation only — every action is a prop.
//
// `titlebar-drag` (ui.css) makes the bar a macOS window drag handle, and the
// 62px spacer clears the traffic lights. Both must stay: the window has
// titleBarStyle 'hiddenInset', so this row IS the title bar.

import { Wifi, FolderOpen, Settings } from 'lucide-react'
import Logo from '../rnspy-devtools/Logo'
import UpdateButton from '../rnspy-devtools/UpdateButton'
import IssuesButton from '../rnspy-devtools/IssuesButton'
import ThemeMenu from '../rnspy-devtools/ThemeMenu'
import { Button, Pill } from '../ui'

export default function HeaderBar({
  statusTone,
  statusLabel,
  address,
  port,
  onCopyConnection,
  issues,
  issuesBtnRef,
  onOpenIssues,
  onOpenProject,
  onOpenSettings,
}) {
  return (
    <header className="titlebar-drag flex h-header shrink-0 items-center gap-3 border-b border-subtle bg-sidebar px-4">
      {/* macOS traffic-light clearance */}
      <div className="w-[62px] shrink-0" aria-hidden="true" />

      <div className="flex shrink-0 items-center gap-2">
        <Logo size={18} />
        <span className="font-ui text-sm font-semibold text-fg leading-tight">
          React Native Spy
        </span>
      </div>

      <div className="h-4 w-px shrink-0 bg-subtle" aria-hidden="true" />

      {/* Live connection state. aria-live so a screen reader hears devices
          connect/disconnect without polling the DOM. */}
      <Pill tone={statusTone} dot aria-live="polite">
        {statusLabel}
      </Pill>

      <button
        type="button"
        onClick={onCopyConnection}
        title="Click to copy connection URL"
        className="inline-flex h-control-sm shrink-0 items-center gap-1 rounded-md border border-subtle bg-card px-2 font-mono text-2xs text-muted transition-colors duration-150 hover:border-default hover:text-fg focus-ring"
      >
        <Wifi size={11} className="text-faint" aria-hidden="true" />
        ws://{address}:{port}
      </button>

      <div className="flex-1" />

      {/* Renders nothing when no update is available. */}
      <UpdateButton />

      <IssuesButton
        ref={issuesBtnRef}
        errorCount={issues.errorCount}
        warnCount={issues.warnCount}
        total={issues.total}
        onClick={onOpenIssues}
      />

      <ThemeMenu />

      <Button variant="ghost" size="sm" onClick={onOpenProject} title="Connect a React Native project folder">
        <FolderOpen size={12} aria-hidden="true" />
        Project
      </Button>

      <Button variant="ghost" size="sm" onClick={onOpenSettings} title="Settings">
        <Settings size={12} aria-hidden="true" />
        Settings
      </Button>
    </header>
  )
}
