import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import CTAButton from "../components/ui/Button"
import BlogDetailSection from "../components/sections/blog/BlogDetailSection"
import { BLOG_ARTICLES } from "../lib/constants"
import { api } from "../lib/api"
import { toBlocks } from "../lib/blogBlocks"

function normalise(post) {
  if (!post) return null
  return {
    ...post,
    image: post.image || "",
    imageUrl: post.coverImageUrl || post.imageUrl || "",
    // Blocks from the admin builder win; older posts still carry HTML in `body`,
    // which toBlocks() parses into the same shape.
    body: toBlocks(post.blocks?.length ? post.blocks : post.body),
  }
}

export default function BlogDetail() {
  const { slug } = useParams()
  // Start with the static fallback so we render immediately + survive offline
  const [article, setArticle] = useState(() =>
    BLOG_ARTICLES.find((a) => a.slug === slug) || null
  )
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setNotFound(false)
    api
      .blogBySlug(slug)
      .then((post) => {
        if (cancelled) return
        setArticle(normalise(post))
      })
      .catch((err) => {
        if (cancelled) return
        // If the CMS doesn't have it AND we don't have a fallback, show 404
        const staticMatch = BLOG_ARTICLES.find((a) => a.slug === slug)
        if (!staticMatch) {
          if (err.status === 404) setNotFound(true)
          else setArticle(null)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [slug])

  if (notFound || (!loading && !article)) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-bg-deep px-6">
        <div className="text-center">
          <p className="text-[0.625rem] tracking-[0.3em] uppercase text-accent-wheat mb-3">404</p>
          <h1 className="text-3xl md:text-4xl text-accent-cream mb-4">
            We couldn&apos;t find that post.
          </h1>
          <CTAButton to="/blog" showArrow={false}>Back to Blog</CTAButton>
        </div>
      </section>
    )
  }

  if (!article) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-bg-deep">
        <p className="text-accent-cream/60 text-sm tracking-[0.2em] uppercase">Loading…</p>
      </section>
    )
  }

  return <BlogDetailSection article={article} />
}
