import { motion } from "framer-motion"
import { fadeInUp } from "../../../lib/motion"
import { JournalArt } from "../../donor/DonorEmptyState"

/**
 * Stands in for a blog grid when nothing is published yet.
 *
 * The public blog surfaces used to fall back to a set of invented articles
 * whenever the CMS had no posts, which put fictional stories on a live site.
 * They now render this instead: an honest "nothing yet" is the one thing that
 * is always true, and a section that deletes itself reads as a page that failed
 * to load.
 *
 * The illustration is the donor portal's hand — same palette, same drawing
 * language as the events archive's empty state.
 */
export default function NoBlogPosts({
  heading = "No Posts Just Yet",
  body = "New stories, updates and reflections from the MIAA team are on the way. Check back soon, or follow us on social media for the latest.",
  className = "",
}) {
  return (
    <motion.div
      {...fadeInUp}
      className={`flex flex-col items-center text-center max-w-xl 3xl:max-w-2xl mx-auto py-8 md:py-10 ${className}`}
    >
      <JournalArt className="w-44 h-40 md:w-56 md:h-52 3xl:w-72 3xl:h-[17rem]" />
      <h3 className="text-xl md:text-2xl 3xl:text-4xl font-medium text-primary tracking-tight leading-tight mt-4">
        {heading}
      </h3>
      <p className="text-sm md:text-base 3xl:text-lg text-primary/70 leading-relaxed mt-3">
        {body}
      </p>
    </motion.div>
  )
}
