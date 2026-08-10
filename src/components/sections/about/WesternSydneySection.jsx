import { motion } from "framer-motion"
import { fadeInLeft, fadeInRight } from "../../../lib/motion"
import sydneyMap from "../../../assets/images/About/sydney.png"
import sydneyMapWithout from "../../../assets/images/About/sydney_without.png"
import Text from "../../../content/Text"
import { splitParagraphs } from "../../../content/format"
import { useText } from "../../../content/context"

// The "without" map shows first; then the full map (with the extra state)
// slowly fades in on top when the section scrolls into view.
function MapCrossfade({ className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <img
        src={sydneyMapWithout}
        alt="Map silhouette of Western Sydney"
        className="w-full h-auto object-contain"
      />
      <motion.img
        src={sydneyMap}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-contain"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 2.2, ease: "easeInOut", delay: 0.4 }}
      />
    </div>
  )
}

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

export default function WesternSydneySection() {
  const t = useText()
  return (
    <section className="relative bg-bg-deep pt-12 md:pt-16 pb-12 md:pb-16 overflow-hidden">
      {/* Section label + dotted divider */}
      <div className="relative z-10 px-6 md:px-10 lg:px-16 3xl:px-24 mb-10 md:mb-14">
        <div className="flex items-center gap-2 mb-2">
          <QuatrefoilMarker />
          <span className="text-[0.625rem] 3xl:text-sm font-normal tracking-[0.2em] uppercase text-accent-wheat">
            <Text k="about.western.label" />
          </span>
        </div>
        <div
          className="h-[2px] w-full"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(215,184,147,0.4) 0.09375rem, transparent 0.09375rem)",
            backgroundSize: "0.5rem 0.1875rem",
          }}
        />
      </div>

      <div className="relative max-w-[1400px] 3xl:max-w-[3200px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24">
        {/* Map — absolute, left, large, slight overlap into content */}
        <motion.div
          {...fadeInLeft}
          className="hidden lg:flex absolute left-0 top-0 bottom-0 w-[55%] items-center justify-start pointer-events-none"
        >
          <MapCrossfade className="w-full -ml-[3%]" />
        </motion.div>

        {/* Mobile/tablet — map above content, normal flow */}
        <div className="lg:hidden mb-8 flex justify-center">
          <MapCrossfade className="w-full max-w-sm" />
        </div>

        {/* Right content — pushed right on lg so map overlaps slightly */}
        <motion.div {...fadeInRight} className="relative z-10 lg:ml-[48%]">
          <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] 3xl:text-[3.2rem] font-medium text-accent-cream tracking-tight leading-[1.1] mb-5">
            <Text k="about.western.heading" />
          </h2>

          <p className="text-base md:text-[1.0625rem] 3xl:text-xl text-accent-wheat leading-snug mb-6 font-medium">
            <Text k="about.western.subheading" />
          </p>

          <p className="text-[0.9375rem] md:text-base 3xl:text-lg text-accent-cream font-semibold leading-relaxed mb-10 max-w-2xl">
            <Text k="about.western.acknowledgement" />
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 text-sm md:text-[0.875rem] 3xl:text-base text-accent-cream/85 leading-relaxed">
            {splitParagraphs(t("about.western.body")).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
