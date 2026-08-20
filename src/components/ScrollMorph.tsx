import { useEffect, useRef, useState } from 'react'

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

/**
 * Holds the page completely still while the child animation plays.
 *
 * This sits in normal flow at its natural height — it adds no scroll distance and
 * never pins anything, so the rest of the page keeps its layout and stays put.
 * When the content crosses the middle of the viewport it snaps to centre, blocks
 * scroll input, and spends that input on the animation instead. Once the
 * animation reaches either end the page scrolls again as usual.
 */
export default function ScrollMorph({
  children,
  distance = 1200,
  className,
}: {
  /** wheel delta needed to play the animation end to end */
  distance?: number
  className?: string
  children: (progress: number) => React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const progressRef = useRef(0)
  const lockedRef = useRef(false)
  const lockYRef = useRef(0)
  const touchYRef = useRef(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const setP = (v: number) => {
      progressRef.current = v
      setProgress(v)
    }

    /** how far the content's centre sits below the viewport's centre */
    function centreOffset() {
      const r = el!.getBoundingClientRect()
      return r.top + r.height / 2 - window.innerHeight / 2
    }

    function lock() {
      // Snap so the content is exactly centred, then hold the page there. The page
      // renders inside a CSS `zoom`, so a requested scroll delta and the resulting
      // change in viewport offset are not quite 1:1 — converge instead of assuming.
      for (let i = 0; i < 4; i++) {
        const d = centreOffset()
        if (Math.abs(d) < 0.5) break
        window.scrollTo({ top: window.scrollY + d, behavior: 'instant' })
      }
      lockYRef.current = window.scrollY
      lockedRef.current = true
    }

    function unlock() {
      lockedRef.current = false
    }

    function advance(delta: number) {
      let next = clamp01(progressRef.current + delta / distance)
      // Snap through the last sliver so accumulated floating-point error can never
      // leave us just short of an end and hold the page locked.
      if (next > 0.999) next = 1
      if (next < 0.001) next = 0
      setP(next)
      if (next === 1 || next === 0) unlock()
    }

    /** Never hold the page when there is nothing left to play in that direction. */
    function exhausted(delta: number) {
      return (delta > 0 && progressRef.current >= 1) || (delta < 0 && progressRef.current <= 0)
    }

    /** Should this scroll gesture be spent on the animation instead of the page? */
    function shouldLock(delta: number) {
      if (delta === 0) return false
      // Only if there is animation left to play in the direction of travel.
      if (exhausted(delta)) return false
      const d = centreOffset()
      // Engage when the centre is close, or when this gesture would carry it past.
      return Math.abs(d) < 60 || Math.sign(d) !== Math.sign(d - delta)
    }

    function onWheel(e: WheelEvent) {
      if (!lockedRef.current) {
        if (!shouldLock(e.deltaY)) return
        e.preventDefault()
        lock()
        advance(e.deltaY)
        return
      }
      if (exhausted(e.deltaY)) {
        unlock()
        return
      }
      e.preventDefault()
      advance(e.deltaY)
      window.scrollTo(0, lockYRef.current)
    }

    function onTouchStart(e: TouchEvent) {
      touchYRef.current = e.touches[0].clientY
    }

    function onTouchMove(e: TouchEvent) {
      const y = e.touches[0].clientY
      const delta = (touchYRef.current - y) * 2
      touchYRef.current = y
      if (!lockedRef.current) {
        if (!shouldLock(delta)) return
        e.preventDefault()
        lock()
        advance(delta)
        return
      }
      if (exhausted(delta)) {
        unlock()
        return
      }
      e.preventDefault()
      advance(delta)
      window.scrollTo(0, lockYRef.current)
    }

    const keySteps: Record<string, number> = {
      ArrowDown: 120,
      ArrowUp: -120,
      PageDown: 400,
      PageUp: -400,
      ' ': 400,
    }

    function onKeyDown(e: KeyboardEvent) {
      // Escape always hands scrolling back, whatever state we are in.
      if (e.key === 'Escape' && lockedRef.current) {
        unlock()
        return
      }
      const step = keySteps[e.key]
      if (!step) return
      if (lockedRef.current && exhausted(step)) {
        unlock()
        return
      }
      if (!lockedRef.current) {
        if (!shouldLock(step)) return
        e.preventDefault()
        lock()
        advance(step)
        return
      }
      e.preventDefault()
      advance(step)
      window.scrollTo(0, lockYRef.current)
    }

    // Anything that still manages to scroll the page while locked gets undone.
    function onScroll() {
      if (lockedRef.current) window.scrollTo(0, lockYRef.current)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('scroll', onScroll)
    }
  }, [distance])

  return (
    <div ref={ref} className={className}>
      {children(progress)}
    </div>
  )
}
