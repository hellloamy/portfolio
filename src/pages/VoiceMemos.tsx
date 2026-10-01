import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Layout from '../components/Layout'
import heroArt from '../assets/images/case-study/voice-memos-hero.png'
import affinityMapping from '../assets/images/case-study/vm-affinity-mapping.png'
import personaInformedIssac from '../assets/images/case-study/persona-informed-issac.png'
import logoEasyVoiceRecorder from '../assets/images/case-study/logo-easy-voice-recorder.png'
import logoRev from '../assets/images/case-study/logo-rev.png'
import logoEvernote from '../assets/images/case-study/logo-evernote.png'
import logoMotivAudio from '../assets/images/case-study/logo-motiv-audio.png'
import logoOtterAi from '../assets/images/case-study/logo-otter-ai.png'
import logoBandlab from '../assets/images/case-study/logo-bandlab.png'
import vmLowfi1 from '../assets/images/case-study/vm-lowfi-1.webp'
import vmLowfi2 from '../assets/images/case-study/vm-lowfi-2.webp'
import vmMidfi from '../assets/images/case-study/vm-midfi.webp'
import vmFinalCurrent from '../assets/images/case-study/vm-final-current.webp'
import vmFinalRedesign from '../assets/images/case-study/vm-final-redesign.mp4'

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
  { n: '1', text: 'Let users personalize recordings with colors, icons, and folders so the app feels like their own' },
  { n: '2', text: 'Auto-generate summaries so users can tell what a recording holds at a glance' },
  { n: '3', text: 'Lean into brainstorming — Voice Memos is where thinking starts, not where work gets finished' },
]

