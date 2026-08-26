import { motion } from "framer-motion"
import EventsHeroSection from "../components/sections/offsiteevents/EventsHeroSection"
import OffsiteProgramsSection from "../components/sections/offsiteevents/OffsiteProgramsSection"
import PreviousEventsSection from "../components/sections/offsiteevents/PreviousEventsSection"
import SectionDivider from "../components/ui/SectionDivider"
import float2 from "../assets/images/About/float2.png"

export default function OffsiteEvents() {
  return (
    <>
      <EventsHeroSection />

      {/* Renders its own "Upcoming Events" divider — the whole block removes
          itself when the API reports nothing upcoming. */}
      <OffsiteProgramsSection />

      {/* Boundary float — top-right, viewport edge, partly off-screen */}
      <div className="relative h-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="hero-float pointer-events-none absolute z-40 right-0 top-0 translate-x-1/3 -translate-y-1/2 w-40 md:w-56 lg:w-72"
        >
          <img src={float2} alt="" className="w-full h-auto drop-shadow-2xl" />
        </motion.div>
      </div>

      {/* "Where Families Discover Art Together" used to sit here: three static
          cards with a title, a blurb and a date, which read as three real events
          the museum was advertising. The page now goes straight from what's on
          to what's been — every event on it is a record from the Events CMS. */}

      <SectionDivider label="EVENT ARCHIVE" bg="bg-bg" variant="light" />
      <PreviousEventsSection />
    </>
  )
}
