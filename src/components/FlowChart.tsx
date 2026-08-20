export type FlowNode = {
  id: string
  label: string
  x: number
  y: number
  w?: number
  variant?: 'start' | 'default'
}

export type FlowEdge = {
  from: string
  to: string
}

const BOX_H = 52

function edgePath(a: FlowNode, b: FlowNode) {
  const aw = a.w ?? 180
  const startX = a.x + aw
  const startY = a.y + BOX_H / 2
  const endX = b.x
  const endY = b.y + BOX_H / 2
  const midX = startX + (endX - startX) / 2
  if (startY === endY) {
    return `M ${startX} ${startY} L ${endX} ${endY}`
  }
  return `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`
}

export default function FlowChart({
  nodes,
  edges,
  width,
  height,
  scale,
  className,
}: {
  nodes: FlowNode[]
  edges: FlowEdge[]
  width: number
  height: number
  /** px per data-unit. When set, the SVG renders at this exact scale instead of
   *  stretching to fill its container — pass the same value to multiple charts
   *  so their nodes read at the same physical size. */
  scale?: number
  className?: string
}) {
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]))
  const style = scale
    ? { width: width * scale, height: height * scale }
    : { width: '100%', aspectRatio: `${width} / ${height}` }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={`block ${className ?? ''}`} style={style}>
      <g fill="none" stroke="#fb923c" strokeWidth="1.5">
        {edges.map((e) => (
          <path key={`${e.from}-${e.to}`} d={edgePath(byId[e.from], byId[e.to])} />
        ))}
      </g>
      {nodes.map((n) => {
        const w = n.w ?? 180
        const isStart = n.variant === 'start'
        return (
          <g key={n.id}>
            <rect
              x={n.x}
              y={n.y}
              width={w}
              height={BOX_H}
              rx={8}
              fill={isStart ? '#dcfce7' : '#ffedd5'}
              stroke={isStart ? '#4ade80' : '#fb923c'}
              strokeWidth={1.5}
            />
            <text
              x={n.x + w / 2}
              y={n.y + BOX_H / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={16}
              fill="#111"
              fontFamily="var(--font-sans)"
            >
              {n.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
