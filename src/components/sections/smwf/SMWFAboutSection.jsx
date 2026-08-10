import { motion } from "framer-motion"
import { fadeInUp, fadeInLeft, fadeInRight } from "../../../lib/motion"
import { ArrowUpRight } from "lucide-react"
import Text from "../../../content/Text"


import visionPhoto from "../../../assets/images/Homepage/SMWF/vision-photo.jpg"

const INNER_MARQUEE_WORDS = ["Our Words", "Our Story"]

// Same quatrefoil shape used in SMWFTurquoiseMarquee — 4 circles + a centre
// square form the kufic-style mark. Colour is parameterised so the same
// component can be reused across sections.
function Quatrefoil({ color = "#124039", className = "w-5 h-5", style }) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden="true">
      <circle cx="50" cy="22" r="25" fill={color} />
      <circle cx="50" cy="78" r="25" fill={color} />
      <circle cx="22" cy="50" r="25" fill={color} />
      <circle cx="78" cy="50" r="25" fill={color} />
      <rect x="22" y="22" width="56" height="56" rx="4" fill={color} />
    </svg>
  )
}

function InnerMarqueeRow() {
  return (
    <div className="flex items-center shrink-0">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 md:gap-6 2xl:gap-8 3xl:gap-10 px-2 md:px-3 2xl:px-4 3xl:px-5 shrink-0">
          <span
            className="font-aeonik font-medium text-sm md:text-base 2xl:text-lg 3xl:text-xl whitespace-nowrap"
            style={{ color: "#124039" }}
          >
            {INNER_MARQUEE_WORDS[i % 2]}
          </span>
          <Quatrefoil
            color="#124039"
            className="w-[19px] h-[19px] md:w-5 md:h-5 2xl:w-6 2xl:h-6 3xl:w-7 3xl:h-7 shrink-0"
            style={{ transform: "rotate(-3.49deg)" }}
          />
        </div>
      ))}
    </div>
  )
}

