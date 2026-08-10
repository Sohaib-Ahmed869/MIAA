import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ShieldCheck, ReceiptText, HeartHandshake } from "lucide-react"
import CTAButton from "../../ui/Button"
import ornament from "../../../assets/images/Homepage/Ornament_1.png"
import Text from "../../../content/Text"
import { useText } from "../../../content/context"

// Donation-themed imagery (Unsplash). ?auto=format keeps payloads small.
const IMG = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=70`

const HERO_IMAGES = [
  { src: IMG("photo-1469571486292-0ba58a3f068b"), alt: "Many hands raised together forming a heart" },
  { src: IMG("photo-1532629345422-7515f3d16bb6"), alt: "Open hands offering coins with a 'make a change' note" },
  { src: IMG("photo-1593113646773-028c64a8f1b8"), alt: "Volunteers packing goods at a community drive" },
  { src: IMG("photo-1497633762265-9d179a990aa6"), alt: "A stack of books representing learning and culture" },
]

const ROTATE_MS = 4500
const ease = [0.25, 0.1, 0.25, 1]

export default function DonationsHeroSection() {
  const [active, setActive] = useState(0)
  const t = useText()
  const REASSURANCES = [
    { icon: ShieldCheck, label: t("donate.hero.badge1.label"), sub: t("donate.hero.badge1.sub") },
    { icon: ReceiptText, label: t("donate.hero.badge2.label"), sub: t("donate.hero.badge2.sub") },
    { icon: HeartHandshake, label: t("donate.hero.badge3.label"), sub: t("donate.hero.badge3.sub") },
  ]

  useEffect(() => {
    // Respect users who prefer reduced motion — no auto-rotation.
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    if (reduce) return
    const t = setInterval(
      () => setActive((i) => (i + 1) % HERO_IMAGES.length),
      ROTATE_MS
    )
    return () => clearInterval(t)
  }, [])

  return (
    <section className="relative bg-bg-deep overflow-hidden">
      {/* Soft terra glow, top-left */}
      <div
        className="absolute -top-32 -left-24 w-[42rem] h-[42rem] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(193,92,69,0.20) 0%, rgba(193,92,69,0) 65%)",
        }}
      />
      {/* Cool teal glow, bottom-right */}
      <div
        className="absolute -bottom-40 -right-24 w-[40rem] h-[40rem] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(56,113,122,0.35) 0%, rgba(56,113,122,0) 65%)",
        }}
      />

      <div className="relative z-10 max-w-[1400px] 3xl:max-w-[3200px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24 pt-28 md:pt-32 pb-16 md:pb-20 3xl:pb-28">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 3xl:gap-24 items-center">
          {/* ── Left: copy ── */}
          <div className="text-center lg:text-left">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="text-[0.6875rem] md:text-xs 3xl:text-sm tracking-[0.25em] uppercase text-accent-wheat font-semibold mb-3"
            >
              <Text k="donate.hero.eyebrow" />
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease }}
              className="text-4xl md:text-5xl lg:text-[3.4rem] 3xl:text-[5rem] font-medium text-accent-cream tracking-tight leading-[1.05]"
            >
              <Text k="donate.hero.title" />
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base md:text-lg 3xl:text-xl text-accent-cream/75 mt-5 md:mt-6 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed"
            >
              <Text k="donate.hero.subtitle" />
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4"
            >
              <CTAButton to="/donate/checkout">{t("donate.hero.cta")}</CTAButton>
              <a
                href="#choose-a-cause"
                className="text-[0.6875rem] 3xl:text-sm tracking-[0.15em] uppercase font-semibold text-accent-cream/70 hover:text-accent-cream transition-colors"
              >
                <Text k="donate.hero.chooseLink" />
              </a>
            </motion.div>

            {/* Reassurance strip */}
            <motion.ul
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-10 md:mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-3"
            >
              {REASSURANCES.map(({ icon: Icon, label, sub }) => (
                <li
                  key={label}
                  className="flex items-center gap-3 rounded-sm border border-accent-cream/10 bg-white/[0.04] px-4 py-3 backdrop-blur-sm"
                >
                  <span className="flex-none flex items-center justify-center w-9 h-9 rounded-full bg-secondary-terra/15 text-accent-wheat">
                    <Icon className="w-[1.05rem] h-[1.05rem]" strokeWidth={1.75} />
                  </span>
                  <span className="text-left leading-tight">
                    <span className="block text-[0.8125rem] 3xl:text-sm font-semibold text-accent-cream">
                      {label}
                    </span>
                    <span className="block text-[0.6875rem] 3xl:text-xs text-accent-cream/55">
                      {sub}
                    </span>
                  </span>
                </li>
              ))}
            </motion.ul>
          </div>

          {/* ── Right: auto-rotating donation imagery ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.25, ease }}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            {/* Terra accent block, offset behind */}
            <div className="absolute -top-4 -left-4 3xl:-top-6 3xl:-left-6 w-full h-full rounded-md border border-secondary-terra/40 bg-secondary-terra/[0.06] pointer-events-none" />

            <div className="relative rounded-md overflow-hidden ring-1 ring-accent-cream/15 shadow-2xl shadow-black/30 aspect-[4/3] bg-bg-deep">
              {/* Crossfading images */}
              {HERO_IMAGES.map((img, i) => (
                <motion.img
                  key={img.src}
                  src={img.src}
                  alt={img.alt}
                  loading={i === 0 ? "eager" : "lazy"}
                  aria-hidden={i !== active}
                  initial={false}
                  animate={{ opacity: i === active ? 1 : 0 }}
                  transition={{ duration: 1.1, ease }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ))}
              {/* subtle bottom scrim */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg-deep/70 to-transparent" />
              {/* Caption chip */}
              <div className="absolute bottom-4 left-4 right-16 flex items-center gap-2 text-accent-cream">
                <span className="w-2 h-2 rounded-full bg-secondary-terra flex-none" />
                <span className="text-[0.6875rem] 3xl:text-sm tracking-wide font-medium">
                  <Text k="donate.hero.caption" />
                </span>
              </div>
              {/* Carousel dots */}
              <div className="absolute bottom-4 right-4 flex items-center gap-1.5">
                {HERO_IMAGES.map((img, i) => (
                  <button
                    key={img.src}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`Show image ${i + 1}`}
                    aria-current={i === active}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === active
                        ? "w-5 bg-accent-cream"
                        : "w-1.5 bg-accent-cream/40 hover:bg-accent-cream/70"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Ornament flourish overlapping top-right */}
            <motion.img
              src={ornament}
              alt=""
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-8 -right-6 lg:-top-10 lg:-right-8 3xl:-top-14 3xl:-right-12 w-16 lg:w-20 3xl:w-28 object-contain pointer-events-none drop-shadow-lg"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
