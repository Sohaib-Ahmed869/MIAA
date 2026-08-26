import { useState } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { fadeInUp } from "../../../lib/motion"
import { useCMS } from "../../../hooks/useCMS"
import { api } from "../../../lib/api"
import { formatEventDate } from "../../../lib/eventDate"
import Text from "../../../content/Text"
import { useMedia } from "../../../content/context"

export default function PreviousEventsSection() {
  const [hoveredPrev, setHoveredPrev] = useState(null)
  // Stands in for a real archive record that has no photo of its own — editable
  // in admin → Site Content.
  const fallbackImage = useMedia("offsite.previous.image")
  // Real archive records or nothing: the placeholder rows that used to fill this
  // list advertised five events the museum never held.
  const { data: previousEvents, loading } = useCMS(
    () => api.previousEvents({ surface: "offsite" }),
    []
  )

  return (
    <section className="py-16 md:py-24 3xl:py-32 bg-bg">
      <div className="max-w-[1400px] 3xl:max-w-[3200px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24">
        <motion.div {...fadeInUp}>
          <div className="grid grid-cols-1 md:grid-cols-[15rem_1fr] gap-8 md:gap-16">
            {/* Left — heading */}
            <div>
              <h3 className="text-2xl md:text-[1.75rem] 3xl:text-[2.4rem] font-medium text-primary leading-tight">
                <Text k="offsite.previous.heading" />
              </h3>
            </div>

            {/* Right — list with hover image inline, or a plain line saying the
                archive is still empty. The divider above labels this block, so
                removing it entirely would leave the label over blank space. */}
            <div>
              {!loading && previousEvents.length === 0 && (
                <p className="text-base 3xl:text-lg text-primary/70 leading-relaxed border-y border-primary/15 py-6">
                  <Text k="offsite.previous.empty" />
                </p>
              )}
              <div
                className={`flex-col divide-y divide-primary/15 border-y border-primary/15 ${
                  previousEvents.length > 0 ? "flex" : "hidden"
                }`}
              >
                {previousEvents.map((event, i) => {
                  // The API hands us the right destination per entry —
                  // /previous-events/… for a written-up archive record, the
                  // event's own page for one that simply ran its course. An
                  // entry with neither stays non-clickable.
                  const to = event.detailPath || null

                  const inner = (
                    <>
                      <div className="flex items-center justify-between gap-3">
                        <p
                          className={`text-[0.9375rem] md:text-lg 3xl:text-xl font-medium transition-colors duration-200 ${
                            hoveredPrev === i ? "text-secondary-terra" : "text-primary"
                          }`}
                        >
                          {event.title}
                        </p>
                        {to && (
                          <ArrowUpRight
                            className={`w-4 h-4 3xl:w-5 3xl:h-5 flex-shrink-0 transition-all duration-200 ${
                              hoveredPrev === i
                                ? "text-secondary-terra opacity-100 translate-x-0"
                                : "text-primary/40 opacity-0 -translate-x-1"
                            }`}
                          />
                        )}
                      </div>
                      {(event.subtitle || event.date) && (
                        <p className="text-sm 3xl:text-base text-primary mt-0.5">
                          {[formatEventDate(event.date), event.subtitle]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      )}

                      {/* Hover image — lg and up only. Below that the
                          right-hand column is too narrow for a 180px thumbnail
                          to float beside the title without sitting on it. */}
                      <AnimatePresence>
                        {hoveredPrev === i && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
                            animate={{ opacity: 1, scale: 1, rotate: 3 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.25 }}
                            className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[180px] h-[120px] 3xl:w-[12vw] 3xl:h-[8vw] rounded overflow-hidden z-10 pointer-events-none shadow-lg"
                          >
                            <img
                              src={event.imageUrl || fallbackImage.src}
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
                    // The right inset reserves the hover thumbnail's lane so
                    // the title and date wrap before they reach it instead of
                    // being covered by it. Padding, not margin, so the
                    // divider rules still run the full width of the column.
                    className: `block py-4 3xl:py-5 relative lg:pr-[13rem] 3xl:pr-[14vw] ${
                      to ? "cursor-pointer" : ""
                    }`,
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
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
