import { useState, useRef, useEffect, useMemo } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { ZoomIn, ZoomOut, X } from "lucide-react"
import { fadeInUp } from "../../../lib/motion"
import { splitCaptionDate, creditLine } from "../../../lib/artCredit"
import CTAButton from "../../ui/Button"
import Text from "../../../content/Text"
import { useText, useMediaResolver } from "../../../content/context"


gsap.registerPlugin(ScrollTrigger)

// Layout only. Every credit string — artist, title, year, caption — is editable
// in admin → Site Content (Islamic Art → Artwork credits) and resolved below.
const ART_PIECES = [
  {
    mediaKey: "islamicart.gallery.image5",
    top: "3%",
    left: "12%",
    size: "w-28 md:w-36 lg:w-56 3xl:w-[18vw]",
    parallaxFactor: 1.2,
  },
  {
    mediaKey: "islamicart.gallery.image2",
    top: "35%",
    left: "-3%",
    size: "w-28 md:w-40 lg:w-56 3xl:w-[18vw]",
    parallaxFactor: 0.8,
  },
  {
    mediaKey: "islamicart.gallery.image3",
    top: "62%",
    left: "20%",
    size: "w-24 md:w-36 lg:w-50 3xl:w-[15vw]",
    parallaxFactor: 1.5,
  },
  {
    mediaKey: "islamicart.gallery.image1",
    top: "5%",
    right: "2%",
    size: "w-32 md:w-48 lg:w-60 3xl:w-[19vw]",
    parallaxFactor: 1.0,
  },
  {
    mediaKey: "islamicart.gallery.image4",
    top: "52%",
    right: "8%",
    size: "w-28 md:w-40 lg:w-56 3xl:w-[18vw]",
    parallaxFactor: 1.3,
  },
]

