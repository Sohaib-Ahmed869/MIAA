import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { fadeInUp } from "../../../lib/motion"
import { useMediaResolver } from "../../../content/context"


const SECTION_BG = "#FFFFFF"
const INK         = "#124039"

const HIGHLIGHTS = [
  {
    title: "Panel Discussions",
    body: "Thought-provoking conversations with writers, academics, and creatives exploring pressing ideas, stories, and perspectives.",
    mediaKey: "smwf.highlights.image1",
  },
  {
    title: "Book Signings with Authors",
    body: "Meet your favourite authors in person and take home a signed copy as a treasured keepsake.",
    mediaKey: "smwf.highlights.image2",
  },
  {
    title: "Hanging Poem Exhibition",
    body: "Experience poetry brought to life through a stunning visual display of words suspended in space.",
    mediaKey: "smwf.highlights.image3",
  },
  {
    title: "Little Readers and Writers Corner",
    body: "A cosy space dedicated to children's love of books, brought to you by ISRA Children's Library.",
    mediaKey: "smwf.highlights.image4",
  },
  {
    title: "Stalls",
    body: "Browse a vibrant marketplace of books, art, and community initiatives.",
    mediaKey: "smwf.highlights.image5",
  },
  {
    title: "Teens with Pens",
    body: "A dynamic writing workshop for young creatives, guided by author George Green.",
    mediaKey: "smwf.highlights.image6",
  },
]

export default function SMWFProgramHighlightsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const media = useMediaResolver()
  const highlights = useMemo(
    () => HIGHLIGHTS.map((h) => ({ ...h, image: media(h.mediaKey) })),
    [media]
  )
  const activeImage = highlights[activeIndex].image

  return (
    <section
      id="smwf-highlights"
      className="py-20 md:py-24 lg:py-28 desktop:py-32 2xl:py-32 3xl:py-40 4xl:py-56"
      style={{ backgroundColor: SECTION_BG }}
    >
      <div className="max-w-[1500px] desktop:max-w-[1700px] 2xl:max-w-[1800px] 3xl:max-w-[3200px] 4xl:max-w-[4000px] mx-auto px-6 md:px-10 lg:px-14 desktop:px-20 2xl:px-16 3xl:px-20 4xl:px-32">
        <motion.h2
          {...fadeInUp}
          className="font-aeonik text-3xl md:text-4xl lg:text-5xl desktop:text-6xl 2xl:text-6xl 3xl:text-7xl 4xl:text-[6.5rem] font-medium tracking-tight leading-tight mb-10 md:mb-14 desktop:mb-16 2xl:mb-16 3xl:mb-20 4xl:mb-28"
          style={{ color: INK }}
        >
          Programme Highlights
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-14 desktop:gap-16 2xl:gap-16 3xl:gap-20 4xl:gap-28 items-start">
          {/* Left — photo that changes with active accordion item */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeIndex}
                src={activeImage}
                alt={HIGHLIGHTS[activeIndex].title}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
                className="absolute inset-0 block w-full h-full object-cover"
              />
            </AnimatePresence>
          </div>

          {/* Right — accordion list. Borders are computed per item so that
              both the line ABOVE and BELOW the currently-open item disappear
              (an opened item visually "floats" without dividers). */}
          <div>
            {highlights.map((item, i) => {
              const isOpen = i === activeIndex
              const prevOpen = i > 0 && i - 1 === activeIndex
              const isLast = i === highlights.length - 1
              // top border: hidden on the first item, AND hidden when the
              // previous item is open (since that would visually appear as
              // the open item's bottom divider). Always shown for the open
              // item itself.
              const showTopBorder = i > 0 && !prevOpen
              // bottom border: only on the last item, and only when it's closed.
              const showBottomBorder = isLast && !isOpen
              const borderClasses = [
                showTopBorder ? "border-t" : "",
                showBottomBorder ? "border-b" : "",
              ].filter(Boolean).join(" ")
              return (
                <div
                  key={item.title}
                  className={borderClasses}
                  style={{ borderColor: "rgba(18,64,57,0.18)" }}
                >
                  <button
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    className={`w-full text-left ${i === 0 ? "pt-0 pb-5 md:pb-6 desktop:pb-7 2xl:pb-7 3xl:pb-9 4xl:pb-12" : "py-5 md:py-6 desktop:py-7 2xl:py-7 3xl:py-9 4xl:py-12"} transition-opacity hover:opacity-75`}
                    aria-expanded={isOpen}
                  >
                    <h3
                      className="font-aeonik text-lg md:text-xl desktop:text-2xl 2xl:text-2xl 3xl:text-3xl 4xl:text-5xl font-semibold tracking-tight transition-colors"
                      style={{ color: isOpen ? "#2A9E9B" : INK }}
                    >
                      {item.title}
                    </h3>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="body"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                          className="overflow-hidden"
                        >
                          <p
                            className="font-barlow text-sm md:text-base desktop:text-lg 2xl:text-lg 3xl:text-xl 4xl:text-3xl leading-relaxed pt-3 md:pt-4 desktop:pt-5 2xl:pt-5 3xl:pt-6 4xl:pt-9 pr-2 md:pr-6 2xl:pr-8 4xl:pr-12"
                            style={{ color: "rgba(18,64,57,0.8)" }}
                          >
                            {item.body}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
