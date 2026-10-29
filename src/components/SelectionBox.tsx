import type { ReactNode } from 'react'
import { useDrag } from '../lib/useDrag'

/**
 * A design-tool selection frame: hairline border with square handles on each
 * corner. Visitors can drag it around and it stays where they drop it.
 */
export default function SelectionBox({
  className = '',
  innerClassName = '',
  children,
}: {
  className?: string
  innerClassName?: string
  children: ReactNode
}) {
  const drag = useDrag()

  return (
    <div {...drag} className={`${className} touch-none select-none`}>
      <div className={`relative border-[0.8px] border-gray-2 ${innerClassName}`}>
        <Handles />
        {children}
      </div>
    </div>
  )
}

/** Just the four corner squares, for framing a box that isn't draggable. Needs a `relative` parent. */
export function Handles() {
  return (
    <>
      <span
        data-handle
        className="pointer-events-none absolute -left-[4px] -top-[4px] z-10 size-2 border-[0.8px] border-gray-2 bg-gray-1"
      />
      <span
        data-handle
        className="pointer-events-none absolute -left-[4px] -bottom-[4px] z-10 size-2 border-[0.8px] border-gray-2 bg-gray-1"
      />
      <span
        data-handle
        className="pointer-events-none absolute -right-[4px] -top-[4px] z-10 size-2 border-[0.8px] border-gray-2 bg-gray-1"
      />
      <span
        data-handle
        className="pointer-events-none absolute -right-[4px] -bottom-[4px] z-10 size-2 border-[0.8px] border-gray-2 bg-gray-1"
      />
    </>
  )
}
