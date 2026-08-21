import { motion } from "framer-motion"
import { fadeInUp } from "../../../lib/motion"
import Text from "../../../content/Text"
import { CalendarArt } from "../../donor/DonorEmptyState"

/**
 * Stands in for the upcoming-events grid when the calendar is genuinely clear.
 *
 * The block used to remove itself entirely, which left the page jumping from
 * the hero straight to "Discover More" and gave a visitor no answer to the
 * question they came with. Saying "nothing scheduled yet" is an answer; silence
 * reads as a page that failed to load.
 *
 * No button: unlike the donate page's empty state — which had to lead somewhere
 * because the page ended there — the event archive sits directly below this one,
 * and a scroll button pointing a screen down would be noise.
 *
 * The illustration is the donor portal's, deliberately: same palette, same hand,
 * and the same drawing for "nothing here yet" in both places.
 */
export default function NoUpcomingEventsSection() {
  return (
    <section className="py-14 md:py-20 3xl:py-28 bg-bg-deep">
      <div className="max-w-[1400px] 3xl:max-w-[3200px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24">
        <motion.div
          {...fadeInUp}
          className="flex flex-col items-center text-center max-w-xl 3xl:max-w-2xl mx-auto"
        >
          <CalendarArt className="w-48 h-44 md:w-60 md:h-56 3xl:w-72 3xl:h-[17rem]" />
          <h2 className="text-2xl md:text-3xl lg:text-4xl 3xl:text-5xl font-medium text-white tracking-tight leading-tight mt-4">
            <Text k="offsite.empty.heading" />
          </h2>
          <p className="text-base 3xl:text-lg text-white/65 leading-relaxed mt-4">
            <Text k="offsite.empty.body" />
          </p>
        </motion.div>
      </div>
    </section>
  )
}
