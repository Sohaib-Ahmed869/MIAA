import { useRef } from "react"
import { motion } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import CTAButton from "../../ui/Button"
import Text from "../../../content/Text"
import { useText, useMedia } from "../../../content/context"

import heroBgPattern from "../../../assets/images/GalaDinner/herobgpattern.png"

gsap.registerPlugin(ScrollTrigger)

export default function GalaHeroSection() {
  const image = useMedia("gala.hero.image")
  const sectionRef = useRef(null)
  const imgRef = useRef(null)
  const t = useText()

  useGSAP(() => {
    gsap.fromTo(
      imgRef.current,
      { yPercent: -12 },
      {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      }
    )
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="relative h-auto md:h-screen md:min-h-[37.5rem] md:max-h-[1200px] 3xl:max-h-none 3xl:h-screen overflow-hidden flex flex-col">
      {/* Top section — teal bg with pattern + centered text */}
      <div className="relative flex-none md:flex-1 flex flex-col items-center justify-center bg-primary pt-28 pb-20 md:pt-32 md:pb-0 3xl:pt-36">
        {/* Hero background pattern */}
        <div className="absolute inset-0">
          <img src={heroBgPattern} alt="" className="w-full h-full object-cover" />
        </div>

        {/* Hero text — staggered entrance */}
        <div className="relative z-10 text-center px-6">
          <motion.p
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-display text-xs sm:text-sm md:text-lg 3xl:text-2xl tracking-[0.35em] uppercase mb-1"
            style={{ color: "#F3EFEB" }}
          >
            <Text k="gala.hero.eyebrow" />
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl 3xl:text-9xl font-medium tracking-tight leading-none gala-heading"
          >
            <Text k="gala.hero.title" />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-display text-base sm:text-lg md:text-2xl 3xl:text-3xl tracking-tight uppercase mt-2"
            style={{ color: "#F3EFEB" }}
          >
            <Text k="gala.hero.subtitle" />
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-6 md:mt-8 mb-8 md:mb-12"
          >
            <CTAButton
              href="https://tickets.miaaustralia.org/checkout/view-event/id/8327602/chk/17d4/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6"
            >
              {t("gala.hero.cta")}
            </CTAButton>
          </motion.div>
        </div>
      </div>

      {/* Hero image — parallax scroll */}
      <div className="relative flex-none md:flex-1 w-full h-[70vh] sm:h-[65vh] md:h-auto bg-primary overflow-hidden">
        <img
          ref={imgRef}
          src={image.src}
          alt={image.alt}
          className="w-full object-cover object-top block will-change-transform scale-110"
          style={{ height: "100%" }}
        />
      </div>
    </section>
  )
}
