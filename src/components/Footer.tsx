import arrowExternal from '../assets/icons/arrow-external.svg'

export default function Footer() {
  return (
    <footer className="flex items-end justify-between">
      <div className="text-[24px] text-black tracking-[-0.96px] leading-normal">
        <p className="m-0">© Amy Wang, 2026</p>
        <p className="m-0 hidden sm:block">built and designed with love and lots of podcasts</p>
      </div>
      <div className="flex gap-12 items-center">
        <a
          href="mailto:agwang2@illinois.edu"
          className="flex gap-2 items-center justify-center text-[32px] text-black tracking-[-1.28px]"
        >
          email
          <img src={arrowExternal} alt="" className="size-6" />
        </a>
        <a
          href="https://www.linkedin.com/in/amywang6"
          target="_blank"
          rel="noreferrer"
          className="flex gap-2 items-center justify-center text-[32px] text-black tracking-[-1.28px]"
        >
          linkedin
          <img src={arrowExternal} alt="" className="size-6" />
        </a>
      </div>
    </footer>
  )
}
