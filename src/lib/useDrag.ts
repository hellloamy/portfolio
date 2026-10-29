import { useRef, useState } from 'react'

/**
 * Lets visitors drag an element around; it stays where they drop it. Spread the
 * returned props onto the element. The offset is in layout px, which #root's zoom
 * makes different from screen px.
 */
export function useDrag() {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const drag = useRef<{ x: number; y: number; scale: number } | null>(null)

  const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (e.button !== 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    // #root is zoomed, so screen px don't match layout px one to one
    const scale = e.currentTarget.getBoundingClientRect().width / e.currentTarget.offsetWidth
    drag.current = { x: e.clientX / scale - offset.x, y: e.clientY / scale - offset.y, scale }
  }

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const d = drag.current
    if (d) setOffset({ x: e.clientX / d.scale - d.x, y: e.clientY / d.scale - d.y })
  }

  const onPointerUp = () => {
    drag.current = null
  }

  return {
    'data-draggable': true,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel: onPointerUp,
    style: { transform: `translate(${offset.x}px, ${offset.y}px)` },
  }
}
