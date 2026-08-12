import { motion } from "framer-motion"
import { fadeInLeft, fadeInRight, staggerContainer, staggerItem } from "../../../lib/motion"

import patternKufic from "../../../assets/images/Homepage/SMWF/pattern-kufic.png"
import { useMedia } from "../../../content/context"

const BULLETS = [
  "Muslim students in Years 7 to 12",
  "Enrolled in a Sydney school or registered home-schooler based in Sydney",
  "Poetry, Short Prose (Fiction), Creative Non-Fiction",
]

const SUBMIT_URL = "https://www.miaaustralia.org/smwf"

export default function SMWFStoriesWeInheritSection() {
  const image = useMedia("smwf.stories.image")
  return (
    <section
      id="smwf-stories-we-inherit"
      className="relative overflow-hidden"
      style={{ backgroundColor: "#124039" }}
    >
      {/* Kufic pattern — one tile stretched to 100% of the section width */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen"
        style={{
          backgroundImage: `url(${patternKufic})`,
          backgroundSize: "100% auto",
          backgroundRepeat: "repeat-y",
          backgroundPosition: "center top",
        }}
      />

      <div className="relative z-10 max-w-[1500px] desktop:max-w-[1700px] 3xl:max-w-[2400px] 4xl:max-w-[3200px] mx-auto px-6 md:px-10 lg:px-14 desktop:px-16 3xl:px-20 4xl:px-28 py-16 md:py-20 lg:py-24 desktop:py-28 3xl:py-32 4xl:py-44">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 desktop:gap-16 3xl:gap-20 4xl:gap-28 items-center">
          {/* Left column — text */}
          <motion.div {...fadeInLeft}>
            <span
              className="inline-block px-5 md:px-6 desktop:px-7 3xl:px-8 4xl:px-10 py-2 md:py-2.5 desktop:py-3 3xl:py-3.5 4xl:py-5 rounded-full font-aeonik text-xs md:text-sm desktop:text-[0.9375rem] 3xl:text-base 4xl:text-xl font-semibold tracking-[0.18em] uppercase mb-8 md:mb-10 desktop:mb-12 3xl:mb-14 4xl:mb-20"
              style={{ backgroundColor: "#C15C45", color: "#FFFFFF" }}
            >
              SMWF 2026
            </span>

            <h2 className="font-aeonik text-white text-4xl md:text-5xl lg:text-6xl desktop:text-[4.25rem] 3xl:text-[5rem] 4xl:text-[7rem] font-medium tracking-tight leading-[1.05] mb-8 md:mb-10 desktop:mb-12 3xl:mb-14 4xl:mb-20">
              The Stories We Inherit
            </h2>

            <p className="font-barlow text-white text-lg md:text-xl desktop:text-[1.375rem] 3xl:text-2xl 4xl:text-4xl mb-6 md:mb-8 desktop:mb-10 3xl:mb-12 4xl:mb-16">
              Student Writing Competition
            </p>

            <motion.ul
              {...staggerContainer}
              className="space-y-3 md:space-y-4 desktop:space-y-5 3xl:space-y-6 4xl:space-y-9 mb-10 md:mb-12 desktop:mb-14 3xl:mb-16 4xl:mb-24"
            >
              {BULLETS.map((item) => (
                <motion.li
                  key={item}
                  {...staggerItem}
                  className="flex items-start gap-3 md:gap-4 desktop:gap-5 4xl:gap-7"
                >
                  <span
                    aria-hidden
                    className="block w-1.5 h-1.5 md:w-2 md:h-2 desktop:w-2.5 desktop:h-2.5 3xl:w-2.5 3xl:h-2.5 4xl:w-4 4xl:h-4 rounded-full mt-2.5 md:mt-3 desktop:mt-3 3xl:mt-3.5 4xl:mt-5 shrink-0"
                    style={{ backgroundColor: "#FFFFFF" }}
                  />
                  <span className="font-barlow text-white/85 text-base md:text-lg desktop:text-[1.1875rem] 3xl:text-xl 4xl:text-3xl leading-relaxed">
                    {item}
                  </span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.a
              href={SUBMIT_URL}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="inline-flex items-center gap-2 desktop:gap-2.5 4xl:gap-4 px-7 md:px-8 desktop:px-10 3xl:px-12 4xl:px-16 py-3.5 md:py-4 desktop:py-5 3xl:py-6 4xl:py-8 font-aeonik text-xs md:text-sm desktop:text-base 3xl:text-lg 4xl:text-2xl font-semibold tracking-[0.18em] uppercase rounded-none"
              style={{ backgroundColor: "#CBCE58", color: "#124039" }}
            >
              Submit Your Entry Here
            </motion.a>
          </motion.div>

          {/* Right column — image */}
          <motion.div
            {...fadeInRight}
            className="w-full"
          >
            <div className="aspect-[5/4] lg:aspect-[6/5] desktop:aspect-[7/5] 3xl:aspect-[7/5] 4xl:aspect-[8/5] overflow-hidden rounded-lg">
              <img
                src={image.src}
                alt={image.alt}
                className="block w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
