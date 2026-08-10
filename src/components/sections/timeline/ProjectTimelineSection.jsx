import { useState, useMemo, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { fadeInUp } from "../../../lib/motion"
import CTAButton from "../../ui/Button"
import dotMark from "../../../assets/images/Timeline/dot.png"
import Text from "../../../content/Text"
import { useText } from "../../../content/context"

const TIMELINE_DATA = {
  2022: [
    {
      date: "30 JUL 2022",
      body: "Submitted grant application for the WestInvest Program",
    },
  ],
  2023: [
    {
      date: "19 JAN 2023",
      body: "Received confirmation of successful grant application",
    },
    {
      date: "1 AUG 2023",
      body: "Confirmation of Museum relocation from Blacktown to either Cumberland or Parramatta local government area",
    },
    {
      date: "30 NOV 2023",
      body: "Signed the funding deed with the NSW Government",
    },
  ],
  2024: [
    {
      date: "18 JAN 2024",
      body: "SRA Board resolved to proceed with leasing the Oriole Park Auburn site and formally wrote to Cumberland Council",
    },
    {
      date: "22 JUN 2024",
      body: "Submitted Expression of Interest to the formal EOI process for the Oriole Park Auburn site",
    },
    {
      date: "15 JUL 2024",
      body: "Commenced community consultation with a combined national meeting of ISRA board, staff, members, and volunteers",
    },
    {
      date: "25 JUL 2024",
      body: "Appointed RP Infrastructure as project manager for the museum construction",
    },
    {
      date: "28 JUL 2024",
      body: "Appointed Dr Nur Shkembi as Artistic Director and Curator",
    },
    {
      date: "5 SEPT 2024",
      body: "Dr Eeqbal Hassim, Education Specialist formerly begins consultation for MIAA's museum education plan",
    },
    {
      date: "27 SEPT 2024",
      body: "EOI for MIAA Logo and Branding opens",
    },
    {
      date: "1 OCT 2024",
      body: "Confirmed name change from Sydney Islamic Arts Museum Project to Museum of Islamic Art Australia (MIAA), following internal ISRA consultation",
    },
    {
      date: "9 OCT 2024",
      body: "Functional Diagram for MIAA Architectural Design: Version 1 full draft complete",
    },
    {
      date: "31 OCT 2024",
      body: "MIAA Logo and Branding EOI closes",
    },
    {
      date: "11 DEC 2024",
      body: "Cumberland Council resolved to enter negotiations with ISRA for the Oriole Park Auburn site",
    },
  ],
  2025: [
    {
      date: "29 JAN 2025",
      body: "MIAA Logo and Branding shortlisted candidate interviews",
    },
    {
      date: "13 FEB 2025",
      body: "Negotiation process with Cumberland Council for Oriole Park Auburn site commences",
    },
    {
      date: "20 FEB 2025",
      body: "Functional Diagram for MIAA Architectural Design: Final Version complete",
    },
    {
      date: "1 MARCH 2025",
      body: "Powerhouse Museum x ISRA/MIAA Ramadan Event at Sydney Observatory",
    },
    {
      date: "9 APRIL 2025",
      body: "MIAA Education Pedagogical Design brief – Phases 1 and 2 full drafts completed",
    },
    {
      date: "29 APR 2025",
      body: "Cumberland Council did not pass the final resolution for the Oriole Park Auburn site",
    },
    {
      date: "27 JUN 2025",
      body: "Purchased new museum property for $8,800,000",
    },
    {
      date: "18 AUG 2025",
      body: "Finalised and released MIAA Architectural Design Brief for the architectural competition",
    },
    {
      date: "10 SEP 2025",
      body: "Land settlement for the new museum site completed",
    },
    {
      date: "26 OCT 2025",
      body: "MIAA public event held at Novotel Sydney Parramatta: land acquisition announcement and location reveal; official launch of the Museum's new Branding and Logo",
    },
    {
      date: "DEC 2025",
      body: "Finalise the MIAA Architectural Design competition and select the winning concept design",
    },
  ],
  2026: [
    {
      date: "JUN 2026",
      body: "Winning Architectural teams to complete detailed architectural design and documentation in consultation with RPI and MIAA; submit development application to council",
    },
    {
      date: "JUL 2026",
      body: "Host the inaugural Museum of Islamic Art Annual Gala Dinner",
    },
  ],
}

const YEARS = [
  { label: "2022", value: 2022 },
  { label: "2023", value: 2023 },
  { label: "2024", value: 2024 },
  { label: "2025", value: 2025 },
  { label: "2026, This Year", value: 2026 },
]

const COLS_PER_ROW = 4
const TERRA = "#C15C45"
const WHEAT_LINE = "rgba(215,184,147,0.85)"

function QuatrefoilMarker({ size = 11 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill={TERRA}
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

function chunk(arr, size) {
  const out = []
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size))
  }
  return out
}

