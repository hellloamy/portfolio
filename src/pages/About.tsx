import Layout from '../components/Layout'
import photobooth from '../assets/images/about-photobooth.png'

export default function About() {
  return (
    <Layout>
      <div className="absolute inset-0 flex translate-y-[19px] items-center justify-center gap-[220px]">
        <div className="flex h-[640px] w-[410px] shrink-0 items-center justify-center rounded-[10px] bg-white shadow-[4px_4px_20px_0px_rgba(0,0,0,0.1)]">
          <div
            className="h-[507px] w-[203px] rounded-[9px] p-[9px] shadow-[0px_4px_18px_0px_rgba(0,0,0,0.1)]"
            style={{
              background:
                'linear-gradient(135deg, #f2f2f0 0%, #b6b6b3 22%, #8a8a87 50%, #b6b6b3 78%, #f2f2f0 100%)',
            }}
          >
            <div
              className="relative size-full overflow-hidden rounded-[3px]"
              style={{
                background:
                  'radial-gradient(120% 90% at 50% 15%, #ffe6f0 0%, #fed5e5 45%, #f7b9d3 100%)',
              }}
            >
              <img
                src={photobooth}
                alt="Photobooth strip of Amy"
                className="photobooth-drop pointer-events-none absolute inset-0 size-full object-contain"
              />
              <div className="pointer-events-none absolute inset-0 shadow-[inset_0px_4px_18px_18px_rgba(0,0,0,0.25)]" />
            </div>
          </div>
        </div>

        <div className="max-w-[530px]">
          <div className="flex items-baseline whitespace-nowrap">
            <span className="font-pixel text-[165px] leading-none">h</span>
            <span className="text-[80px] leading-none tracking-[-3.2px]">i! I&rsquo;m Amy.</span>
          </div>

          <div className="mt-12 text-[24px] leading-normal tracking-[-0.96px]">
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
