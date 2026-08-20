import { Link } from 'react-router-dom'

const resumePdf = '/amy-wang-resume.pdf'

const items = [
  { number: '01', label: 'Home', to: '/' },
  { number: '02', label: 'About', to: '/about' },
]

export default function Nav() {
  return (
    <nav className="flex items-center justify-between">
      {items.map((item) => (
        <Link key={item.label} to={item.to} className="flex flex-col gap-4 items-start">
          <p className="text-[20px] text-gray-2 tracking-[-0.8px]">{item.number}</p>
          <p className="text-[24px] text-black tracking-[-0.96px]">{item.label}</p>
        </Link>
      ))}
      <a
        href={resumePdf}
        target="_blank"
        rel="noreferrer"
        className="flex flex-col gap-4 items-start"
      >
        <p className="text-[20px] text-gray-2 tracking-[-0.8px]">03</p>
        <p className="text-[24px] text-black tracking-[-0.96px]">Resume</p>
      </a>
    </nav>
  )
}
