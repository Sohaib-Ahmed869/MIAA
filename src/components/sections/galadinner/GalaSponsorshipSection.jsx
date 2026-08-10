import { motion } from "framer-motion"
import { fadeInLeft, fadeInRight } from "../../../lib/motion"
import CTAButton from "../../ui/Button"
import SectionDivider from "../../ui/SectionDivider"
import Text from "../../../content/Text"
import { splitParagraphs } from "../../../content/format"
import { useText } from "../../../content/context"

export default function GalaSponsorshipSection() {
  const t = useText()
  return (
    <section className="bg-accent-cream">
      <div className="max-w-[1400px] 3xl:max-w-[3200px] mx-auto">
        <SectionDivider label={t("gala.sponsorship.label")} bg="bg-transparent" variant="light" />
      </div>

      <div className="max-w-[1400px] 3xl:max-w-[3200px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24 py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20 items-start">
          {/* Left — Heading + CTA */}
          <motion.div {...fadeInLeft}>
            <h2 className="font-display text-3xl md:text-[2.625rem] 3xl:text-[3.2rem] font-medium text-primary leading-none tracking-tight mb-10 mt-0 uppercase">
              <Text k="gala.sponsorship.heading" />
            </h2>
            <CTAButton href="/Gala Dinner - Sponsorship Package.pdf" download>{t("gala.sponsorship.cta")}</CTAButton>
          </motion.div>

          {/* Right — Description */}
          <motion.div {...fadeInRight} className="flex flex-col gap-3 text-base 3xl:text-xl text-primary leading-normal font-medium">
            {splitParagraphs(t("gala.sponsorship.body")).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
