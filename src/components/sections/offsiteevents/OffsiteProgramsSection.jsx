import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { fadeInUp, staggerItem } from "../../../lib/motion"
import { useCMS } from "../../../hooks/useCMS"
import { api } from "../../../lib/api"
import { formatEventDate } from "../../../lib/eventDate"

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

export default function OffsiteProgramsSection() {
  // upcoming: true — events whose date has passed belong in the archive, not
  // under an "Upcoming Events" heading.
  const { data: upcomingEvents } = useCMS(
    () => api.events({ category: "offsite", upcoming: true }),
    FALLBACK_EVENTS
  )

  return (
    <section className="py-12 md:py-16 3xl:py-24 bg-bg-deep">
      <div className="max-w-[1400px] 3xl:max-w-[3200px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24">
        <motion.h2
          {...fadeInUp}
          className="text-3xl md:text-[2.625rem] 3xl:text-[3.2rem] font-medium text-white tracking-tight leading-tight mb-12 md:mb-14"
        >
          Offsite Programs and Events
        </motion.h2>

        <motion.div
          key={upcomingEvents.map((e) => e._id || e.title).join(",")}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-y-10 md:gap-y-12"
        >
          {upcomingEvents.map((event, i) => {
            const slug = event.slug || event._id || slugify(event.title)
            const cardLink = event.redirectUrl || `/event/${slug}`
            return (
              <motion.div
                key={event._id || i}
                {...staggerItem}
                className={`group md:px-6 ${(i + 1) % 3 !== 0 && i !== upcomingEvents.length - 1 ? "md:border-r md:border-white/15" : ""}`}
              >
                <Link to={cardLink} className="block">
                  {/* Date & location — left-aligned */}
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

                  {/* Subtitle */}
                  {event.subtitle && (
                    <p className="text-[0.8125rem] 3xl:text-base text-white leading-relaxed mb-2">
                      {event.subtitle}
                    </p>
                  )}

                  {/* Description */}
                  <p className="text-[0.8125rem] 3xl:text-base text-white/65 leading-relaxed">
                    {event.description}
                  </p>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
