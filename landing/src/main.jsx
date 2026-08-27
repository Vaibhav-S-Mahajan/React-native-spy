import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const container = document.getElementById('root')

// The production build is prerendered, so the container already holds markup and
// we hydrate it. The dev server serves an empty container, so we mount fresh.
// Getting this wrong either throws away the prerendered HTML (createRoot on
// server markup) or warns on every dev reload (hydrating nothing).
if (container.hasChildNodes()) {
  hydrateRoot(
    container,
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
} else {
  createRoot(container).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
