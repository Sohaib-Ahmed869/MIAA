import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight, Plus } from "lucide-react"


const MotionLink = motion.create(Link)

import logoCollab from "../../../assets/images/Homepage/SMWF/logo-collab.svg"
import heroPhoto from "../../../assets/images/Homepage/SMWF/hero-photo.jpg"
import patternKufic from "../../../assets/images/Homepage/SMWF/pattern-kufic.png"
import Text from "../../../content/Text"
import { useText } from "../../../content/context"

const MENU_LINKS = [
  { label: "Home",                       href: "#smwf-top" },
  { label: "Our Vision",                 href: "#smwf-vision" },
  { label: "Festival",                   href: "#smwf-festival" },
  { label: "Panellists and Presenters",  href: "#smwf-panellists" },
  { label: "Programme Highlights",       href: "#smwf-highlights" },
  { label: "The Stories We Inherit",     href: "#smwf-stories" },
  { label: "Behind the Mark",            href: "#smwf-mark" },
  { label: "Join SMWF",                  href: "#smwf-join" },
]

export default function SMWFHeroSection() {
  const [menuOpen, setMenuOpen] = useState(false)
  const t = useText()

  // Lock body scroll while drawer is open
  useEffect(() => {
    if (menuOpen) {
      const prev = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => { document.body.style.overflow = prev }
    }
  }, [menuOpen])

  return (
    <section
      id="smwf-top"
      className="relative overflow-hidden min-h-screen"
      style={{ backgroundColor: "#124039" }}
    >
      {/* Kufic background pattern — one tile stretched to 100% of the section
          (which already spans the full content width), so it reaches both edges
          at 1080p / 2K / 4K without bleeding into the scrollbar gutter. */}
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

      {/* Top bar — MINN × SMWF lockup + back-to-MIAA CTA. Full-bleed, padding-only. */}
      <div className="relative z-20 w-full px-6 md:px-10 lg:px-16 3xl:px-24 pt-5 md:pt-6 3xl:pt-10 flex items-center justify-between gap-4">
        <a href="/" className="block flex-shrink-0">
          <img
            src={logoCollab}
            alt="MINN × Sydney Muslim Writers Festival"
            className="h-7 sm:h-8 md:h-10 lg:h-11 2xl:h-12 3xl:h-14 w-auto"
          />
        </a>
        <div className="flex items-center gap-2 md:gap-3 3xl:gap-5">
          <MotionLink
            to="/"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="inline-flex items-center gap-1.5 3xl:gap-2.5 px-4 sm:px-5 md:px-5 lg:px-6 2xl:px-7 3xl:px-8 py-2 md:py-2.5 2xl:py-3 3xl:py-4 font-aeonik text-[0.5625rem] sm:text-[0.625rem] md:text-[0.6875rem] lg:text-xs 2xl:text-[0.8125rem] 3xl:text-sm font-semibold tracking-[0.18em] uppercase rounded-none text-white"
            style={{ backgroundColor: "#C15C45" }}
          >
            <span className="hidden sm:inline"><Text k="smwf.hero.topbar" /></span>
            <span className="sm:hidden"><Text k="smwf.hero.topbarShort" /></span>
            <ArrowUpRight
              className="w-3 h-3 md:w-3.5 md:h-3.5 2xl:w-4 2xl:h-4 3xl:w-5 3xl:h-5"
              strokeWidth={2.5}
            />
          </MotionLink>
          {/* Placeholder keeps the menu button's slot in the bar; the real
              button is fixed so it stays in the corner while scrolling. */}
          <div
            aria-hidden
            className="w-9 h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 2xl:w-12 2xl:h-12 3xl:w-14 3xl:h-14 flex-shrink-0"
          />
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="fixed z-[120] top-5 right-6 md:top-6 md:right-10 lg:right-16 3xl:top-10 3xl:right-24 w-9 h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 2xl:w-12 2xl:h-12 3xl:w-14 3xl:h-14 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
            style={{ backgroundColor: "#CBCE58" }}
          >
            <motion.span
              className="flex items-center justify-center"
              animate={{ rotate: menuOpen ? 45 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
              <Plus
                className="w-5 h-5 md:w-5 md:h-5 lg:w-6 lg:h-6 2xl:w-7 2xl:h-7 3xl:w-8 3xl:h-8"
                style={{ color: "#124039" }}
                strokeWidth={2.5}
              />
            </motion.span>
          </button>
        </div>
      </div>

      {/* Slide-out menu drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <div
              key="smwf-menu-modal-wrap"
              className="fixed inset-0 z-[100] flex items-start justify-end px-6 md:px-10 lg:px-16 3xl:px-24 pt-20 md:pt-24 3xl:pt-36"
              onClick={() => setMenuOpen(false)}
            >
              <motion.div
                key="smwf-menu-modal"
                initial={{ opacity: 0, scale: 0.9, y: -12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -12 }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                className="relative w-full max-w-[35rem] 2xl:max-w-[40rem] 3xl:max-w-[51.25rem] max-h-[80vh] shadow-2xl flex flex-col overflow-hidden origin-top-right"
                style={{ backgroundColor: "#C15C45" }}
                role="dialog"
                aria-modal="true"
                aria-label="SMWF navigation"
                onClick={(e) => e.stopPropagation()}
              >
                <nav className="flex-1 px-7 sm:px-10 md:px-12 2xl:px-16 3xl:px-20 pt-8 md:pt-10 2xl:pt-12 3xl:pt-14 pb-8 md:pb-10 2xl:pb-12 3xl:pb-14 overflow-y-auto">
                  <ul className="flex flex-col gap-2 md:gap-2.5 2xl:gap-3 3xl:gap-4">
                    {MENU_LINKS.map((link, i) => (
                      <motion.li
                        key={link.href}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.06 + i * 0.03, ease: [0.25, 0.1, 0.25, 1] }}
                      >
                        <a
                          href={link.href}
                          onClick={() => setMenuOpen(false)}
                          className="block font-aeonik text-white text-[1.75rem] sm:text-[2rem] md:text-[2.25rem] 2xl:text-[2.75rem] 3xl:text-[3.5rem] font-medium leading-[1.15] tracking-[-0.005em] hover:opacity-80 transition-opacity"
                        >
                          {link.label}
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                </nav>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Hero content — full-bleed layout, padding-only (matches AboutHeroSection) */}
      <div className="relative z-10 w-full px-6 md:px-10 lg:px-16 3xl:px-24 pt-20 md:pt-28 lg:pt-36 2xl:pt-40 3xl:pt-48 pb-8 md:pb-10 lg:pb-12 2xl:pb-16 3xl:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10 lg:gap-10 2xl:gap-14 3xl:gap-16 items-center">
          {/* Left — copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <span
              className="inline-block rounded-full text-white font-medium tracking-[0.18em] uppercase text-[0.6875rem] md:text-xs 2xl:text-sm 3xl:text-base px-5 md:px-6 2xl:px-8 3xl:px-10 py-2 md:py-2.5 2xl:py-3 3xl:py-4"
              style={{ backgroundColor: "#C15C45" }}
            >
              <Text k="smwf.hero.date" />
            </span>

            <h1 className="mt-4 md:mt-5 2xl:mt-6 3xl:mt-7 font-aeonik text-white tracking-[-0.01em] leading-[1.06] text-[1.875rem] sm:text-[2.25rem] md:text-[2.5rem] lg:text-[2rem] xl:text-[2.625rem] 2xl:text-[3.5rem] 3xl:text-[5.5rem] font-medium">
              <Text k="smwf.hero.heading" />
            </h1>

            <p className="mt-3 md:mt-4 2xl:mt-5 3xl:mt-6 max-w-lg 2xl:max-w-xl 3xl:max-w-2xl text-white/85 font-barlow text-sm md:text-base 2xl:text-lg 3xl:text-xl leading-relaxed">
              <Text k="smwf.hero.intro" />
            </p>

            <motion.a
              href="https://www.miaaustralia.org/smwf"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="mt-5 md:mt-6 2xl:mt-8 3xl:mt-9 inline-flex items-center gap-2 px-7 md:px-8 2xl:px-10 3xl:px-12 py-3.5 md:py-4 2xl:py-5 3xl:py-6 font-aeonik text-xs md:text-sm 2xl:text-base 3xl:text-lg font-semibold tracking-[0.18em] uppercase rounded-none"
              style={{ backgroundColor: "#CBCE58", color: "#124039" }}
            >
              {t("smwf.hero.cta")}
            </motion.a>
          </motion.div>

          {/* Right — festival photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative"
          >
            <div className="overflow-hidden rounded-lg 2xl:rounded-xl aspect-[3/2] shadow-2xl ring-1 ring-white/10">
              <img
                src={heroPhoto}
                alt="Sydney Muslim Writers Festival panel discussion"
                className="block w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