export default function IslamicArtSection() {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [zoom, setZoom] = useState(1)
  const [drag, setDrag] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const containerRef = useRef(null)
  const sectionRef = useRef(null)
  const frameRefs = useRef([])
  const t = useText()
  const media = useMediaResolver()

  // Artwork files *and* their credits are editable in admin → Site Content;
  // only the scatter positions stay here as layout data. The year is its own
  // field, but a caption pasted from a gallery ("(2008), Borderlands series…")
  // still carries one at the front, so that form is understood as a fallback.
  const artPieces = useMemo(
    () =>
      ART_PIECES.map((piece) => {
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
          // Title and year on their own, for the lightbox header where the
          // artist is already the heading above.
          titleYear: creditLine("", title, year),
          alt: [creditLine(artist, title, year), parsed.caption]
            .filter(Boolean)
            .join(". "),
        }
      }),
    [media, t]
  )

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

  // Track mouse globally — normalised to -1 … 1 based on window center
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

  // GSAP scroll-triggered entrance: frames rise one-by-one from below
  useGSAP(() => {
    const frames = frameRefs.current.filter(Boolean)
    if (!frames.length) return

    // Set initial state — far below and invisible
    gsap.set(frames, { y: 150, opacity: 0 })

    gsap.to(frames, {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power3.out",
      stagger: 0.2,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
        once: true,
      },
    })
  }, { scope: sectionRef })

  // Mobile layout — frames stack above + below the center text (no overlap)
  const mobileTopFrames = artPieces.slice(0, 3)
  const mobileBottomFrames = artPieces.slice(3)

  return (
    <section ref={sectionRef} className="py-16 md:py-24 3xl:py-32 bg-accent-cream overflow-hidden">
      <div className="max-w-[1400px] 3xl:max-w-[3200px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24">
        {/* Mobile layout — stacked, no overlap */}
        <div className="md:hidden flex flex-col items-center text-center gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-3 gap-3 w-full items-start"
          >
            {mobileTopFrames.map((piece, i) => (
              <button
                type="button"
                key={i}
                onClick={() => openLightbox(i)}
                className={`overflow-hidden cursor-pointer border-[5px] border-primary ${i % 2 === 1 ? "mt-8" : ""}`}
              >
                <div className="border-[6px] border-white">
                  <img
                    src={piece.src}
                    alt={piece.alt}
                    className="w-full h-auto block"
                  />
                </div>
              </button>
            ))}
          </motion.div>

          <motion.div {...fadeInUp} className="px-2 py-4">
            <h2 className="text-3xl font-medium text-primary tracking-tight leading-snug">
              <Text k="home.art.heading" />
            </h2>
            <p className="mt-5 text-sm text-primary leading-relaxed font-medium">
              <Text k="home.art.body" />
            </p>
            <div className="mt-6">
              <CTAButton to="/islamic-art">{t("home.art.cta")}</CTAButton>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 gap-3 w-full items-start"
          >
            {mobileBottomFrames.map((piece, i) => (
              <button
                type="button"
                key={i}
                onClick={() => openLightbox(mobileTopFrames.length + i)}
                className={`overflow-hidden cursor-pointer border-[5px] border-primary ${i % 2 === 1 ? "mt-10" : ""}`}
              >
                <div className="border-[6px] border-white">
                  <img
                    src={piece.src}
                    alt={piece.alt}
                    className="w-full h-auto block"
                  />
                </div>
              </button>
            ))}
          </motion.div>
        </div>

        {/* Desktop layout — scattered frames with mouse-tracking */}
        <div ref={containerRef} className="hidden md:block">
          <div className="relative md:min-h-[46.875rem] lg:min-h-[56.25rem]">
            {/* Center text */}
            <motion.div
              {...fadeInUp}
              className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 pointer-events-none px-4"
            >
              <h2 className="text-3xl md:text-4xl lg:text-[2.8rem] 3xl:text-[3.2rem] font-medium text-primary tracking-tight leading-snug">
                Celebrating Islamic
                <br />
                Art in Australia
              </h2>
              <p className="mt-5 text-sm md:text-lg 3xl:text-xl text-primary leading-relaxed max-w-lg 3xl:max-w-xl font-medium">
                Across Australia, Islamic art continues to flourish — shaped by
                diverse artists, cultures, and stories. The Museum of Islamic Art
                Australia proudly supports this creative movement, celebrating its
                heritage and future through art, learning, and community.
              </p>
              <div className="pointer-events-auto mt-6">
                <CTAButton to="/islamic-art">{t("home.art.cta")}</CTAButton>
              </div>
            </motion.div>

            {/* Art frames — GSAP drives the entrance, Framer Motion drives the mouse parallax */}
            {artPieces.map((piece, i) => (
              <ArtFrame
                key={i}
                ref={(el) => (frameRefs.current[i] = el)}
                piece={piece}
                index={i}
                isHovered={hoveredIndex === i}
                onHover={() => setHoveredIndex(i)}
                onLeave={() => setHoveredIndex(null)}
                onClick={() => openLightbox(i)}
                springX={springX}
                springY={springY}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox — same modal style as Gala Dinner venue map */}
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
            <div className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-accent-wheat/15">
              <div>
                {/* Artist, then title and year, then the caption. */}
                <h3 className="font-display text-lg md:text-xl 3xl:text-2xl text-accent-cream uppercase tracking-wide">
                  {artPieces[lightboxIndex].artist}
                </h3>
                <p className="text-sm 3xl:text-base text-accent-wheat">
                  {artPieces[lightboxIndex].titleYear}
                </p>
                <p className="text-xs 3xl:text-sm text-accent-cream/50 mt-1">
                  {artPieces[lightboxIndex].caption}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs 3xl:text-sm text-accent-cream/50 mr-2">{Math.round(zoom * 100)}%</span>
                <button
                  onClick={() => { setZoom((z) => Math.min(z + 0.5, 4)); setDrag({ x: 0, y: 0 }) }}
                  className="w-9 h-9 rounded-full border border-accent-wheat/25 text-accent-cream flex items-center justify-center hover:bg-accent-cream/10 transition-colors"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { setZoom((z) => Math.max(z - 0.5, 0.5)); setDrag({ x: 0, y: 0 }) }}
                  className="w-9 h-9 rounded-full border border-accent-wheat/25 text-accent-cream flex items-center justify-center hover:bg-accent-cream/10 transition-colors"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setLightboxIndex(null)}
                  className="w-9 h-9 rounded-full border border-accent-wheat/25 text-accent-cream flex items-center justify-center hover:bg-accent-cream/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Image area — draggable */}
            <div
              className="flex-1 overflow-hidden flex items-center justify-center select-none"
              style={{ cursor: dragging ? "grabbing" : "grab" }}
              onMouseDown={handleMouseDown}
            >
              <img
                src={artPieces[lightboxIndex].src}
                alt={artPieces[lightboxIndex].alt}
                className="max-h-[80vh] w-auto transition-transform duration-150"
                draggable={false}
                style={{
                  transform: `scale(${zoom}) translate(${drag.x / zoom}px, ${drag.y / zoom}px)`,
                }}
              />
            </div>

            {/* Bottom hint */}
            <div className="px-6 md:px-10 py-3 border-t border-accent-wheat/15 text-center">
              <p className="text-[0.6875rem] 3xl:text-sm text-accent-cream/40 tracking-wider">
                Drag to pan &middot; Use controls to zoom &middot; Click &times; to close
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

import { forwardRef } from "react"

const ArtFrame = forwardRef(function ArtFrame(
  { piece, isHovered, onHover, onLeave, onClick, springX, springY },
  ref,
) {
  const factor = piece.parallaxFactor
  // Opposite direction: negate the spring values, scaled by factor * 20px
  const mx = useTransform(springX, (v) => -v * factor * 20)
  const my = useTransform(springY, (v) => -v * factor * 10)

  return (
    <div
      ref={ref}
      className={`${piece.size} absolute z-0 cursor-pointer`}
      style={{
        top: piece.top,
        left: piece.left,
        right: piece.right,
      }}
    >
      {/* Inner wrapper for mouse-tracking parallax (Framer Motion) */}
      <motion.div
        style={{ x: mx, y: my }}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        onClick={onClick}
      >
        <div className="border-[6px] border-primary overflow-hidden">
          <div className="border-[8px] border-white">
            <img
              src={piece.src}
              alt={piece.alt}
              className="w-full h-auto block"
            />
          </div>
        </div>

        {/* Credit overlay — visible on hover */}
        <AnimatePresence>
          {isHovered && piece.credit && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.25 }}
              className="mt-2.5 text-[0.625rem] lg:text-[0.6875rem] 3xl:text-sm text-primary leading-snug text-center"
            >
              {/* Caption first, then the credit line underneath: artist, title,
                  and the year last. */}
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
