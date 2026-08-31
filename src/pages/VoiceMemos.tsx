import Layout from '../components/Layout'
import ScrollMorph from '../components/ScrollMorph'
import MorphingFlowChart from '../components/MorphingFlowChart'
import { searchBefore, searchAfter, menuBefore, menuAfter } from '../data/architectureFlows'
import heroArt from '../assets/images/case-study/voice-memos-hero.png'
import affinityMapping from '../assets/images/case-study/affinity-mapping.png'
import personaInformedIssac from '../assets/images/case-study/persona-informed-issac.png'
import logoEasyVoiceRecorder from '../assets/images/case-study/logo-easy-voice-recorder.png'
import logoRev from '../assets/images/case-study/logo-rev.png'
import logoEvernote from '../assets/images/case-study/logo-evernote.png'
import logoMotivAudio from '../assets/images/case-study/logo-motiv-audio.png'
import logoOtterAi from '../assets/images/case-study/logo-otter-ai.png'
import logoBandlab from '../assets/images/case-study/logo-bandlab.png'
import sketch1 from '../assets/images/case-study/sketch-1.png'
import sketch2 from '../assets/images/case-study/sketch-2.png'
import lowfiSidenav from '../assets/images/case-study/lowfi-sidenav.png'
import lowfiForYou from '../assets/images/case-study/lowfi-foryou.png'
import midfiSidenav from '../assets/images/case-study/midfi-sidenav.png'
import midfiTrending from '../assets/images/case-study/midfi-trending.png'
import version1 from '../assets/images/case-study/version-1.png'
import version2 from '../assets/images/case-study/version-2.png'
import finalProductNews from '../assets/images/case-study/final-product-news.mp4'
import finalProductPosts from '../assets/images/case-study/final-product-posts.mp4'
import finalProductTagsSearch from '../assets/images/case-study/final-product-tags-search.mp4'

const CARD_SHADOW = 'shadow-[0_20px_35px_-12px_rgba(0,0,0,0.25)]'

const metaItems = [
  { label: 'timeline', value: 'Sept - Dec 2025' },
  { label: 'team', value: '1 Lead, 5 Designers' },
  { label: 'role', value: 'Designer' },
  { label: 'skills', value: 'Figma' },
]

const COMPETITOR_GRID = 'grid grid-cols-[286px_repeat(5,1fr)_72px] items-center gap-x-3 pb-6'

const competitorCols = ['organization', 'personalization', 'sharing', 'ai / smart', 'visual clarity']

/** 2 = strong, 1 = limited, 0 = missing — in column order above. */
const competitors = [
  { name: 'Easy Voice Recorder', logo: logoEasyVoiceRecorder, scores: [1, 1, 1, 1, 2], price: 'paid' },
  { name: 'Rev', logo: logoRev, scores: [1, 1, 1, 1, 1], price: 'paid' },
  { name: 'Evernote', logo: logoEvernote, scores: [2, 2, 2, 2, 2], price: 'paid' },
  { name: 'MOTIV Audio', logo: logoMotivAudio, scores: [2, 1, 1, 0, 2], price: 'free' },
  { name: 'Otter.ai', logo: logoOtterAi, scores: [2, 2, 2, 2, 2], price: 'paid' },
  { name: 'BandLab', logo: logoBandlab, scores: [1, 2, 2, 2, 0], price: 'paid' },
]

const ratingLegend: [number, string][] = [
  [2, 'strong'],
  [1, 'limited/basic'],
  [0, 'missing'],
]

const painPoints = [
  { text: 'Difficult to categorize recordings beyond basic folders', iconFirst: false },
  { text: 'Lacks sorting and content-based search to find recordings fast', iconFirst: true },
  { text: 'No speech-to-text, AI summaries, translation, or smart naming', iconFirst: false },
  { text: 'Recording controls are hard to find and lack countdowns', iconFirst: true },
]

const insights = [
  { n: '1', text: 'Combine Lists and Communities; change the naming' },
  { n: '2', text: 'Combine Quote and Repost into one option, letting users add a comment or repost without one.' },
  { n: '3', text: 'Reduce clutter and button density by removing unnecessary icons (Ex. views icon)' },
  { n: '4', text: 'Restructure side and low nav bars; move notifications to corner' },
]

const finalProduct = [
  {
    video: finalProductNews,
    lines: ['Side nav simplified from 13 to 8 buttons', 'Trending moved from under search bar to side nav'],
  },
  {
    video: finalProductPosts,
    lines: ['Posts over 3 hidden under the view more arrow', 'Post interactions simplified from 6 to 4 core buttons'],
  },
  {
    video: finalProductTagsSearch,
    lines: ['Tags over 3 are hidden under the view more arrow', 'Search simplified to recent history with no tabs'],
  },
]

