import { motion } from "framer-motion"
import { fadeInLeft, fadeInRight } from "../../../lib/motion"
import float1 from "../../../assets/images/About/float1.png"
import Text from "../../../content/Text"
import { splitParagraphs } from "../../../content/format"
import { useText, useMedia } from "../../../content/context"

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

export default function CommunityCultureSection() {
  const image1 = useMedia("community.culture.image1")
  const image2 = useMedia("community.culture.image2")
  const t = useText()
  return (
    <section className="relative bg-bg py-12 md:py-16 overflow-hidden">
      {/* Section label + dotted divider */}
      <div className="px-6 md:px-10 lg:px-16 3xl:px-24 mb-8 md:mb-10">
        <div className="flex items-center gap-2 mb-2">
          <QuatrefoilMarker />
          <span className="text-[0.625rem] 3xl:text-sm font-normal tracking-[0.2em] uppercase text-secondary-terra">
            <Text k="community.culture.label" />
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
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-16 items-start">
          {/* Left — heading + intro + 2-col paragraphs + full-width paragraph */}
          <motion.div {...fadeInLeft}>
            <h2 className="text-3xl md:text-4xl lg:text-[2.625rem] 3xl:text-[3.2rem] font-medium text-primary tracking-tight leading-tight mb-5">
              <Text k="community.culture.heading" />
            </h2>

            <p className="text-base md:text-[1.0625rem] 3xl:text-xl text-primary leading-relaxed mb-10 max-w-2xl 3xl:max-w-3xl">
              <Text k="community.culture.intro" />
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 text-[0.8125rem] md:text-sm 3xl:text-base text-primary leading-relaxed mb-8">
              {splitParagraphs(t("community.culture.body")).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <p className="text-[0.8125rem] md:text-sm 3xl:text-base text-primary leading-relaxed max-w-3xl">
              <Text k="community.culture.body2" />
            </p>
          </motion.div>

          {/* Right — overlapped photos with white border on photo 2 + float1 at bottom-right */}
          <motion.div {...fadeInRight} className="relative">
            {/* Top photo */}
            <div className="overflow-hidden rounded-sm">
              <img
                src={image1.src}
                alt={image1.alt}
                className="w-full h-auto object-cover block"
              />
            </div>

            {/* Bottom photo — overlapping the first, with thick white border + shadow */}
            <div className="relative z-10 w-[80%] ml-auto -mt-12 md:-mt-20 lg:-mt-28 bg-white p-2 md:p-3 ">
              <img
                src={image2.src}
                alt={image2.alt}
                className="w-full h-auto object-cover block"
              />
            </div>

            {/* float1 — bottom-right corner of this column, partly off-edge */}
            <div className="hero-float pointer-events-none absolute -bottom-8 md:-bottom-10 lg:-bottom-12 -right-6 md:-right-10 lg:-right-14 w-20 md:w-28 lg:w-36 3xl:w-44 z-20">
              <img src={float1} alt="" className="w-full h-auto drop-shadow-2xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
