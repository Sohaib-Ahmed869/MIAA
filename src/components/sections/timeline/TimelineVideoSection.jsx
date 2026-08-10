import { motion } from "framer-motion"
import { fadeInUp } from "../../../lib/motion"
import Text from "../../../content/Text"

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

export default function TimelineVideoSection() {
  return (
    <section className="bg-bg-deep pt-16 md:pt-20 3xl:pt-28 pb-8 md:pb-12 3xl:pb-16">
      <div className="px-6 md:px-10 lg:px-16 3xl:px-24 mb-10 md:mb-12">
        <div className="flex items-center gap-2 mb-2">
          <QuatrefoilMarker />
          <span className="text-[0.625rem] 3xl:text-sm font-normal tracking-[0.2em] uppercase text-secondary-terra">
            <Text k="timeline.video.label" />
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

      <div className="max-w-[1400px] 3xl:max-w-[3200px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24">
        <motion.div
          {...fadeInUp}
          className="relative w-full aspect-video overflow-hidden rounded-sm border border-white/10 shadow-2xl"
        >
          <iframe
            src="https://www.youtube.com/embed/Wkqt0JoStac?rel=0"
            title="MIAA Project Video"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </motion.div>
      </div>
    </section>
  )
}
