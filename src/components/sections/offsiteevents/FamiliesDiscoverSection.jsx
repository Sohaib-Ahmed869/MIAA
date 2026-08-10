import { motion } from "framer-motion"
import { fadeInUp, staggerContainer, staggerItem } from "../../../lib/motion"
import Text from "../../../content/Text"
import { useText } from "../../../content/context"

import artConnectionImg from "../../../assets/images/MIAEvents/families-art-connection.png"
import behindVisionImg from "../../../assets/images/MIAEvents/families-behind-vision.png"
import heritageDesignImg from "../../../assets/images/MIAEvents/families-heritage-design.png"

export default function FamiliesDiscoverSection() {
  const t = useText()
  const FAMILY_EVENTS = [
    {
      date: "07.02.26",
      title: t("offsite.families.card1.title"),
      description: t("offsite.families.card1.body"),
      image: artConnectionImg,
    },
    {
      date: "07.02.26",
      title: t("offsite.families.card2.title"),
      description: t("offsite.families.card2.body"),
      image: behindVisionImg,
    },
    {
      date: "07.02.26",
      title: t("offsite.families.card3.title"),
      description: t("offsite.families.card3.body"),
      image: heritageDesignImg,
    },
  ]

  return (
    <section className="relative py-16 md:py-24 3xl:py-32 bg-accent-cream">
      <div className="max-w-[1400px] 3xl:max-w-[3200px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24">
        <motion.div {...fadeInUp} className="mb-12 md:mb-14 max-w-3xl 3xl:max-w-4xl">
     
          <h2 className="text-3xl md:text-[2.625rem] 3xl:text-[3.2rem] font-medium text-primary tracking-tight leading-tight">
            <Text k="offsite.families.heading" />
          </h2>
        </motion.div>

        <motion.div
          {...staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 md:divide-x md:divide-primary/15 gap-y-12"
        >
          {FAMILY_EVENTS.map((event, i) => (
            <motion.article
              key={i}
              {...staggerItem}
              className="group flex flex-col md:px-6"
            >
              {/* Title */}
              <h3 className="text-lg md:text-xl 3xl:text-3xl font-semibold text-primary leading-tight mb-2">
                {event.title}
              </h3>

              {/* Description */}
              <p className="text-[0.8125rem] md:text-sm 3xl:text-lg text-primary/80 leading-relaxed mb-5">
                {event.description}
              </p>

              {/* Image — fixed height + rounded corners so all 3 match exactly */}
              <div
                className="h-[200px] md:h-[15rem] lg:h-[16.25rem] 3xl:h-[18vw] mb-5 overflow-hidden rounded-lg bg-cover bg-center"
                style={{ backgroundImage: `url(${event.image})` }}
                role="img"
                aria-label={event.title}
              />

              {/* Date — wheat/gold, right-aligned, at the bottom */}
              <div className="mt-auto text-right">
                <p className="text-2xl md:text-[1.75rem] 3xl:text-[2.1rem] tracking-wide text-[#D0A270] font-medium">
                  {event.date}
                </p>
                <p className="text-[0.6875rem] 3xl:text-sm text-primary/60 italic mt-1">
                  <Text k="offsite.families.location" />
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
