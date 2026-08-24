import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, ArrowLeft, ArrowRight, Link2 } from "lucide-react"
import { Link } from "react-router-dom"
import { fadeInUp, staggerContainer, staggerItem } from "../../../lib/motion"
import { BLOG_ARTICLES } from "../../../lib/constants"
import { blogImages } from "./blogImages"

const SHARE_BUTTONS = [
  {
    label: "Share on Facebook",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "Share on X",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Copy Link",
    icon: <Link2 className="w-3.5 h-3.5" />,
  },
]

/**
 * One body block from the admin builder (see `lib/blogBlocks.js`). Text keeps
 * whitespace-pre-line so the line breaks an author typed survive.
 */
function BodyBlock({ block }) {
  switch (block.type) {
    case "intro":
      return (
        <p className="text-base sm:text-lg md:text-xl 3xl:text-2xl text-primary leading-relaxed font-medium whitespace-pre-line">
          {block.text}
        </p>
      )
    case "heading":
      return (
        <h2 className="text-base sm:text-lg md:text-xl 3xl:text-2xl font-semibold text-primary leading-snug mt-2">
          {block.text}
        </h2>
      )
    case "list": {
      const List = block.ordered ? "ol" : "ul"
      return (
        <List
          className={`flex flex-col gap-2 pl-5 text-sm sm:text-base 3xl:text-lg text-primary leading-relaxed ${
            block.ordered ? "list-decimal" : "list-disc"
          } marker:text-secondary-terra`}
        >
          {(block.items || []).map((item, i) => (
            <li key={i} className="pl-1 whitespace-pre-line">
              {item}
            </li>
          ))}
        </List>
      )
    }
    case "quote":
      return (
        <blockquote className="border-l-2 border-secondary-terra pl-5 sm:pl-6 my-2">
          <p className="text-base sm:text-lg md:text-xl 3xl:text-2xl text-primary italic leading-relaxed whitespace-pre-line">
            {block.text}
          </p>
          {block.attribution && (
            <footer className="mt-2 text-xs sm:text-sm 3xl:text-base tracking-wider uppercase text-primary/60">
              {block.attribution}
            </footer>
          )}
        </blockquote>
      )
    case "image": {
      const src = block.imageUrl || block.url || ""
      if (!src) return null
      return (
        <figure className="my-2">
          <img
            src={src}
            alt={block.caption || ""}
            loading="lazy"
            className="w-full h-auto rounded-lg object-cover"
          />
          {block.caption && (
            <figcaption className="mt-2 text-xs sm:text-sm 3xl:text-base text-primary/60 italic">
              {block.caption}
            </figcaption>
          )}
        </figure>
      )
    }
    default:
      return (
        <p className="text-sm sm:text-base 3xl:text-lg text-primary leading-relaxed whitespace-pre-line">
          {block.text}
        </p>
      )
  }
}

