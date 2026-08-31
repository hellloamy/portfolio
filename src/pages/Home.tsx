import Layout from '../components/Layout'
import ProjectCard from '../components/ProjectCard'
import SpinningCd from '../components/SpinningCd'
import WinkingFace from '../components/WinkingFace'
import ClickCursor from '../components/ClickCursor'
import scrollChevron from '../assets/icons/scroll-chevron.svg'
import projectsPGlyph from '../assets/icons/projects-p-glyph.png'
import thumbXRedesign from '../assets/images/thumb-x-redesign.png'
import thumbVoiceMemos from '../assets/images/thumb-voice-memos.png'
import thumbPsiEtaMu from '../assets/images/thumb-psi-eta-mu.png'
import thumbLostFound from '../assets/images/thumb-lost-found.png'
import thumbWcsImpact from '../assets/images/thumb-wcs-impact.png'

const projects = [
  { title: 'X Redesign', meta: '2026 · app redesign', image: thumbXRedesign, to: '/projects/x-redesign' },
  { title: 'Apple Voice Memos Redesign', meta: '2025 · app redesign', image: thumbVoiceMemos, to: '/projects/voice-memos' },
  { title: 'Psi Eta Mu Website', meta: '2026 · web design', image: thumbPsiEtaMu },
  { title: 'Lost & Found', meta: '2025 · app design', image: thumbLostFound },
  { title: 'WCS Impact Map & Wrapped', meta: '2026 · web design', image: thumbWcsImpact },
]

function AnnotationBox({
  className,
  widthClass,
  children,
}: {
  className: string
  widthClass: string
  children: React.ReactNode
}) {
  return (
    <div className={`absolute ${className} ${widthClass}`}>
      <div className="relative border-[0.8px] border-gray-2 px-4 py-3">
        <span className="absolute -left-[4px] -top-[4px] size-2 border-[0.8px] border-gray-2 bg-gray-1" />
        <span className="absolute -left-[4px] -bottom-[4px] size-2 border-[0.8px] border-gray-2 bg-gray-1" />
        <span className="absolute -right-[4px] -top-[4px] size-2 border-[0.8px] border-gray-2 bg-gray-1" />
        <span className="absolute -right-[4px] -bottom-[4px] size-2 border-[0.8px] border-gray-2 bg-gray-1" />
        <p className="text-justify text-[24px] leading-normal tracking-[-0.96px]">{children}</p>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <Layout>
      <>
        {/* Hero — tight bounding box around just the wordmark cluster, centered in one viewport */}
        <div className="relative hidden min-h-[calc(150vh-90px)] items-center justify-center md:flex">
          <div className="relative -translate-y-32 h-[429px] w-[1106px] shrink-0">
            <SpinningCd className="absolute left-[120px] top-0 size-[120px]" />
            <WinkingFace className="absolute left-[858px] top-[309px] size-[120px]" />

            {/* Each row is baseline-aligned so the pixel capital and the sans letters
                share a bottom edge; the sans margin sets the gap between them. */}
            <div className="absolute left-[284px] top-[6px] flex items-baseline whitespace-nowrap">
              <span className="font-pixel text-[264px] leading-none">A</span>
              <span className="ml-0 text-[128px] leading-none tracking-[-5.12px]">my</span>
            </div>
            <div className="absolute left-[468px] top-[163px] flex items-baseline whitespace-nowrap">
              <span className="font-pixel text-[264px] leading-none">W</span>
              <span className="ml-[-40px] text-[128px] leading-none tracking-[-5.12px]">ang</span>
            </div>

            <AnnotationBox className="left-0 top-[256px]" widthClass="w-[400px]">
              currently studying <span className="font-bold">information sciences</span> @ <span className="font-bold">uiuc</span>
            </AnnotationBox>

            <AnnotationBox className="left-[686px] top-[78px]" widthClass="w-[420px]">
              <span className="font-bold">ux designer</span> passionate about using <span className="font-bold">empathy</span> to create{' '}
              <span className="font-bold">intuitive user interfaces</span>
            </AnnotationBox>

            {/* Cursor renders last so it stacks above the annotation boxes it overlaps */}
            <ClickCursor className="absolute left-[354px] top-[329px] z-10 h-[100px] w-[70px]" />
          </div>

          <img
            src={scrollChevron}
            alt=""
            className="chevron-pulse absolute bottom-[76px] left-1/2 h-5 w-[35px] -translate-x-1/2"
          />
        </div>

        {/* Projects */}
        <div className="mb-12 flex items-baseline pt-24 md:pt-0">
          <img src={projectsPGlyph} alt="" className="h-[80px] w-auto" />
          <span className="text-[80px] leading-none tracking-[-3.2px]">rojects</span>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 pb-12 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </>
    </Layout>
  )
}
