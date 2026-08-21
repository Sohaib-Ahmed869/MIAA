import { motion } from "framer-motion"
import { fadeInUp } from "../../../lib/motion"
import CTAButton from "../../ui/Button"
import Text from "../../../content/Text"
import { useText } from "../../../content/context"
import { DonationArt } from "../../donor/DonorEmptyState"

/**
 * Stands in for the causes grid when no donation product is published.
 *
 * Disabling every cause used to leave the "Choose a Cause" divider hanging over
 * nothing, so the donate page ended at a label with no section under it. The
 * page still has to lead somewhere, and the general fund is always open — so
 * this says why the list is empty and sends the visitor to the same checkout
 * the hero's button uses.
 *
 * The illustration is the donor portal's, deliberately: it is already the
 * museum's palette and the same drawing for the same idea in both places.
 */
export default function NoCausesSection() {
  const t = useText()
  return (
    <section className="py-16 md:py-24 3xl:py-32 bg-bg">
      <div className="max-w-[1400px] 3xl:max-w-[3200px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24">
        <motion.div
          {...fadeInUp}
          className="flex flex-col items-center text-center max-w-xl 3xl:max-w-2xl mx-auto"
        >
          <DonationArt className="w-52 h-48 md:w-64 md:h-60 3xl:w-72 3xl:h-[17rem]" />
          <h2 className="text-2xl md:text-3xl lg:text-4xl 3xl:text-5xl font-medium text-primary tracking-tight leading-tight mt-4">
            <Text k="donate.empty.heading" />
          </h2>
          <p className="text-base 3xl:text-lg text-primary/70 leading-relaxed mt-4 mb-8 md:mb-10">
            <Text k="donate.empty.body" />
          </p>
          <CTAButton to="/donate/checkout">{t("donate.empty.cta")}</CTAButton>
        </motion.div>
      </div>
    </section>
  )
}