const persona = {
  meta: '42 · software engineer · new york',
  needs: ['verified-only filtering', 'clear parody + satire labels', 'a cleaner homepage'],
}

const journey = [
  { step: 'Opens app for tech news', pain: 'Three separate nav bars to parse', mood: 2 },
  { step: 'Finds the news tab', pain: 'Buried inside search', mood: 4 },
  { step: 'Only 5 topics, none tech', pain: 'Too few niches covered', mood: 1 },
  { step: 'Searches, filters to verified', pain: 'Too many taps to get there', mood: 2 },
  { step: 'Half the results are paid checkmarks', pain: 'Credible and paid look identical', mood: 2 },
]

/** Status marks for the competitor matrix, drawn to match MoodFace's line work.
    Colour carries the scale at a glance; the shapes still tell them apart without it. */
const statusColor = ['text-red-600', 'text-amber-500', 'text-teal-500']

function StatusIcon({ level, className }: { level: number; className?: string }) {
  const mark = [
    <>
      <path d="M7 7 L13 13" strokeLinecap="round" />
      <path d="M13 7 L7 13" strokeLinecap="round" />
    </>,
    <path d="M6.4 10 L13.6 10" strokeLinecap="round" />,
    <path d="M6.2 10.2 L8.9 12.9 L13.8 7.3" strokeLinecap="round" strokeLinejoin="round" />,
  ][level]
  return (
    <svg
      viewBox="0 0 20 20"
      className={`${statusColor[level]} ${className ?? ''}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="8.5" />
      {mark}
    </svg>
  )
}

/** Five-step mood scale, drawn to match the site's flat black-on-white line work. */
function MoodFace({ mood, className }: { mood: number; className?: string }) {
  const mouth = ['M 6 14 Q 10 9 14 14', 'M 6 13.5 Q 10 11 14 13.5', 'M 6 12.5 L 14 12.5', 'M 6 12 Q 10 15 14 12', 'M 6 11.5 Q 10 17 14 11.5'][mood]
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none" stroke="black" strokeWidth="1.1" aria-hidden="true">
      <circle cx="10" cy="10" r="8.5" />
      <circle cx="7" cy="8" r="0.9" fill="black" stroke="none" />
      <circle cx="13" cy="8" r="0.9" fill="black" stroke="none" />
      <path d={mouth} strokeLinecap="round" />
    </svg>
  )
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 77 77" className={className} fill="black" aria-hidden="true">
      <rect x="35" y="0" width="7" height="14" />
      <rect x="35" y="63" width="7" height="14" />
      <rect x="28" y="14" width="7" height="14" />
      <rect x="28" y="49" width="7" height="14" />
      <rect x="42" y="14" width="7" height="14" />
      <rect x="42" y="49" width="7" height="14" />
      <rect x="14" y="28" width="14" height="7" />
      <rect x="49" y="28" width="14" height="7" />
      <rect x="0" y="35" width="14" height="7" />
      <rect x="63" y="35" width="14" height="7" />
      <rect x="14" y="42" width="14" height="7" />
      <rect x="49" y="42" width="14" height="7" />
    </svg>
  )
}

function PixelStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <p className="font-pixel text-[165px] leading-none -mb-4">{value}</p>
      <p className="text-[24px] tracking-[-0.96px] whitespace-nowrap">{label}</p>
    </div>
  )
}

function InsightCell({ insight, className }: { insight: { n: string; text: string }; className?: string }) {
  return (
    <div className={`flex flex-1 flex-col items-center px-6 py-10 text-center ${className ?? ''}`}>
      {/* pixel glyphs sit low in their line box; nudge up to optically centre */}
      <p className="font-pixel text-[165px] leading-none -mb-4 -translate-y-[18px]">{insight.n}</p>
      <p className="text-[24px] tracking-[-0.96px]">{insight.text}</p>
    </div>
  )
}

function PairedVersionCard({
  number,
  title,
  pros,
  cons,
}: {
  number: string
  title: string
  pros: string
  cons: string
}) {
  return (
    <div className="flex flex-col items-center gap-12">
      <PixelStat value={number} label={title} />
      <div className="text-[24px] tracking-[-0.96px]">
        <p>
          <span className="text-[20px] text-gray-2">pros</span> {pros}
        </p>
        <p className="mt-4">
          <span className="text-[20px] text-gray-2">cons</span> {cons}
        </p>
      </div>
    </div>
  )
}

export default function VoiceMemos() {
  return (
    <Layout>
      <div className="mx-auto w-[1056px] max-w-full">
        {/* Hero */}
        <div className="mt-16 h-[400px] w-full overflow-hidden rounded-2xl bg-gray-2/10">
          <img src={heroArt} alt="Apple Voice Memos redesign hero" className="size-full object-cover" />
        </div>

        <div className="mt-1 flex items-baseline whitespace-nowrap">
          <span className="font-pixel text-[165px] leading-none mr-[-48px]">V</span>
          <span className="text-[80px] leading-none tracking-[-3.2px] mr-[24px]">oice</span>
          <span className="font-pixel text-[165px] leading-none">M</span>
          <span className="text-[80px] leading-none tracking-[-3.2px] mr-[24px]">emos</span>
          <span className="font-pixel text-[165px] leading-none mr-[-8px]">R</span>
          <span className="text-[80px] leading-none tracking-[-3.2px]">edesign</span>
        </div>

        <p className="text-[24px] tracking-[-0.96px]">
          Reduced clutter and added smarter folders to Apple&rsquo;s Voice Memos, making recordings searchable and
          easy to organize.
        </p>

        <div className="mt-12 w-full border-t border-gray-2/20" />
        <div className="mt-5 flex w-full items-center justify-between">
          {metaItems.map((m) => (
            <div key={m.label} className="flex flex-col items-start gap-4">
              <p className="text-[20px] text-gray-2 tracking-[-0.8px]">{m.label}</p>
              <p className="text-[24px] text-black tracking-[-0.96px]">{m.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 w-full border-t border-gray-2/20" />

        {/* Pain points */}
        <section className="mt-24">
          <p className="mb-[37px] text-[20px] text-gray-2 tracking-[-0.8px]">pain points</p>
          <div className="flex w-full justify-between rounded-3xl bg-white px-10 py-12">
            {painPoints.map((p, i) => (
              <div
                key={p.text}
                className={`flex w-[234px] flex-col items-center gap-10 text-center ${i % 2 === 1 ? 'translate-y-3' : ''}`}
              >
                {p.iconFirst ? (
                  <>
                    <SparkleIcon className="size-[77px]" />
                    <p className="text-[24px] tracking-[-0.96px]">{p.text}</p>
                  </>
                ) : (
                  <>
                    <p className="text-[24px] tracking-[-0.96px]">{p.text}</p>
                    <SparkleIcon className="size-[77px]" />
                  </>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Competitor analysis — a feature matrix. Colour is doing all the work in
            the research doc, so it is rebuilt here as filled / half / empty marks
            that survive the site's flat black-on-white palette. */}
        <section className="mt-24">
          <p className="mb-[37px] text-[20px] text-gray-2 tracking-[-0.8px]">competitor analysis</p>
          <div className="w-full overflow-hidden rounded-3xl bg-white px-10 py-9">
            <div className={COMPETITOR_GRID}>
              <p className="text-[20px] text-gray-2 tracking-[-0.8px]">app</p>
              {competitorCols.map((c) => (
                <p key={c} className="text-center text-[20px] text-gray-2 tracking-[-0.8px]">
                  {c}
                </p>
              ))}
              <p className="text-right text-[20px] text-gray-2 tracking-[-0.8px]">pricing</p>
            </div>

            {competitors.map((row) => (
              <div key={row.name} className={`${COMPETITOR_GRID} border-t border-gray-2/20 py-6`}>
                <div className="flex items-center gap-4">
                  <img
                    src={row.logo}
                    alt=""
                    className="size-10 shrink-0 rounded-[10px] object-cover shadow-[0_1px_4px_0_rgba(0,0,0,0.18)]"
                  />
                  <p className="text-[24px] leading-tight tracking-[-0.96px]">{row.name}</p>
                </div>
                {row.scores.map((s, i) => (
                  <div key={i} className="flex justify-center">
                    <StatusIcon level={s} className="size-6" />
                  </div>
                ))}
                <p className="text-right text-[20px] text-gray-2 tracking-[-0.8px]">{row.price}</p>
              </div>
            ))}

            <div className="flex items-center gap-8 border-t border-gray-2/20 pt-6">
              {ratingLegend.map(([level, label]) => (
                <div key={label} className="flex items-center gap-2">
                  <StatusIcon level={level} className="size-5" />
                  <p className="text-[20px] text-gray-2 tracking-[-0.8px]">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* User interviews & synthesis */}
        <section className="mt-24">
          <div className="flex w-full flex-wrap items-stretch gap-11">
            <div className="flex w-[484px] flex-col">
              <p className="mb-[37px] text-[20px] text-gray-2 tracking-[-0.8px]">user interviews &amp; affinity mapping</p>
              <div className="flex w-full flex-1 flex-col justify-center gap-20 rounded-3xl bg-white px-10 py-10">
                <div className="flex items-center gap-8">
                  {/* pixel glyphs sit low in their line box; nudge up to optically centre */}
                  <div className="-translate-y-[18px]">
                    <PixelStat value="12" label="Interviewees" />
                  </div>
                  <p className="flex-1 text-[24px] tracking-[-0.96px]">
                    We asked peers with &amp; without X experience to test three user flows, documenting their
                    frustrations and critiques.
                  </p>
                </div>
                <img
                  src={affinityMapping}
                  alt="Affinity mapping of interview notes"
                  className="w-full rounded-xl object-cover"
                />
              </div>
            </div>
            <div className="flex w-[525px] flex-col">
              <p className="mb-[37px] text-[20px] text-gray-2 tracking-[-0.8px]">synthesis — what should be done?</p>
              {/* Two independent columns so each cell's rule sits directly below its own
                  content — giving every number + description the same padding. */}
              <div className="flex w-full items-stretch overflow-hidden rounded-3xl bg-white">
                <div className="flex flex-1 flex-col">
                  <InsightCell insight={insights[0]} />
                  <InsightCell insight={insights[2]} className="border-t border-gray-2/20" />
                </div>
                <div className="flex flex-1 flex-col border-l border-gray-2/20">
                  <InsightCell insight={insights[1]} />
                  <InsightCell insight={insights[3]} className="border-t border-gray-2/20" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Redesigned info architecture — both flows render at the same px-per-unit
            scale so their boxes read as the same size, then are cascaded within one
            shared card the way the original design lays them out. Scrolling through
            this section pins the card and crossfades each flow from its cluttered
            "before" state into the simplified redesign. */}
        <section className="mt-24">
          <ScrollMorph>
            {(progress) => (
              <>
                <p className="mb-[37px] text-[20px] text-gray-2 tracking-[-0.8px]">
                  {progress < 0.5 ? 'original info architecture' : 'redesigned info architecture'}
                </p>
                <div className="relative h-[930px] w-full rounded-3xl bg-white">
                  <p className="absolute left-10 top-[41.5px] text-[20px] text-gray-2 tracking-[-0.8px]">
                    tabs under search &amp; trending
                  </p>
                  <div className="absolute left-[170px] top-[81.5px]">
                    <MorphingFlowChart before={searchBefore} after={searchAfter} scale={0.65} progress={progress} />
                  </div>
                  <div className="absolute left-10 top-[393.5px]">
                    <MorphingFlowChart before={menuBefore} after={menuAfter} scale={0.65} progress={progress} />
                  </div>
                  <p className="absolute right-10 top-[858.5px] text-[20px] text-gray-2 tracking-[-0.8px]">
                    side navigation
                  </p>
                </div>
              </>
            )}
          </ScrollMorph>
        </section>

        {/* User personas & journey mapping — one card: who he is, then where the
            current flow loses him, step by step. */}
        <section className="mt-24">
          <p className="mb-[37px] text-[20px] text-gray-2 tracking-[-0.8px]">user personas &amp; journey mapping</p>

          <div className="w-full overflow-hidden rounded-3xl bg-white">
            <div className="flex items-center gap-8 px-10 py-9">
              <img
                src={personaInformedIssac}
                alt="Illustrated portrait of Informed Issac"
                className="size-[104px] shrink-0 rounded-2xl object-cover"
              />
              <div>
                <p className="text-[32px] leading-none tracking-[-1.28px]">Informed Issac</p>
                <p className="mt-3 text-[20px] text-gray-2 tracking-[-0.8px]">occasional user · {persona.meta}</p>
              </div>
              <div className="ml-auto flex flex-col items-end gap-1">
                <p className="text-[20px] text-gray-2 tracking-[-0.8px]">needs</p>
                {persona.needs.map((n) => (
                  <p key={n} className="text-[20px] tracking-[-0.8px]">
                    {n}
                  </p>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-5 border-t border-gray-2/20">
              {journey.map((cell, i) => (
                <div key={i} className={`flex flex-col gap-4 px-6 py-9 ${i > 0 ? 'border-l border-gray-2/20' : ''}`}>
                  <MoodFace mood={cell.mood} className="size-6" />
                  <p className="text-[20px] leading-snug tracking-[-0.8px]">{cell.step}</p>
                  <p className="text-[20px] leading-snug tracking-[-0.8px] text-gray-2">{cell.pain}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Paper sketches / wireframes */}
        <section className="mt-24">
          <div className="relative h-[1120px] w-full">
            <div className="absolute left-0 top-0 w-[504px]">
              <p className="text-[20px] text-gray-2 tracking-[-0.8px]">paper sketches</p>
              <div className="mt-[37px] flex gap-6">
                <img
                  src={sketch1}
                  alt="Paper sketch: tabs under search"
                  className={`w-[240px] rounded-2xl ${CARD_SHADOW}`}
                />
                <img
                  src={sketch2}
                  alt="Paper sketch: side navigation options"
                  className={`w-[240px] rounded-2xl ${CARD_SHADOW}`}
                />
              </div>
            </div>
            <div className="absolute left-0 top-[540px] w-[504px]">
              <p className="text-[20px] text-gray-2 tracking-[-0.8px]">mid-fi wireframes</p>
              <div className="mt-[37px] flex gap-6">
                <img
                  src={midfiSidenav}
                  alt="Mid-fidelity side navigation"
                  className={`w-[240px] rounded-2xl ${CARD_SHADOW}`}
                />
                <img
                  src={midfiTrending}
                  alt="Mid-fidelity trending page"
                  className={`w-[240px] rounded-2xl ${CARD_SHADOW}`}
                />
              </div>
            </div>
            <div className="absolute left-[552px] top-[270px] w-[504px]">
              <p className="text-[20px] text-gray-2 tracking-[-0.8px]">low-fi wireframes</p>
              <div className="mt-[37px] flex gap-6">
                <img
                  src={lowfiSidenav}
                  alt="Low-fidelity side navigation"
                  className={`w-[240px] rounded-2xl ${CARD_SHADOW}`}
                />
                <img
                  src={lowfiForYou}
                  alt="Low-fidelity for you feed"
                  className={`w-[240px] rounded-2xl ${CARD_SHADOW}`}
                />
              </div>
            </div>
          </div>
        </section>

        {/* A/B testing */}
        <section className="mt-24">
          <p className="mb-[37px] text-[20px] text-gray-2 tracking-[-0.8px]">a/b testing</p>
          <div className="relative h-[690px] w-full rounded-3xl bg-white">
            <div className="absolute left-1/2 top-0 h-[600px] -translate-x-1/2 border-l border-gray-2/20" />
            <div className="absolute inset-x-0 top-[600px] border-t border-gray-2/20" />

            <img
              src={version1}
              alt="Version 1 mockup: view more arrows"
              className={`absolute left-10 top-[68px] w-[214px] rounded-2xl ${CARD_SHADOW}`}
            />
            <div className="absolute left-[291px] top-7 w-[197px]">
              <PairedVersionCard
                number="1"
                title="View More Arrows"
                pros="Keeps users in control and prevents mindless scrolling"
                cons="Adds click friction and interrupts the visual reading flow"
              />
            </div>

            <img
              src={version2}
              alt="Version 2 mockup: endless scroll"
              className={`absolute left-[568px] top-[68px] w-[214px] rounded-2xl ${CARD_SHADOW}`}
            />
            <div className="absolute left-[819px] top-[31px] w-[197px]">
              <PairedVersionCard
                number="2"
                title="Endless Scroll"
                pros="Maximizes feed immersion with uninterrupted browsing"
                cons="Harder to relocate posts and can cause overload device memory"
              />
            </div>

            <p className="absolute inset-x-0 top-[625px] text-center text-[24px] tracking-[-0.96px]">
              After conducting more user interviews, we went with option 1!
            </p>
          </div>
        </section>

        {/* Final product */}
        <section className="mb-16 mt-24">
          <p className="mb-[37px] text-[20px] text-gray-2 tracking-[-0.8px]">final product</p>
          <div className="flex w-full gap-6">
            {finalProduct.map((item, i) => (
              <div key={i} className="w-[336px]">
                <video
                  src={item.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{ aspectRatio: 664 / 1192 }}
                  className={`w-full rounded-[20px] object-contain ${CARD_SHADOW}`}
                />
                <div className="mt-5 text-[24px] tracking-[-0.96px]">
                  <p>{item.lines[0]}</p>
                  <p className="mt-4">{item.lines[1]}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  )
}
