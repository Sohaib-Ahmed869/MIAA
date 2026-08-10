import { motion } from "framer-motion"
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer, staggerItem } from "../../../lib/motion"
import CTAButton from "../../ui/Button"
import Text from "../../../content/Text"
import { useText } from "../../../content/context"
import { TIMELINE_MILESTONES } from "../../../lib/constants"
import buildingImg from "../../../assets/images/Homepage/buildingfuture.jpg"

import sydneyView from "../../../assets/images/Homepage/Miatimeline/sydney-view.png"
import sydneyWater from "../../../assets/images/Homepage/Miatimeline/sydney-water.png"
import sydneyPasture from "../../../assets/images/Homepage/Miatimeline/sydney-pasture.png"
import sydneyArches from "../../../assets/images/Homepage/Miatimeline/sydney-arches.png"

const timelineImages = [sydneyView, sydneyWater, sydneyPasture, sydneyArches]

export default function TimelineSection() {
  const t = useText()
  return (
    <section className="pt-16 md:pt-24 3xl:pt-32 bg-accent-cream">
      <div className="max-w-[1400px] 3xl:max-w-[3200px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24">
        {/* Top: 2-column — text left, building image right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-16">
          {/* Left - Text */}
          <motion.div {...fadeInLeft}>
            <h2 className="text-3xl md:text-[2.5rem] 3xl:text-[3.2rem] font-medium text-primary tracking-tight leading-tight">
              <Text k="home.timeline.heading" />
            </h2>
            <p className="mt-4 text-sm 3xl:text-lg text-primary leading-normal max-w-md 3xl:max-w-xl">
              <Text k="home.timeline.body" />
            </p>
            <div className="mt-8">
              <CTAButton to="/timeline">{t("home.timeline.cta")}</CTAButton>
            </div>
          </motion.div>

          {/* Right - Building render */}
          <motion.div {...fadeInRight} className="flex items-center justify-end">
            <img
              src={buildingImg}
              alt="Future museum building render"
              className="w-full max-w-lg 3xl:max-w-2xl h-auto"
            />
          </motion.div>
        </div>

        {/* MIAA Timeline heading */}
        <motion.div {...fadeInUp}>
          <h3 className="text-2xl md:text-3xl 3xl:text-4xl font-medium text-primary mb-8">
            <Text k="home.timeline.subheading" />
          </h3>
        </motion.div>

        {/* Timeline cards — 4 columns, full bleed */}
        <motion.div
          {...staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          {TIMELINE_MILESTONES.map((milestone, i) => (
            <motion.div key={milestone.year} {...staggerItem} className="group">
              {/* Image card with year + text overlay */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={timelineImages[i]}
                  alt={milestone.text}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Gradient for text readability */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
                {/* Year + description inside image */}
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-base md:text-lg 3xl:text-xl font-medium text-white mb-1 font-barlow">
                    {milestone.year}
                  </p>
                  <p className="text-base 3xl:text-lg text-white leading-snug">
                    {milestone.text}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
