import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { Link } from "react-router-dom"
import { fadeInUp, staggerContainer, staggerItem } from "../../../lib/motion"
import CTAButton from "../../ui/Button"
import Text from "../../../content/Text"
import { useText } from "../../../content/context"
import { BLOG_POSTS } from "../../../lib/constants"

import img1 from "../../../assets/images/Homepage/insightsandinspirations/Rectangle 100 (4).png"
import img2 from "../../../assets/images/Homepage/insightsandinspirations/Rectangle 100 (5).png"
import img3 from "../../../assets/images/Homepage/insightsandinspirations/Rectangle 100 (6).png"

const blogImages = {
  "Rectangle 100 (4).png": img1,
  "Rectangle 100 (5).png": img2,
  "Rectangle 100 (6).png": img3,
}

export default function InsightsSection() {
  const t = useText()
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
          <CTAButton to="/blog" className="mt-4 md:mt-0 px-4 py-2">{t("home.insights.cta")}</CTAButton>
        </motion.div>

        {/* Blog cards - flat, no card wrapper */}
        <motion.div
          {...staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 md:divide-x md:divide-primary/10 gap-y-8 md:gap-y-0"
        >
          {BLOG_POSTS.map((post, i) => (
            <motion.article key={i} {...staggerItem} className="group md:px-6 first:md:pl-0 last:md:pr-0">
              {/* Image */}
              <div className="h-52 md:h-56 3xl:h-[16vw] rounded-lg overflow-hidden mb-4">
                <img
                  src={blogImages[post.image]}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Text */}
              <h3 className="text-lg 3xl:text-2xl font-semibold text-primary mb-2">
                {post.title}
              </h3>
              <p className="text-sm 3xl:text-lg text-primary leading-relaxed mb-3">
                {post.description}
              </p>
              <Link
                to="/blog"
                className="inline-flex items-center gap-1 text-xs 3xl:text-sm font-bold tracking-wider uppercase text-secondary-terra hover:text-secondary-rust transition-colors"
              >
                Read More
                <ArrowUpRight className="w-3 h-3" strokeWidth={2.5} />
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
