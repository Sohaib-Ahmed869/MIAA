import { motion } from "framer-motion"
import { fadeInLeft, fadeInRight } from "../../../lib/motion"
import { useEmbed } from "../../../content/context"

import smwfLogo from "../../../assets/images/Homepage/SMWF/smwf-green.svg"

const SECTION_BG = "#F3EFEB"
const INK         = "#124039"

// Vimeo embed URL — scraped from miaaustralia.org/smwf "Behind the Mark" section.
// Native Vimeo player handles play/pause/timeline/3-dot menu/Vimeo branding.
export default function SMWFBehindTheMarkSection() {
  // Editable in admin → Site Content. The native player keeps play/pause,
  // the timeline scrubber and Vimeo branding.
  const videoUrl = useEmbed("smwf.mark.videoUrl")

  return (
    <section
      id="smwf-mark"
      className="py-20 md:py-24 lg:py-28 desktop:py-32 3xl:py-40 4xl:py-56"
      style={{ backgroundColor: SECTION_BG }}
    >
      <div className="max-w-[1500px] desktop:max-w-[1700px] 3xl:max-w-[3200px] 4xl:max-w-[4000px] mx-auto px-6 md:px-10 lg:px-14 desktop:px-20 3xl:px-20 4xl:px-32">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-16 desktop:gap-20 3xl:gap-24 4xl:gap-32 items-center">
          {/* LEFT — vertical Vimeo video */}
          <motion.div {...fadeInLeft} className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[260px] sm:max-w-[280px] md:max-w-[300px] desktop:max-w-[360px] 3xl:max-w-[420px] 4xl:max-w-[600px]">
              {/* 264:432 aspect from the original iframe — set via padding-bottom so the iframe fills it */}
              <div className="relative w-full" style={{ paddingBottom: "163.6%" /* 432/264 */ }}>
                <iframe
                  src={videoUrl}
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title="The Meaning Behind the Mark"
                />
              </div>
            </div>
          </motion.div>

          {/* RIGHT — heading + body + logo */}
          <motion.div {...fadeInRight}>
            <h2
              className="font-aeonik text-3xl md:text-4xl lg:text-5xl desktop:text-6xl 3xl:text-7xl 4xl:text-[6.5rem] font-medium tracking-tight leading-tight"
              style={{ color: INK }}
            >
              The Meaning Behind the Mark
            </h2>
            <p
              className="mt-6 md:mt-7 desktop:mt-8 3xl:mt-10 4xl:mt-14 font-barlow text-base md:text-lg desktop:text-xl 3xl:text-2xl 4xl:text-4xl leading-relaxed max-w-lg desktop:max-w-xl 3xl:max-w-2xl 4xl:max-w-5xl"
              style={{ color: INK }}
            >
              The SMWF logo is more than an image — it&apos;s a story of voices,
              roots, and unity. Watch the video to see how its elements come
              together to reflect who we are and what we stand for.
            </p>

            <div className="mt-8 md:mt-10 desktop:mt-12 3xl:mt-14 4xl:mt-20">
              <img
                src={smwfLogo}
                alt="Sydney Muslim Writers Festival logo"
                className="h-20 md:h-24 lg:h-28 desktop:h-32 3xl:h-36 4xl:h-52 w-auto"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
