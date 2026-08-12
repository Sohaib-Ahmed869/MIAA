import { motion } from "framer-motion"
import { fadeInLeft, fadeInRight } from "../../../lib/motion"
import CTAButton from "../../ui/Button"
import Text from "../../../content/Text"
import { useMemo } from "react"
import { useText, useMediaResolver } from "../../../content/context"

import bgPattern from "../../../assets/images/Homepage/SMWF/SMWF-BGPATTERN.png"
import smwfLogo from "../../../assets/images/Homepage/SMWF/smwflogo.png"

const CAROUSEL_KEYS = [
  "home.smwf.image1",
  "home.smwf.image2",
  "home.smwf.image3",
  "home.smwf.image4",
]

function QuatrefoilIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 100 100" fill="#fff">
      <circle cx="50" cy="22" r="25" />
      <circle cx="50" cy="78" r="25" />
      <circle cx="22" cy="50" r="25" />
      <circle cx="78" cy="50" r="25" />
      <rect x="22" y="22" width="56" height="56" rx="4" fill="#fff" />
    </svg>
  )
}

function BannerStrip({ text, count = 30 }) {
  return (
    <div className="flex whitespace-nowrap gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-2.5 text-white font-aeonik text-base 3xl:text-xl font-normal tracking-wide flex-shrink-0"
        >
          <QuatrefoilIcon />
          {text}
        </span>
      ))}
    </div>
  )
}

export default function SMWFSection() {
  const media = useMediaResolver()
  // Repeated enough times for a seamless infinite scroll (no flicker on reset)
  const carouselImages = useMemo(() => {
    const base = CAROUSEL_KEYS.map(media)
    return [...base, ...base, ...base, ...base]
  }, [media])

  const t = useText()
  return (
    <section className="py-16 md:py-24 3xl:py-32 bg-bg overflow-hidden">
      <div className="max-w-[1400px] 3xl:max-w-[3200px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-0 items-stretch">
          {/* Left content */}
          <motion.div {...fadeInLeft} className="pr-0 lg:pr-12 py-4">
            <div className="mb-6">
              <img
                src={smwfLogo}
                alt="Sydney Muslim Writers Festival"
                className="h-12 3xl:h-12 w-44 3xl:w-52 object-contain block"
              />
            </div>

            <h2 className="text-3xl md:text-4xl 3xl:text-[3.2rem] font-medium text-primary tracking-tight leading-snug">
              <Text k="home.smwf.heading" />
            </h2>
            <p className="italic text-secondary-wine mt-4 text-base 3xl:text-xl font-medium">
              <Text k="home.smwf.tagline" />
            </p>
            <p className="mt-2 text-sm 3xl:text-lg text-primary leading-normal ">
              <Text k="home.smwf.body" />
            </p>
            <div className="mt-8">
              <CTAButton to="/events">{t("home.smwf.cta")}</CTAButton>
            </div>
          </motion.div>

          {/* Right panel */}
          <motion.div
            {...fadeInRight}
            className="relative min-h-[480px] md:min-h-[33.75rem] 3xl:min-h-[35vw] rounded-lg overflow-hidden"
          >
            {/* Teal base + repeating pattern */}
            <div
              className="absolute inset-0 bg-primary"
              style={{
                backgroundImage: `url(${bgPattern})`,
                backgroundSize: "100% auto",
                backgroundRepeat: "repeat",
              }}
            />

            {/* Vertical auto-carousel — entire column rotated diagonally */}
            <div
              className="absolute z-10 flex justify-center"
              style={{
                top: "-30%",
                bottom: "-30%",
                left: "-5%",
                right: "-5%",
                transform: "rotate(-8deg)",
              }}
            >
              <div className="smwf-vertical-carousel flex flex-col items-center gap-3 md:gap-4">
                {carouselImages.map((src, i) => (
                  <div
                    key={i}
                    className="smwf-carousel-item flex-shrink-0 w-[260px] sm:w-[320px] md:w-[26rem] 3xl:w-[20vw] rounded-lg overflow-hidden shadow-lg border-[4px] md:border-[6px] border-white"
                  >
                    <img
                      src={src}
                      alt="SMWF event"
                      className="w-full object-cover block"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Top diagonal banner — "18 April 2026" */}
            <div
              className="absolute z-20"
              style={{
                top: 5,
                left: -300,
                right: -300,
                transform: "rotate(13deg)",
                backgroundColor: "#DD613E",
                padding: "14px 0",
              }}
            >
              <div className="smwf-banner-top">
                <BannerStrip text="18 April 2026" />
              </div>
            </div>

            {/* Bottom diagonal banner — "Festival Day" */}
            <div
              className="absolute z-20"
              style={{
                bottom: 45,
                left: -300,
                right: -300,
                transform: "rotate(-18deg)",
                backgroundColor: "#4656CD",
                padding: "14px 0",
              }}
            >
              <div className="smwf-banner-bottom">
                <BannerStrip text="Festival Day" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
