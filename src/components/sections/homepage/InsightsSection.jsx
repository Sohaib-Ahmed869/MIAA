import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { Link } from "react-router-dom"
import { fadeInUp, staggerContainer, staggerItem } from "../../../lib/motion"
import CTAButton from "../../ui/Button"
import Text from "../../../content/Text"
import { useText } from "../../../content/context"
import { useCMS } from "../../../hooks/useCMS"
import { api } from "../../../lib/api"
import NoBlogPosts from "../blog/NoBlogPosts"

// Three across, matching the grid.
const MAX_CARDS = 3

function SkeletonCard() {
  return (
    <div className="md:px-6 first:md:pl-0 last:md:pr-0 animate-pulse">
      <div className="h-52 md:h-56 3xl:h-[16vw] rounded-lg bg-primary/10 mb-4" />
      <div className="h-5 bg-primary/10 rounded w-2/3 mb-3" />
      <div className="h-3 bg-primary/10 rounded w-full mb-2" />
      <div className="h-3 bg-primary/10 rounded w-1/2" />
    </div>
  )
}

export default function InsightsSection() {
  const t = useText()
  // Real posts only — the fallback is an empty list, so an unreachable API and
  // an empty CMS both land on the empty state rather than on invented articles.
  const { data: posts, loading } = useCMS(() => api.blogList(), [])
  const visible = posts.slice(0, MAX_CARDS)

  return (
    <section className="py-16 md:py-24 3xl:py-32 bg-accent-cream">
      <div className="max-w-[1400px] 3xl:max-w-[3200px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24">
        {/* Header */}
        <motion.div
          {...fadeInUp}
          className="flex flex-col md:flex-row md:items-start md:justify-between mb-10"
        >
          <h2 className="text-3xl md:text-4xl 3xl:text-[3.2rem] font-medium text-primary tracking-tight">
            <Text k="home.insights.heading" />
          </h2>
          {/* The button only earns its place while there is something to visit. */}
          {visible.length > 0 && (
            <CTAButton to="/blog" className="mt-4 md:mt-0 px-4 py-2">{t("home.insights.cta")}</CTAButton>
          )}
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 md:divide-x md:divide-primary/10 gap-y-8 md:gap-y-0">
            {Array.from({ length: MAX_CARDS }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <NoBlogPosts
            heading={t("home.insights.empty.heading")}
            body={t("home.insights.empty.body")}
          />
        ) : (
          /* Blog cards - flat, no card wrapper */
          <motion.div
            {...staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 md:divide-x md:divide-primary/10 gap-y-8 md:gap-y-0"
          >
            {visible.map((post) => (
              <motion.article
                key={post._id || post.slug}
                {...staggerItem}
                className="group md:px-6 first:md:pl-0 last:md:pr-0"
              >
                {/* Image */}
                <Link to={`/blog/${post.slug}`} className="block">
                  <div className="h-52 md:h-56 3xl:h-[16vw] rounded-lg overflow-hidden mb-4 bg-primary/10">
                    {post.coverImageUrl && (
                      <img
                        src={post.coverImageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>
                </Link>

                {/* Text */}
                <h3 className="text-lg 3xl:text-2xl font-semibold text-primary mb-2">
                  {post.title}
                </h3>
                <p className="text-sm 3xl:text-lg text-primary leading-relaxed mb-3">
                  {post.description}
                </p>
                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1 text-xs 3xl:text-sm font-bold tracking-wider uppercase text-secondary-terra hover:text-secondary-rust transition-colors"
                >
                  Read More
                  <ArrowUpRight className="w-3 h-3" strokeWidth={2.5} />
                </Link>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
