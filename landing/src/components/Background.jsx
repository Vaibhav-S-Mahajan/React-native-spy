// src/components/Background.jsx
// Fixed atmospheric layers behind every section: a drifting technical grid,
// three slow colour blooms, film grain, and a scanline sweep. Purely
// decorative, so it is aria-hidden and never intercepts pointer events.

import './Background.css'

export default function Background() {
  return (
    <div className="bg" aria-hidden="true">
      <div className="bg__grid" />
      <div className="bg__glow bg__glow--green" />
      <div className="bg__glow bg__glow--purple" />
      <div className="bg__glow bg__glow--blue" />
      <div className="bg__scan" />
      <div className="bg__noise" />
    </div>
  )
}
