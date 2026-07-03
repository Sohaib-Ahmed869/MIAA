import { motion } from "framer-motion"
import { XCircle } from "lucide-react"
import { fadeInUp } from "../lib/motion"
import CTAButton from "../components/ui/Button"

export default function DonationCancelled() {
  return (
    <section className="bg-bg-deep min-h-screen">
      <div className="max-w-[600px] mx-auto px-6 md:px-10 pt-28 md:pt-32 pb-20 text-center">
        <motion.div {...fadeInUp}>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/20 mb-6"
          >
            <XCircle className="w-8 h-8 text-amber-400" />
          </motion.div>

          <h1 className="text-2xl md:text-3xl font-medium text-accent-cream tracking-tight mb-4">
            Donation Cancelled
          </h1>
          <p className="text-base text-accent-cream/65 max-w-md mx-auto mb-8">
            Your donation was not processed. No charges have been made. You can
            try again whenever you're ready.
          </p>

          <CTAButton to="/donate">Return to Donations</CTAButton>
        </motion.div>
      </div>
    </section>
  )
}
