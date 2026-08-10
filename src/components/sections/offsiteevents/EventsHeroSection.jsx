import { motion } from "framer-motion"
import Text from "../../../content/Text"

import hero1 from "../../../assets/images/MIAEvents/events-hero-1.png"
import hero2 from "../../../assets/images/MIAEvents/events-hero-2.png"
import hero3 from "../../../assets/images/MIAEvents/events-hero-3.png"

const HERO_PHOTOS = [
  { src: hero1, alt: "Meet the award-winning author book launch", aspect: 300 / 417 },
  { src: hero2, alt: "MIAA community panel discussion", aspect: 691 / 417 },
  { src: hero3, alt: "Visitors connecting at a MIAA event", aspect: 409 / 417 },
]

export default function EventsHeroSection() {
  const loopPhotos = [...HERO_PHOTOS, ...HERO_PHOTOS]

  return (
    <section className="relative bg-bg-deep overflow-hidden">
      {/* Title */}
      <div className="relative z-10 w-full px-6 md:px-10 lg:px-16 3xl:px-24 pt-28 md:pt-32 pb-8 md:pb-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-3xl md:text-4xl lg:text-[2.6rem] 3xl:text-[4.5rem] font-medium text-accent-cream tracking-tight leading-tight"
        >
          <Text k="offsite.hero.title" />
        </motion.h1>
      </div>

      {/* Infinite auto-scrolling carousel */}
      <div className="w-full pb-10 md:pb-14 overflow-hidden">
        <div className="flex gap-4 events-hero-carousel will-change-transform">
          {loopPhotos.map((photo, i) => (
            <div
              key={i}
              className="flex-shrink-0 h-[17.5rem] md:h-[23.75rem] lg:h-[28.125rem] overflow-hidden rounded-sm"
              style={{ aspectRatio: photo.aspect }}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover block"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
