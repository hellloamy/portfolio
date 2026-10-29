import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Layout from '../components/Layout'
import { Handles } from '../components/SelectionBox'
import { GRID, PALETTE, fetchDoodles, submitDoodle, type Doodle, type Ink, type Pixels } from '../lib/guestbook'
import { measureWall, playPin, type PinPlan } from '../lib/pinAnimation'

const CELL = 20 // canvas px per pixel on the drawing pad
const blank = (): Pixels => new Array(GRID * GRID).fill('')

// Pixel-art cursors drawn on a 16-cell grid
function pixelCursor(cells: (x: number, y: number) => string, hotspot: [number, number], fallback: string) {
  let rects = ''
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const fill = cells(x, y)
      if (fill) rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="${fill}"/>`
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 16 16" shape-rendering="crispEdges">${rects}</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") ${hotspot[0]} ${hotspot[1]}, ${fallback}`
}

// Both tools lie along the diagonal x + y = 15 with their working end in the bottom
// left. `along` runs from -15 there to 15 at the top right, and `halfWidth` says how
// far the shape reaches either side of the centre line at each point. Cells on a
// diagonal alternate, so the outline is found from neighbours rather than by
// distance, which would checkerboard.
function diagonalTool(halfWidth: (along: number) => number, fill: (along: number) => string) {
  const inside = (x: number, y: number) => Math.abs(x + y - 15) <= halfWidth(x - y)
  return (x: number, y: number) => {
    if (!inside(x, y)) return ''
    if (!inside(x - 1, y) || !inside(x + 1, y) || !inside(x, y - 1) || !inside(x, y + 1)) return '#000000'
    return fill(x - y)
  }
}

const PENCIL_CURSOR = pixelCursor(
  diagonalTool(
    (along) => (along < -13 ? -1 : along <= -12 ? 0 : along <= -9 ? 1 : along <= 13 ? 2 : -1),
    (along) => {
      if (along <= -7) return '#f1d7b0' // sharpened wood
      if (along <= 5) return '#ffffff' // body
      if (along <= 8) return PALETTE.g // metal band
      return PALETTE.p // eraser
    },
  ),
  [3, 29],
  'crosshair',
)

// A white eraser in a pink paper sleeve, with just the rubbing end showing. Outlined
// in black like the pencil.
const ERASER_ROWS = [
  '................',
  '................',
  '..kkkkkkkkkkkk..',
  '..kwwohhhhhhhk..',
  '..kwwopppppppk..',
  '..kwwopppppppk..',
  '..kwwopppppppk..',
  '..kwwopppppppk..',
  '..kssopppppppk..',
  '..kkkkkkkkkkkk..',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
]
const ERASER_COLORS: Record<string, string> = {
  k: '#000000', // outline
  w: '#ffffff', // rubber
  s: '#e6e6e6', // rubber, shaded underside
  o: '#b0476b', // sleeve edge
  h: '#fcd5e3', // sleeve highlight
  p: PALETTE.p, // sleeve
}

// The hotspot sits on the bottom-left corner of the white end, where it rubs the page
const ERASER_CURSOR = pixelCursor((x, y) => ERASER_COLORS[ERASER_ROWS[y][x]] ?? '', [5, 18], 'cell')

// Outline eraser (Tabler, MIT) for the tool toggle icon
const ERASER_PATHS = [
  'M19 20h-10.5l-4.21 -4.3a1 1 0 0 1 0 -1.41l10 -10a1 1 0 0 1 1.41 0l5 5a1 1 0 0 1 0 1.41l-9.2 9.3',
  'M18 13.3l-6.3 -6.3',
]

const COLORS: { ink: Ink; label: string }[] = [
  { ink: 'k', label: 'Black' },
  { ink: 'g', label: 'Grey' },
  { ink: 'p', label: 'Pink' },
]

type Tool = 'pen' | 'eraser'

// Outline icons (Tabler, MIT) for the pen / eraser toggle
const TOOL_ICONS: Record<Tool, React.ReactNode> = {
  pen: (
    <>
      <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
      <path d="M13.5 6.5l4 4" />
    </>
  ),
  eraser: (
    <>
      {ERASER_PATHS.map((d) => (
        <path key={d} d={d} />
      ))}
    </>
  ),
}

function paint(ctx: CanvasRenderingContext2D, pixels: Pixels, cell: number) {
  ctx.clearRect(0, 0, GRID * cell, GRID * cell)
  pixels.forEach((ink, i) => {
    if (!ink) return
    ctx.fillStyle = PALETTE[ink]
    ctx.fillRect((i % GRID) * cell, Math.floor(i / GRID) * cell, cell, cell)
  })
}

