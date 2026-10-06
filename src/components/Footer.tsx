import arrowExternal from '../assets/icons/arrow-external.svg'

export default function Footer() {
  return (
    <footer className="flex items-end justify-between">
      <div className="text-[24px] text-black tracking-[-0.96px] leading-normal">
        <p className="m-0">© Amy Wang, 2026</p>
        <p className="m-0 hidden sm:block">built and designed with love and lots of podcasts</p>
      </div>
      {/* On a phone the pair drops to the copyright's own size and sits close
          together, so the row reads as one group rather than two words pushed
          against opposite edges. Full size from sm up. */}
      <div className="flex gap-5 items-center sm:gap-12">
        <a
          href="mailto:agwang2@illinois.edu"
          className="flex gap-1.5 items-center justify-center text-[24px] text-black tracking-[-0.96px] sm:gap-2 sm:text-[32px] sm:tracking-[-1.28px]"
        >
          email
          <img src={arrowExternal} alt="" className="size-[18px] sm:size-6" />
        </a>
        <a
          href="https://www.linkedin.com/in/amywang6"
          target="_blank"
          rel="noreferrer"
          className="flex gap-1.5 items-center justify-center text-[24px] text-black tracking-[-0.96px] sm:gap-2 sm:text-[32px] sm:tracking-[-1.28px]"
        >
          linkedin
          <img src={arrowExternal} alt="" className="size-[18px] sm:size-6" />
        </a>
      </div>
    </footer>
  )
}
