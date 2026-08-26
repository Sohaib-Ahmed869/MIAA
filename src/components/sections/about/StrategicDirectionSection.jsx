import { useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { staggerContainer, staggerItem } from "../../../lib/motion"

import ic1 from "../../../assets/images/About/ic1.png"
import ic2 from "../../../assets/images/About/ic2.png"
import ic4 from "../../../assets/images/About/ic4.png"
import ix3 from "../../../assets/images/About/ix3.png"
import ic5 from "../../../assets/images/About/ic5.png"
import Text from "../../../content/Text"

// Icons stay in code (assets); the card copy is editable content, keyed here.
const PILLARS = [
  { icon: ic1, key: "about.strategic.pillar1" },
  { icon: ic2, key: "about.strategic.pillar2" },
  { icon: ix3, key: "about.strategic.pillar3" },
  { icon: ic4, key: "about.strategic.pillar4" },
  { icon: ic5, key: "about.strategic.pillar5" },
]

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

export default function StrategicDirectionSection() {
  const containerRef = useRef(null)
  const scrollerRef = useRef(null)

  // Cursor-inside horizontal scroll: capture wheel, scroll cards horizontally,
  // pause vertical page scroll until cursor leaves OR scroller hits an edge.
  useEffect(() => {
    const container = containerRef.current
    const scroller = scrollerRef.current
    if (!container || !scroller) return

    const onWheel = (e) => {
      const dy = e.deltaY
      if (!dy) return

      const atStart = scroller.scrollLeft <= 0
      const atEnd =
        scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 1

      // If scrolling up at the start, or down at the end, let the page scroll
      if ((atStart && dy < 0) || (atEnd && dy > 0)) return

      e.preventDefault()
      scroller.scrollLeft += dy
    }

    container.addEventListener("wheel", onWheel, { passive: false })
    return () => container.removeEventListener("wheel", onWheel)
  }, [])

  return (
    <section className="bg-bg-deep pt-12 md:pt-16 pb-12 md:pb-16">
      {/* Section label + dotted divider */}
      <div className="px-6 md:px-10 lg:px-16 3xl:px-24 mb-10 md:mb-14">
        <div className="flex items-center gap-2 mb-2">
          <QuatrefoilMarker />
          <span className="text-[0.625rem] 3xl:text-sm font-normal tracking-[0.2em] uppercase text-accent-wheat">
            <Text k="about.strategic.label" />
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
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl lg:text-[2.625rem] 3xl:text-[3.2rem] font-medium text-accent-cream tracking-tight leading-[1.1] mb-12 md:mb-14 text-center"
        >
          <Text k="about.strategic.heading" />
        </motion.h2>
      </div>

      {/* Cards — captures wheel for horizontal scroll while cursor is inside */}
      <div ref={containerRef}>
        <motion.div
          ref={scrollerRef}
          {...staggerContainer}
          className="flex gap-5 overflow-x-auto scroll-smooth no-scrollbar px-6 md:px-10 lg:px-16 3xl:px-24 pb-2 justify-center flex-wrap xl:flex-nowrap"
          style={{ scrollbarWidth: "none" }}
        >
          {/* Five equal columns only from xl (1280) up. Between 1024 and 1279
              that split leaves ~165px per card and the copy breaks to one or
              two words a line, so the cards keep a fixed 17.5rem width and
              wrap 3 + 2 instead. */}
          {PILLARS.map((pillar) => (
            <motion.div
              key={pillar.key}
              {...staggerItem}
              className="bg-bg-teal/25 border border-accent-wheat/15 p-6 3xl:p-8 flex flex-col gap-4 flex-shrink-0 w-[260px] md:w-[18.75rem] lg:w-[17.5rem] xl:w-0 xl:flex-1 hover:bg-bg-teal/40 transition-colors duration-300"
            >
              <img src={pillar.icon} alt="" className="w-10 h-10 3xl:w-14 3xl:h-14 object-contain" />
              <p className="text-accent-cream/75 text-[0.8125rem] 3xl:text-base leading-relaxed">
                <Text k={pillar.key} />
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
