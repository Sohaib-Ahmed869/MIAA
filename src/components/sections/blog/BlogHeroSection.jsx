import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react"
import { Link } from "react-router-dom"
import { useMedia } from "../../../content/context"

/**
 * The carousel shows real posts only — flagged "featured" ones first, and the
 * newest posts when nobody has flagged any. With nothing published the carousel
 * drops away and the page keeps its title; the rows below carry the empty state.
 */
export default function BlogHeroSection({ articles = [], loading = false }) {
  const image = useMedia("blog.hero.image")
  const [current, setCurrent] = useState(0)

  const featured = useMemo(() => {
    const flagged = articles.filter((a) => a.featured)
    return (flagged.length ? flagged : articles).slice(0, 4)
  }, [articles])

  const prev = () => setCurrent((c) => (c === 0 ? featured.length - 1 : c - 1))
  const next = () => setCurrent((c) => (c === featured.length - 1 ? 0 : c + 1))

  const article = featured[Math.min(current, Math.max(featured.length - 1, 0))]

  if (!article) {
    return (
      <section className="bg-bg-deep pt-28 md:pt-32 pb-14 md:pb-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] 3xl:text-[4.5rem] font-medium text-accent-cream tracking-tight leading-snug px-6 md:px-10 lg:px-16 3xl:px-24 mt-10 sm:mt-14 md:mt-20"
        >
          News, Stories, And Updates From MIAA
        </motion.h1>
        {loading && (
          <div className="px-6 md:px-10 lg:px-16 3xl:px-24 mt-8">
            <div className="h-[30vh] md:h-64 rounded-lg bg-accent-cream/5 animate-pulse" />
          </div>
        )}
      </section>
    )
  }

  return (
    <section className="bg-bg-deep pt-28 md:pt-32 pb-0">
      {/* Page heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] 3xl:text-[4.5rem] font-medium text-accent-cream tracking-tight leading-snug mb-6 md:mb-8 px-6 md:px-10 lg:px-16 3xl:px-24 mt-10 sm:mt-14 md:mt-20"
      >
        News, Stories, And Updates From MIAA
      </motion.h1>

      {/* Hero carousel — full width */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] items-stretch">
        {/* Left — image carousel */}
        <div className="relative overflow-hidden bg-primary h-[55vh] sm:h-[60vh] md:h-[31.25rem] lg:h-[34.375rem] 3xl:h-[45vh]">
            <AnimatePresence mode="wait">
              <motion.img
                key={current}
                src={article.imageUrl || image.src}
                alt={article.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
          </div>

          {/* Right — article info on primary bg */}
          <div className="bg-primary p-6 md:p-10 flex flex-col justify-between">
            {/* Section divider */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <svg width="10" height="10" viewBox="0 0 100 100" fill="#DD613E">
                  <circle cx="50" cy="22" r="25" />
                  <circle cx="50" cy="78" r="25" />
                  <circle cx="22" cy="50" r="25" />
                  <circle cx="78" cy="50" r="25" />
                  <rect x="22" y="22" width="56" height="56" rx="4" fill="#DD613E" />
                </svg>
                <span className="text-[0.625rem] 3xl:text-sm tracking-[0.2em] uppercase text-accent-wheat font-normal">
                  Featured
                </span>
              </div>
              <div
                className="h-[2px] w-full mb-6 md:mb-12"
                style={{
                  backgroundImage: "radial-gradient(circle, #D7B89350 0.09375rem, transparent 0.09375rem)",
                  backgroundSize: "0.5rem 0.1875rem",
                  height: "2px",
                }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="flex-1"
              >
                {(article.date || article.author) && (
                  <p className="text-sm 3xl:text-base text-accent-wheat italic mb-3">
                    {[article.date, article.author && `by ${article.author}`]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}

                <h2 className="text-xl sm:text-2xl md:text-3xl 3xl:text-[3.2rem] font-medium text-accent-cream tracking-tight leading-snug mb-3">
                  {article.title}
                </h2>

                <p className="text-base 3xl:text-lg text-accent-cream leading-relaxed mb-6">
                  {article.description}
                </p>

                <Link
                  to={`/blog/${article.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs 3xl:text-sm font-semibold tracking-wider uppercase text-accent-cream hover:text-accent-wheat transition-colors"
                >
                  Read More
                  <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                </Link>
              </motion.div>
            </AnimatePresence>

            {/* Navigation arrows — pointless with a single post */}
            <div className={`items-center gap-3 mt-8 ${featured.length > 1 ? "flex" : "hidden"}`}>
              <button
                onClick={prev}
                className="w-10 h-10 3xl:w-12 3xl:h-12 rounded-lg bg-secondary-terra text-white flex items-center justify-center hover:bg-secondary-rust transition-colors"
              >
                <ArrowLeft className="w-4.5 h-4.5" />
              </button>
              <button
                onClick={next}
                className="w-10 h-10 3xl:w-12 3xl:h-12 rounded-lg bg-secondary-terra text-white flex items-center justify-center hover:bg-secondary-rust transition-colors"
              >
                <ArrowRight className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </div>
    </section>
  )
}
