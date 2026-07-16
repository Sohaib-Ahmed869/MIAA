import { motion } from "framer-motion"
import { fadeInLeft, fadeInRight, staggerContainer, staggerItem } from "../../../lib/motion"
import CTAButton from "../../ui/Button"
import kidsImg from "../../../assets/images/Support/donor-event.png"

const BENEFITS = [
  "Free Museum entry all year round*",
  "Members only previews and exclusive guided tours",
  "Early release tickets for Museum events",
  "Early release tickets for the MIAA Annual Gala Dinner",
  "Enjoy discounts in the gift shop and cafe",
  "Memberships directly support the museum operations",
]

export default function MIAAKidsSection() {
  return (
    <section className="py-16 md:py-24 3xl:py-32 bg-primary">
      <div className="max-w-[1400px] 3xl:max-w-[3200px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left — heading + checklist + button */}
          <motion.div {...fadeInLeft}>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[2rem] 3xl:text-[3.2rem] font-medium text-accent-cream tracking-tight leading-snug mb-6">
              My MIAA and MIAA Kids 2029
            </h2>
            <p className="text-base 3xl:text-lg text-accent-cream leading-relaxed mb-6 max-w-md 3xl:max-w-xl">
              Stay in touch and be the first to join My MIAA and MIAA Kids prior
              to the Museum&rsquo;s grand opening in early 2029. Benefits of
              becoming a MIAA Member:
            </p>

            <motion.ul {...staggerContainer} className="flex flex-col gap-2.5 mb-6">
              {BENEFITS.map((b) => (
                <motion.li
                  key={b}
                  {...staggerItem}
                  className="flex items-start gap-3"
                >
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-cream flex-shrink-0" />
                  <span className="text-base 3xl:text-lg text-accent-cream leading-relaxed">
                    {b}
                  </span>
                </motion.li>
              ))}
            </motion.ul>

            <p className="text-sm md:text-[0.9375rem] 3xl:text-base text-accent-wheat italic mb-8">
              *Excludes ticketed events
            </p>

            <CTAButton to="/contact">Join Membership</CTAButton>
          </motion.div>

          {/* Right — image */}
          <motion.div {...fadeInRight}>
            <div className="overflow-hidden">
              <img
                src={kidsImg}
                alt="MIAA community audience at an event"
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
