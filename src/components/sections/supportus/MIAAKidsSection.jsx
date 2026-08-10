import { motion } from "framer-motion"
import { fadeInLeft, fadeInRight, staggerContainer, staggerItem } from "../../../lib/motion"
import CTAButton from "../../ui/Button"
import kidsImg from "../../../assets/images/Support/donor-event.png"
import Text from "../../../content/Text"
import { useText } from "../../../content/context"

export default function MIAAKidsSection() {
  const t = useText()
  const BENEFITS = [
    t("support.kids.benefit1"),
    t("support.kids.benefit2"),
    t("support.kids.benefit3"),
    t("support.kids.benefit4"),
    t("support.kids.benefit5"),
    t("support.kids.benefit6"),
  ]
  return (
    <section className="py-16 md:py-24 3xl:py-32 bg-primary">
      <div className="max-w-[1400px] 3xl:max-w-[3200px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left — heading + checklist + button */}
          <motion.div {...fadeInLeft}>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[2rem] 3xl:text-[3.2rem] font-medium text-accent-cream tracking-tight leading-snug mb-6">
              <Text k="support.kids.heading" />
            </h2>
            <p className="text-base 3xl:text-lg text-accent-cream leading-relaxed mb-6 max-w-md 3xl:max-w-xl">
              <Text k="support.kids.intro" />
            </p>

            <motion.ul {...staggerContainer} className="flex flex-col gap-2.5 mb-6">
              {BENEFITS.map((b, i) => (
                <motion.li
                  key={i}
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
              <Text k="support.kids.note" />
            </p>

            <CTAButton to="/contact">{t("support.kids.cta")}</CTAButton>
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
