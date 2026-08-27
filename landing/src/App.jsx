// src/App.jsx
// Page composition. Order is deliberate: hook the visitor with the working
// mock, frame the gap it fills, show the six panels, prove the setup is safe,
// compare honestly, then answer objections before asking for the download.

import Background from './components/Background'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Problem from './components/Problem'
import Features from './components/Features'
import Setup from './components/Setup'
import Compare from './components/Compare'
import Protocol from './components/Protocol'
import Extras from './components/Extras'
import Faq from './components/Faq'
import Download from './components/Download'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <a href="#features" className="skip-link">
        Skip to content
      </a>
      <Background />
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Features />
        <Setup />
        <Compare />
        <Protocol />
        <Extras />
        <Faq />
        <Download />
      </main>
      <Footer />
    </>
  )
}
