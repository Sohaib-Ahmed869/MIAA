import { motion } from "framer-motion"
import { useMemo } from "react"
import Text from "../../../content/Text"
import { useText, useMediaResolver } from "../../../content/context"


// Aspect ratios are part of the carousel layout; the files themselves and
// their descriptions are editable in admin → Site Content.
const HERO_PHOTOS = [
  { key: "offsite.hero.image1", aspect: 300 / 417 },
  { key: "offsite.hero.image2", aspect: 691 / 417 },
  { key: "offsite.hero.image3", aspect: 409 / 417 },
]

export default function EventsHeroSection() {
  const media = useMediaResolver()
  const t = useText()
  const photos = useMemo(
    () => HERO_PHOTOS.map((p) => ({ ...p, src: media(p.key), alt: t(`${p.key}.alt`) })),
    [media, t]
  )
  const loopPhotos = [...photos, ...photos]

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
