/* ─── Dense Dev-Tool Design System ─── */

export const BTN_PRIMARY = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--space-1)',
  height: 28,
  padding: '0 var(--space-3)',
  border: 'none',
  borderRadius: 'var(--radius-md)',
  background: 'var(--accent-primary)',
  color: 'var(--accent-fg)',
  fontSize: 'var(--text-sm)',
  fontWeight: 'var(--font-weight-semibold)',
  fontFamily: 'var(--font-ui)',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  lineHeight: 'var(--line-height-tight)',
  transition: 'background-color 120ms ease',
}

export const BTN_SECONDARY = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--space-1)',
  height: 28,
  padding: '0 var(--space-3)',
  border: '1px solid var(--border-default)',
  borderRadius: 'var(--radius-md)',
  background: 'transparent',
  color: 'var(--text-secondary)',
  fontSize: 'var(--text-sm)',
  fontWeight: 'var(--font-weight-medium)',
  fontFamily: 'var(--font-ui)',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  lineHeight: 'var(--line-height-tight)',
  transition: 'all 120ms ease',
}

export const BTN_GHOST = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--space-1)',
  height: 24,
  padding: '0 var(--space-2)',
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  background: 'transparent',
  color: 'var(--text-tertiary)',
  fontSize: 'var(--text-xs)',
  fontWeight: 'var(--font-weight-medium)',
  fontFamily: 'var(--font-ui)',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  lineHeight: 'var(--line-height-tight)',
  transition: 'all 120ms ease',
}

export const BTN_DANGER = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--space-1)',
  height: 28,
  padding: '0 var(--space-3)',
  border: '1px solid var(--status-danger-border)',
  borderRadius: 'var(--radius-md)',
  background: 'var(--status-danger-bg)',
  color: 'var(--status-danger-text)',
  fontSize: 'var(--text-sm)',
  fontWeight: 'var(--font-weight-medium)',
  fontFamily: 'var(--font-ui)',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  lineHeight: 'var(--line-height-tight)',
  transition: 'all 120ms ease',
}

export const INPUT_BASE = {
  height: 28,
  padding: '0 var(--space-2)',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border-default)',
  background: 'var(--bg-input)',
  color: 'var(--text-primary)',
  fontSize: 'var(--text-sm)',
  fontFamily: 'var(--font-mono)',
  outline: 'none',
  lineHeight: 'var(--line-height-tight)',
  transition: 'border-color 120ms ease',
}

export const BADGE = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--space-1)',
  padding: '2px var(--space-2)',
  borderRadius: 'var(--radius-sm)',
  fontSize: 'var(--text-xs)',
  fontWeight: 'var(--font-weight-medium)',
  border: '1px solid transparent',
  lineHeight: 'var(--line-height-tight)',
}

export const BADGE_SUCCESS = {
  ...BADGE,
  background: 'var(--status-success-bg)',
  color: 'var(--status-success-text)',
  borderColor: 'var(--status-success-border)',
}

export const BADGE_WARNING = {
  ...BADGE,
  background: 'var(--status-warning-bg)',
  color: 'var(--status-warning-text)',
  borderColor: 'var(--status-warning-border)',
}

export const BADGE_DANGER = {
  ...BADGE,
  background: 'var(--status-danger-bg)',
  color: 'var(--status-danger-text)',
  borderColor: 'var(--status-danger-border)',
}

export const BADGE_INFO = {
  ...BADGE,
  background: 'var(--status-info-bg)',
  color: 'var(--status-info-text)',
  borderColor: 'var(--status-info-border)',
}

export const SECTION_LABEL = {
  fontSize: 'var(--text-xs)',
  fontWeight: 'var(--font-weight-medium)',
  fontFamily: 'var(--font-ui)',
  color: 'var(--text-tertiary)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  lineHeight: 'var(--line-height-tight)',
}

export const EMPTY_STATE = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'var(--space-2)',
  color: 'var(--text-tertiary)',
  fontSize: 'var(--text-sm)',
  fontFamily: 'var(--font-ui)',
}
