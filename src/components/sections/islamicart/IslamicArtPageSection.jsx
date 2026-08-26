import { useRef, useMemo, useState, useEffect, forwardRef } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ZoomIn, ZoomOut, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"

import Text from "../../../content/Text"
import { splitParagraphs } from "../../../content/format"
import { useText, useMediaResolver } from "../../../content/context"
import { splitCaptionDate, creditLine } from "../../../lib/artCredit"

gsap.registerPlugin(ScrollTrigger)

// The centre text column is capped at max-w-xl (36rem) and centred, so the
// usable gutter on each side is `50% - 18rem`. A frame parked at a raw
// percentage walks straight into that column once the viewport drops below
// ~1300px (the client's 1024–1280 laptop band). `gutter` is the furthest the
// frame may sit from its edge before it would touch the text; the inline
// style takes min(percentage, gutter) so wide screens keep the signed-off
// scatter and narrow ones slide the frame back into the margin.
// gutter = 50% - (18rem column half + frame width + 0.75rem breathing room)
const GUTTER_W44 = "calc(50% - 29.75rem)" // frames that are lg:w-44 (11rem)
const GUTTER_W48 = "calc(50% - 30.75rem)" // frames that are lg:w-48 (12rem)

const BASE_FRAMES = [
  { mediaKey: "islamicart.gallery.image5", top: "3%", left: "4%", gutter: GUTTER_W44, size: "w-28 md:w-36 lg:w-44 3xl:w-[14vw]", parallaxFactor: 1.2, hoverWidth: "w-[14rem] lg:w-[16rem] 3xl:w-[18rem] relative left-1/2 -translate-x-1/2" },
  { mediaKey: "islamicart.gallery.image2", top: "35%", left: "2%", gutter: GUTTER_W44, size: "w-28 md:w-40 lg:w-44 3xl:w-[14vw]", parallaxFactor: 0.8, hoverWidth: "w-[16rem] lg:w-[18rem] 3xl:w-[20rem] relative left-1/2 -translate-x-1/2" },
  { mediaKey: "islamicart.gallery.image3", top: "68%", left: "12%", gutter: GUTTER_W48, size: "w-28 md:w-40 lg:w-48 3xl:w-[14vw]", parallaxFactor: 1.5, hoverWidth: "w-[16rem] lg:w-[18rem] 3xl:w-[20rem] relative left-1/2 -translate-x-1/2" },
  { mediaKey: "islamicart.gallery.image1", top: "8%", right: "4%", gutter: GUTTER_W48, size: "w-32 md:w-48 lg:w-48 3xl:w-[15vw]", parallaxFactor: 1.0 },
  { mediaKey: "islamicart.gallery.image4", top: "52%", right: "4%", gutter: GUTTER_W44, size: "w-28 md:w-40 lg:w-44 3xl:w-[14vw]", parallaxFactor: 1.3 },
]

const ArtFrame = forwardRef(function ArtFrame(
  { piece, isHovered, onHover, onLeave, onClick, springX, springY },
  ref,
) {
  const factor = piece.parallaxFactor
  const mx = useTransform(springX, (v) => -v * factor * 20)
  const my = useTransform(springY, (v) => -v * factor * 10)

  return (
    <div
      ref={ref}
      className={`${piece.size} absolute z-10 cursor-pointer hidden lg:block`}
      style={{
        top: piece.top,
        left: piece.left ? `min(${piece.left}, ${piece.gutter})` : undefined,
        right: piece.right ? `min(${piece.right}, ${piece.gutter})` : undefined,
      }}
    >
      <motion.div
        style={{ x: mx, y: my }}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        onClick={onClick}
      >
        <div className="border-[4px] border-secondary-terra overflow-hidden">
          <div className="border-[4px] border-white">
            <img
              src={piece.src}
              alt={piece.alt}
              className="w-full h-auto block"
            />
          </div>
        </div>

        <AnimatePresence>
          {isHovered && piece.credit && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.25 }}
              className={`mt-2.5 text-[0.625rem] lg:text-[0.6875rem] 3xl:text-sm text-accent-cream leading-snug text-center ${piece.hoverWidth || ""}`}
            >
              {/* Caption first, then the credit line underneath: artist,
                  title, and the year last. */}
              <span className="not-italic text-[0.5625rem] lg:text-[0.625rem] 3xl:text-xs font-normal opacity-80">
                {piece.caption}
              </span>
              <br />
              <span className="not-italic font-bold">{piece.credit}</span>
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
})

