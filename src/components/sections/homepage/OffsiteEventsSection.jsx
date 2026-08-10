import { useState } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { fadeInUp, staggerContainer, staggerItem } from "../../../lib/motion"
import CTAButton from "../../ui/Button"
import { useCMS } from "../../../hooks/useCMS"
import { api } from "../../../lib/api"
import { formatEventDate } from "../../../lib/eventDate"
import Text from "../../../content/Text"
import { useText } from "../../../content/context"

function slugify(s = "") {
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

import offsiteImg1 from "../../../assets/images/Homepage/Offsite program images/offsiteimg-01.png"
import offsiteImg2 from "../../../assets/images/Homepage/Offsite program images/offsiteimg-02.png"
import offsiteImg3 from "../../../assets/images/Homepage/Offsite program images/offsiteimg-03.png"
import offsiteImg4 from "../../../assets/images/Homepage/Offsite program images/offsiteimg-04.png"

const FALLBACK_EVENTS = [
  {
    date: "07.02.26",
    location: "At Gallery A, MIAA",
    title: "Islamic Art Showcase",
    description:
      "A curated exhibition highlighting works by emerging Muslim Australian artists and their global influences.",
    image: offsiteImg1,
  },
  {
    date: "07.02.26",
    location: "At Gallery A, MIAA",
    title: "Islamic Art Showcase",
    description:
      "A curated exhibition highlighting works by emerging Muslim Australian artists and their global influences.",
    image: offsiteImg2,
  },
  {
    date: "TBA",
    location: "At Gallery A, MIAA",
    title: "Islamic Art Showcase",
    description:
      "A curated exhibition highlighting works by emerging Muslim Australian artists and their global influences.",
    image: offsiteImg3,
  },
]

const FALLBACK_PREVIOUS = [
  { title: "Event Title Lorem Ipsum Dolor Sit Amet", image: offsiteImg4 },
  { title: "Event Title Lorem Ipsum Dolor Sit Amet", image: offsiteImg4 },
  { title: "Event Title Lorem Ipsum Dolor Sit Amet", image: offsiteImg4 },
  { title: "Event Title Lorem Ipsum Dolor Sit Amet", image: offsiteImg4 },
]

export default function OffsiteEventsSection() {
  const [hoveredPrev, setHoveredPrev] = useState(null)
  const t = useText()

  // upcoming: true — events whose date has passed belong in the archive, not
  // under an "Upcoming Events" heading.
  const { data: upcomingEvents } = useCMS(
    () => api.events({ category: "offsite", upcoming: true }),
    FALLBACK_EVENTS
  )
  const { data: previousEvents } = useCMS(
    () => api.previousEvents({ surface: "offsite" }),
    FALLBACK_PREVIOUS
  )

  return (
    <section className="py-16 md:py-24 3xl:py-32 bg-bg-deep">
      <div className="max-w-[1400px] 3xl:max-w-[3200px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24">
        {/* Header */}
        <motion.div
          {...fadeInUp}
          className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between mb-14"
        >
          <h2 className="text-3xl md:text-[2.625rem] 3xl:text-[3.2rem] font-medium text-white tracking-tight leading-tight">
            <Text k="home.offsite.heading" />
          </h2>
          <CTAButton to="/offsite-events" className="self-start md:mt-1 whitespace-nowrap">{t("home.offsite.cta")}</CTAButton>
        </motion.div>

        {/* Upcoming event cards */}
        <motion.div
          {...staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-y-10 md:gap-y-12 mb-20"
        >
          {upcomingEvents.map((event, i) => {
            const slug = event.slug || event._id || slugify(event.title)
            const cardLink = event.redirectUrl || `/event/${slug}`
            const showDivider = (i + 1) % 3 !== 0 && i !== upcomingEvents.length - 1
            return (
              <motion.div
                key={event._id || i}
                {...staggerItem}
                className={`group md:px-6 ${showDivider ? "md:border-r md:border-white/15" : ""}`}
              >
                <Link to={cardLink} className="block">
                  {/* Date & location */}
                  <div className="mb-4">
                    <p className="text-2xl md:text-3xl 3xl:text-[2.4rem] tracking-wide text-[#D0A270] font-medium">
                      {formatEventDate(event.date)}
                    </p>
                    <p className="text-[0.6875rem] 3xl:text-sm text-white/70 mt-1.5 tracking-wide font-medium">
                      {event.location}
                    </p>
                  </div>

                  {/* Image */}
                  {(event.imageUrl || event.image) ? (
                    <div className="h-48 md:h-56 3xl:h-72 overflow-hidden rounded-xl mb-5 isolate">
                      <img
                        src={event.imageUrl || event.image}
                        alt={event.title}
                        className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] overflow-hidden rounded-xl mb-5 bg-primary/50 flex items-center justify-center">
                      <span className="text-accent-cream/30 text-sm uppercase tracking-widest">Coming Soon</span>
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-base md:text-lg 3xl:text-xl font-bold text-white mb-2 group-hover:text-accent-caramel transition-colors leading-tight">
                    {event.title}
                  </h3>
                  {event.subtitle && (
                    <p className="text-[0.8125rem] 3xl:text-base text-white leading-relaxed mb-2">
                      {event.subtitle}
                    </p>
                  )}
                  <p className="text-[0.8125rem] 3xl:text-base text-white/65 leading-relaxed">
                    {event.description}
                  </p>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Previous Events — 2 column layout */}
        <motion.div {...fadeInUp}>
          <div className="grid grid-cols-1 md:grid-cols-[15rem_1fr] gap-8 md:gap-16">
            {/* Left column — heading */}
            <div>
              <h3 className="text-2xl 3xl:text-3xl font-medium text-white leading-tight">
                <Text k="home.offsite.previousHeading" />
              </h3>
            </div>

            {/* Right column — list with hover image inline */}
            <div>
              <div className="flex flex-col divide-y divide-white/15 border-y border-white/15">
                {previousEvents.map((event, i) => {
                  // The API hands us the right destination for each entry —
                  // /previous-events/… for a written-up archive record, the
                  // event's own page for one that simply ran its course. The
                  // seeded fallback placeholders have neither, so they stay
                  // non-clickable rather than pretending to be links.
                  const to = event.detailPath || null

                  const inner = (
                    <>
                      <div className="flex items-center justify-between gap-3">
                        <p
                          className={`text-[0.9375rem] md:text-lg 3xl:text-xl font-medium transition-colors duration-200 ${
                            hoveredPrev === i
                              ? "text-accent-caramel"
                              : "text-white"
                          }`}
                        >
                          {event.title}
                        </p>
                        {to && (
                          <ArrowUpRight
                            className={`w-4 h-4 3xl:w-5 3xl:h-5 flex-shrink-0 transition-all duration-200 ${
                              hoveredPrev === i
                                ? "text-accent-caramel opacity-100 translate-x-0"
                                : "text-white/40 opacity-0 -translate-x-1"
                            }`}
                          />
                        )}
                      </div>
                      {(event.subtitle || event.date) && (
                        <p className="text-sm 3xl:text-base text-white/50 mt-0.5">
                          {[formatEventDate(event.date), event.subtitle]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      )}

                      {/* Hover image — appears on the right of the hovered item */}
                      <AnimatePresence>
                        {hoveredPrev === i && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
                            animate={{ opacity: 1, scale: 1, rotate: 3 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.25 }}
                            className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-[180px] h-[120px] 3xl:w-[12vw] 3xl:h-[8vw] rounded overflow-hidden z-10 pointer-events-none"
                          >
                            <img
                              src={event.imageUrl || event.image}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )

                  const commonProps = {
                    onMouseEnter: () => setHoveredPrev(i),
                    onMouseLeave: () => setHoveredPrev(null),
                    className: `block py-4 relative ${to ? "cursor-pointer" : ""}`,
                  }

                  return to ? (
                    <Link key={event._id || i} to={to} {...commonProps}>
                      {inner}
                    </Link>
                  ) : (
                    <div key={event._id || i} {...commonProps}>
                      {inner}
                    </div>
                  )
                })}
              </div>

              <div className="mt-6">
                <CTAButton to="/offsite-events">View All Events</CTAButton>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
