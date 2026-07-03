import { motion } from "framer-motion"
import CTAButton from "../../ui/Button"

export default function DonationsHeroSection() {
  return (
    <section className="relative bg-bg-deep overflow-visible">
      <div className="w-full px-6 md:px-10 lg:px-16 3xl:px-24 pt-28 md:pt-32 pb-16 md:pb-20 text-center">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-[0.6875rem] md:text-xs 3xl:text-sm tracking-[0.25em] uppercase text-accent-wheat font-semibold mb-3"
        >
          Support MIAA
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-3xl md:text-4xl lg:text-[2.6rem] 3xl:text-[4.5rem] font-medium text-accent-cream tracking-tight leading-tight"
        >
          Make a Donation
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base md:text-lg 3xl:text-xl text-accent-cream/75 mt-5 md:mt-6 max-w-2xl mx-auto font-medium"
        >
          Your generous contribution helps preserve and celebrate Islamic art and
          culture in Australia.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-8"
        >
          <CTAButton to="/donate/checkout">Donate Now</CTAButton>
        </motion.div>
      </div>
    </section>
  )
}
