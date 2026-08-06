import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import CTAButton from "../components/ui/Button"
import { fadeInUp } from "../lib/motion"
import { api } from "../lib/api"

export default function PreviousEventDetail() {
  const { slug } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setNotFound(false)
    api
      .previousEvent(slug)
      .then((data) => {
        if (!cancelled) setEvent(data)
      })
      .catch((err) => {
        if (cancelled) return
        if (err.status === 404) setNotFound(true)
        else setEvent(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [slug])

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-bg">
        <p className="text-primary/50 text-sm tracking-[0.2em] uppercase">Loading…</p>
      </section>
    )
  }

  if (notFound || !event) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-bg px-6">
        <div className="text-center">
          <p className="text-[0.625rem] tracking-[0.3em] uppercase text-secondary-terra mb-3">
            404
          </p>
          <h1 className="text-3xl md:text-4xl text-primary mb-4">
            We couldn&apos;t find that event.
          </h1>
          <CTAButton to="/offsite-events" showArrow={false}>
            Back to Events
          </CTAButton>
        </div>
      </section>
    )
  }

  const paragraphs = (event.description || "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

  return (
    <article className="bg-bg pt-28 md:pt-32 pb-16 md:pb-24">
      <div className="max-w-[1000px] 3xl:max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24">
        <motion.div {...fadeInUp} className="mb-8">
          <Link
            to="/offsite-events"
            className="inline-flex items-center gap-2 text-[0.6875rem] tracking-[0.2em] uppercase text-primary/60 hover:text-secondary-terra transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Previous Events
          </Link>
        </motion.div>

        <motion.header {...fadeInUp}>
          {event.date && (
            <p className="text-[0.6875rem] tracking-[0.25em] uppercase text-secondary-terra mb-3">
              {event.date}
            </p>
          )}
          <h1 className="text-3xl md:text-4xl lg:text-[3rem] 3xl:text-[4rem] font-medium text-primary tracking-tight leading-[1.1]">
            {event.title}
          </h1>
          {event.subtitle && (
            <p className="mt-4 text-base md:text-lg 3xl:text-xl text-primary/70 leading-relaxed">
              {event.subtitle}
            </p>
          )}
        </motion.header>

        {event.imageUrl && (
          <motion.div
            {...fadeInUp}
            className="mt-8 md:mt-10 rounded-lg overflow-hidden aspect-[16/9] bg-accent-cream"
          >
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}

        {paragraphs.length > 0 && (
          <motion.div
            {...fadeInUp}
            className="mt-8 md:mt-12 flex flex-col gap-5 max-w-[70ch]"
          >
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className="text-[0.9375rem] md:text-base 3xl:text-lg text-primary/85 leading-relaxed whitespace-pre-line"
              >
                {p}
              </p>
            ))}
          </motion.div>
        )}

        <div className="mt-12 md:mt-16">
          <CTAButton to="/offsite-events" showArrow={false}>
            Back to Events
          </CTAButton>
        </div>
      </div>
    </article>
  )
}
