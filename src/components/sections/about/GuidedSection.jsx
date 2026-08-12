import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus } from "lucide-react"
import { fadeInLeft, fadeInRight } from "../../../lib/motion"
import Text from "../../../content/Text"
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

export default function GuidedSection() {
  const image = useMedia("about.guided.image")
  const [openIndex, setOpenIndex] = useState(0)
  const t = useText()
  const ITEMS = [
    { title: t("about.guided.mission.title"), body: t("about.guided.mission.body") },
    { title: t("about.guided.vision.title"), body: t("about.guided.vision.body") },
  ]

  return (
    <section className="bg-bg-deep pt-12 md:pt-16 pb-12 md:pb-16">
      {/* Section label + dotted divider */}
      <div className="px-6 md:px-10 lg:px-16 3xl:px-24 mb-8 md:mb-10">
        <div className="flex items-center gap-2 mb-2">
          <QuatrefoilMarker />
          <span className="text-[0.625rem] 3xl:text-sm font-normal tracking-[0.2em] uppercase text-accent-wheat">
            <Text k="about.guided.label" />
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
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-16 items-start">
          {/* Left — heading + accordion */}
          <motion.div {...fadeInLeft}>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] 3xl:text-[3.2rem] font-medium text-accent-cream tracking-tight leading-[1.1] mb-10 md:mb-12">
              <Text k="about.guided.heading" />
            </h2>

            <div className="flex flex-col">
              {ITEMS.map((item, i) => (
                <div
                  key={i}
                  className="border-b border-accent-wheat/20 last:border-b-0"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                    className="w-full flex items-center gap-3 py-5 text-left group"
                  >
                    <span className="w-6 h-6 rounded-full border border-accent-wheat/60 flex items-center justify-center flex-shrink-0 group-hover:border-accent-wheat transition-colors">
                      {openIndex === i ? (
                        <Minus className="w-3 h-3 text-accent-wheat" />
                      ) : (
                        <Plus className="w-3 h-3 text-accent-wheat" />
                      )}
                    </span>
                    <span
                      className={`text-lg md:text-xl 3xl:text-2xl font-medium transition-colors ${
                        openIndex === i
                          ? "text-accent-cream"
                          : "text-accent-cream/65"
                      }`}
                    >
                      {item.title}
                    </span>
                  </button>
                  <AnimatePresence>
                    {openIndex === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="pl-9 pb-5 text-sm md:text-[0.9375rem] 3xl:text-lg text-accent-cream/85 leading-relaxed max-w-xl 3xl:max-w-2xl">
                          {item.body}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — photo */}
          <motion.div {...fadeInRight}>
            <div className="overflow-hidden">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
