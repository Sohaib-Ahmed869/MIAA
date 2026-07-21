import { motion } from "framer-motion"
import { Heart } from "lucide-react"
import { fadeInUp } from "../../../lib/motion"
import CTAButton from "../../ui/Button"

// A quiet, optional invitation to give — placed after sponsorship so guests
// who aren't sponsoring still have a gentle path to support the Museum.
export default function GalaDonateSection() {
  return (
    <section className="bg-accent-cream pb-16 md:pb-20">
      <div className="max-w-[1400px] 3xl:max-w-[3200px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24">
        <motion.div
          {...fadeInUp}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10 rounded-lg border border-primary/15 bg-white/40 px-6 md:px-10 py-8 md:py-9"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2.5 mb-3">
              <Heart className="w-4 h-4 text-secondary-terra flex-shrink-0" />
              <span className="text-[0.6875rem] 3xl:text-sm tracking-[0.2em] uppercase text-secondary-terra font-semibold">
                Support the Museum
              </span>
            </div>
            <p className="text-base 3xl:text-xl text-primary leading-relaxed font-medium max-w-[42rem]">
              Not sponsoring, but would still like to help? Every contribution,
              large or small, brings Australia&apos;s first Museum of Islamic Art
              a little closer.
            </p>
          </div>
          <div className="flex-shrink-0">
            <CTAButton to="/donate">Make a Donation</CTAButton>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