const persona = {
  meta: '15 · singer/songwriter · kauai, hi',
  needs: ['a simple ui', 'excellent audio quality', 'a tutorial for new users'],
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

/** Three insights read better stacked than in a grid, so the numeral sits beside
    the text rather than above it. */
function InsightRow({ insight, className }: { insight: { n: string; text: string }; className?: string }) {
  return (
    <div className={`flex flex-1 items-center gap-8 px-10 py-8 ${className ?? ''}`}>
      {/* pixel glyphs sit low in their line box; nudge up to optically centre */}
      <p className="w-[72px] shrink-0 text-center font-pixel text-[140px] leading-none -translate-y-[15px]">
        {insight.n}
      </p>
      <p className="flex-1 text-[24px] tracking-[-0.96px]">{insight.text}</p>
    </div>
  )
}

export default function VoiceMemos() {
  const [mapOpen, setMapOpen] = useState(false)

  useEffect(() => {
    if (!mapOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMapOpen(false)
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [mapOpen])

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
              <div className="flex w-full flex-1 flex-col justify-center gap-12 rounded-3xl bg-white px-10 py-10">
                <div className="flex items-center gap-8">
                  {/* pixel glyphs sit low in their line box; nudge up to optically centre */}
                  <div className="-translate-y-[18px]">
                    <PixelStat value="12" label="Interviewees" />
                  </div>
                  <p className="flex-1 text-[24px] tracking-[-0.96px]">
                    We asked peers who have experience using recording applications to evaluate the recording
                    experience, organization &amp; management, accessibility, &amp; personalization of Apple Voice
                    Memos.
                  </p>
                </div>
                {/* The board is far too dense to read at card width, so it opens full-screen. */}
                <button
                  type="button"
                  onClick={() => setMapOpen(true)}
                  className="group relative block w-full overflow-hidden rounded-xl"
                  aria-label="Expand the affinity map"
                >
                  <img src={affinityMapping} alt="Affinity map of interview notes" className="block w-full" />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 group-hover:bg-black/40">
                    <span className="text-[20px] tracking-[-0.8px] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      click to expand
                    </span>
                  </span>
                </button>
              </div>
            </div>
            <div className="flex w-[525px] flex-col">
              <p className="mb-[37px] text-[20px] text-gray-2 tracking-[-0.8px]">synthesis — what should be done?</p>
              <div className="flex w-full flex-1 flex-col overflow-hidden rounded-3xl bg-white">
                {insights.map((insight, i) => (
                  <InsightRow
                    key={insight.n}
                    insight={insight}
                    className={i > 0 ? 'border-t border-gray-2/20' : ''}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How might we — the framing is set in gray so the question itself carries the weight. */}
        <section className="mt-24">
          <p className="mb-[37px] text-[20px] text-gray-2 tracking-[-0.8px]">how might we</p>
          <div className="w-full rounded-3xl bg-white px-16 py-14">
            <p className="text-[32px] leading-snug tracking-[-1.28px]">
              <span className="text-gray-2">How might we</span> create visual organization methods like
              AI-generated summaries to further simplify and facilitate the usage of Voice Memos?
            </p>
          </div>
        </section>

        {/* User personas & journey mapping — one card: who he is, then where the
            current flow loses him, step by step. */}
        <section className="mt-24">
          <p className="mb-[37px] text-[20px] text-gray-2 tracking-[-0.8px]">user personas &amp; journey mapping</p>

          <div className="w-full overflow-hidden rounded-3xl bg-white">
            <div className="flex items-center gap-8 px-10 py-9">
              <img
                src={personaInformedIssac}
                alt="Illustrated portrait of the persona"
                className="size-[104px] shrink-0 rounded-2xl object-cover"
              />
              <div>
                <p className="text-[32px] leading-none tracking-[-1.28px]">Stitch</p>
                <p className="mt-3 text-[20px] text-gray-2 tracking-[-0.8px]">bandlab user · {persona.meta}</p>
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

        {/* Wireframes — one shot per stage, side by side at a shared height. */}
        <section className="mt-24">
          <div className="flex items-end justify-between">
            <div>
              <p className="mb-[37px] text-[20px] text-gray-2 tracking-[-0.8px]">low-fi</p>
              <img
                src={vmLowfi1}
                alt="Low-fidelity folder grid"
                className={`h-[560px] w-auto rounded-2xl ${CARD_SHADOW}`}
              />
            </div>

            <div>
              <p className="mb-[37px] text-[20px] text-gray-2 tracking-[-0.8px]">low-fi 2</p>
              <img
                src={vmLowfi2}
                alt="Low-fidelity folder list with filter"
                className={`h-[560px] w-auto rounded-2xl ${CARD_SHADOW}`}
              />
            </div>

            <div>
              <p className="mb-[37px] text-[20px] text-gray-2 tracking-[-0.8px]">mid-fi</p>
              <img
                src={vmMidfi}
                alt="Mid-fidelity folder list"
                className={`h-[560px] w-auto rounded-2xl ${CARD_SHADOW}`}
              />
            </div>
          </div>
        </section>

        {/* Final product — the shipping app beside the redesign, at a shared height
            so the two read as a before/after pair. */}
        <section className="mb-16 mt-24">
          <p className="mb-[37px] text-[20px] text-gray-2 tracking-[-0.8px]">final product</p>
          <div className="flex items-start justify-center gap-16">
            <div className="flex flex-col items-center">
              <img
                src={vmFinalCurrent}
                alt="Voice Memos as it ships today"
                className={`h-[620px] w-auto rounded-[20px] border-[40px] border-black ${CARD_SHADOW}`}
              />
              <p className="mt-6 text-[24px] tracking-[-0.96px]">current</p>
            </div>

            <div className="flex flex-col items-center">
              <video
                src={vmFinalRedesign}
                autoPlay
                loop
                muted
                playsInline
                className={`h-[620px] w-auto rounded-[20px] border-[40px] border-black ${CARD_SHADOW}`}
              />
              <p className="mt-6 text-[24px] tracking-[-0.96px]">redesign</p>
            </div>
          </div>
        </section>
      </div>

      {/* Portalled to <body> so the page's 66.667% zoom doesn't shrink the overlay. */}
      {mapOpen &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Affinity map"
            onClick={() => setMapOpen(false)}
            className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/80 p-8"
          >
            <img
              src={affinityMapping}
              alt="Affinity map of interview notes"
              className="max-h-full max-w-full rounded-lg object-contain"
            />
          </div>,
          document.body,
        )}
    </Layout>
  )
}
