import { motion } from "framer-motion"
import { fadeInUp } from "../../../lib/motion"
import CTAButton from "../../ui/Button"
import Text from "../../../content/Text"
import { useText } from "../../../content/context"

export default function AboutUsSection() {
  const t = useText()
  return (
    <section className="py-16 md:py-24 3xl:py-32 bg-accent-cream">
      <div className="max-w-[1400px] 3xl:max-w-[3200px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24">
        <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center lg:text-justify lg:ml-[30%]">
          <p className="text-lg md:text-xl lg:text-2xl 3xl:text-3xl font-medium text-primary leading-relaxed">
            <Text k="home.aboutus.body" />
          </p>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8"
          >
            <CTAButton to="/about">{t("home.aboutus.cta")}</CTAButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
