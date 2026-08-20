import { useEffect, useRef, useState } from 'react'
import stationaryFace from '../assets/images/hero-blob-1.png'
import winkFrame0 from '../assets/images/face-frames/face-wink-0.png'
import winkFrame1 from '../assets/images/face-frames/face-wink-1.png'

const FRAME_DURATION_MS = 330

export default function WinkingFace({ className }: { className?: string }) {
  const [src, setSrc] = useState(stationaryFace)
  const timeouts = useRef<number[]>([])

  useEffect(() => {
    return () => {
      timeouts.current.forEach((id) => window.clearTimeout(id))
    }
  }, [])

  const playWink = () => {
    timeouts.current.forEach((id) => window.clearTimeout(id))
    timeouts.current = []

    setSrc(winkFrame0)
    timeouts.current.push(
      window.setTimeout(() => setSrc(winkFrame1), FRAME_DURATION_MS),
      window.setTimeout(() => setSrc(stationaryFace), FRAME_DURATION_MS * 2),
    )
  }

  return (
    <button type="button" onClick={playWink} aria-label="Wink" className={`cursor-pointer ${className ?? ''}`}>
      <img src={src} alt="" className="size-full" />
    </button>
  )
}
