import { useRef } from "react"
import { motion } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import heroImg from "../../../assets/images/About/about-hero.png"
import floatingOrnament from "../../../assets/images/About/float1.png"
import Text from "../../../content/Text"

gsap.registerPlugin(ScrollTrigger)

export default function AboutHeroSection() {
  const sectionRef = useRef(null)
  const imgRef = useRef(null)

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
    <section ref={sectionRef} className="relative bg-bg-deep overflow-hidden 3xl:h-[85vh] 3xl:flex 3xl:flex-col">
      {/* Dotted divider under navbar — matches the nav overlay style */}
      <div
        className="absolute top-20 md:top-24 3xl:top-28 left-4 sm:left-6 md:left-10 lg:left-16 3xl:left-24 right-4 sm:right-6 md:right-10 lg:right-16 h-[2px] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(215,184,147,0.4) 0.09375rem, transparent 0.09375rem)",
          backgroundSize: "0.5rem 0.1875rem",
        }}
      />

      {/* Title */}
      <div className="relative z-10 w-full px-6 md:px-10 lg:px-16 3xl:px-24 pt-28 md:pt-32 pb-10 md:pb-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-[2.2rem] md:text-[2.8rem] lg:text-[3.4rem] 3xl:text-[4.5rem] font-medium text-accent-cream leading-[1.1] tracking-tight max-w-4xl 3xl:max-w-5xl"
        >
          <Text k="about.hero.title" />
        </motion.h1>
      </div>

      {/* Hero image + floating ornament */}
      <div className="relative 3xl:flex-1">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="w-full"
        >
          <div className="w-full h-[70vh] sm:h-[65vh] md:h-[26.25rem] lg:h-[32.5rem] 3xl:h-full overflow-hidden">
            <img
              ref={imgRef}
              src={heroImg}
              alt="Audience at MIAA event"
              className="w-full object-cover object-center scale-150 md:scale-[1.2] block will-change-transform"
              style={{ height: "120%" }}
            />
          </div>
        </motion.div>

        {/* Floating glossy quatrefoil — right edge, straddling the image bottom */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 1 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="hero-float pointer-events-none absolute z-20 right-[4%] md:right-[6%] lg:right-[8%] -top-12 md:-top-20 lg:-top-28 3xl:-top-36 w-32 md:w-48 lg:w-64 3xl:w-80"
        >
          <img src={floatingOrnament} alt="" className="w-full h-auto" />
        </motion.div>
      </div>
    </section>
  )
}
