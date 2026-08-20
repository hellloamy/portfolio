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

export default function ClickCursor({ className }: { className?: string }) {
  const [src, setSrc] = useState(stationaryCursor)
  const timeouts = useRef<number[]>([])
  const isStationary = src === stationaryCursor
  const size = isStationary ? STATIONARY_SIZE : ANIMATED_SIZE

  useEffect(() => {
    return () => {
      timeouts.current.forEach((id) => window.clearTimeout(id))
    }
  }, [])

  const playOnce = () => {
    timeouts.current.forEach((id) => window.clearTimeout(id))
    timeouts.current = FRAMES.map((frame, i) => window.setTimeout(() => setSrc(frame), i * FRAME_DURATION_MS))
    timeouts.current.push(
      window.setTimeout(() => setSrc(stationaryCursor), FRAMES.length * FRAME_DURATION_MS),
    )
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
        <img src={src} alt="" className="size-full" />
      </button>
    </div>
  )
}