export default function SMWFAboutSection() {
  return (
    <section
      id="smwf-festival"
      className="pt-20 md:pt-28 lg:pt-32 2xl:pt-36 3xl:pt-44 pb-10 md:pb-12 lg:pb-14 2xl:pb-16 3xl:pb-20"
      style={{ backgroundColor: "#F3EFEB" }}
    >
      <div className="w-full px-6 md:px-10 lg:px-16 2xl:px-20 3xl:px-24">
        {/* Two-column intro text — centred block with a wide gutter between
            the two paragraphs (matches the reference layout). */}
        <motion.div
          {...fadeInUp}
          className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 lg:gap-32 2xl:gap-40 3xl:gap-48 w-full mb-16 md:mb-20 lg:mb-24 2xl:mb-28 3xl:mb-32"
        >
          <p
            className="font-barlow text-base md:text-lg lg:text-xl 2xl:text-2xl 3xl:text-3xl leading-relaxed"
            style={{ color: "#124039" }}
          >
            The Sydney Muslim Writers Festival is a unique platform that
            celebrates the diverse voices of Muslim writers, poets, and
            thinkers. Founded with the vision of showcasing authentic
            storytelling, SMWF offers a space for both emerging and established
            authors to share their narratives and explore various themes in
            literature.
          </p>
          <p
            className="font-barlow text-base md:text-lg lg:text-xl 2xl:text-2xl 3xl:text-3xl leading-relaxed"
            style={{ color: "#124039" }}
          >
            Our theme this year &lsquo;Beyond Noise&rsquo; is about filtering
            out the excess of opinions in modern discourse to amplify voices
            that are constructive, authentic, and rooted in knowledge.
          </p>
        </motion.div>

        {/* Two-column cards: group photo (2/3) + Vision card (1/3) — both
            children fill the grid row height (items-stretch + h-full) so the
            photo column always matches the Vision card height. */}
        <div
          id="smwf-vision"
          className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] items-stretch gap-5 md:gap-6 2xl:gap-8 3xl:gap-9"
        >
          {/* Left — group photo */}
          <motion.div {...fadeInLeft} className="h-full min-h-[20rem] md:min-h-[24rem] lg:min-h-[26rem] 2xl:min-h-[32rem] 3xl:min-h-[36rem]">
            <div className="overflow-hidden h-full w-full">
              <img
                src={visionPhoto}
                alt="Sydney Muslim Writers Festival community"
                className="block w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Right — Vision card. Uses flex column so Vision text → marquee
              → button flow naturally; the spacer absorbs leftover vertical
              space and the marquee is never positioned by a fixed percentage,
              so nothing overlaps at narrow viewports (320 / 768 / 1024). */}
          <motion.div
            {...fadeInRight}
            className="relative overflow-hidden p-8 md:p-10 lg:p-12 2xl:p-14 3xl:p-16 h-full min-h-[20rem] md:min-h-[24rem] lg:min-h-[26rem] 2xl:min-h-[32rem] 3xl:min-h-[36rem] flex flex-col"
            style={{ backgroundColor: "#2A9E9B" }}
          >
            {/* Our Vision heading + body */}
            <div className="relative z-10 pt-0 xl:pt-14 2xl:pt-32 3xl:pt-44">
              <h3 className="font-aeonik text-white text-2xl md:text-3xl 2xl:text-4xl 3xl:text-5xl font-medium tracking-tight mb-3 md:mb-4 2xl:mb-5 3xl:mb-6">
                <Text k="smwf.about.visionHeading" />
              </h3>
              <p className="font-barlow text-white/90 text-sm md:text-base 2xl:text-lg 3xl:text-xl leading-relaxed max-w-md 2xl:max-w-lg 3xl:max-w-2xl">
                <Text k="smwf.about.visionBody" />
              </p>
            </div>

            {/* Small gap between Vision text and marquee — tighter on mobile
                so the marquee sits closer under the body text. */}
            <div className="h-2 md:h-8 lg:h-10 2xl:h-14 3xl:h-20" />

            {/* Tilted pink marquee — in normal flow right under the gap.
                Negative left margin keeps the kufic shape aligned to the
                card edge; large negative right margin lets the band bleed
                off the right edge (clipped by the card's overflow-hidden). */}
            <div className="relative z-0 -ml-8 md:-ml-10 lg:-ml-12 2xl:-ml-14 3xl:-ml-16 -mr-[600px]">
              <div
                className="py-3 md:py-3.5 2xl:py-4 3xl:py-5 overflow-hidden"
                style={{
                  backgroundColor: "#F4A8A1",
                  transform: "rotate(-3deg)",
                  transformOrigin: "center",
                }}
              >
                <div
                  className="flex smwf-banner-top w-max"
                  style={{ animationDuration: "60s" }}
                >
                  <InnerMarqueeRow />
                  <InnerMarqueeRow />
                </div>
              </div>
            </div>

            {/* Gap between marquee and button — scaled per breakpoint */}
            <div className="h-4 md:h-6 lg:h-8 2xl:h-12 3xl:h-16" />

            {/* GET TICKETS button — flows naturally at the bottom of the
                flex column, always under the marquee. */}
            <div className="relative z-10">
              <motion.a
                href="https://www.miaaustralia.org/smwf"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="inline-flex items-center gap-2 2xl:gap-2.5 3xl:gap-3 px-6 md:px-7 2xl:px-9 3xl:px-10 py-3 md:py-3.5 2xl:py-4 3xl:py-5 font-aeonik text-xs md:text-sm 2xl:text-base 3xl:text-lg font-semibold tracking-[0.18em] uppercase rounded-none"
                style={{ backgroundColor: "#CBCE58", color: "#124039" }}
              >
                Get Tickets
                <ArrowUpRight
                  className="w-3.5 h-3.5 md:w-4 md:h-4 2xl:w-5 2xl:h-5 3xl:w-6 3xl:h-6"
                  strokeWidth={2.5}
                />
              </motion.a>
            </div>

            {/* Bottom grow spacer — absorbs any leftover vertical space on
                tall (2K/4K) cards so the empty room sits at the BOTTOM of
                the card, not between Vision text and the marquee. */}
            <div className="grow" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