function DrawingPad({
  pixels,
  ink,
  onChange,
  onClear,
}: {
  pixels: Pixels
  ink: Ink | ''
  onChange: (p: Pixels) => void
  onClear: () => void
}) {
  const ref = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const last = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const ctx = ref.current?.getContext('2d')
    if (ctx) paint(ctx, pixels, CELL)
  }, [pixels])

  const cellAt = (e: React.PointerEvent) => {
    // Ratios rather than raw px, so #root's zoom doesn't throw off which cell is hit
    const r = e.currentTarget.getBoundingClientRect()
    return {
      x: Math.floor(((e.clientX - r.left) / r.width) * GRID),
      y: Math.floor(((e.clientY - r.top) / r.height) * GRID),
    }
  }

  const stroke = (to: { x: number; y: number }) => {
    const from = last.current ?? to
    const next = pixels.slice()
    // Fill every cell between pointer events so fast strokes don't leave gaps
    const steps = Math.max(Math.abs(to.x - from.x), Math.abs(to.y - from.y), 1)
    for (let i = 0; i <= steps; i++) {
      const x = Math.round(from.x + ((to.x - from.x) * i) / steps)
      const y = Math.round(from.y + ((to.y - from.y) * i) / steps)
      if (x >= 0 && y >= 0 && x < GRID && y < GRID) next[y * GRID + x] = ink
    }
    last.current = to
    onChange(next)
  }

  return (
    <div className="relative w-full border-[0.8px] border-gray-2">
      <Handles />
      <button
        type="button"
        onClick={onClear}
        className="absolute top-3 right-3 z-10 cursor-pointer bg-white/90 px-3 py-1 text-[20px] tracking-[-0.6px] text-gray-2 hover:text-black"
      >
        clear
      </button>
      <canvas
        ref={ref}
        width={GRID * CELL}
        height={GRID * CELL}
        aria-label="Drawing pad"
        className="block aspect-square w-full touch-none bg-white [image-rendering:pixelated]"
        style={{
          backgroundImage:
            'linear-gradient(#eeeeee 1px, transparent 1px), linear-gradient(90deg, #eeeeee 1px, transparent 1px)',
          backgroundSize: `${100 / GRID}% ${100 / GRID}%`,
          cursor: ink ? PENCIL_CURSOR : ERASER_CURSOR,
        }}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId)
          drawing.current = true
          last.current = null
          stroke(cellAt(e))
        }}
        onPointerMove={(e) => drawing.current && stroke(cellAt(e))}
        onPointerUp={() => (drawing.current = false)}
        onPointerCancel={() => (drawing.current = false)}
      />
    </div>
  )
}

