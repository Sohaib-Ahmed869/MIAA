import { motion } from "framer-motion"
import { Check } from "lucide-react"
import CTAButton from "../../ui/Button"
import { fadeInLeft, staggerContainer, staggerItem } from "../../../lib/motion"
import Text from "../../../content/Text"
import { useText } from "../../../content/context"

export default function OtherDonationsSection() {
  const t = useText()
  const DONATION_OPTIONS = [
    { text: t("support.other.opt1.text") },
    { label: t("support.other.opt2.label"), text: t("support.other.opt2.text") },
    { label: t("support.other.opt3.label"), text: t("support.other.opt3.text") },
    { label: t("support.other.opt4.label"), text: t("support.other.opt4.text") },
    { label: t("support.other.opt5.label"), text: t("support.other.opt5.text") },
    { label: t("support.other.opt6.label"), text: t("support.other.opt6.text") },
  ]

  return (
    <section className="py-16 md:py-24 3xl:py-32 bg-bg">
      <div className="max-w-[1400px] 3xl:max-w-[3200px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-10 lg:gap-20 items-stretch">
          {/* Left — heading + button at bottom */}
          <motion.div {...fadeInLeft} className="flex flex-col justify-between">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[2.5rem] 3xl:text-[3.2rem] font-medium text-primary tracking-tight leading-snug max-w-sm 3xl:max-w-lg">
              <Text k="support.other.heading" />
            </h2>

            <CTAButton to="/donate" className="mt-8 lg:mt-10 self-start">{t("support.other.cta")}</CTAButton>
          </motion.div>

          {/* Right — checklist */}
          <motion.ul
            {...staggerContainer}
            className="flex flex-col gap-6"
          >
            {DONATION_OPTIONS.map((opt, i) => (
              <motion.li
                key={i}
                {...staggerItem}
                className="flex gap-4 items-start"
              >
                <span className="flex-shrink-0 mt-0.5 w-8 h-8 3xl:w-10 3xl:h-10 rounded-full border-2 border-primary/30 flex items-center justify-center">
                  <Check strokeWidth={4} className="text-primary" />
                </span>
                <p className="text-base md:text-lg 3xl:text-xl text-primary leading-relaxed">
                  {opt.label && <span className="font-semibold">{opt.label} </span>}
                  {opt.text}
                </p>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  )
}
