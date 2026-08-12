import { motion } from "framer-motion"
import { fadeInLeft, fadeInRight } from "../../../lib/motion"
import CTAButton from "../../ui/Button"
import Text from "../../../content/Text"
import { useText, useMedia } from "../../../content/context"

export default function VolunteerSection() {
  const image = useMedia("support.volunteer.image")
  const t = useText()
  return (
    <section className="py-16 md:py-24 3xl:py-32 bg-bg">
      <div className="max-w-[1400px] 3xl:max-w-[3200px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1px_1fr] gap-8 lg:gap-12 items-stretch">
          {/* Left — volunteer group photo */}
          <motion.div {...fadeInLeft}>
            <div className="overflow-hidden">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>

          {/* Vertical divider */}
          <div className="hidden lg:block bg-primary/15" />

          {/* Right — text + CTA */}
          <motion.div {...fadeInRight} className="flex flex-col justify-between">
            <div>
              <p className="text-base md:text-lg 3xl:text-xl text-secondary-sand font-medium mb-2">
                <Text k="support.volunteer.eyebrow" />
              </p>
              <h2 className="text-2xl md:text-3xl lg:text-[2rem] 3xl:text-[3.2rem] font-medium text-primary tracking-tight leading-snug mb-6">
                <Text k="support.volunteer.heading" />
              </h2>
              <p className="text-base sm:text-lg 3xl:text-xl text-primary leading-relaxed mb-4 max-w-md 3xl:max-w-xl">
                <Text k="support.volunteer.body1" />
              </p>
              <p className="text-base sm:text-lg 3xl:text-xl text-primary leading-relaxed max-w-md 3xl:max-w-xl">
                <Text k="support.volunteer.body2" />
              </p>
            </div>

            <CTAButton to="/contact" className="mt-8 self-start">{t("support.volunteer.cta")}</CTAButton>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