function DoodleCard({ doodle }: { doodle: Doodle }) {
  const ref = useRef<HTMLCanvasElement>(null)
  // Layout effect so a newly pinned card is painted before it starts flying
  useLayoutEffect(() => {
    const ctx = ref.current?.getContext('2d')
    if (ctx) paint(ctx, doodle.pixels, 1)
  }, [doodle.pixels])

  const date = new Date(doodle.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toLowerCase()
  // A slight tilt, seeded from the id so each polaroid keeps its angle across renders
  const tilt = ([...doodle.id].reduce((n, c) => n + c.charCodeAt(0), 0) % 9) - 4

  // The pin animation moves this wrapper; the tilt sits on the inner element (via the
  // separate `rotate` property) so the two don't clash
  return (
    <div data-doodle-id={doodle.id} className="relative">
      <figure
        className="m-0 w-[200px] bg-white px-[14px] pt-[14px] pb-4 shadow-[4px_4px_20px_0px_rgba(0,0,0,0.1)] transition-[rotate,scale] duration-200 select-none [rotate:var(--tilt)] hover:[rotate:0deg] hover:[scale:1.04]"
        style={{ '--tilt': `${tilt}deg` } as React.CSSProperties}
      >
        <canvas
          ref={ref}
          width={GRID}
          height={GRID}
          className="block size-[172px] bg-[#fdfdfd] shadow-[inset_0_0_0_0.8px_#e6e6e6] [image-rendering:pixelated]"
        />
        <figcaption className="mt-4 flex items-baseline justify-between gap-2 text-[20px] tracking-[-0.6px]">
          <span className="truncate">{doodle.name}</span>
          <span className="shrink-0 text-[16px] text-gray-2">{date}</span>
        </figcaption>
      </figure>
    </div>
  )
}

export default function Guestbook() {
  const [pixels, setPixels] = useState<Pixels>(blank)
  const [color, setColor] = useState<Ink>('k')
  const [tool, setTool] = useState<Tool>('pen')
  const ink = tool === 'eraser' ? '' : color
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [wall, setWall] = useState<Doodle[] | null>(null)
  const padRef = useRef<HTMLDivElement>(null)
  const wallRef = useRef<HTMLDivElement>(null)
  const pin = useRef<PinPlan | null>(null)

  // Runs after the new doodle is in the DOM but before the browser paints it
  useLayoutEffect(() => {
    if (pin.current && wallRef.current) playPin(wallRef.current, pin.current)
    pin.current = null
  }, [wall])

  useEffect(() => {
    fetchDoodles()
      .then(setWall)
      .catch(() => setWall([]))
  }, [])

  const submit = async () => {
    if (!pixels.some(Boolean)) return setError('Draw something first')
    if (!name.trim()) return setError('Add your name first')
    setSending(true)
    try {
      const doodle = await submitDoodle(name, pixels)
      if (padRef.current && wallRef.current) {
        pin.current = {
          id: doodle.id,
          from: padRef.current.getBoundingClientRect(),
          before: measureWall(wallRef.current),
        }
      }
      setWall((w) => [doodle, ...(w ?? [])])
      setPixels(blank())
      setName('')
    } catch {
      setError("Couldn't pin your doodle. Try again in a moment.")
    } finally {
      setSending(false)
    }
  }

  const count = wall?.length ?? 0

  return (
    // Centred in the space between nav and footer. The wall is sized to three
    // polaroids across so the whole block has a fixed width to centre.
    <Layout contentClassName="flex flex-col">
      <div className="flex flex-1 items-center justify-center py-20">
        <div className="w-full lg:w-fit">
          <div className="flex items-baseline whitespace-nowrap">
            <span className="font-pixel text-[115px] leading-none lg:text-[140px]">l</span>
            <span className="text-[56px] leading-none tracking-[-2.24px] lg:text-[72px] lg:tracking-[-2.9px]">
              eave a doodle :)
            </span>
          </div>
          <div className="mt-14 flex flex-col gap-16 lg:flex-row lg:items-start lg:gap-24">
            <div className="w-[480px] max-w-full shrink-0">
              <div ref={padRef}>
                <DrawingPad
                  pixels={pixels}
                  ink={ink}
                  onChange={(p) => {
                    setPixels(p)
                    setError('')
                  }}
                  onClear={() => setPixels(blank())}
                />
              </div>

              <div className="mt-6 flex items-center gap-5">
                {COLORS.map((c) => (
                  <button
                    key={c.label}
                    type="button"
                    aria-label={c.label}
                    aria-pressed={tool === 'pen' && color === c.ink}
                    onClick={() => {
                      setColor(c.ink)
                      setTool('pen') // picking a colour while erasing means you want to draw again
                    }}
                    className={`size-12 cursor-pointer rounded-full transition-[outline-color] ${
                      tool === 'pen' && color === c.ink
                        ? 'outline-[3px] outline-offset-[3px] outline-black'
                        : 'outline-[3px] outline-offset-[3px] outline-transparent'
                    }`}
                    style={{ backgroundColor: PALETTE[c.ink] }}
                  />
                ))}

                <div className="ml-auto flex h-14 gap-1 rounded-[14px] bg-[#eeeeee] p-1.5">
                  {(['pen', 'eraser'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      aria-label={t === 'pen' ? 'Pen' : 'Eraser'}
                      aria-pressed={tool === t}
                      onClick={() => setTool(t)}
                      className={`flex size-11 cursor-pointer items-center justify-center rounded-[10px] ${
                        tool === t ? 'bg-white text-black' : 'text-gray-2 hover:text-black'
                      }`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="size-7"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        {TOOL_ICONS[t]}
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              <input
                value={name}
                maxLength={20}
                placeholder="your name"
                aria-label="Your name"
                onChange={(e) => {
                  setName(e.target.value)
                  setError('')
                }}
                className="mt-6 block h-14 w-full rounded-[14px] border-[0.8px] border-gray-2 bg-white px-4 text-[22px] tracking-[-0.6px] outline-none placeholder:text-gray-2 focus:border-black"
              />
              <button
                type="button"
                onClick={submit}
                disabled={sending}
                className="mt-5 h-14 w-full cursor-pointer rounded-[14px] bg-black text-[22px] tracking-[-0.6px] text-white disabled:cursor-wait disabled:opacity-60"
              >
                {sending ? 'pinning…' : 'pin to the wall →'}
              </button>
              <p className="mt-3 min-h-[30px] text-[20px] tracking-[-0.6px]" aria-live="polite">
                {error && <span className="text-red-600">{error}</span>}
              </p>
            </div>

            <div className="w-full lg:w-[664px]">
              {/* Spans the full three-polaroid wall, so the count always sits over the
                  third column, however many doodles there are */}
              <div className="mb-6 flex justify-between text-[20px] tracking-[-0.6px] text-gray-2">
                <span>the wall</span>
                {wall && <span>{count === 1 ? '1 doodle' : `${count} doodles`}</span>}
              </div>
              <div ref={wallRef} className="flex flex-wrap gap-8">
                {wall?.map((d) => (
                  <DoodleCard key={d.id} doodle={d} />
                ))}
              </div>
              {wall && count === 0 && <p className="text-[24px] tracking-[-0.96px]">Be the first to leave a doodle.</p>}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
