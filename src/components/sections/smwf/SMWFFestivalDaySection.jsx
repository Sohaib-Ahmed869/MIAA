import { motion } from "framer-motion"
import { useMemo } from "react"
import { useMediaResolver } from "../../../content/context"
import { fadeInLeft } from "../../../lib/motion"
import Text from "../../../content/Text"

import iconCalendar from "../../../assets/images/Homepage/SMWF/icon-calendar.svg"
import iconClock from "../../../assets/images/Homepage/SMWF/icon-clock.svg"
import iconLocation from "../../../assets/images/Homepage/SMWF/icon-location.svg"
import patternKufic from "../../../assets/images/Homepage/SMWF/pattern-kufic.png"

const DETAILS = [
  { label: "18th April 2026",                       icon: iconCalendar },
  { label: "9:30am – 5:30pm",                       icon: iconClock },
  {
    label: "Bryan Brown Theatre & Function\nCentre",
    icon: iconLocation,
    underline: true,
    map: "Bryan Brown Theatre & Function Centre, 80 Rickard Rd, Bankstown NSW 2200",
  },
]

// Teaser for the Past Festivals gallery — same three files, same keys.
const BASE_KEYS = ["smwf.past.image1", "smwf.past.image4", "smwf.past.image7"]


function Quatrefoil({ color = "#FFFFFF", className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="50" cy="22" r="25" fill={color} />
      <circle cx="50" cy="78" r="25" fill={color} />
      <circle cx="22" cy="50" r="25" fill={color} />
      <circle cx="78" cy="50" r="25" fill={color} />
      <rect x="22" y="22" width="56" height="56" rx="4" fill={color} />
    </svg>
  )
}

