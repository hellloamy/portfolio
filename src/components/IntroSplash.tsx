import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigationType } from 'react-router-dom'
import introSprite from '../assets/images/intro-pixel-sprite.png'
import pusherSprite from '../assets/images/intro-pusher-sprite.png'

/** 18 frames at 80ms, then she shoves the panel off to the right. */
const PLAY_MS = 1900
const EXIT_MS = 2800

const PANEL_COLOR = '#fdd6e5'

/** Read-only so it stays safe to call during render, including StrictMode's double pass. */
function canPlay() {
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

type State = 'playing' | 'leaving' | 'done'

export default function IntroSplash() {
  // 'POP' is what a fresh document load reports; clicking a link in the nav reports
  // 'PUSH', so this fires on refresh but not on in-site navigation. A module-level
  // "already played" flag would not work here — StrictMode's double mount would
  // consume it and swallow the splash in development.
  const navigationType = useNavigationType()

  // Decided during the first render so the page never flashes before the splash covers it.
  const [state, setState] = useState<State>(() =>
    canPlay() && navigationType === 'POP' ? 'playing' : 'done',
  )

  useEffect(() => {
    if (state !== 'playing') return

    // Safari 26 ignores theme-color and instead tints its status bar and toolbar
    // from the background of a fixed or sticky element sitting at the viewport
    // edge. A full-bleed `fixed` splash is exactly that, so both bars came out
    // pink — and since Safari only samples on load, they stayed pink for the whole
    // visit. Positioning absolutely keeps the panel out of that sample and lets the
    // bars fall back to the body colour, so the pink reads as one block sliding.
    // The trade-off is that an absolute panel scrolls, hence the lock and the
    // reset — a refresh part-way down the page would otherwise start it off-screen.
    window.scrollTo(0, 0)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const toLeave = setTimeout(() => setState('leaving'), PLAY_MS)
    // Released here rather than only in cleanup: reaching 'done' renders nothing but
    // keeps the component mounted, so cleanup alone would leave the page locked.
    const toDone = setTimeout(() => {
      setState('done')
      document.body.style.overflow = previousOverflow
    }, PLAY_MS + EXIT_MS)
    return () => {
      clearTimeout(toLeave)
      clearTimeout(toDone)
      document.body.style.overflow = previousOverflow
    }
    // Runs once per mount — the home page remounting is what replays it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (state === 'done') return null

  // Portalled to <body> so the page's 66.667% zoom doesn't shrink the overlay.
  // The panel travels one viewport PLUS her 120px width, so she walks fully clear
  // of the right edge instead of being unmounted mid-stride.
  return createPortal(
    <div
      aria-hidden="true"
      className={`absolute inset-x-0 top-0 z-[100] h-screen flex items-center justify-center transition-transform duration-[2800ms] ease-linear ${
        state === 'leaving' ? 'translate-x-[calc(100%+120px)]' : 'translate-x-0'
      }`}
      style={{ backgroundColor: PANEL_COLOR }}
    >
      {/* rendered at the source's native 200x140 so the pixel grid stays exact */}
      <div className="intro-sprite" style={{ '--intro-sprite-src': `url(${introSprite})` } as React.CSSProperties} />

      {/* She stands OUTSIDE the panel: right-full puts her right edge flush against
          the panel's left edge, so her hands meet the pink rather than sitting on
          it. At rest that parks her off-screen; as the panel slides right she walks
          into view on the revealed page, shoving it along. */}
      {state === 'leaving' && (
        <div
          className="intro-pusher absolute bottom-0 right-full"
          style={{ '--intro-pusher-src': `url(${pusherSprite})` } as React.CSSProperties}
        />
      )}
    </div>,
    document.body,
  )
}
