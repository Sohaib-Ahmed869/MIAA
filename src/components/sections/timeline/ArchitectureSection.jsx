import { motion } from "framer-motion"
import { fadeInLeft, fadeInRight, fadeInUp } from "../../../lib/motion"
import CTAButton from "../../ui/Button"

function QuatrefoilMarker({ size = 11 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="#C15C45"
      className="flex-shrink-0"
    >
      <circle cx="50" cy="22" r="25" />
      <circle cx="50" cy="78" r="25" />
      <circle cx="22" cy="50" r="25" />
      <circle cx="78" cy="50" r="25" />
      <rect x="22" y="22" width="56" height="56" rx="4" />
    </svg>
  )
}

export default function ArchitectureSection() {
  return (
    <section id="architecture" className="bg-accent-cream pt-16 md:pt-20 3xl:pt-28 pb-16 md:pb-24 3xl:pb-32">
      {/* Section label + dotted divider */}
      <div className="px-6 md:px-10 lg:px-16 3xl:px-24 mb-10 md:mb-12">
        <div className="flex items-center gap-2 mb-2">
          <QuatrefoilMarker />
          <span className="text-[0.625rem] 3xl:text-sm font-normal tracking-[0.2em] uppercase text-secondary-terra">
            Architectural Design
          </span>
        </div>
        <div
          className="h-[2px] w-full"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(56,113,122,0.4) 0.09375rem, transparent 0.09375rem)",
            backgroundSize: "0.5rem 0.1875rem",
          }}
        />
      </div>

      <div className="max-w-[1400px] 3xl:max-w-[3200px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.4fr] gap-10 lg:gap-16 items-start">
          {/* Left — heading + small text + download CTA */}
          <motion.div {...fadeInLeft}>
            <h2 className="text-3xl md:text-4xl lg:text-[2.25rem] 3xl:text-[3.2rem] font-medium text-primary tracking-tight leading-[1.1] mb-12 md:mb-16">
              Architecture as Art
              <br />
              and Experience
            </h2>

            <p className="text-[0.8125rem] md:text-sm 3xl:text-base text-primary leading-relaxed mb-5 max-w-xs 3xl:max-w-sm">
              MIAA officially launched the Architect Design Competition on
              18&nbsp;August&nbsp;2025. Read the MIAA Architectural Design
              Brief here.
            </p>

            <CTAButton href="/MIAA-Architecture-Brief.pdf" download>Download</CTAButton>
          </motion.div>

          {/* Right — intro paragraph + 2-col sub-grid */}
          <motion.div {...fadeInRight} className="flex flex-col gap-8">
            <p className="text-base md:text-[1.0625rem] 3xl:text-xl text-primary leading-relaxed">
              The Museum of Islamic Art Australia will be a unique
              architecturally designed space for showcasing the beauty,
              intricacy and innovation of Islamic art over the centuries. The
              museum&apos;s architecture will not only embrace Islamic design
              principles as a contemporary expression, but will also embrace
              the natural and urban landscape of the museum&apos;s location.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 text-[0.8125rem] md:text-sm 3xl:text-lg text-primary leading-relaxed">
              <p>
                The architectural design forms part of the museum&apos;s story
                and will be incorporated into the multilayered learning
                experience for visitors. In other words, the building design
                will reflect and acknowledge the significance of architecture
                in the Islamic arts. By incorporating Islamic design
                principles, it is intended that the museum structure, in of
                itself, will form part of the &apos;art&apos; of the museum.
              </p>
              <p>
                The museum galleries will be curated with multisensory
                experiences in mind. This unique experience will continue
                beyond the gallery walls to include taste, touch and scent
                &mdash; these museum offerings are delivered as part of the
                overall visitor experience through the museum gardens,
                specialty café and pantry, and the gift shop which offers
                unique Islamic inspired gifts, homewares and books.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
