// src/components/Protocol.jsx
// The technical section: data-flow diagram, what the snippet patches, and the
// full event protocol table. This exists because the audience is developers who
// will want to know exactly what gets injected into their app before they run it.

import { Cpu, Monitor, Smartphone } from 'lucide-react'
import Reveal from './Reveal'
import { PRODUCT, PROTOCOL, SDK_PATCHES } from '../data/content'
import './Protocol.css'

export default function Protocol() {
  return (
    <section className="section protocol" id="protocol">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">Under the hood</span>
          <h2 className="section-title">No magic, no backend, no telemetry</h2>
          <p className="section-sub">
            A WebSocket server in the Electron main process, a snippet in your app that patches four
            globals, and a preload bridge that is the only path between them. Everything stays on your
            machine.
          </p>
        </Reveal>

        <Reveal className="proto__flow">
          <div className="proto__node" style={{ '--node-accent': 'var(--purple)' }}>
            <span className="proto__node-icon">
              <Smartphone size={19} />
            </span>
            <h4>
              Your RN app
              <code>rnspy.connection.js</code>
            </h4>
            <p>
              Patches console, fetch, XMLHttpRequest and WebSocket, then streams JSON frames. Retries
              every 2s and queues up to 500 events while offline.
            </p>
          </div>

          <div className="proto__link">
            <span className="proto__track" />
            <span className="proto__packet" />
            <span className="proto__packet" />
            <span className="proto__packet" />
            <span className="proto__link-label">ws://:{PRODUCT.port}</span>
          </div>

          <div className="proto__node" style={{ '--node-accent': 'var(--accent)' }}>
            <span className="proto__node-icon">
              <Cpu size={19} />
            </span>
            <h4>
              Main process
              <code>rnspyServer.js</code>
            </h4>
            <p>
              Tags each frame with a sequence number and client metadata, keeps a 500-entry log buffer,
              and binds 0.0.0.0 so physical devices can reach it.
            </p>
          </div>

          <div className="proto__link">
            <span className="proto__track" />
            <span className="proto__packet" />
            <span className="proto__packet" />
            <span className="proto__packet" />
            <span className="proto__link-label">contextBridge</span>
          </div>

          <div className="proto__node" style={{ '--node-accent': 'var(--blue)' }}>
            <span className="proto__node-icon">
              <Monitor size={19} />
            </span>
            <h4>
              Renderer
              <code>useRnspyDevtools.js</code>
            </h4>
            <p>
              Buckets every event by device, merges the two-phase network frames in O(1), enforces the
              caps, and renders the six panels.
            </p>
          </div>
        </Reveal>

        <div className="proto__cols">
          <Reveal className="proto__box">
            <div className="proto__box-head">
              <h3>What the snippet patches</h3>
              <p>
                Four globals, wrapped so your app behaves exactly as it did before. Responses are
                cloned rather than consumed.
              </p>
            </div>
            {SDK_PATCHES.map((p) => (
              <div key={p.target} className="proto__patch">
                <code>{p.target}</code>
                <p>{p.detail}</p>
              </div>
            ))}
          </Reveal>

          <Reveal className="proto__box" delay={120}>
            <div className="proto__box-head">
              <h3>Event protocol</h3>
              <p>Every frame the client can send. Eight kinds, all plain JSON.</p>
            </div>
            <table className="proto__table">
              <caption className="sr-only">WebSocket frame kinds sent from the client to the desktop app</caption>
              <thead>
                <tr>
                  <th scope="col">Kind</th>
                  <th scope="col">Emitted by</th>
                  <th scope="col">Key fields</th>
                </tr>
              </thead>
              <tbody>
                {PROTOCOL.map((row) => (
                  <tr key={row.kind}>
                    <td className="proto__kind">{row.kind}</td>
                    <td className="proto__from">{row.from}</td>
                    <td className="proto__fields">{row.fields}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="proto__stamp">
              Each frame is stamped server-side with{' '}
              <code>seq, deviceId, clientId, clientName, clientPlatform, receivedAt</code> before it
              reaches the UI.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
