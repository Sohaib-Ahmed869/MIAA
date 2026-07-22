import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Calendar, Archive, Users, Inbox, Mail, ArrowUpRight } from "lucide-react"
import { adminApi, getAdminUser } from "../auth"
import PageHeader from "../components/PageHeader"
import { SkeletonStatCards, SkeletonList } from "../components/Skeleton"

const CARDS = [
  { key: "events", title: "Events", icon: Calendar, to: "/admin/events" },
  { key: "previousEvents", title: "Previous Events", icon: Archive, to: "/admin/previous-events" },
  { key: "team", title: "Team Members", icon: Users, to: "/admin/team" },
  { key: "contact", title: "Contact Submissions", icon: Inbox, to: "/admin/contact" },
  { key: "newsletter", title: "Subscribers", icon: Mail, to: "/admin/newsletter" },
]

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    if (value == null) return
    const target = Number(value)
    if (Number.isNaN(target)) return
    const start = performance.now()
    const duration = 700
    let raf
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(target * eased))
      if (t < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [value])
  return <span>{display}</span>
}

export default function Dashboard() {
  const [counts, setCounts] = useState({})
  const [recent, setRecent] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const admin = getAdminUser()

  useEffect(() => {
    let mounted = true
    setLoading(true)
    Promise.all([
      adminApi.listEvents().catch(() => []),
      adminApi.listPreviousEvents().catch(() => []),
      adminApi.listTeam().catch(() => []),
      adminApi.listContact().catch(() => []),
      adminApi.listNewsletter().catch(() => []),
    ])
      .then(([events, prev, team, contact, news]) => {
        if (!mounted) return
        setCounts({
          events: events.length,
          previousEvents: prev.length,
          team: team.length,
          contact: contact.length,
          newsletter: news.length,
        })
        setRecent(contact.slice(0, 5))
      })
      .catch((err) => setError(err.message || "Failed to load counts"))
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div>
      <PageHeader
        label="Overview"
        title={`Hello${admin?.name ? `, ${admin.name.split(" ")[0]}` : ""}`}
        subtitle="A quick look at your museum content and recent activity."
      />

      {error && <p className="text-rose-600 text-sm mb-4">{error}</p>}

      {loading ? (
        <SkeletonStatCards count={5} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {CARDS.map((c, i) => (
            <motion.div
              key={c.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 + i * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Link
                to={c.to}
                className="group block bg-white border border-primary/10 rounded-sm p-4 sm:p-5 hover:border-secondary-terra/60 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-sm bg-accent-cream text-primary">
                    <c.icon className="w-4 h-4" strokeWidth={1.75} />
                  </span>
                  <ArrowUpRight
                    strokeWidth={2}
                    className="w-3.5 h-3.5 text-primary/30 group-hover:text-secondary-terra transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </div>
                <p
                  className="text-4xl font-medium text-primary leading-none"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <AnimatedNumber value={counts[c.key]} />
                </p>
                <p className="text-[0.6875rem] tracking-[0.18em] uppercase text-primary/55 mt-3">
                  {c.title}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-10 bg-white border border-primary/10 rounded-sm overflow-hidden"
      >
        <div className="px-4 sm:px-6 py-4 border-b border-primary/10 flex items-center justify-between gap-3">
          <p
            className="text-base text-primary tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Recent Contact Submissions
          </p>
          <Link
            to="/admin/contact"
            className="group inline-flex items-center gap-1 text-[0.625rem] tracking-[0.2em] uppercase text-secondary-terra hover:text-secondary-rust transition-colors"
          >
            View all
            <ArrowUpRight
              strokeWidth={2.5}
              className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
        {loading ? (
          <div className="p-3">
            <SkeletonList count={4} />
          </div>
        ) : recent.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-primary/55">
            No submissions yet.
          </p>
        ) : (
          <ul className="divide-y divide-primary/8">
            {recent.map((s) => (
              <li
                key={s._id}
                className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4 text-sm hover:bg-accent-cream/60 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-primary font-medium truncate">{s.fullName}</p>
                  <p className="text-primary/60 text-xs truncate">
                    {s.email}
                    {s.topic ? ` · ${s.topic}` : ""}
                  </p>
                </div>
                <span className="text-[0.625rem] tracking-[0.15em] uppercase text-primary/50">
                  {new Date(s.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </div>
  )
}
