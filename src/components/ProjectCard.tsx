import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'

type ProjectCardProps = {
  title: string
  meta: string
  image: string
  to?: string
}

/** The hero's Figma-selection treatment — hairline rule with a handle at each
    corner — drawn in white over the artwork with no fill behind it. The soft
    drop-shadow is what keeps it readable on the lighter thumbnails. */
function SelectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative border-[0.8px] border-white px-3 py-2 drop-shadow-[0_1px_4px_rgba(0,0,0,0.55)]">
      <span className="absolute -left-[3px] -top-[3px] size-1.5 border-[0.8px] border-white bg-white" />
      <span className="absolute -left-[3px] -bottom-[3px] size-1.5 border-[0.8px] border-white bg-white" />
      <span className="absolute -right-[3px] -top-[3px] size-1.5 border-[0.8px] border-white bg-white" />
      <span className="absolute -right-[3px] -bottom-[3px] size-1.5 border-[0.8px] border-white bg-white" />
      <p className="whitespace-nowrap text-[18px] leading-normal tracking-[-0.72px] text-white">{children}</p>
    </div>
  )
}

export default function ProjectCard({ title, meta, image, to }: ProjectCardProps) {
  // Projects without a destination aren't written up yet — they stay unclickable
  // and say so on hover, under a heavier wash.
  const comingSoon = !to

  const frameRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  // Position and visibility are tracked apart so leaving the card only fades the
  // label out. Clearing the position too would snap it to the corner mid-fade.
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)

  function trackCursor(e: React.MouseEvent) {
    const frame = frameRef.current
    const label = labelRef.current
    if (!frame) return

    const rect = frame.getBoundingClientRect()
    // Pointer coords are viewport pixels but `left`/`top` are laid out in CSS
    // pixels, and the page renders inside a 66.667% zoom — derive the ratio from
    // the element itself rather than hard-coding it.
    const scale = rect.width / frame.offsetWidth || 1
    const labelW = label?.offsetWidth ?? 0
    const labelH = label?.offsetHeight ?? 0
    const pad = 10

    // Always up and to the left of the pointer, so the arrow — whose tip is its
    // top-left pixel — reads as pointing at the label. Clamped to the frame so it
    // never clips near an edge.
    const cursorX = (e.clientX - rect.left) / scale
    const cursorY = (e.clientY - rect.top) / scale

    setPos({
      x: Math.min(Math.max(pad, cursorX - labelW - 8), frame.offsetWidth - labelW - pad),
      y: Math.min(Math.max(pad, cursorY - labelH - 8), frame.offsetHeight - labelH - pad),
    })
    setVisible(true)
  }

  const content = (
    <>
      <div
        ref={frameRef}
        onMouseMove={trackCursor}
        onMouseLeave={() => setVisible(false)}
        className="relative aspect-[492/336] w-full overflow-hidden rounded-2xl shadow-[0_20px_35px_-12px_rgba(0,0,0,0.25)]"
      >
        <img src={image} alt={title} className="size-full object-cover" />

        {/* Just enough contrast for the white label to read, fading in step with it. */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 bg-black transition-opacity duration-100 ease-out ${
            visible ? 'opacity-[0.2]' : 'opacity-0'
          }`}
        />
        <div
          ref={labelRef}
          aria-hidden="true"
          style={{ left: pos.x, top: pos.y }}
          className={`pointer-events-none absolute w-max transition-opacity duration-100 ease-out ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <SelectionLabel>{comingSoon ? 'coming soon' : 'view case study'}</SelectionLabel>
        </div>
      </div>
      <div className="mt-5 flex w-full items-baseline justify-between gap-4">
        <p className="text-[24px] text-black tracking-[-0.96px]">{title}</p>
        <p className="shrink-0 text-[20px] text-gray-2 tracking-[-0.8px]">{meta}</p>
      </div>
    </>
  )

  if (to) {
    return (
      <Link to={to} className="block">
        {content}
      </Link>
    )
  }

  return <div className="cursor-default">{content}</div>
}
