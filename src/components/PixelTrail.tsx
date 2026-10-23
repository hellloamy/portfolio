import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useLocation } from 'react-router-dom'

/**
 * The page as a pixel artboard. Moving the mouse leaves a trail of grid-snapped
 * pixels that blink out in steps; holding the button down paints pixels that stay
 * put (pinned to the page, so they scroll with it) for a few seconds, then blink out
 * the same way.
 */
const CELL = 6 // screen px per trail pixel
const BRUSH = 8 // screen px per painted pixel
const LIFE_MS = 520
const DOODLE_HOLD_MS = 3000 // how long a painted pixel stays at full size
const DOODLE_FADE_MS = 600
const TRAIL_COLORS = ['#000000', '#767676', '#f7a8c8']
const INK = '#000000'

type Pixel = { x: number; y: number; born: number; color: string }

// Shrink in whole steps (full, two-thirds, one-third) rather than smoothly, like a sprite
const stepSize = (cell: number, age: number) => cell * (age < 0.4 ? 1 : age < 0.75 ? 2 / 3 : 1 / 3)

// Pressing on these keeps its normal behaviour instead of starting a stroke
const INTERACTIVE = 'a, button, input, textarea, select, label, [role="button"], [contenteditable], [data-draggable]'

export default function PixelTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const painted = useRef(new Map<string, { x: number; y: number; born: number }>()) // page coords, keyed by cell
  const redraw = useRef<() => void>(() => {})
  const { pathname } = useLocation()

  // Each page gets a blank board
  useEffect(() => {
    painted.current.clear()
    redraw.current()
  }, [pathname])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const trail: Pixel[] = []
    let last: { x: number; y: number } | null = null
    let drawing = false
    let raf = 0

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      render(performance.now())
    }

    const render = (now: number) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      ctx.fillStyle = INK
      for (const [key, p] of painted.current) {
        const fade = (now - p.born - DOODLE_HOLD_MS) / DOODLE_FADE_MS
        if (fade >= 1) {
          painted.current.delete(key)
          continue
        }
        const size = fade < 0 ? BRUSH : stepSize(BRUSH, fade)
        const inset = (BRUSH - size) / 2
        ctx.fillRect(p.x - window.scrollX + inset, p.y - window.scrollY + inset, size, size)
      }
      for (let i = trail.length - 1; i >= 0; i--) {
        if (now - trail[i].born >= LIFE_MS) trail.splice(i, 1)
      }
      for (const p of trail) {
        const size = stepSize(CELL, (now - p.born) / LIFE_MS)
        const inset = (CELL - size) / 2
        ctx.fillStyle = p.color
        ctx.fillRect(p.x + inset, p.y + inset, size, size)
      }
    }
    redraw.current = () => render(performance.now())

    const tick = (now: number) => {
      render(now)
      raf = trail.length || painted.current.size ? requestAnimationFrame(tick) : 0
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }

    const dropTrail = (x: number, y: number, now: number) => {
      // jitter by a cell or so, then snap, so the trail reads as a scatter of pixel-art blocks
      const jx = Math.round(x / CELL + (Math.random() - 0.5) * 2) * CELL
      const jy = Math.round(y / CELL + (Math.random() - 0.5) * 2) * CELL
      if (trail.some((p) => p.x === jx && p.y === jy && now - p.born < 60)) return
      trail.push({ x: jx, y: jy, born: now, color: TRAIL_COLORS[Math.floor(Math.random() * TRAIL_COLORS.length)] })
    }

    const paint = (x: number, y: number) => {
      const px = Math.floor((x + window.scrollX) / BRUSH) * BRUSH
      const py = Math.floor((y + window.scrollY) / BRUSH) * BRUSH
      painted.current.set(`${px},${py}`, { x: px, y: py, born: performance.now() })
    }

    // Visit points along the stroke so fast moves don't leave gaps
    const along = (to: { x: number; y: number }, spacing: number, fn: (x: number, y: number) => void) => {
      const from = last ?? to
      const steps = Math.max(1, Math.ceil(Math.hypot(to.x - from.x, to.y - from.y) / spacing))
      for (let i = 1; i <= steps; i++) {
        fn(from.x + ((to.x - from.x) * i) / steps, from.y + ((to.y - from.y) * i) / steps)
      }
    }

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return
      if ((e.target as Element).closest(INTERACTIVE)) return
      e.preventDefault() // no text selection or image dragging while painting
      drawing = true
      last = { x: e.clientX, y: e.clientY }
      paint(e.clientX, e.clientY)
      schedule()
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const to = { x: e.clientX, y: e.clientY }
      if (drawing) {
        along(to, BRUSH / 2, paint)
      } else if (!reduceMotion) {
        const now = performance.now()
        along(to, CELL * 1.5, (x, y) => dropTrail(x, y, now))
      }
      last = to
      schedule()
    }

    const onUp = () => {
      drawing = false
    }

    const onLeave = () => {
      last = null
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('scroll', redraw.current, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    document.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', redraw.current)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  // Portaled to <body> so #root's zoom doesn't scale it off the real cursor position
  return createPortal(
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999] h-screen w-screen"
    />,
    document.body,
  )
}