export default function BlogDetailSection({ article }) {
  const allRelated = BLOG_ARTICLES.filter(
    (a) => a.slug !== article.slug && a.category === article.category
  )
  const [relPage, setRelPage] = useState(0)
  const relPageCount = Math.max(1, Math.ceil(allRelated.length / 3))
  const related = allRelated.slice(relPage * 3, relPage * 3 + 3)

  const bodyContent = article.body || [
    {
      type: "intro",
      text: "In id pellentesque purus, sed auctor elit. Phasellus ut dui ex. Curabitur molestie dignissim laoreet. Fusce mollis sagittis tellus, id efficitur diam gravida vitae. Integer convallis ultricies metus, id euismod nisl auctor nec. Mauris vestibulum consequat ligula, eget viverra nisi efficitur quis. Pellentesque egestas magna in lorem vulputate efficitur.",
    },
    {
      type: "paragraph",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel libero molestie ligula ullamcorper eleifend vitae ornare lectus. Nam et quam mollis risus tristique placerat eu non enim. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed porttitor ex eu turpis accumsan semper. Integer pretium lorem at metus maximus, ac suscipit ligula pulvinar. Pellentesque non ex nec nulla malesuada placerat elementum condimentum eros. Pellentesque at magna sit amet lectus volutpat placerat. Phasellus a varius massa, at suscipit velit. Duis tellus urna, feugiat eu dapibus sit amet, euismod in enim. Nulla vehicula mattis quam ut bibendum. Nulla feugiat mollis neque et efficitur.",
    },
    {
      type: "heading",
      text: "Lorem ipsum dolor sit amet consectetur adipiscing.",
    },
    {
      type: "paragraph",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel libero molestie ligula ullamcorper eleifend vitae ornare lectus. Nam et quam mollis risus tristique placerat eu non enim. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed porttitor ex eu turpis accumsan semper. Integer pretium lorem at metus maximus, ac suscipit ligula pulvinar. Pellentesque non ex nec nulla malesuada placerat elementum condimentum eros. Pellentesque at magna sit amet lectus volutpat placerat. Phasellus a varius massa, at suscipit velit.",
    },
    {
      type: "heading",
      text: "Lorem ipsum dolor sit amet consectetur adipiscing.",
    },
    {
      type: "paragraph",
      text: "Suspendisse dapibus ex non sagittis laoreet. Quisque quis finibus quam. Morbi lacus lacus, malesuada sit amet quam nec, lobortis euismod arcu. Sed quis mauris in orci volutpat maximus. Morbi rutrum tristique metus et consequat. Morbi lacinia ligula felis, et suscipit felis egestas sit amet. Ut eu lacinia massa, pulvinar imperdiet urna. In interdum tincidunt eros, ac rutrum metus dictum vulputate. Vivamus tristique et ipsum at cursus.",
    },
    {
      type: "paragraph",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel libero molestie ligula ullamcorper eleifend vitae ornare lectus. Nam et quam mollis risus tristique placerat eu non enim. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed porttitor ex eu turpis accumsan semper. Integer pretium lorem at metus maximus, ac suscipit ligula pulvinar.",
    },
  ]

  return (
    <>
      {/* Hero — teal with centered text */}
      <section className="relative bg-bg-deep pt-28 md:pt-32 pb-0">
        <div className="max-w-[900px] 3xl:max-w-[1800px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24 text-center pb-10 md:pb-14">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-sm 3xl:text-base text-accent-wheat italic mb-3"
          >
            {article.date}, <span>by {article.author}</span>
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] 3xl:text-[4.5rem] font-medium text-accent-cream tracking-tight leading-tight"
          >
            {article.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-4 text-sm sm:text-base 3xl:text-lg text-accent-cream leading-relaxed max-w-2xl 3xl:max-w-3xl mx-auto"
          >
            {article.description}
          </motion.p>
        </div>

        {/* Hero image — contained */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-[1100px] 3xl:max-w-[2200px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24"
        >
          <img
            src={article.imageUrl || blogImages[article.image]}
            alt={article.title}
            className="w-full h-auto object-contain"
          />
        </motion.div>
      </section>

      {/* Body + Share */}
      <section className="bg-bg py-16 md:py-20">
        <div className="max-w-[1100px] 3xl:max-w-[2200px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 items-start">
            {/* Body */}
            <motion.div {...fadeInUp} className="flex flex-col gap-6">
              {bodyContent.map((block, i) => (
                <BodyBlock key={i} block={block} />
              ))}
            </motion.div>

            {/* Share sidebar */}
            <motion.div
              {...fadeInUp}
              className="lg:sticky lg:top-32 flex lg:flex-col items-start gap-3"
            >
              <p className="text-xs 3xl:text-sm tracking-wider uppercase text-primary/60 lg:mb-1">
                Share Post
              </p>
              <div className="flex lg:flex-col gap-2">
                {SHARE_BUTTONS.map((btn) => (
                  <button
                    key={btn.label}
                    aria-label={btn.label}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white hover:bg-secondary-terra transition-colors duration-200"
                  >
                    {btn.icon}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Post section divider */}
      <div className="w-full px-6 md:px-10 lg:px-16 3xl:px-24 pt-8 pb-2 bg-bg">
        <div className="flex items-center gap-2 mb-2">
          <svg width="14" height="14" viewBox="0 0 100 100" fill="#DD613E">
            <circle cx="50" cy="22" r="25" />
            <circle cx="50" cy="78" r="25" />
            <circle cx="22" cy="50" r="25" />
            <circle cx="78" cy="50" r="25" />
            <rect x="22" y="22" width="56" height="56" rx="4" fill="#DD613E" />
          </svg>
          <span className="text-[0.625rem] 3xl:text-sm font-normal tracking-[0.2em] uppercase" style={{ color: "#7A3A42" }}>
            Related Post
          </span>
        </div>
        <div
          className="h-[2px] w-full"
          style={{
            backgroundImage: "radial-gradient(circle, #38717A50 0.09375rem, transparent 0.09375rem)",
            backgroundSize: "0.5rem 0.1875rem",
            height: "2px",
          }}
        />
      </div>

      {/* Related Posts */}
      <section className="bg-bg py-16 md:py-20">
        <div className="max-w-[1400px] 3xl:max-w-[3200px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24">
          <motion.div
            key={relPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-10"
          >
            {related.map((post, i) => {
              const isCenter = i === 1 && related.length === 3
              return (
                <article
                  key={post.slug}
                  className={`group flex flex-col relative ${isCenter ? "lg:before:absolute lg:before:left-[-1.25rem] lg:before:top-0 lg:before:bottom-0 lg:before:w-px lg:before:bg-primary/10 lg:after:absolute lg:after:right-[-1.25rem] lg:after:top-0 lg:after:bottom-0 lg:after:w-px lg:after:bg-primary/10" : ""}`}
                >
                  <Link to={`/blog/${post.slug}`} className="block mb-4 overflow-hidden">
                    <div className="aspect-[16/10] overflow-hidden rounded-lg">
                      <img
                        src={post.imageUrl || blogImages[post.image]}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
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

          {/* Carousel arrows if more than 3 */}
          {relPageCount > 1 && (
            <div className="flex items-center gap-3 mt-10 justify-center">
              <button
                onClick={() => setRelPage((p) => Math.max(0, p - 1))}
                disabled={relPage === 0}
                className="w-10 h-10 3xl:w-12 3xl:h-12 rounded-lg bg-secondary-terra text-white flex items-center justify-center hover:bg-secondary-rust transition-all duration-200 disabled:opacity-30"
              >
                <ArrowLeft className="w-4.5 h-4.5" />
              </button>
              <button
                onClick={() => setRelPage((p) => Math.min(relPageCount - 1, p + 1))}
                disabled={relPage === relPageCount - 1}
                className="w-10 h-10 3xl:w-12 3xl:h-12 rounded-lg bg-secondary-terra text-white flex items-center justify-center hover:bg-secondary-rust transition-all duration-200 disabled:opacity-30"
              >
                <ArrowRight className="w-4.5 h-4.5" />
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
