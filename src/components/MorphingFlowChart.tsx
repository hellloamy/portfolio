import type { FlowData } from '../data/architectureFlows'

const BOX_H = 52

type Box = {
  id: string
  x: number
  y: number
  w: number
  opacity: number
  boxScale: number
  isStart: boolean
  labelBefore?: string
  labelAfter?: string
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

function parentMap(data: FlowData) {
  const parents: Record<string, string> = {}
  for (const e of data.edges) parents[e.to] = e.from
  return parents
}

function edgePath(a: Box, b: Box) {
  const startX = a.x + a.w
  const startY = a.y + BOX_H / 2
  const endX = b.x
  const endY = b.y + BOX_H / 2
  const midX = startX + (endX - startX) / 2
  if (Math.abs(startY - endY) < 0.5) return `M ${startX} ${startY} L ${endX} ${endY}`
  return `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`
}

export default function MorphingFlowChart({
  before,
  after,
  scale,
  progress,
  className,
}: {
  before: FlowData
  after: FlowData
  scale: number
  progress: number
  className?: string
}) {
  const t = easeInOut(clamp01(progress))

  const beforeById = Object.fromEntries(before.nodes.map((n) => [n.id, n]))
  const afterById = Object.fromEntries(after.nodes.map((n) => [n.id, n]))
  const beforeParents = parentMap(before)
  const afterParents = parentMap(after)

  const boxes: Record<string, Box> = {}

  // 1. Boxes that survive the redesign simply travel from one layout to the other.
  for (const n of before.nodes) {
    const m = afterById[n.id]
    if (!m) continue
    boxes[n.id] = {
      id: n.id,
      x: lerp(n.x, m.x, t),
      y: lerp(n.y, m.y, t),
      w: lerp(n.w ?? 180, m.w ?? 180, t),
      opacity: 1,
      boxScale: 1,
      isStart: n.variant === 'start',
      labelBefore: n.label,
      labelAfter: m.label,
    }
  }

  // Nearest already-placed ancestor, so a removed branch collapses into whatever
  // part of the tree is still standing rather than into thin air.
  function anchor(id: string, parents: Record<string, string>) {
    const seen = new Set<string>()
    let cur = parents[id]
    while (cur && !seen.has(cur)) {
      if (boxes[cur]) return boxes[cur]
      seen.add(cur)
      cur = parents[cur]
    }
    return null
  }

  // 2. Removed boxes shrink into their parent and drop out early.
  for (const n of before.nodes) {
    if (afterById[n.id]) continue
    const a = anchor(n.id, beforeParents)
    const w = n.w ?? 180
    boxes[n.id] = {
      id: n.id,
      x: lerp(n.x, a ? a.x : n.x, t),
      y: lerp(n.y, a ? a.y : n.y, t),
      w,
      opacity: clamp01(1 - t * 1.9),
      boxScale: lerp(1, 0.5, t),
      isStart: n.variant === 'start',
      labelBefore: n.label,
      labelAfter: n.label,
    }
  }

  // 3. New boxes grow out of their parent once the old layout has cleared.
  for (const n of after.nodes) {
    if (beforeById[n.id]) continue
    const a = anchor(n.id, afterParents)
    const w = n.w ?? 180
    boxes[n.id] = {
      id: n.id,
      x: lerp(a ? a.x : n.x, n.x, t),
      y: lerp(a ? a.y : n.y, n.y, t),
      w,
      opacity: clamp01((t - 0.55) / 0.35),
      boxScale: lerp(0.5, 1, t),
      isStart: n.variant === 'start',
      labelBefore: n.label,
      labelAfter: n.label,
    }
  }

  const key = (e: { from: string; to: string }) => `${e.from}->${e.to}`
  const beforeEdges = new Set(before.edges.map(key))
  const afterEdges = new Set(after.edges.map(key))
  const allEdges = [...before.edges, ...after.edges].filter(
    (e, i, arr) => arr.findIndex((o) => key(o) === key(e)) === i,
  )

  const width = Math.max(before.width, after.width)
  const height = Math.max(before.height, after.height)

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`block ${className ?? ''}`}
      style={{ width: width * scale, height: height * scale }}
    >
      <g fill="none" stroke="#fb923c" strokeWidth="1.5">
        {allEdges.map((e) => {
          const a = boxes[e.from]
          const b = boxes[e.to]
          if (!a || !b) return null
          const inBefore = beforeEdges.has(key(e))
          const inAfter = afterEdges.has(key(e))
          const base = inBefore && inAfter ? 1 : inBefore ? 1 - t * 1.9 : (t - 0.55) / 0.35
          const opacity = clamp01(Math.min(base, a.opacity, b.opacity))
          if (opacity <= 0.01) return null
          return <path key={key(e)} d={edgePath(a, b)} opacity={opacity} />
        })}
      </g>

      {Object.values(boxes).map((b) => {
        if (b.opacity <= 0.01) return null
        const cx = b.x + b.w / 2
        const cy = b.y + BOX_H / 2
        const sameLabel = b.labelBefore === b.labelAfter
        return (
          <g
            key={b.id}
            opacity={b.opacity}
            transform={`translate(${cx} ${cy}) scale(${b.boxScale}) translate(${-cx} ${-cy})`}
          >
            <rect
              x={b.x}
              y={b.y}
              width={b.w}
              height={BOX_H}
              rx={8}
              fill={b.isStart ? '#dcfce7' : '#ffedd5'}
              stroke={b.isStart ? '#4ade80' : '#fb923c'}
              strokeWidth={1.5}
            />
            {sameLabel ? (
              <text
                x={cx}
                y={cy}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={16}
                fill="#111"
                fontFamily="var(--font-sans)"
              >
                {b.labelBefore}
              </text>
            ) : (
              <>
                <text
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={16}
                  fill="#111"
                  fontFamily="var(--font-sans)"
                  opacity={1 - t}
                >
                  {b.labelBefore}
                </text>
                <text
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={16}
                  fill="#111"
                  fontFamily="var(--font-sans)"
                  opacity={t}
                >
                  {b.labelAfter}
                </text>
              </>
            )}
          </g>
        )
      })}
    </svg>
  )
}
