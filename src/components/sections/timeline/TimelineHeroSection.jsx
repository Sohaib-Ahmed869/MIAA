import { motion } from "framer-motion"
import { ArrowDownRight } from "lucide-react"
import { fadeInLeft, fadeInRight } from "../../../lib/motion"
import CTAButton from "../../ui/Button"
import renderImg from "../../../assets/images/Timeline/buildingfuture.jpg"
import float1 from "../../../assets/images/About/float1.png"
import Text from "../../../content/Text"
import { splitParagraphs } from "../../../content/format"
import { useText } from "../../../content/context"

export default function TimelineHeroSection() {
  const t = useText()
  return (
    <section className="relative z-20 bg-bg-deep">
      {/* Top — Title + intro split */}
      <div className="relative z-10 w-full px-6 md:px-10 lg:px-16 3xl:px-24 pt-28 md:pt-32 pb-10 md:pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left — Title + Donate CTA */}
          <motion.div {...fadeInLeft}>
            <h1 className="text-3xl md:text-4xl lg:text-[2.6rem] 3xl:text-[4.5rem] font-medium text-accent-cream tracking-tight leading-tight">
              <Text k="timeline.hero.title" />
            </h1>
            <div className="mt-6">
              <CTAButton href="#architecture" icon={ArrowDownRight}>{t("timeline.hero.cta")}</CTAButton>
            </div>
          </motion.div>

          {/* Right — Intro text */}
          <motion.div
            {...fadeInRight}
            className="flex flex-col gap-3 text-sm md:text-[0.9375rem] 3xl:text-xl text-accent-cream/85 leading-relaxed"
          >
            {splitParagraphs(t("timeline.hero.intro")).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Building render — full width, with float1 at the bottom-right cutting point */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="relative w-full"
      >
        <div className="w-full h-[55vh] md:h-[28.75rem] lg:h-[35rem] 3xl:h-[45vh] overflow-hidden">
          <img
            src={renderImg}
            alt="MIAA architectural render"
            className="w-full object-cover object-center block"
            style={{ height: "100%" }}
          />
        </div>

        {/* float1 — sits on the cutting edge (bottom of the render) on the right */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="hero-float pointer-events-none absolute z-50 right-4 md:right-10 lg:right-20 bottom-0 translate-y-1/2 w-28 md:w-40 lg:w-48 3xl:w-64"
        >
          <img src={float1} alt="" className="w-full h-auto drop-shadow-2xl" />
        </motion.div>
      </motion.div>
    </section>
  )
}