function DiagonalRibbon({
  text,
  bg,
  color = "#FFFFFF",
  rotate,
  bottom,
  right,
  top,
  width,
  duration = 30,
  reverse = false,
  transformOrigin = "right center",
}) {
  return (
    <div
      className="absolute py-3 md:py-4 3xl:py-6 pointer-events-none z-20 overflow-hidden"
      style={{
        bottom, right, top, width,
        backgroundColor: bg,
        transform: `rotate(${rotate}deg)`,
        transformOrigin,
      }}
    >
      <div
        className="flex smwf-banner-top w-max"
        style={{
          animationDuration: `${duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {[0, 1].map((set) => (
          <div key={set} className="flex items-center shrink-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-4 md:gap-6 3xl:gap-9 px-3 md:px-5 3xl:px-7 font-aeonik font-semibold text-base md:text-lg 3xl:text-2xl tracking-tight whitespace-nowrap shrink-0"
                style={{ color }}
              >
                {text}
                <Quatrefoil color={color} className="w-3.5 h-3.5 md:w-4 md:h-4 3xl:w-6 3xl:h-6" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function VerticalMarquee({ images, duration = 30 }) {
  return (
    <div className="relative overflow-hidden h-[340px] md:h-[400px] lg:h-[460px] 3xl:h-[600px]">
      <motion.div
        className="flex flex-col gap-5 md:gap-6 3xl:gap-9"
        animate={{ y: ["-50%", "0%"] }}
        transition={{ duration, ease: "linear", repeat: Infinity }}
      >
        {images.map((img, i) => (
          <div key={i} className="flex-shrink-0 aspect-[5/3] overflow-hidden">
            <img
              src={img}
              alt=""
              aria-hidden="true"
              className="block w-full h-full object-cover"
            />
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default function SMWFFestivalDaySection() {
  const media = useMediaResolver()
  const MARQUEE_IMAGES = useMemo(() => {
    const base = BASE_KEYS.map(media)
    return [...base, ...base]
  }, [media])
  return (
    <section
      id="smwf-festival-day"
      className="relative overflow-hidden"
      style={{ backgroundColor: "#124039" }}
    >
      {/* Kufic pattern — only behind the left info column; the carousel and
          the ribbon banner area on the right stay plain dark green via a
          horizontal mask that cuts off before the carousel. */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen"
        style={{
          backgroundImage: `url(${patternKufic})`,
          backgroundSize: "auto 720px",
          backgroundRepeat: "repeat",
          backgroundPosition: "-800px center",
          maskImage: "linear-gradient(to right, #000 0%, #000 35%, transparent 40%)",
          WebkitMaskImage: "linear-gradient(to right, #000 0%, #000 35%, transparent 40%)",
        }}
      />

      <div className="relative z-10 max-w-[1500px] 3xl:max-w-[2000px] mx-auto px-6 md:px-10 lg:px-14 3xl:px-20 py-10 md:py-12 lg:py-14 3xl:py-20">
        {/*
          THREE-COLUMN LAYOUT on lg+:
            [ info (1fr) | carousel (fixed) | ribbon canvas (1fr) ]
          The carousel column uses an EXPLICIT pixel width on the grid
          template itself, not on the wrapper inside. That's the safest way
          to guarantee its width — the grid honors it before anything
          downstream can squeeze or stretch it.
        */}
        <div
          className="
            grid grid-cols-1 gap-12
            lg:grid-cols-[1fr_460px_minmax(280px,1fr)] lg:gap-10
            3xl:grid-cols-[1fr_620px_minmax(380px,1fr)] 3xl:gap-16
            items-center
          "
        >
          {/* COLUMN 1 — Festival Day info */}
          <motion.div {...fadeInLeft}>
            <h2 className="font-aeonik text-white text-4xl md:text-5xl lg:text-6xl 3xl:text-[5rem] font-medium tracking-tight mb-10 md:mb-14 3xl:mb-20">
              <Text k="smwf.festival.heading" />
            </h2>

            <ul className="space-y-6 md:space-y-7 3xl:space-y-10 mb-10 md:mb-12 3xl:mb-16">
              {DETAILS.map((d) => (
                <li key={d.label} className="flex items-start gap-4 md:gap-5">
                  <img
                    src={d.icon}
                    alt=""
                    aria-hidden="true"
                    className="w-5 h-5 md:w-6 md:h-6 3xl:w-9 3xl:h-9 mt-1 flex-shrink-0"
                  />
                  {d.map ? (
                    <div className="relative group">
                      <span className="font-barlow text-white text-base md:text-lg 3xl:text-2xl underline underline-offset-4 decoration-1 cursor-pointer whitespace-pre-line">
                        {d.label}
                      </span>
                      {/* Google Maps preview — revealed on hover, opens upward
                          so it isn't clipped by the section's overflow-hidden. */}
                      <div className="absolute left-0 bottom-full mb-3 z-50 w-[300px] md:w-[360px] 3xl:w-[440px] opacity-0 invisible translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
                        <div className="overflow-hidden rounded-lg shadow-2xl ring-1 ring-black/10 bg-white">
                          <iframe
                            title={`Map — ${d.label}`}
                            src={`https://www.google.com/maps?q=${encodeURIComponent(d.map)}&output=embed`}
                            className="block w-full h-[220px] md:h-[260px] 3xl:h-[320px] border-0"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <span
                      className={`font-barlow text-white text-base md:text-lg 3xl:text-2xl ${
                        d.underline ? "underline underline-offset-4 decoration-1" : ""
                      }`}
                    >
                      {d.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>

            <motion.a
              href="https://www.miaaustralia.org/smwf"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="inline-flex items-center gap-2 px-7 md:px-8 3xl:px-12 py-3.5 md:py-4 3xl:py-6 font-aeonik text-xs md:text-sm 3xl:text-lg font-semibold tracking-[0.18em] uppercase rounded-none"
              style={{ backgroundColor: "#CBCE58", color: "#124039" }}
            >
              Download Full Programme
            </motion.a>
          </motion.div>

          {/* COLUMN 2 — Carousel.
              The wrapper just fills its column; the column itself enforces
              the 460/620 width above. On mobile, the column doesn't exist
              (1-col stack), so we cap and center the carousel manually. */}
          <div className="w-full max-w-[440px] mx-auto lg:max-w-none lg:mx-0">
            <VerticalMarquee images={MARQUEE_IMAGES} duration={30} />
          </div>

          {/* COLUMN 3 — empty spacer so the grid keeps its 3-column shape */}
          <div className="hidden lg:block" />
        </div>
      </div>

      {/* Diagonal scrolling ribbons that meet edge-to-edge at the right
          edge (vertically centered), forming a V opening leftward. */}
      <div className="hidden lg:block">
        <DiagonalRibbon
          text="Festival Day"
          bg="#4656CD"
          color="#FFFFFF"
          rotate={-30}
          bottom="50%"
          right="-48px"
          width="1100px"
          duration={40}
          reverse
          transformOrigin="right bottom"
        />
        <DiagonalRibbon
          text="18 April 2026"
          bg="#C15C45"
          color="#FFFFFF"
          rotate={30}
          top="50%"
          right="-48px"
          width="1100px"
          duration={40}
          reverse
          transformOrigin="right top"
        />
      </div>

      {/* Mobile-only ribbon */}
      <div className="lg:hidden">
        <DiagonalRibbon
          text="18 April 2026"
          bg="#C15C45"
          color="#FFFFFF"
          rotate={-25}
          bottom="-30px"
          right="-100px"
          width="900px"
        />
      </div>
    </section>
  )
}