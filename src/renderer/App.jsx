import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

const RnspyDevtoolsPage = lazy(() => import('./components/rnspy-devtools/RnspyDevtoolsPage'))

export default function App() {
  return (
    <div style={{
      display: 'flex', height: '100%', width: '100%',
      background: 'var(--bg-app)',
    }}>
      <Suspense
        fallback={
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--bg-app)', color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)',
          }}>
            Loading…
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<RnspyDevtoolsPage />} />
          <Route path="/rnspy" element={<RnspyDevtoolsPage />} />
        </Routes>
      </Suspense>
    </div>
  )
}
