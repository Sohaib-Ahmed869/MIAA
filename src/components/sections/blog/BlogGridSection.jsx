import { useState, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight, ArrowRight, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { fadeInUp } from "../../../lib/motion"
import NoBlogPosts from "./NoBlogPosts"

const PAGE_SIZE = 6

function SkeletonCard() {
  return (
    <div className="flex flex-col animate-pulse">
      <div className="aspect-[16/10] rounded-lg bg-primary/10 mb-4" />
      <div className="h-5 bg-primary/10 rounded w-3/4 mb-3" />
      <div className="h-3 bg-primary/10 rounded w-full mb-2" />
      <div className="h-3 bg-primary/10 rounded w-2/3 mb-4" />
      <div className="h-3 bg-primary/10 rounded w-24" />
    </div>
  )
}

export default function BlogGridSection({
  heading,
  intro,
  articles,
  bg = "bg-accent-cream",
  // True while the first fetch is in flight. Skeletons are the honest answer
  // then — neither the grid nor "nothing published" is a claim we can make yet.
  fetching = false,
  emptyHeading,
  emptyBody,
}) {
  const [requestedPage, setPage] = useState(0)
  const [paging, setPaging] = useState(false)
  const loading = fetching || paging

  const pageCount = Math.max(1, Math.ceil(articles.length / PAGE_SIZE))
  // A fetch that lands after mount can shrink the list under a page the reader
  // is already on, so the page is clamped on read rather than stored blindly.
  const page = Math.min(requestedPage, pageCount - 1)
  const visible = useMemo(() => {
    const start = page * PAGE_SIZE
    return articles.slice(start, start + PAGE_SIZE)
  }, [articles, page])

  const changePage = useCallback((newPage) => {
    setPaging(true)
    setTimeout(() => {
      setPage(newPage)
      setPaging(false)
    }, 600)
  }, [])

  const maxVisible = 5
  const getPageNumbers = () => {
    if (pageCount <= maxVisible) return Array.from({ length: pageCount }, (_, i) => i)
    const pages = [0]
    if (page > 2) pages.push("...")
    for (let i = Math.max(1, page - 1); i <= Math.min(pageCount - 2, page + 1); i++) {
      pages.push(i)
    }
    if (page < pageCount - 3) pages.push("...")
    pages.push(pageCount - 1)
    return pages
  }

  return (
    <section className={`py-16 md:py-20 3xl:py-28 ${bg}`}>
      <div className="max-w-[1400px] 3xl:max-w-[3200px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24">
        {/* Heading row */}
        <motion.div
          {...fadeInUp}
          className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-10 md:mb-12"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl 3xl:text-[3.2rem] font-medium text-primary tracking-tight leading-tight">
            {heading}
          </h2>
          {intro && (
            <p className="md:max-w-md 3xl:max-w-lg text-base 3xl:text-lg text-primary leading-relaxed">
              {intro}
            </p>
          )}
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-10"
            >
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <div key={i}>
                  <SkeletonCard />
                </div>
              ))}
            </motion.div>
          ) : articles.length === 0 ? (
            /* Nothing published in this category — say so rather than filling
               the grid with placeholder articles. */
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <NoBlogPosts heading={emptyHeading} body={emptyBody} />
            </motion.div>
          ) : (
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-10"
            >
              {visible.map((post, i) => {
                const col = i % 3
                const rowStart = Math.floor(i / 3) * 3
                const rowCount = Math.min(3, visible.length - rowStart)
                const isCenter = col === 1 && rowCount === 3
                return (
                <article
                  key={post.slug}
                  className={`group flex flex-col relative ${isCenter ? "lg:before:absolute lg:before:left-[-1.25rem] lg:before:top-0 lg:before:bottom-0 lg:before:w-px lg:before:bg-primary/10 lg:after:absolute lg:after:right-[-1.25rem] lg:after:top-0 lg:after:bottom-0 lg:after:w-px lg:after:bg-primary/10" : ""}`}
                >
                  <Link to={`/blog/${post.slug}`} className="block mb-4 overflow-hidden">
                    <div className="aspect-[16/10] overflow-hidden rounded-lg bg-primary/10">
                      {post.imageUrl && (
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>
                  </Link>
                  <h3 className="text-base md:text-lg 3xl:text-2xl font-semibold text-primary leading-tight mb-2">
                    {post.title}
                  </h3>
                  <p className="text-sm 3xl:text-base text-primary leading-relaxed mb-3">
                    {post.description}
                  </p>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs 3xl:text-sm font-semibold tracking-wider uppercase text-secondary-terra hover:text-secondary-rust transition-colors duration-200 mt-auto"
                  >
                    Read More
                    <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </Link>
                </article>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {pageCount > 1 && (
          <div className="mt-12 flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
            {page > 0 && (
              <button
                onClick={() => changePage(page - 1)}
                disabled={loading}
                className="w-8 h-8 sm:w-9 sm:h-9 3xl:w-11 3xl:h-11 flex items-center justify-center bg-secondary-terra text-white rounded hover:bg-secondary-rust transition-all duration-200 hover:scale-105 disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            {getPageNumbers().map((p, i) =>
              p === "..." ? (
                <span key={`dots-${i}`} className="px-1 text-primary/40 text-sm">...</span>
              ) : (
                <button
                  key={p}
                  onClick={() => changePage(p)}
                  disabled={loading}
                  className={`w-8 h-8 sm:w-9 sm:h-9 3xl:w-11 3xl:h-11 flex items-center justify-center text-xs sm:text-sm 3xl:text-base font-medium rounded transition-all duration-200 ${
                    p === page
                      ? "bg-secondary-sand text-white"
                      : "bg-transparent text-primary/60 border border-primary/20 hover:border-secondary-sand hover:text-secondary-sand"
                  } disabled:opacity-50`}
                >
                  {p + 1}
                </button>
              )
            )}
            {page < pageCount - 1 && (
              <button
                onClick={() => changePage(page + 1)}
                disabled={loading}
                className="w-8 h-8 sm:w-9 sm:h-9 3xl:w-11 3xl:h-11 flex items-center justify-center bg-secondary-terra text-white rounded hover:bg-secondary-rust transition-all duration-200 hover:scale-105 disabled:opacity-50"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