export default function IslamicArtPageSection() {
  const sectionRef = useRef(null)
  const pinRef = useRef(null)
  const wordsRef = useRef([])
  const frameRefs = useRef([])
  const trackRef = useRef(null)
  const viewportRef = useRef(null)
  const indicatorRef = useRef(null)
  const swiperRef = useRef(null)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [zoom, setZoom] = useState(1)
  const [drag, setDrag] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const t = useText()
  const media = useMediaResolver()

  // Artwork files *and* their credits are editable in admin → Site Content
  // (Islamic Art → Artwork credits); only the scatter positions stay here as
  // layout data. Home's Islamic Art block reads the same keys.
  const FRAMES = useMemo(
    () =>
      BASE_FRAMES.map((piece) => {
        const parsed = splitCaptionDate(t(`${piece.mediaKey}.caption`))
        const year = t(`${piece.mediaKey}.year`) || parsed.date
        const artist = t(`${piece.mediaKey}.artist`)
        const title = t(`${piece.mediaKey}.title`)
        return {
          ...piece,
          src: media(piece.mediaKey),
          artist,
          title,
          caption: parsed.caption,
          credit: creditLine(artist, title, year),
          // Title and year alone, for the lightbox where the artist is the
          // heading above.
          titleYear: creditLine("", title, year),
          alt: [creditLine(artist, title, year), parsed.caption]
            .filter(Boolean)
            .join(". "),
        }
      }),
    [media, t]
  )
  const PARAGRAPHS = splitParagraphs(t("islamicart.body"))

  const openLightbox = (i) => {
    setZoom(1)
    setDrag({ x: 0, y: 0 })
    setLightboxIndex(i)
  }

  const handleMouseDown = (e) => {
    setDragging(true)
    setDragStart({ x: e.clientX - drag.x, y: e.clientY - drag.y })
  }
  const handleMouseMove = (e) => {
    if (!dragging) return
    setDrag({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
  }
  const handleMouseUp = () => setDragging(false)

  useEffect(() => {
    if (lightboxIndex === null) return
    const onKey = (e) => {
      if (e.key === "Escape") setLightboxIndex(null)
    }
    window.addEventListener("keydown", onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [lightboxIndex])

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 })

  useEffect(() => {
    function onMove(e) {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      mouseX.set(x)
      mouseY.set(y)
    }
    window.addEventListener("mousemove", onMove)
    return () => window.removeEventListener("mousemove", onMove)
  }, [mouseX, mouseY])

  const wordTokens = useMemo(() => {
    const tokens = []
    PARAGRAPHS.forEach((para, pIdx) => {
      const words = para.split(/\s+/)
      words.forEach((w, wIdx) => {
        tokens.push({ word: w, paraIdx: pIdx, wordIdx: wIdx })
      })
    })
    return tokens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [PARAGRAPHS.length])

  useGSAP(
    () => {
      const wordEls = wordsRef.current.filter(Boolean)
      const track = trackRef.current
      const viewport = viewportRef.current
      if (!wordEls.length || !track || !viewport) return

      gsap.set(wordEls, { opacity: 0.18 })

      // Frames entrance — staggered rise from below
      const frames = frameRefs.current.filter(Boolean)
      if (frames.length) {
        gsap.set(frames, { y: 80, opacity: 0 })
        gsap.to(frames, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.15,
          delay: 0.3,
        })
      }

      const getOverflow = () => Math.max(0, track.scrollHeight - viewport.clientHeight)

      gsap.set(track, { y: 0 })

      // Scrubbed tween for text translation (like Director Message)
      gsap.to(track, {
        y: () => -getOverflow(),
        ease: "none",
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight * 2.5}`,
          pin: true,
          pinSpacing: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress
            // Word highlighting
            const start = 0.02
            const end = 0.95
            const local = Math.min(1, Math.max(0, (progress - start) / (end - start)))
            const targetCount = Math.round(local * wordEls.length)
            wordEls.forEach((el, idx) => {
              el.style.opacity = idx < targetCount ? "1" : "0.18"
            })
            // Scroll indicator
            if (indicatorRef.current) {
              indicatorRef.current.style.top = `${progress * 80}%`
            }
          },
        },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} className="relative bg-bg-deep pt-14 md:pt-20">
      <div ref={pinRef} className="relative w-full h-screen" style={{ clipPath: "inset(0 0 0 0)" }}>
        {/* Frames — mouse-tracking parallax + hover credits */}
        {FRAMES.map((piece, i) => (
          <ArtFrame
            key={i}
            ref={(el) => (frameRefs.current[i] = el)}
            piece={piece}
            isHovered={hoveredIndex === i}
            onHover={() => setHoveredIndex(i)}
            onLeave={() => setHoveredIndex(null)}
            onClick={() => openLightbox(i)}
            springX={springX}
            springY={springY}
          />
        ))}

        {/* Center column — title fixed, text scrolls in viewport */}
        <div className="absolute inset-0 z-20 flex justify-center pt-12 md:pt-16 px-4 pointer-events-none">
          <div className="w-full max-w-md md:max-w-lg lg:max-w-xl 3xl:max-w-2xl text-center flex flex-col">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-3xl md:text-4xl lg:text-[2.4rem] 3xl:text-[4.5rem] font-medium text-accent-cream tracking-tight leading-tight mb-6"
            >
              <Text k="islamicart.title" />
            </motion.h1>

            {/* Scrollable text viewport — like Director Message panel */}
            <div
              ref={viewportRef}
              className="relative flex-1 overflow-hidden mb-8"
            >
              {/* Fade gradients */}
              <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-bg-deep to-transparent z-10 pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-bg-deep to-transparent z-10 pointer-events-none" />

              <div ref={trackRef} className="will-change-transform pt-6">
                <div className="text-[0.875rem] md:text-[0.9375rem] lg:text-base 3xl:text-xl text-accent-cream leading-[1.7] tracking-wide space-y-3 md:space-y-4 text-left md:text-justify">
                  {PARAGRAPHS.map((para, pIdx) => {
                    const words = para.split(/\s+/)
                    return (
                      <p key={pIdx}>
                        {words.map((w, wIdx) => {
                          const flatIdx = wordTokens.findIndex(
                            (t) => t.paraIdx === pIdx && t.wordIdx === wIdx
                          )
                          return (
                            <span
                              key={`${pIdx}-${wIdx}`}
                              ref={(el) => (wordsRef.current[flatIdx] = el)}
                              className="transition-opacity duration-200"
                              style={{ opacity: 0.18 }}
                            >
                              {w}{" "}
                            </span>
                          )
                        })}
                      </p>
                    )
                  })}

                </div>
                <div className="h-16" />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Mobile/tablet art gallery — swipeable Swiper carousel.
          Shown up to lg: below 1024px there is no room for the scattered
          frames beside the text column, so the carousel carries the artwork. */}
      <div className="lg:hidden pb-10 relative">
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          onSwiper={(s) => { swiperRef.current = s }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          speed={800}
          spaceBetween={16}
          slidesPerView={1.2}
          breakpoints={{ 768: { slidesPerView: 2.2 } }}
          centeredSlides
          loop
          style={{
            "--swiper-pagination-color": "#D7B893",
            "--swiper-pagination-bullet-inactive-color": "#D7B893",
            "--swiper-pagination-bullet-inactive-opacity": "0.35",
          }}
        >
          {FRAMES.filter((_, i) => i !== 1).map((piece) => (
            <SwiperSlide key={piece.mediaKey}>
              <div
                onClick={() => openLightbox(FRAMES.indexOf(piece))}
                className="px-1 cursor-pointer"
              >
                {/* Image wrapper — buttons are centered relative to this */}
                <div className="relative">
                  <div className="border-[4px] border-secondary-terra overflow-hidden">
                    <div className="border-[4px] border-white">
                      <img
                        src={piece.src}
                        alt={piece.alt}
                        className="w-full h-auto block"
                      />
                    </div>
                  </div>
                </div>
                <div className="pb-8">
                  <p className="mt-3 text-[0.6875rem] text-accent-cream/60 leading-snug text-center">
                    {piece.caption}
                  </p>
                  <p className="mt-1.5 text-sm font-bold text-accent-cream text-center">
                    {piece.credit}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom nav arrows — positioned over the image area */}
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="absolute left-1 top-0 z-30 w-8 h-8 rounded-full bg-primary/60 backdrop-blur-sm flex items-center justify-center text-accent-cream active:scale-90 transition-transform"
          style={{ top: "calc(50% - 5rem)", transform: "translateY(-50%)" }}
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="absolute right-1 top-0 z-30 w-8 h-8 rounded-full bg-primary/60 backdrop-blur-sm flex items-center justify-center text-accent-cream active:scale-90 transition-transform"
          style={{ top: "calc(50% - 5rem)", transform: "translateY(-50%)" }}
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Lightbox modal — same style as homepage art + gala venue map */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex flex-col bg-primary/95 backdrop-blur-sm"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 md:px-10 py-3 md:py-5 border-b border-accent-wheat/15">
              <div className="min-w-0 flex-1 mr-3">
                <h3 className="font-display text-base md:text-xl 3xl:text-2xl text-accent-cream uppercase tracking-wide truncate">
                  {FRAMES[lightboxIndex].artist}
                </h3>
                <p className="text-sm 3xl:text-base text-accent-wheat truncate">
                  {FRAMES[lightboxIndex].titleYear}
                </p>
                <p className="hidden md:block text-xs 3xl:text-sm text-accent-cream/50 mt-1">
                  {FRAMES[lightboxIndex].caption}
                </p>
              </div>
              <div className="flex items-center gap-2 md:gap-3 shrink-0">
                <span className="hidden md:inline text-xs 3xl:text-sm text-accent-cream/50 mr-2">{Math.round(zoom * 100)}%</span>
                <button
                  onClick={() => { setZoom((z) => Math.min(z + 0.5, 4)); setDrag({ x: 0, y: 0 }) }}
                  className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-accent-wheat/25 text-accent-cream flex items-center justify-center hover:bg-accent-cream/10 transition-colors"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { setZoom((z) => Math.max(z - 0.5, 0.5)); setDrag({ x: 0, y: 0 }) }}
                  className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-accent-wheat/25 text-accent-cream flex items-center justify-center hover:bg-accent-cream/10 transition-colors"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setLightboxIndex(null)}
                  className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-accent-wheat/25 text-accent-cream flex items-center justify-center hover:bg-accent-cream/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Image area — draggable */}
            <div
              className="flex-1 overflow-hidden flex items-center justify-center select-none px-4 md:px-0"
              style={{ cursor: dragging ? "grabbing" : "grab" }}
              onMouseDown={handleMouseDown}
            >
              <img
                src={FRAMES[lightboxIndex].src}
                alt={FRAMES[lightboxIndex].alt}
                className="max-h-[75vh] md:max-h-[80vh] max-w-full w-auto transition-transform duration-150"
                draggable={false}
                style={{
                  transform: `scale(${zoom}) translate(${drag.x / zoom}px, ${drag.y / zoom}px)`,
                }}
              />
            </div>

            {/* Bottom bar — description on mobile + hint */}
            <div className="px-4 md:px-10 py-2 md:py-3 border-t border-accent-wheat/15">
              <p className="md:hidden text-[0.625rem] text-accent-cream/50 leading-relaxed text-center mb-1.5 line-clamp-3">
                {FRAMES[lightboxIndex].caption}
              </p>
              <p className="text-[0.625rem] md:text-[0.6875rem] 3xl:text-sm text-accent-cream/40 tracking-wider text-center">
                Pinch to zoom &middot; Tap &times; to close
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
