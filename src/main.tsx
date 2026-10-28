import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// A refresh on the landing page always starts at the top. The intro splash resets
// the scroll itself, but the browser's own restore lands after it and drags the page
// back down, cutting the animation off. scrollRestoration is per history entry, so
// back/forward on the other pages keeps its normal behaviour.
if (window.location.pathname === '/') {
  history.scrollRestoration = 'manual'
  window.scrollTo(0, 0)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
