import { useEffect, useRef } from 'react'
import { canvas2d, createPuffRenderer } from './puff'

/*
 * Puff-print hover effect for the hero (see ./puff). The pixel art (every <img>
 * inside the layer) and the wordmark (spans inside [data-puff-text]) are redrawn
 * into one canvas; on hover they puff up into glossy, rounded ink lit by the cursor.
 *
 * The DOM stays in place (for layout, clicks, animation and screen readers) and is
 * only hidden once the canvas has drawn, so if WebGL is unavailable the plain hero
 * shows as before. Frame swaps on the animated art are picked up and redrawn.
 */

const PAD = 60 // css px of canvas around the hero box, so highlights aren't clipped
const BLUR = 7 // css px: how soft the puffed edge is

export default function PuffLayer({ children }: { children: React.ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current!
    const canvas = canvasRef.current!
    const puff = createPuffRenderer(canvas)
    if (!puff) return

    // device px per css px of the hero (folds in #root's zoom and the screen's dpr)
    let unit = 1
    let bounds = { x: 0, y: 0, w: 0, h: 0 } // everything drawn, device px, y down
    let ready = false
    let disposed = false
    let fontsLoaded = false

    // The animated art swaps its <img> src, and the new frame is often still
    // loading when we redraw. The DOM image is hidden, so skipping it would blank
    // the art: draw from decoded copies instead, holding each element's last good
    // frame until the new one is ready.
    const decoded = new Map<string, HTMLImageElement>()
    const pending = new Set<string>()
    const lastGood = new WeakMap<HTMLImageElement, HTMLImageElement>()
    function drawable(img: HTMLImageElement) {
      const src = img.src // not currentSrc: that still names the old frame until the new one loads
      const hit = decoded.get(src)
      if (hit) {
        lastGood.set(img, hit)
        return hit
      }
      if (src && !pending.has(src)) {
        pending.add(src)
        const im = new Image()
        im.onload = () => { decoded.set(src, im); pending.delete(src); queueBuild() }
        im.onerror = () => pending.delete(src)
        im.src = src
      }
      return lastGood.get(img)
    }

    async function loadFonts(spans: HTMLElement[]) {
      await Promise.all(
        spans.map((s) => {
          const cs = getComputedStyle(s)
          return document.fonts.load(`${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`, s.textContent ?? '')
        }),
      )
      fontsLoaded = true
    }

    async function build() {
      const spans = [...wrap.querySelectorAll<HTMLElement>('[data-puff-text] span')]
      const allImgs = [...wrap.querySelectorAll<HTMLImageElement>('img')]
      if (!fontsLoaded) await loadFonts(spans)
      if (disposed) return
      const dpr = window.devicePixelRatio || 1
      const crect = canvas.getBoundingClientRect()
      unit = (crect.width / canvas.offsetWidth) * dpr
      const W = Math.round(crect.width * dpr)
      const H = Math.round(crect.height * dpr)
      if (!W || !H) return
      // wait for every image's first frame, so the art never shows up half-drawn.
      // Hidden frames (data-puff-hidden) are decoded too, so they're ready the
      // moment they're shown, but only the visible ones are drawn.
      const allSources = allImgs.map(drawable)
      if (!ready && allSources.some((s) => !s)) return
      const imgs = allImgs.filter((img) => !img.hasAttribute('data-puff-hidden'))
      const sources = imgs.map((img) => allSources[allImgs.indexOf(img)])

      // draw everything where the browser laid it out: text in its own font, art with crisp pixels
      const art = canvas2d(W, H)
      const ctx = art.getContext('2d', { willReadFrequently: true })!
      ctx.fillStyle = '#000'
      ctx.imageSmoothingEnabled = false
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
      const grow = (l: number, t: number, w: number, h: number) => {
        x0 = Math.min(x0, l); y0 = Math.min(y0, t)
        x1 = Math.max(x1, l + w); y1 = Math.max(y1, t + h)
      }
      for (const s of spans) {
        const cs = getComputedStyle(s)
        const r = s.getBoundingClientRect()
        ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${parseFloat(cs.fontSize) * unit}px ${cs.fontFamily}`
        const ls = parseFloat(cs.letterSpacing)
        if ('letterSpacing' in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${isNaN(ls) ? 0 : ls * unit}px`
        const m = ctx.measureText(s.textContent ?? '')
        const asc = m.fontBoundingBoxAscent, desc = m.fontBoundingBoxDescent
        const top = (r.top - crect.top) * dpr, left = (r.left - crect.left) * dpr, h = r.height * dpr
        // CSS centres the font's ascent + descent inside the line box; the baseline sits under the ascent
        ctx.fillText(s.textContent ?? '', left, top + (h - (asc + desc)) / 2 + asc)
        grow(left, top, r.width * dpr, h)
      }
      imgs.forEach((img, i) => {
        const src = sources[i]
        if (!src) return
        const r = img.getBoundingClientRect()
        const left = (r.left - crect.left) * dpr, top = (r.top - crect.top) * dpr
        ctx.drawImage(src, left, top, r.width * dpr, r.height * dpr)
        grow(left, top, r.width * dpr, r.height * dpr)
      })
      bounds = { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }

      puff!.upload(art, BLUR * unit)
      ready = true
      draw()
      wrap.dataset.puffReady = ''
    }

    // rebuilds are coalesced to one per frame (the CD swaps frames every 170ms while it spins)
    let buildQueued = false
    let building = false
    function queueBuild() {
      if (buildQueued || disposed) return
      buildQueued = true
      requestAnimationFrame(async () => {
        buildQueued = false
        if (building) { queueBuild(); return }
        building = true
        await build()
        building = false
      })
    }

    // pointer, in canvas device px (y down); hover and inflate ease toward their targets
    const mouse = { x: -1e5, y: -1e5 }
    let hover = 0, inflate = 0, target = 0
    let raf = 0, last = 0

    function draw() {
      if (ready) puff!.draw({ mouse, rect: bounds, hover, inflate, unit })
    }

    function tick(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016)
      last = now
      hover += (target - hover) * (1 - Math.pow(0.0005, dt))
      // puffs up quickly, and settles back flat slower than it rose
      inflate += (target - inflate) * (1 - Math.pow(target ? 0.002 : 0.02, dt))
      const settled = Math.abs(target - hover) < 0.001 && Math.abs(target - inflate) < 0.001
      if (settled) { hover = target; inflate = target }
      draw()
      raf = settled ? 0 : requestAnimationFrame(tick)
    }
    const kick = () => {
      if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick) }
    }

    function onMove(e: PointerEvent) {
      if (!ready) return
      const dpr = window.devicePixelRatio || 1
      const crect = canvas.getBoundingClientRect()
      mouse.x = (e.clientX - crect.left) * dpr
      mouse.y = (e.clientY - crect.top) * dpr
      const m = 30 * unit // a little slack around the art
      const over = mouse.x > bounds.x - m && mouse.x < bounds.x + bounds.w + m && mouse.y > bounds.y - m && mouse.y < bounds.y + bounds.h + m
      target = over ? 1 : 0
      if (raf) return
      if (hover > 0 || target > 0) kick()
    }
    const onLeave = () => { target = 0; kick() }

    queueBuild()
    const ro = new ResizeObserver(queueBuild)
    ro.observe(wrap)
    // animated art swaps its <img> src (and the cursor its size and visible frame): redraw when it does
    const mo = new MutationObserver(queueBuild)
    mo.observe(wrap, { subtree: true, attributes: true, attributeFilter: ['src', 'style', 'data-puff-hidden'] })
    wrap.addEventListener('load', queueBuild, true)
    window.addEventListener('resize', queueBuild)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      mo.disconnect()
      wrap.removeEventListener('load', queueBuild, true)
      window.removeEventListener('resize', queueBuild)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      delete wrap.dataset.puffReady
    }
  }, [])

  return (
    <div ref={wrapRef} className="puff-layer absolute inset-0">
      {children}
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute z-20"
        style={{ left: -PAD, top: -PAD, width: `calc(100% + ${PAD * 2}px)`, height: `calc(100% + ${PAD * 2}px)` }}
      />
    </div>
  )
}
