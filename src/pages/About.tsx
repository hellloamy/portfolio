import Layout from '../components/Layout'
import photobooth from '../assets/images/about-photobooth.png'

export default function About() {
  return (
    <Layout>
      {/* Side by side needs ~1160px of content width, which only the lg breakpoint
          clears — below it the pair stacks and returns to normal flow, since the
          absolute fill is only there to centre the row in the viewport. */}
      <div className="flex flex-col items-center gap-14 py-16 lg:absolute lg:inset-0 lg:flex-row lg:translate-y-[19px] lg:justify-center lg:gap-[220px] lg:py-0">
        <div className="flex h-[520px] w-[333px] shrink-0 items-center justify-center rounded-[10px] bg-white shadow-[4px_4px_20px_0px_rgba(0,0,0,0.1)] lg:h-[640px] lg:w-[410px]">
          <div
            className="h-[412px] w-[165px] rounded-[9px] p-[9px] shadow-[0px_4px_18px_0px_rgba(0,0,0,0.1)] lg:h-[507px] lg:w-[203px]"
            style={{
              background:
                'linear-gradient(135deg, #f2f2f0 0%, #b6b6b3 22%, #8a8a87 50%, #b6b6b3 78%, #f2f2f0 100%)',
            }}
          >
            <div
              className="relative size-full overflow-hidden rounded-[3px]"
              style={{
                background:
                  'radial-gradient(120% 90% at 50% 15%, #fff1f5 0%, #fde4ec 45%, #f6c8da 100%)',
              }}
            >
              <img
                src={photobooth}
                alt="Photobooth strip of Amy"
                className="photobooth-drop pointer-events-none absolute inset-0 size-full object-contain"
              />
              <div className="pointer-events-none absolute inset-0 shadow-[inset_0px_3px_24px_10px_rgba(0,0,0,0.2)]" />
            </div>
          </div>
        </div>

        <div className="max-w-[530px]">
          <div className="flex items-baseline whitespace-nowrap">
            <span className="font-pixel text-[115px] leading-none lg:text-[165px]">h</span>
            <span className="text-[56px] leading-none tracking-[-2.24px] lg:text-[80px] lg:tracking-[-3.2px]">
              i! I&rsquo;m Amy.
            </span>
          </div>

          <div className="mt-8 text-[24px] leading-normal tracking-[-0.96px] lg:mt-12">
            <p>
              I&apos;m a designer born and raised in northern New Jersey and currently studying at the University of
              Illinois Urbana-Champaign. What drew me to design is its ability to create empathetic, thoughtful
              interfaces that solve real problems for niche communities and underserved audiences.
            </p>
            <p className="mt-6">
              Outside of design, you&apos;ll usually find me playing badminton, sketching on my iPad, watching
              college basketball (go Illini!), or singing along to R&amp;B.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
