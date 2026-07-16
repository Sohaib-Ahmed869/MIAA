import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Calendar, MapPin, Clock, ArrowLeft, Heart } from "lucide-react"
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer, staggerItem } from "../../../lib/motion"
import CTAButton from "../../ui/Button"

function slugify(s = "") {
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function paragraphs(text) {
  if (!text || typeof text !== "string") return []
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
}

export default function EventDetailSection({ event, relatedEvents = [] }) {
  if (!event) return null

  const heroImage = event.imageUrl || event.image
  const longParagraphs = paragraphs(event.longDescription)
  const bodyParagraphs = longParagraphs.length
    ? longParagraphs
    : [
        event.description ||
          "Details for this event will be shared soon. Please check back closer to the date for the full program, speaker lineup, and RSVP information.",
      ]

  const subtitle = event.subtitle || "A gathering of stories, art, and community."
  const formatText = event.format || "In-person"
  const admissionText = event.admission || "Free / RSVP"
  const rsvpLabel = event.rsvpLabel || "RSVP for Event"
  const rsvpUrl = event.rsvpUrl || "/contact"
  const rsvpIsExternal = /^https?:\/\//i.test(rsvpUrl)
  const highlights = Array.isArray(event.highlights)
    ? event.highlights.filter((h) => h && (h.tag || h.title || h.body))
    : []

  // Donations — the admin enables this per event. Link to the shared checkout
  // with the event pre-selected (accepts an _id or slug).
  const acceptsDonations = Boolean(event.acceptDonations)
  const donateTarget = event.slug || event._id
  const donateUrl = `/donate/checkout?event=${encodeURIComponent(donateTarget || "")}`
  const raised = Number(event.raisedAmount || 0)
  const goal = Number(event.goalAmount || 0)
  const pct = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0
  const fmtMoney = (cents) =>
    `$${(cents / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}`

  return (
    <article className="bg-bg">
      {/* Hero */}
      <section className="relative bg-bg-deep overflow-hidden">
        <div className="absolute inset-0">
          {heroImage && (
            <img
              src={heroImage}
              alt={event.title}
              className="w-full h-full object-cover opacity-40"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-bg-deep/70 via-bg-deep/60 to-bg-deep" />
        </div>

        <div className="relative z-10 max-w-[1400px] 3xl:max-w-[3200px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 3xl:px-24 pt-20 sm:pt-28 md:pt-40 3xl:pt-48 pb-20 sm:pb-24 md:pb-28 3xl:pb-36">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to="/offsite-events"
              className="inline-flex items-center gap-2 text-accent-cream/80 hover:text-accent-cream text-[0.6875rem] 3xl:text-sm tracking-[0.3em] uppercase pt-4 pb-5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2.5} />
              Back to Events
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-[0.6875rem] 3xl:text-sm tracking-[0.3em] uppercase text-accent-wheat mb-5"
          >
            {event.category === "homepage" ? "MIAA Event" : "Offsite Program"}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-6xl lg:text-7xl 3xl:text-[6.5rem] font-medium text-accent-cream tracking-tight leading-[1.05] max-w-5xl"
          >
            {event.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-8 md:mt-14 pt-6 md:pt-0 flex flex-wrap gap-x-6 sm:gap-x-10 gap-y-5 text-accent-cream"
          >
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 3xl:w-12 3xl:h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                <Calendar className="w-4 h-4 3xl:w-5 3xl:h-5" strokeWidth={2} />
              </span>
              <div>
                <p className="text-[0.625rem] 3xl:text-xs tracking-[0.25em] uppercase text-accent-cream/60">
                  Date
                </p>
                <p className="text-base 3xl:text-xl font-medium text-accent-cream">
                  {event.date || "TBA"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-9 h-9 3xl:w-12 3xl:h-12 flex-shrink-0 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                <MapPin className="w-4 h-4 3xl:w-5 3xl:h-5" strokeWidth={2} />
              </span>
              <div>
                <p className="text-[0.625rem] 3xl:text-xs tracking-[0.25em] uppercase text-accent-cream/60">
                  Location
                </p>
                <p className="text-base 3xl:text-xl font-medium text-accent-cream">
                  {event.location || "MIAA"}
                </p>
              </div>
            </div>

            {event.time && (
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 3xl:w-12 3xl:h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                  <Clock className="w-4 h-4 3xl:w-5 3xl:h-5" strokeWidth={2} />
                </span>
                <div>
                  <p className="text-[0.625rem] 3xl:text-xs tracking-[0.25em] uppercase text-accent-cream/60">
                    Time
                  </p>
                  <p className="text-base 3xl:text-xl font-medium text-accent-cream">
                    {event.time}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Feature image + body */}
      <section className="bg-bg-cream py-14 sm:py-20 md:py-28 3xl:py-36">
        <div className="max-w-[1400px] 3xl:max-w-[3200px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 3xl:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20 items-start">
            <motion.div
              {...fadeInLeft}
              className="relative"
            >
              {heroImage && (
                <div className="relative rounded-xl overflow-hidden shadow-2xl">
                  <img
                    src={heroImage}
                    alt={event.title}
                    className="w-full h-auto block"
                  />
                </div>
              )}
              <div className="absolute -bottom-4 left-4 md:-bottom-6 md:-left-6">
                <div className="bg-secondary-terra text-white px-5 py-4 3xl:px-7 3xl:py-5 rounded-md shadow-xl">
                  <p className="text-[0.625rem] 3xl:text-xs tracking-[0.25em] uppercase text-white/80">
                    Save the Date
                  </p>
                  <p className="text-xl 3xl:text-2xl font-semibold mt-1">
                    {event.date || "TBA"}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div {...fadeInRight}>
              <p className="text-[0.6875rem] 3xl:text-sm tracking-[0.3em] uppercase text-secondary-terra mb-5">
                About the Event
              </p>
              <h2 className="text-3xl md:text-4xl 3xl:text-[3rem] font-medium text-primary tracking-tight leading-tight">
                {subtitle}
              </h2>
              {bodyParagraphs.map((p, i) => (
                <p
                  key={i}
                  className={`text-base 3xl:text-xl text-primary/${
                    i === 0 ? "85" : "75"
                  } leading-relaxed ${i === 0 ? "mt-6" : "mt-5"}`}
                >
                  {p}
                </p>
              ))}

              <div className="mt-10 flex flex-wrap gap-4 items-center">
                {rsvpIsExternal ? (
                  <CTAButton href={rsvpUrl}>{rsvpLabel}</CTAButton>
                ) : (
                  <CTAButton to={rsvpUrl}>{rsvpLabel}</CTAButton>
                )}
                <Link
                  to="/offsite-events"
                  className="text-primary text-[0.6875rem] 3xl:text-sm tracking-[0.2em] uppercase font-semibold hover:text-secondary-terra transition-colors"
                >
                  View All Events
                </Link>
                {acceptsDonations && (
                  <CTAButton to={donateUrl} icon={Heart}>
                    Donate to this Event
                  </CTAButton>
                )}
              </div>

              {acceptsDonations && (
                <div className="mt-8 rounded-xl border border-secondary-terra/25 bg-secondary-terra/5 p-5 md:p-6">
                  <p className="text-[0.6875rem] 3xl:text-sm tracking-[0.25em] uppercase text-secondary-terra font-semibold">
                    Support this event
                  </p>
                  <p className="mt-2 text-sm 3xl:text-base text-primary/75 leading-relaxed">
                    Your contribution helps MIAA bring programs like this to the
                    community. Every donation goes directly toward this event.
                  </p>
                  {goal > 0 ? (
                    <div className="mt-4">
                      <div className="flex justify-between text-[0.6875rem] 3xl:text-sm tracking-[0.15em] uppercase text-primary/60 mb-1.5">
                        <span className="text-primary font-semibold">
                          {fmtMoney(raised)} raised
                        </span>
                        <span>{fmtMoney(goal)} goal</span>
                      </div>
                      <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-secondary-terra rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    raised > 0 && (
                      <p className="mt-4 text-sm 3xl:text-base text-primary/70">
                        <span className="text-primary font-semibold">
                          {fmtMoney(raised)}
                        </span>{" "}
                        raised so far — thank you.
                      </p>
                    )
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* What to expect */}
      {highlights.length > 0 && (
        <section className="bg-bg py-20 md:py-28 3xl:py-36">
          <div className="max-w-[1400px] 3xl:max-w-[3200px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24">
            <motion.div {...fadeInUp} className="max-w-3xl mb-14 md:mb-16">
              <p className="text-[0.6875rem] 3xl:text-sm tracking-[0.3em] uppercase text-secondary-terra mb-5">
                What to Expect
              </p>
              <h2 className="text-3xl md:text-4xl 3xl:text-[3rem] font-medium text-primary tracking-tight leading-tight">
                An evening crafted with care
              </h2>
            </motion.div>

            <motion.div
              {...staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
            >
              {highlights.map((item, i) => (
                <motion.div
                  key={i}
                  {...staggerItem}
                  className="group bg-bg-cream rounded-xl p-7 md:p-9 3xl:p-12 border border-primary/5 hover:border-secondary-terra/30 transition-colors"
                >
                  {item.tag && (
                    <p className="text-[0.625rem] 3xl:text-xs tracking-[0.3em] uppercase text-secondary-terra mb-5">
                      {item.tag}
                    </p>
                  )}
                  {item.title && (
                    <h3 className="text-xl md:text-2xl 3xl:text-3xl font-medium text-primary leading-tight">
                      {item.title}
                    </h3>
                  )}
                  {item.body && (
                    <p className="mt-4 text-sm md:text-base 3xl:text-lg text-primary/75 leading-relaxed">
                      {item.body}
                    </p>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Details strip */}
      <section className="bg-primary py-16 md:py-20 3xl:py-28">
        <div className="max-w-[1400px] 3xl:max-w-[3200px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 text-accent-cream">
            <div>
              <p className="text-[0.625rem] 3xl:text-xs tracking-[0.3em] uppercase text-accent-cream/60 mb-2">
                Date
              </p>
              <p className="text-lg md:text-xl 3xl:text-2xl font-medium">
                {event.date || "TBA"}
              </p>
            </div>
            <div>
              <p className="text-[0.625rem] 3xl:text-xs tracking-[0.3em] uppercase text-accent-cream/60 mb-2">
                Location
              </p>
              <p className="text-lg md:text-xl 3xl:text-2xl font-medium">
                {event.location || "MIAA"}
              </p>
            </div>
            <div>
              <p className="text-[0.625rem] 3xl:text-xs tracking-[0.3em] uppercase text-accent-cream/60 mb-2">
                Format
              </p>
              <p className="text-lg md:text-xl 3xl:text-2xl font-medium">
                {formatText}
              </p>
            </div>
            <div>
              <p className="text-[0.625rem] 3xl:text-xs tracking-[0.3em] uppercase text-accent-cream/60 mb-2">
                Admission
              </p>
              <p className="text-lg md:text-xl 3xl:text-2xl font-medium">
                {admissionText}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related events */}
      {relatedEvents.length > 0 && (
        <section className="bg-bg-deep py-20 md:py-28 3xl:py-36">
          <div className="max-w-[1400px] 3xl:max-w-[3200px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24">
            <motion.div
              {...fadeInUp}
              className="flex flex-wrap items-end justify-between gap-6 mb-12 md:mb-14"
            >
              <div>
                <p className="text-[0.6875rem] 3xl:text-sm tracking-[0.3em] uppercase text-accent-wheat mb-4">
                  Keep Exploring
                </p>
                <h2 className="text-3xl md:text-4xl 3xl:text-[3rem] font-medium text-accent-cream tracking-tight leading-tight">
                  Other Upcoming Events
                </h2>
              </div>
              <CTAButton to="/offsite-events">
                View All
              </CTAButton>
            </motion.div>

            <motion.div
              {...staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {relatedEvents.slice(0, 3).map((rel, i) => {
                const relSlug = rel.slug || rel._id || slugify(rel.title)
                const relLink = rel.redirectUrl || `/event/${relSlug}`
                return (
                  <motion.div key={rel._id || i} {...staggerItem}>
                    <Link to={relLink} className="group block">
                      <div className="aspect-[4/3] overflow-hidden rounded-lg mb-5">
                        <img
                          src={rel.imageUrl || rel.image}
                          alt={rel.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <p className="text-2xl 3xl:text-3xl font-medium text-accent-wheat mb-2">
                        {rel.date}
                      </p>
                      <p className="text-[0.6875rem] 3xl:text-sm text-accent-cream/70 italic mb-3">
                        {rel.location}
                      </p>
                      <h3 className="text-lg 3xl:text-xl font-semibold text-accent-cream group-hover:text-secondary-terra transition-colors">
                        {rel.title}
                      </h3>
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>
      )}
    </article>
  )
}
