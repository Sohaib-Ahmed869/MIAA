import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import EventDetailSection from "../components/sections/eventdetail/EventDetailSection"
import CTAButton from "../components/ui/Button"
import { api } from "../lib/api"

function slugify(s = "") {
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export default function EventDetail() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setNotFound(false)

    // "Other Upcoming Events" must only advertise events that haven't happened
    // yet, so this asks the server for the upcoming set rather than every event.
    // The server owns the definition of "upcoming" (an all-day event counts
    // until the end of its day, and undated "TBA" entries never expire) and
    // returns them soonest-first, so the three shown are the next three.
    const loadRelated = (excludeId) =>
      api
        .events({ upcoming: true })
        .then((list) => {
          if (!cancelled) setRelated(list.filter((e) => e._id !== excludeId))
        })
        .catch(() => {})

    // Resolving the event itself deliberately queries the *unfiltered* list:
    // a past event's own page must still open when someone follows an old link.
    const resolveFromList = () =>
      api
        .events()
        .then((list) => {
          if (cancelled) return
          const match =
            list.find((e) => e._id === id) ||
            list.find((e) => e.slug && e.slug === id) ||
            list.find((e) => slugify(e.title) === id)
          if (match) {
            setEvent(match)
            return loadRelated(match._id)
          }
          setNotFound(true)
        })
        .catch(() => {
          if (!cancelled) setNotFound(true)
        })

    api
      .eventById(id)
      .then((data) => {
        if (cancelled) return
        if (data && data._id) {
          setEvent(data)
          loadRelated(data._id)
        } else {
          return resolveFromList()
        }
      })
      .catch(() => resolveFromList())
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  if (notFound) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-bg-deep px-6">
        <div className="text-center">
          <p className="text-[0.625rem] tracking-[0.3em] uppercase text-accent-wheat mb-3">
            404
          </p>
          <h1 className="text-3xl md:text-4xl text-accent-cream mb-6">
            We couldn&apos;t find that event.
          </h1>
          <CTAButton to="/offsite-events" showArrow={false}>
            Back to Events
          </CTAButton>
        </div>
      </section>
    )
  }

  if (loading || !event) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-bg-deep">
        <p className="text-accent-cream/60 text-sm tracking-[0.2em] uppercase">
          Loading…
        </p>
      </section>
    )
  }

  return <EventDetailSection event={event} relatedEvents={related} />
}
