import { useRef, useEffect } from "react"
import { motion } from "framer-motion"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { fadeInLeft, fadeInRight } from "../../../lib/motion"
import float2 from "../../../assets/images/About/float2.png"
import Text from "../../../content/Text"
import { splitParagraphs } from "../../../content/format"
import { useText, useMedia } from "../../../content/context"

gsap.registerPlugin(ScrollTrigger)

function QuatrefoilMarker({ size = 11 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="#C15C45"
      className="flex-shrink-0"
    >
      <circle cx="50" cy="22" r="25" />
      <circle cx="50" cy="78" r="25" />
      <circle cx="22" cy="50" r="25" />
      <circle cx="78" cy="50" r="25" />
      <rect x="22" y="22" width="56" height="56" rx="4" />
    </svg>
  )
}

export default function DirectorMessageSection() {
  const image = useMedia("about.director.image")
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const viewportRef = useRef(null)
  const t = useText()
  const paragraphs = splitParagraphs(t("about.director.body"))
  useGSAP(
    () => {
      const track = trackRef.current
      const viewport = viewportRef.current
      if (!track || !viewport) return

      const mm = gsap.matchMedia()

      const getOverflow = () =>
        Math.max(0, track.scrollHeight - viewport.clientHeight)

      if (getOverflow() <= 0) return

      gsap.set(track, { y: 0 })

      // Desktop: pin entire section
      mm.add("(min-width: 768px)", () => {
        gsap.to(track, {
          y: () => -getOverflow(),
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${window.innerHeight * 2}`,
            pin: true,
            pinSpacing: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })
      })

      // Mobile: single pinned ScrollTrigger that scrubs the text.
      // Using one trigger (instead of separate pin + scrub) prevents the
      // section below from jittering while the user scrolls the panel.
      mm.add("(max-width: 767px)", () => {
        gsap.to(track, {
          y: () => -getOverflow(),
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${window.innerHeight * 2}`,
            pin: true,
            pinSpacing: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        })
      })

      return () => mm.revert()
    },
    { scope: sectionRef }
  )

  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 500)
    return () => clearTimeout(id)
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative bg-bg-deep min-h-screen flex flex-col"
      style={{ clipPath: "inset(0 0 0 0)", fontSize: "clamp(18px, 1.22vw - 8.84px, 38px)" }}
    >
      {/* Section label + dotted divider */}
      <div className="relative z-10 px-6 md:px-10 lg:px-16 3xl:px-24 pt-10 md:pt-28 3xl:pt-[120px] pb-4 md:pb-16 3xl:pb-[60px]">
        <div className="flex items-center gap-2 mb-2">
          <QuatrefoilMarker />
          <span className="text-[0.625rem] 3xl:text-sm font-normal tracking-[0.2em] uppercase text-secondary-terra">
            <Text k="about.director.label" />
          </span>
        </div>
        <div
          className="h-[2px] w-full"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(215,184,147,0.4) 0.09375rem, transparent 0.09375rem)",
            backgroundSize: "0.5rem 0.1875rem",
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1400px] 3xl:max-w-[2400px] w-full mx-auto px-6 md:px-10 lg:px-16 3xl:px-24 pb-10 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-6 lg:gap-20 items-stretch">
          {/* Left — heading at top, director card aligned with panel bottom */}
          <motion.div {...fadeInLeft} className="flex flex-col">
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] 3xl:text-[3.2rem] font-medium text-accent-cream tracking-tight leading-[1.1]">
              <Text k="about.director.heading" />
            </h2>

            <div className="mt-auto pt-6 md:pt-16">
              <div className="w-24 h-24 md:w-28 md:h-28 3xl:w-36 3xl:h-36 rounded-full overflow-hidden border-2 border-accent-wheat/30 mb-5">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </div>

              <p
                className="text-3xl md:text-4xl 3xl:text-5xl text-accent-cream leading-tight mb-2 md:mb-5"
                style={{ fontFamily: "var(--font-script)" }}
              >
                <Text k="about.director.name" />
              </p>

              <ul className="flex flex-col gap-2">
                <li className="flex items-start gap-2.5">
                  <span className="mt-1.5">
                    <QuatrefoilMarker size={8} />
                  </span>
                  <span className="text-[0.8125rem] 3xl:text-base text-accent-cream/85 leading-snug">
                    <Text k="about.director.role1" />
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1.5">
                    <QuatrefoilMarker size={8} />
                  </span>
                  <span className="text-[0.8125rem] 3xl:text-base text-accent-cream/85 leading-snug">
                    <Text k="about.director.role2" />
                  </span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Right — white message panel */}
          <motion.div {...fadeInRight} className="relative">
            {/* float2 — behind panel, bottom-left corner */}
            <div className="pointer-events-none absolute -bottom-32 -left-28 md:-bottom-40 md:-left-36 3xl:-bottom-44 3xl:-left-40 z-0 hero-float">
              <img src={float2} alt="" className="w-48 md:w-72 lg:w-80 3xl:w-96 h-auto drop-shadow-2xl" />
            </div>

            <div
              ref={viewportRef}
              className="relative z-10 bg-accent-cream rounded-3xl overflow-hidden h-[55vh] md:h-[50vh] 3xl:h-[60vh] px-6 md:px-8 3xl:px-10 py-6 shadow-xl"
            >
              {/* Fade gradients for smooth text clipping */}
              <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-accent-cream to-transparent z-10 pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-accent-cream to-transparent z-10 pointer-events-none" />

              <div ref={trackRef} className="will-change-transform pt-8">
                <div className="flex flex-col gap-5 text-sm md:text-[0.9375rem] 3xl:text-lg text-primary leading-relaxed">
                  {paragraphs.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
                {/* Bottom spacer so last paragraph scrolls fully into view */}
                <div className="h-12" />
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  )
}
