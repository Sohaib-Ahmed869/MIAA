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

gsap.registerPlugin(ScrollTrigger)

const BASE_FRAMES = [
  { mediaKey: "islamicart.gallery.image5", alt: "(2011). 99 channel SD video sculpture installation, audio, and 98 paintings: acrylic, watercolour and gouache on dye diffusion thermal transfer prints. Installation view (detail) for Destiny Disrupted, Griffith University Art Museum. Courtesy the artist and Milani Gallery, Brisbane. Photograph by Carl Warner.", credit: "99 \u2014", creditAuthor: "Khaled Sabsabi", top: "3%", left: "4%", size: "w-28 md:w-36 lg:w-44 3xl:w-[14vw]", parallaxFactor: 1.2, hoverWidth: "w-[14rem] lg:w-[16rem] 3xl:w-[18rem] relative left-1/2 -translate-x-1/2" },
  { mediaKey: "islamicart.gallery.image2", alt: "(2025). Clay, cardamom, size variable. Installation view at Liverpool Powerhouse. Courtesy the artist. Photograph by Kamil Abdullahi.", credit: "Udub-Core \u2014", creditAuthor: "Idil Abdullahi", top: "35%", left: "2%", size: "w-28 md:w-40 lg:w-44 3xl:w-[14vw]", parallaxFactor: 0.8, hoverWidth: "w-[16rem] lg:w-[18rem] 3xl:w-[20rem] relative left-1/2 -translate-x-1/2" },
  { mediaKey: "islamicart.gallery.image3", alt: "(2008), Borderlands series surfboard: digital decal fibreglass, polystyrene and carbon fibre, wire stand, vinyl, 194 x 45 x 8cm. Courtesy the artist. Artist acknowledgment Mark Rabbidge for production. Photograph by Phillip George.", credit: "Inshalla \u2014", creditAuthor: "Phillip George", top: "68%", left: "12%", size: "w-28 md:w-40 lg:w-48 3xl:w-[14vw]", parallaxFactor: 1.5, hoverWidth: "w-[16rem] lg:w-[18rem] 3xl:w-[20rem] relative left-1/2 -translate-x-1/2" },
  { mediaKey: "islamicart.gallery.image1", alt: "(2014-). Hand-stitched white prayer caps (topi), Perspex dome and light, 107 (Dia.) x 60 cm. Image courtesy the artist and Gallery Sally Dan Cuthbert, \u00a9the artist. In Private Collection. Photograph by Abdullah M. I. Syed.", credit: "Aura II \u2014", creditAuthor: "Abdullah M. I. Syed", top: "8%", right: "4%", size: "w-32 md:w-48 lg:w-48 3xl:w-[15vw]", parallaxFactor: 1.0 },
  { mediaKey: "islamicart.gallery.image4", alt: "(2008\u20132021), Folded US$ Bills and staple pins. Image courtesy the artist. Photograph by Mahmood Ali.", credit: "Flying Rug \u2014", creditAuthor: "Abdullah M. I. Syed", top: "52%", right: "4%", size: "w-28 md:w-40 lg:w-44 3xl:w-[14vw]", parallaxFactor: 1.3 },
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
      className={`${piece.size} absolute z-10 cursor-pointer hidden md:block`}
      style={{
        top: piece.top,
        left: piece.left,
        right: piece.right,
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
              <span className="not-italic text-[0.5625rem] lg:text-[0.625rem] 3xl:text-xs font-normal opacity-80">{piece.alt}</span>
              <br />
              <span className="not-italic font-medium">{piece.credit.replace(" \u2014", "")}</span>
              {" ~ "}
              <span className="not-italic font-bold">{piece.creditAuthor}</span>
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

  // Artwork files are editable in admin → Site Content; positions, credits and
  // captions stay here as layout/structured data.
  const FRAMES = useMemo(
    () => BASE_FRAMES.map((piece) => ({ ...piece, src: media(piece.mediaKey) })),
    [media]
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

      {/* Mobile art gallery — swipeable Swiper carousel */}
      <div className="md:hidden pb-10 relative">
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          onSwiper={(s) => { swiperRef.current = s }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          speed={800}
          spaceBetween={16}
          slidesPerView={1.2}
          centeredSlides
          loop
          style={{
            "--swiper-pagination-color": "#D7B893",
            "--swiper-pagination-bullet-inactive-color": "#D7B893",
            "--swiper-pagination-bullet-inactive-opacity": "0.35",
          }}
        >
          {FRAMES.filter((_, i) => i !== 1).map((piece) => (
            <SwiperSlide key={piece.creditAuthor + piece.credit}>
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
                    {piece.alt}
                  </p>
                  <p className="mt-1.5 text-sm text-accent-cream text-center">
                    <span className="font-medium">
                      {piece.credit.replace(" \u2014", "")}
                    </span>
                    {" ~ "}
                    <span className="font-bold">{piece.creditAuthor}</span>
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
                  {FRAMES[lightboxIndex].credit}
                </h3>
                <p className="text-sm 3xl:text-base text-accent-wheat truncate">
                  {FRAMES[lightboxIndex].creditAuthor}
                </p>
                <p className="hidden md:block text-xs 3xl:text-sm text-accent-cream/50 mt-1">
                  {FRAMES[lightboxIndex].alt}
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
                {FRAMES[lightboxIndex].alt}
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
