import { motion } from "framer-motion"
import { fadeInLeft, fadeInRight, fadeInUp } from "../../../lib/motion"
import designOrnament from "../../../assets/images/About/design.png"
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

export default function JourneySection() {
  const image = useMedia("about.journey.image")
  const t = useText()
  return (
    <section className="bg-accent-cream pt-12 md:pt-16 pb-12 md:pb-16">
      {/* Section label + dotted divider */}
      <div className="px-6 md:px-10 lg:px-16 3xl:px-24 mb-10 md:mb-14">
        <div className="flex items-center gap-2 mb-2">
          <QuatrefoilMarker />
          <span className="text-[0.625rem] 3xl:text-sm font-normal tracking-[0.2em] uppercase text-secondary-terra">
            <Text k="about.journey.label" />
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
        {/* Heading + intro paragraph */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-16 mb-12 md:mb-16">
          <motion.h2
            {...fadeInUp}
            className="text-3xl md:text-4xl lg:text-[2.625rem] 3xl:text-[3.2rem] font-medium text-primary tracking-tight leading-[1.1]"
          >
            <Text k="about.journey.heading" />
          </motion.h2>

          <motion.p
            {...fadeInUp}
            className="text-base md:text-[1.0625rem] 3xl:text-xl text-primary leading-relaxed font-medium"
          >
            <Text k="about.journey.intro" />
          </motion.p>
        </div>

        {/* Photo + ornament + secondary text — photo column is wider here */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-10 lg:gap-16 items-start">
          <motion.div {...fadeInLeft}>
            <div className="overflow-hidden">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>

          <motion.div {...fadeInRight} className="flex flex-col">
            {/* Decorative flower ornament */}
            <div className="mb-32 md:mb-40">
              <img
                src={designOrnament}
                alt=""
                className="w-16 md:w-20 3xl:w-24 h-auto"
              />
            </div>

            <div className="flex flex-col gap-5 text-sm md:text-[0.875rem] 3xl:text-base text-primary leading-relaxed max-w-md 3xl:max-w-xl self-end font-medium">
              {splitParagraphs(t("about.journey.body")).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
