import { useEffect, useRef, useState } from 'react'
import stationaryCursor from '../assets/images/hero-blob-3.png'
import cursorFrame0 from '../assets/images/cursor-frames/cursor-0.png'
import cursorFrame1 from '../assets/images/cursor-frames/cursor-1.png'
import cursorFrame2 from '../assets/images/cursor-frames/cursor-2.png'

const FRAMES = [cursorFrame0, cursorFrame1, cursorFrame2]
const FRAME_DURATION_MS = 170

// Both assets are rendered at the same native scale (0.5x). The stationary PNG's
// native canvas (140x200) is fully filled by its art, so it renders at 70x100.
// The gif's native canvas (240x300) has padding baked in so the cursor art can
// grow toward the top-left across frames while staying anchored to the same
// bottom-right corner as the PNG — at the same 0.5x scale it renders at 120x150.
const STATIONARY_SIZE = { width: 70, height: 100 }
const ANIMATED_SIZE = { width: 120, height: 150 }

// Every image stays mounted (so each frame is decoded before it's needed) and only
// the active one is shown. Swapping a single <img>'s src made the button grow to
// the animated size before the next frame had loaded, so the stationary art
// flashed stretched to 120x150 on click. data-puff-hidden keeps PuffLayer, which
// redraws every hero <img> itself, from painting the inactive frames.
export default function ClickCursor({ className }: { className?: string }) {
  // -1 is the stationary cursor; 0..n are animation frames.
  const [frame, setFrame] = useState(-1)
  const timeouts = useRef<number[]>([])
  const size = frame === -1 ? STATIONARY_SIZE : ANIMATED_SIZE

  useEffect(() => {
    return () => {
      timeouts.current.forEach((id) => window.clearTimeout(id))
    }
  }, [])

  const playOnce = () => {
    timeouts.current.forEach((id) => window.clearTimeout(id))
    timeouts.current = FRAMES.map((_, i) => window.setTimeout(() => setFrame(i), i * FRAME_DURATION_MS))
    timeouts.current.push(window.setTimeout(() => setFrame(-1), FRAMES.length * FRAME_DURATION_MS))
  }

  return (
    <div className={`relative ${className ?? ''}`}>
      <button
        type="button"
        onClick={playOnce}
        aria-label="Play cursor animation"
        className="absolute bottom-0 right-0 cursor-pointer"
        style={{ width: size.width, height: size.height }}
      >
        <img
          src={stationaryCursor}
          alt=""
          data-puff-hidden={frame === -1 ? undefined : ''}
          className={`absolute bottom-0 right-0 max-w-none ${frame === -1 ? '' : 'invisible'}`}
          style={STATIONARY_SIZE}
        />
        {FRAMES.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            data-puff-hidden={frame === i ? undefined : ''}
            className={`absolute bottom-0 right-0 max-w-none ${frame === i ? '' : 'invisible'}`}
            style={ANIMATED_SIZE}
          />
        ))}
      </button>
    </div>
  )
}
