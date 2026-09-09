import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
// One stylesheet entry point. tailwind.css declares the cascade layers, pulls in
// Tailwind, then imports theme.css / themes.css / ui.css into a `legacy` layer
// that sits BELOW Tailwind's utilities. Importing those three here instead would
// leave them unlayered, and unlayered rules outrank every layer — which is what
// made utility classes silently lose to theme.css's element resets.
import './styles/tailwind.css'
import { applyStoredTheme } from './hooks/useTheme'

// Set data-theme on <html> BEFORE React renders, so the first paint already
// uses the saved palette instead of flashing the default one.
applyStoredTheme()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 1500,
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-default)',
            fontSize: 'var(--text-xs)',
            fontFamily: 'var(--font-ui)',
            borderRadius: 'var(--radius-md)',
            padding: '6px 10px',
            boxShadow: 'var(--shadow-md)',
          },
        }}
      />
    </HashRouter>
  </React.StrictMode>,
)
