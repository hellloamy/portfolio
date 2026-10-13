import { useEffect, useRef, useState } from 'react'
import { canvas2d, createPuffRenderer } from './puff'

/*
 * The intro's cursive A, drawn puffed up (see ./puff) and lit from the cursor,
 * or from the top left until the cursor shows up. Steps through the sprite strip
 * on the same timing as the .intro-sprite CSS animation it stands in for, and
 * falls back to that plain CSS sprite when WebGL isn't available.
 */

const FRAME_W = 200 // source frame, px
const FRAME_H = 140
const FRAMES = 18
const SHOW_W = 180 // on screen, css px (the 90% the CSS sprite uses)
const SHOW_H = 126
const DELAY_MS = 200 // the 0.2s beat before the first frame
const FRAME_MS = 100 // 17 steps over 1.7s
const BLUR = 4 // css px: how soft the puffed edge is

export default function IntroPuffSprite({ src }: { src: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [fallback, setFallback] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current!
    const puff = createPuffRenderer(canvas)
    if (!puff) { setFallback(true); return }

    const start = performance.now()
    const sheet = new Image()
    sheet.src = src
    let loaded = false
    sheet.decode().then(() => { loaded = true }, () => setFallback(true))

    const dpr = window.devicePixelRatio || 1
    const W = Math.round(SHOW_W * dpr), H = Math.round(SHOW_H * dpr)
    const art = canvas2d(W, H)
    const ctx = art.getContext('2d', { willReadFrequently: true })!
    ctx.imageSmoothingEnabled = false
    const rect = { x: 0, y: 0, w: W, h: H }

    let client: { x: number; y: number } | null = null
    const onMove = (e: PointerEvent) => { client = { x: e.clientX, y: e.clientY } }
    window.addEventListener('pointermove', onMove, { passive: true })

    let shown = -1
    let hover = 0
    let raf = 0
    let last = start
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const t = now - start
      if (!loaded || t < DELAY_MS) return
      const frame = Math.min(FRAMES - 1, Math.floor((t - DELAY_MS) / FRAME_MS))
      if (frame !== shown) {
        shown = frame
        ctx.clearRect(0, 0, W, H)
        ctx.drawImage(sheet, frame * FRAME_W, 0, FRAME_W, FRAME_H, 0, 0, W, H)
        puff.upload(art, BLUR * dpr)
        canvas.style.visibility = 'visible'
      }
      // the panel slides away at the end, so the cursor is re-measured against it every frame
      const r = canvas.getBoundingClientRect()
      const mouse = client ? { x: (client.x - r.left) * dpr, y: (client.y - r.top) * dpr } : { x: -1e5, y: -1e5 }
      hover += ((client ? 1 : 0) - hover) * (1 - Math.pow(0.002, dt))
      puff.draw({ mouse, rect, hover, inflate: 1, unit: dpr })
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
    }
  }, [src])

  if (fallback) return <div className="intro-sprite" style={{ '--intro-sprite-src': `url(${src})` } as React.CSSProperties} />
  return <canvas ref={canvasRef} className="intro-sprite-puff" style={{ width: SHOW_W, height: SHOW_H }} />
}
