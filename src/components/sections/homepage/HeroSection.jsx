import { useRef } from "react"
import { motion } from "framer-motion"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import heroVideo from "../../../assets/videos/homeVideo.mp4"
import GalaBanner from "./GalaBanner"
import HeroDonationWidget from "./HeroDonationWidget"

gsap.registerPlugin(ScrollTrigger)

export default function HeroSection() {
  const sectionRef = useRef(null)

  useGSAP(
    () => {
      gsap.to(".hero-ornament-1", {
        y: -12,
        rotation: 8,
        duration: 4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      })
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col bg-bg-deep overflow-hidden">
      {/* Full-screen background video */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute inset-0 z-0"
      >
        <video
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>

      {/* Content — text left, donation widget right on desktop */}
      <div className="relative z-10 mt-auto w-full px-6 md:px-10 lg:px-16 3xl:px-24 pb-8 md:pb-12 3xl:pb-16">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-10">
          {/* Left: heading + description */}
          <div className="flex-1 min-w-0">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-[2.2rem] md:text-[2.8rem] lg:text-[3.2rem] 3xl:text-[4.5rem] font-medium text-accent-cream leading-[1.15] tracking-tight"
            >
              A Space for Art, Culture
              <br />
              and Community
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
              className="text-sm md:text-[0.9375rem] text-accent-cream leading-relaxed max-w-md 3xl:max-w-lg font-medium mt-4 md:mt-6"
            >
              Explore our website to discover information about Australia&apos;s
              first Islamic Museum dedicated to the arts. We invite you to join
              us on this unique journey as we navigate the various stages and
              milestones of this exciting museum project.
            </motion.p>
          </div>

          {/* Right: CMS-controlled donation widget */}
          <div className="flex-shrink-0">
            <HeroDonationWidget />
          </div>
        </div>
      </div>

      {/* Scrolling Gala Dinner banner — bottom of hero */}
      <GalaBanner />
    </section>
  )
}
