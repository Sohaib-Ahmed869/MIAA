import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { fadeInLeft, fadeInRight, fadeInUp } from "../../../lib/motion"
import CTAButton from "../../ui/Button"
import founderImg from "../../../assets/images/Support/founder-portrait.jpg"
import donorEventImg from "../../../assets/images/Support/donor-event.png"

const SPONSORSHIP_ITEMS = [
  { title: "Faith Gallery & Prayer Hall", image: donorEventImg },
  { title: "Children's Gallery", image: founderImg },
  { title: "Entry Foyer", image: donorEventImg },
  { title: "Temporary/Touring Gallery", image: founderImg },
  { title: "Function Room Sponsorship", image: donorEventImg },
  { title: "Library and Resource Centre", image: founderImg },
  { title: "Gallery Sponsorship", image: donorEventImg },
  { title: "Central Courtyard/Internal Garden", image: founderImg },
]

export default function FoundingMemberSection() {
  const [hoveredIdx, setHoveredIdx] = useState(null)

  return (
    <section className="py-16 md:py-24 3xl:py-32 bg-accent-cream">
      <div className="max-w-[1400px] 3xl:max-w-[3200px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24">
        {/* Top row — image + text */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left — founder portrait */}
          <motion.div {...fadeInLeft}>
            <div className="overflow-hidden">
              <img
                src={founderImg}
                alt="MIAA member visiting a gallery"
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>

          {/* Right — heading, text, CTA */}
          <motion.div {...fadeInRight} className="flex flex-col gap-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[2.5rem] 3xl:text-[3.2rem] font-medium text-primary tracking-tight leading-snug lg:max-w-lg 3xl:max-w-2xl">
              Become a founding member of the Museum of Islamic Art Australia
            </h2>

            <p className="text-base sm:text-lg md:text-xl 3xl:text-2xl text-primary leading-relaxed lg:max-w-lg 3xl:max-w-2xl">
              Founding members of the museum will be listed on our dedicated
              donor&rsquo;s wall and museum archive. Donations can be made on
              behalf of an individual (named or anonymous) or a family. Founding
              members donations start from $5,000
            </p>

            <p className="text-sm sm:text-base 3xl:text-lg text-primary leading-relaxed lg:max-w-lg 3xl:max-w-2xl">
              Donate and sponsor an entire gallery, facility or hall. Contact
              MIAA directly for more details.
            </p>

            <div className="flex flex-wrap items-center gap-6 mt-2">
              <CTAButton to="/donate" className="px-5 sm:px-7 py-3 sm:py-3.5 rounded-lg">Donate Now</CTAButton>
              <p className="text-sm md:text-[0.9375rem] 3xl:text-lg text-primary font-semibold italic leading-snug max-w-[260px] 3xl:max-w-[16rem]">
                Stay in touch and be the first to hear about our upcoming
                campaign
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom row — sponsorship grid */}
        <motion.div
          {...fadeInUp}
          className="mt-16 md:mt-20 grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 lg:gap-16 items-start"
        >
          {/* Left label */}
          <p className="text-lg md:text-xl 3xl:text-2xl font-semibold text-primary leading-relaxed">
            Founding individuals and businesses (includes naming rights for 10
            years and permanent founding member status) available for the
            following:
          </p>

          {/* Right grid of items — 2 columns with hover effect */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SPONSORSHIP_ITEMS.map((item, i) => (
              <div
                key={item.title}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`relative px-5 py-4 3xl:px-6 3xl:py-5 text-sm md:text-[0.9375rem] 3xl:text-base text-primary cursor-pointer rounded-lg transition-colors duration-200 ${
                  hoveredIdx === i ? "bg-[#E5DED6]" : "bg-white"
                }`}
              >
                {item.title}

                {/* Hover image */}
                <AnimatePresence>
                  {hoveredIdx === i && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
                      animate={{ opacity: 1, scale: 1, rotate: 3 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.25 }}
                      className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 w-[140px] h-[90px] 3xl:w-[10vw] 3xl:h-[6vw] rounded-lg overflow-hidden z-10 pointer-events-none shadow-lg"
                    >
                      <img
                        src={item.image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
