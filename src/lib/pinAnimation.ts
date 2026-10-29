import { PALETTE } from './guestbook'

/** Where things were just before a new doodle was added to the wall. */
export type PinPlan = { id: string; from: DOMRect; before: Map<string, DOMRect> }

/** Snapshot the wall so the cards can glide from their old spots once the new one lands. */
export function measureWall(wall: HTMLElement) {
  const rects = new Map<string, DOMRect>()
  wall
    .querySelectorAll<HTMLElement>('[data-doodle-id]')
    .forEach((el) => rects.set(el.dataset.doodleId!, el.getBoundingClientRect()))
  return rects
}

const SETTLE = 'cubic-bezier(0.2, 0.8, 0.2, 1)'
const OVERSHOOT = 'cubic-bezier(0.34, 1.5, 0.64, 1)'

/**
 * Plays once React has rendered the new doodle into the wall. The doodle lifts
 * off the drawing pad and arcs over to its slot while the others shuffle along to
 * make room, then lands with a stamp and a burst of pixels in the site's colours.
 */
export function playPin(wall: HTMLElement, plan: PinPlan) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const items = [...wall.querySelectorAll<HTMLElement>('[data-doodle-id]')]
  const card = items.find((el) => el.dataset.doodleId === plan.id)
  if (!card) return
  // Rects come back in screen px, but transforms apply in layout px under #root's zoom
  const zoom = wall.getBoundingClientRect().width / wall.offsetWidth || 1

  items.forEach((el, i) => {
    const was = plan.before.get(el.dataset.doodleId!)
    if (!was || el === card) return
    const now = el.getBoundingClientRect()
    const dx = (was.left - now.left) / zoom
    const dy = (was.top - now.top) / zoom
    if (!dx && !dy) return
    el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], {
      duration: 500,
      delay: 120 + Math.min(i, 12) * 30,
      easing: SETTLE,
      fill: 'backwards',
    })
  })

  const to = card.getBoundingClientRect()
  const onScreen = to.top >= 0 && to.bottom <= window.innerHeight
  card.style.zIndex = '20'
  // Scale from the corner so the translate lines its top-left up with the pad's
  card.style.transformOrigin = 'top left'

  let arrive: Animation
  if (onScreen) {
    const dx = (plan.from.left - to.left) / zoom
    const dy = (plan.from.top - to.top) / zoom
    const scale = plan.from.width / to.width
    arrive = card.animate(
      [
        { transform: `translate(${dx}px, ${dy}px) scale(${scale})`, easing: 'ease-out' },
        // Peak of the arc: halfway across, lifted up and tilted like it's being carried
        {
          transform: `translate(${dx / 2}px, ${dy / 2 - 120}px) scale(${(scale + 1) / 2}) rotate(-8deg)`,
          offset: 0.45,
          easing: OVERSHOOT,
        },
        { transform: 'none' },
      ],
      { duration: 800 },
    )
  } else {
    // Stacked layout on small screens: the wall is below the pad, so bring it into
    // view and drop the card in rather than flying it somewhere the visitor can't see
    card.scrollIntoView({ behavior: 'smooth', block: 'center' })
    arrive = card.animate(
      [
        { transform: 'translateY(-160px) rotate(-8deg)', opacity: 0 },
        { transform: 'none', opacity: 1 },
      ],
      { duration: 600, delay: 350, easing: OVERSHOOT, fill: 'backwards' },
    )
  }

  arrive.onfinish = () => {
    card.style.transformOrigin = ''
    card.style.zIndex = ''
    card.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }], {
      duration: 240,
      easing: 'ease-in-out',
    })
    burst(card)
  }
}

function burst(card: HTMLElement) {
  const colors = Object.values(PALETTE)
  const count = 18
  for (let i = 0; i < count; i++) {
    const px = document.createElement('span')
    px.style.cssText = `position:absolute;left:50%;top:45%;width:10px;height:10px;pointer-events:none;background:${colors[i % colors.length]}`
    card.appendChild(px)
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4
    const dist = 120 + Math.random() * 60
    const x = Math.cos(angle) * dist
    const y = Math.sin(angle) * dist
    // Stepped easing so the pixels jump outward in frames, like pixel-art animation
    px.animate(
      [
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
        { transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(0.4)`, opacity: 0 },
      ],
      { duration: 640, easing: 'steps(6, end)' },
    ).onfinish = () => px.remove()
  }
}
