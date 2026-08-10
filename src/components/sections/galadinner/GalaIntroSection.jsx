import { motion } from "framer-motion"
import { fadeInLeft, fadeInRight } from "../../../lib/motion"
import SectionDivider from "../../ui/SectionDivider"
import Text from "../../../content/Text"
import { splitParagraphs } from "../../../content/format"
import { useText } from "../../../content/context"

import artHorse from "../../../assets/images/GalaDinner/art-01-horse.png"
import artGrill from "../../../assets/images/GalaDinner/art-02-grill.png"
import section2bg from "../../../assets/images/GalaDinner/section2bg.png"

export default function GalaIntroSection() {
  const t = useText()
  const caption = (
    <>
      {t("gala.intro.captionText")} ~ <span className="font-semibold">{t("gala.intro.captionAuthor")}</span>
    </>
  )
  return (
    <section className="relative pt-8 md:pt-24 pb-20 md:pb-48 overflow-hidden bg-accent-cream">
      {/* Background — section2bg */}
      <div className="absolute inset-0">
        <img src={section2bg} alt="" className="w-full h-full object-cover object-left" />
      </div>

      {/* Section divider */}
      <div className="relative z-10 mb-10 max-w-[1400px] 3xl:max-w-[3200px] mx-auto">
        <SectionDivider label={t("gala.intro.label")} bg="bg-transparent" variant="light" />
      </div>

      <div className="relative z-10 max-w-[1400px] 3xl:max-w-[3200px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Left — Text content */}
          <motion.div {...fadeInLeft} className="flex-1">
            <h2 className="font-display text-2xl md:text-3xl 3xl:text-[3.2rem] font-medium text-primary leading-tight tracking-wide mb-6 uppercase">
              <Text k="gala.intro.heading" />
            </h2>
            <div className="flex flex-col gap-4 text-base 3xl:text-xl text-primary leading-relaxed font-medium tracking-wide max-w-[31.25rem]">
              {splitParagraphs(t("gala.intro.body")).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </motion.div>

          {/* Right — Two art images stacked */}
          <motion.div {...fadeInRight} className="flex-1 flex flex-col gap-10">
            {/* Top — Horse image with caption below */}
            <div className="flex flex-col items-start">
              <div className="border border-white bg-white p-1 shadow-lg w-full max-w-[13.75rem]">
                <img
                  src={artHorse}
                  alt="Islamic art — horse painting"
                  className="w-full h-auto object-cover"
                />
              </div>
              <p className="text-[0.5rem] text-black mt-2 italic leading-snug max-w-[13.75rem]">
                {caption}
              </p>
            </div>

            {/* Bottom — Grill image with caption centered on the left */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <p className="text-[0.5rem] text-black italic leading-snug sm:max-w-[7rem]">
                {caption}
              </p>
              <div className="border border-white bg-white p-1 shadow-lg w-full max-w-[18.75rem] flex-shrink-0">
                <img
                  src={artGrill}
                  alt="Islamic architectural detail"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
