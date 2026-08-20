import { Link } from 'react-router-dom'

type ProjectCardProps = {
  title: string
  meta: string
  image: string
  to?: string
}

export default function ProjectCard({ title, meta, image, to }: ProjectCardProps) {
  // Projects without a destination aren't written up yet — they stay unclickable
  // and say so on hover.
  const comingSoon = !to

  const content = (
    <>
      <div className="relative aspect-[492/336] w-full overflow-hidden rounded-2xl shadow-[0_20px_35px_-12px_rgba(0,0,0,0.25)]">
        <img src={image} alt={title} className="size-full object-cover" />
        {comingSoon && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <p className="font-sans text-[32px] text-white tracking-[-1.28px]">coming soon</p>
          </div>
        )}
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

  return <div className="group cursor-default">{content}</div>
}
