import { useMemo } from "react"
import BlogHeroSection from "../components/sections/blog/BlogHeroSection"
import BlogGridSection from "../components/sections/blog/BlogGridSection"
import SectionDivider from "../components/ui/SectionDivider"
import { useCMS } from "../hooks/useCMS"
import { api } from "../lib/api"

// Normalise a CMS blog doc into the shape the public components expect.
function toArticle(post) {
  return {
    ...post,
    imageUrl: post.coverImageUrl || post.imageUrl || "",
    body: post.body || "",
  }
}

export default function Blog() {
  // One request for the whole page; the two rows are a filter over it. The
  // fallback is an empty list on purpose — there is no invented content to fall
  // back to, so an unreachable API and an empty CMS both show the empty state.
  const { data: posts, loading } = useCMS(
    () => api.blogList().then((items) => items.map(toArticle)),
    []
  )

  const updates = useMemo(() => posts.filter((p) => p.category === "Update"), [posts])
  const blogPosts = useMemo(() => posts.filter((p) => p.category === "Blog"), [posts])

  return (
    <>
      <BlogHeroSection articles={posts} loading={loading} />

      <SectionDivider label="Updates" bg="bg-accent-cream" variant="light" />
      <BlogGridSection
        heading="MIAA Updates"
        intro="Check in to read about our latest news, reviews and happenings.
For up to the minute news and updates remember to follow us on our socials."
        articles={updates}
        fetching={loading}
        emptyHeading="No Updates Just Yet"
        emptyBody="News from the museum — milestones, announcements and behind-the-scenes progress — will appear here as it happens."
      />

      <SectionDivider label="Blog" bg="bg-bg" variant="light" />
      <BlogGridSection
        heading="MIAA Blog Posts"
        intro="Check in to hear from the MIAA team about all things Islamic art, literature and creative communities."
        articles={blogPosts}
        fetching={loading}
        bg="bg-bg"
        emptyHeading="No Posts Just Yet"
        emptyBody="Stories from our team about Islamic art, literature and creative communities are on the way. Check back soon."
      />
    </>
  )
}
