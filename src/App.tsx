import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import XRedesign from './pages/XRedesign'
import VoiceMemos from './pages/VoiceMemos'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects/x-redesign" element={<XRedesign />} />
        <Route path="/projects/voice-memos" element={<VoiceMemos />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
