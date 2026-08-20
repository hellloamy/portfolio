import { useEffect, useRef, useState } from 'react'
import frame0 from '../assets/images/cd-frames/frame-0.png'
import frame1 from '../assets/images/cd-frames/frame-1.png'
import frame2 from '../assets/images/cd-frames/frame-2.png'
import frame3 from '../assets/images/cd-frames/frame-3.png'
import lofiTrack from '../assets/audio/lofi.mp3'

const FRAMES = [frame0, frame1, frame2, frame3]
const FRAME_DURATION_MS = 170

export default function SpinningCd({ className }: { className?: string }) {
  const [frameIndex, setFrameIndex] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const intervalRef = useRef<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (isSpinning) {
      intervalRef.current = window.setInterval(() => {
        setFrameIndex((i) => (i + 1) % FRAMES.length)
      }, FRAME_DURATION_MS)
    }
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isSpinning])

  const toggle = () => {
    setIsSpinning((v) => {
      const next = !v
      const audio = audioRef.current
      if (audio) {
        if (next) {
          audio.currentTime = 0
          audio.play()
        } else {
          audio.pause()
          audio.currentTime = 0
        }
      }
      return next
    })
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isSpinning ? 'Stop the cd' : 'Play the cd'}
      className={`cursor-pointer ${className ?? ''}`}
    >
      <audio ref={audioRef} src={lofiTrack} loop preload="none" />
      <img src={FRAMES[frameIndex]} alt="" className="size-full" />
    </button>
  )
}