function SnakeConnector({ isEvenRow }) {
  const ref = useRef(null)
  const [h, setH] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    setH(el.offsetHeight)
    const ro = new ResizeObserver(() => setH(el.offsetHeight))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const W = 30
  const R = 18
  const S = 1.5 // half stroke width
  const r = R - S

  let d = ""
  if (h > 0) {
    d = isEvenRow
      ? `M 0,${S} H ${W - R} A ${r},${r} 0 0 1 ${W - S},${R} V ${h - R} A ${r},${r} 0 0 1 ${W - R},${h - S} H 0`
      : `M ${W},${S} H ${R} A ${r},${r} 0 0 0 ${S},${R} V ${h - R} A ${r},${r} 0 0 0 ${R},${h - S} H ${W}`
  }

  return (
    <div
      ref={ref}
      className="absolute pointer-events-none"
      style={{
        top: 6,
        bottom: -9,
        [isEvenRow ? "right" : "left"]: -30,
        width: W,
      }}
    >
      {h > 0 && (
        <svg width={W} height={h} className="block overflow-visible" fill="none">
          <path d={d} stroke={WHEAT_LINE} strokeWidth="3" strokeLinecap="round" />
        </svg>
      )}
    </div>
  )
}

export default function ProjectTimelineSection() {
  const [active, setActive] = useState(2025)
  const t = useText()

  const rows = useMemo(() => chunk(TIMELINE_DATA[active] || [], COLS_PER_ROW), [active])

  return (
    <section className="bg-bg-deep pt-16 md:pt-20 3xl:pt-28 pb-16 md:pb-24 3xl:pb-32">
      {/* Section label + dotted divider */}
      <div className="px-6 md:px-10 lg:px-16 3xl:px-24 mb-10 md:mb-14">
        <div className="flex items-center gap-2 mb-2">
          <QuatrefoilMarker />
          <span className="text-[0.625rem] 3xl:text-sm font-normal tracking-[0.2em] uppercase text-secondary-terra">
            <Text k="timeline.project.label" />
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
        {/* Title */}
        <motion.h2
          {...fadeInUp}
          className="text-3xl md:text-4xl lg:text-[2.625rem] 3xl:text-[3.2rem] font-medium text-accent-cream tracking-tight leading-[1.1] text-center mb-8"
        >
          <Text k="timeline.project.heading" />
        </motion.h2>

        {/* Year tabs — pill (horizontally scrollable on mobile if it overflows) */}
        <motion.div
          {...fadeInUp}
          className="mb-14 md:mb-16 -mx-6 md:mx-0 px-6 md:px-0 overflow-x-auto md:overflow-visible md:flex md:justify-center"
        >
          <div className="inline-flex items-center bg-bg-teal/25 rounded-full p-1 gap-1 flex-nowrap whitespace-nowrap">
            {YEARS.map((y) => {
              const isActive = active === y.value
              return (
                <button
                  key={y.value}
                  onClick={() => setActive(y.value)}
                  className={`px-3 sm:px-4 md:px-5 3xl:px-6 py-2 3xl:py-2.5 rounded-full text-[0.6875rem] sm:text-xs md:text-sm 3xl:text-base transition-colors whitespace-nowrap flex-shrink-0 ${
                    isActive
                      ? "bg-accent-wheat text-primary font-medium"
                      : "text-accent-cream/70 hover:text-accent-cream"
                  }`}
                >
                  {y.label}
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Mobile timeline — single vertical column with a left-side solid line */}
        <motion.div
          {...fadeInUp}
          className="md:hidden relative pl-6"
        >
          {/* Vertical solid spine */}
          <div
            className="absolute top-2 bottom-2 left-[7px] w-[3px] pointer-events-none rounded-full"
            style={{ background: WHEAT_LINE }}
          />
          <ul className="flex flex-col gap-8">
            {(TIMELINE_DATA[active] || []).map((m, i) => (
              <li key={i} className="relative">
                {/* Diamond dot anchored on the spine */}
                <img
                  src={dotMark}
                  alt=""
                  className="absolute -left-[22px] top-[2px] pointer-events-none"
                  style={{ width: "12px", height: "12px", display: "block" }}
                />
                <p
                  className="text-[0.75rem] tracking-[0.1em] uppercase mb-2 font-semibold"
                  style={{ color: "#D7B893" }}
                >
                  {m.date}
                </p>
                <p className="text-[0.8125rem] text-accent-cream/90 leading-relaxed">
                  {m.body}
                </p>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Desktop timeline — snake grid (md+) */}
        <motion.div {...fadeInUp} className="hidden md:block relative">
          {rows.map((row, rowIdx) => {
            const isLastRow = rowIdx === rows.length - 1
            const isEvenRow = rowIdx % 2 === 0
            const isFirstRow = rowIdx === 0
            // Right-side curve after even rows (0, 2…), left-side curve after odd rows (1, 3…)
            // A row has an outgoing snake on the right when even (not last), on the left when odd (not last).
            // The incoming snake side is whatever the previous row's outgoing side was.
            const hasOutgoingRight = !isLastRow && isEvenRow
            const hasOutgoingLeft = !isLastRow && !isEvenRow
            // Previous row outgoing side determines this row's incoming side
            const prevEven = (rowIdx - 1) % 2 === 0
            const hasIncomingRight = !isFirstRow && prevEven
            const hasIncomingLeft = !isFirstRow && !prevEven
            const needsDashedLeft = !hasOutgoingLeft && !hasIncomingLeft
            const needsDashedRight = !hasOutgoingRight && !hasIncomingRight
            return (
              <div key={rowIdx} className="relative pb-16 md:pb-20 last:pb-0">
                {/* Horizontal solid line spanning the row */}
                <div
                  className="absolute top-[6px] left-0 right-0 h-[3px] pointer-events-none rounded-full"
                  style={{ background: WHEAT_LINE }}
                />
                {/* Dashed extension off the left of the row */}
                {needsDashedLeft && (
                  <div
                    className="absolute top-[6px] h-[3px] pointer-events-none"
                    style={{
                      right: "calc(100% + 2px)",
                      width: "30vw",
                      maxWidth: "260px",
                      backgroundImage: `linear-gradient(to right, ${WHEAT_LINE} 50%, transparent 0%)`,
                      backgroundSize: "10px 2px",
                      backgroundRepeat: "repeat-x",
                    }}
                  />
                )}
                {/* Dashed extension off the right of the row */}
                {needsDashedRight && (
                  <div
                    className="absolute top-[6px] h-[3px] pointer-events-none"
                    style={{
                      left: "calc(100% + 2px)",
                      width: "30vw",
                      maxWidth: "260px",
                      backgroundImage: `linear-gradient(to right, ${WHEAT_LINE} 50%, transparent 0%)`,
                      backgroundSize: "10px 2px",
                      backgroundRepeat: "repeat-x",
                    }}
                  />
                )}

                {/* Grid of milestones (max 4 per row) */}
                <div
                  className="grid gap-x-6 md:gap-x-8"
                  style={{
                    gridTemplateColumns: `repeat(${COLS_PER_ROW}, minmax(0, 1fr))`,
                  }}
                >
                  {row.map((m, colIdx) => (
                    <div key={colIdx} className="relative pt-12 md:pt-14">
                      {/* Diamond dot on the horizontal line — centered on the line, with a
                          small bg-coloured pad on each side so the line doesn't run through it */}
                      <span
                        className="absolute inline-flex items-center justify-center bg-bg-deep pointer-events-none"
                        style={{
                          top: "1px",
                          left: "-7px",
                          width: "26px",
                          height: "13px",
                        }}
                      >
                        <img
                          src={dotMark}
                          alt=""
                          style={{ width: "12px", height: "12px", display: "block" }}
                        />
                      </span>
                      {/* Vertical dashed drop-line */}
                      <span
                        className="absolute top-[14px] left-[5px] w-[3px] h-7 md:h-9 pointer-events-none"
                        style={{
                          backgroundImage: `linear-gradient(to bottom, ${WHEAT_LINE} 50%, transparent 0%)`,
                          backgroundSize: "3px 7px",
                          backgroundRepeat: "repeat-y",
                        }}
                      />
                      {/* Date */}
                      <p
                        className="text-[0.75rem] md:text-[0.8125rem] 3xl:text-sm tracking-[0.1em] uppercase mb-3 font-semibold"
                        style={{ color: "#D7B893" }}
                      >
                        {m.date}
                      </p>
                      {/* Body */}
                      <p className="text-[0.8125rem] md:text-sm 3xl:text-base text-accent-cream/90 leading-relaxed max-w-[14.375rem] 3xl:max-w-[16rem]">
                        {m.body}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Snake connector — single SVG path, no seam gaps */}
                {!isLastRow && <SnakeConnector isEvenRow={isEvenRow} />}
              </div>
            )
          })}
        </motion.div>

        {/* CTA */}
        <motion.div {...fadeInUp} className="flex justify-center mt-12 md:mt-16">
          <CTAButton href="https://www.youtube.com/@MuseumofIslamicArtAustralia" target="_blank" rel="noreferrer noopener" className="px-6 py-3">{t("timeline.project.cta")}</CTAButton>
        </motion.div>
      </div>
    </section>
  )
}
