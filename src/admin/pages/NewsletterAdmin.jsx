import { useEffect, useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Download, Trash2, Search } from "lucide-react"
import { adminApi } from "../auth"
import PageHeader from "../components/PageHeader"
import Button from "../components/Button"
import EmptyState from "../components/EmptyState"
import { useToast } from "../components/Toast"
import { useConfirm } from "../../components/ui/ConfirmDialog"
import { SkeletonList } from "../components/Skeleton"

export default function NewsletterAdmin() {
  const [items, setItems] = useState([])
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { notify } = useToast()
  const confirm = useConfirm()

  const load = async () => {
    setLoading(true)
    try {
      const data = await adminApi.listNewsletter()
      setItems(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    if (!query) return items
    const q = query.toLowerCase()
    return items.filter(
      (i) => i.email.toLowerCase().includes(q) || (i.source || "").toLowerCase().includes(q)
    )
  }, [items, query])

  const remove = async (id) => {
    if (!(await confirm({ title: "Remove this subscriber?", confirmLabel: "Remove", danger: true }))) return
    await adminApi.deleteSubscriber(id)
    notify("Subscriber removed")
    load()
  }

  const exportCsv = () => {
    const rows = [["email", "source", "subscribedAt"]]
    items.forEach((s) =>
      rows.push([s.email, s.source, new Date(s.createdAt).toISOString()])
    )
    const csv = rows
      .map((r) => r.map((c) => `"${(c || "").replace(/"/g, '""')}"`).join(","))
      .join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `miaa-subscribers-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
    notify("CSV downloaded")
  }

  return (
    <div>
      <PageHeader
        label="Newsletter"
        title="Subscribers"
        subtitle="Email addresses captured from the footer signup."
        actions={
          <Button onClick={exportCsv} variant="dark">
            <Download className="w-3.5 h-3.5" className="-ml-0.5 mr-1" /> Export CSV
          </Button>
        }
      />

      <div className="mb-4 relative max-w-sm">
        <Search
          className="w-3.5 h-3.5"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by email…"
          className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-primary/15 rounded-sm focus:outline-none focus:border-secondary-terra/70 focus:ring-1 focus:ring-secondary-terra/30 transition-colors"
        />
      </div>

      {error && (
        <p className="text-xs text-rose-600 bg-rose-50 px-3 py-2 rounded-sm mb-4">{error}</p>
      )}

      {loading ? (
        <SkeletonList count={5} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={items.length === 0 ? "No subscribers yet" : "No matches"}
          hint={
            items.length === 0
              ? "Newsletter signups from the public site appear here."
              : "Try a different search."
          }
        />
      ) : (
        <motion.ul
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.02 } } }}
          className="bg-white border border-primary/10 rounded-sm divide-y divide-primary/8 overflow-hidden"
        >
          {filtered.map((s) => (
            <motion.li
              key={s._id}
              variants={{ hidden: { opacity: 0, y: 4 }, visible: { opacity: 1, y: 0 } }}
              className="flex items-center gap-4 px-5 py-3 hover:bg-accent-cream/60 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-primary text-sm truncate">{s.email}</p>
                <p className="text-[0.6875rem] tracking-[0.15em] uppercase text-primary/45">
                  via {s.source}
                </p>
              </div>
              <span className="text-[0.625rem] tracking-[0.15em] uppercase text-primary/45 w-32 text-right">
                {new Date(s.createdAt).toLocaleDateString()}
              </span>
              <button
                onClick={() => remove(s._id)}
                className="inline-flex items-center gap-1 text-[0.625rem] tracking-[0.2em] uppercase text-primary/45 hover:text-rose-600 transition-colors"
              >
                <Trash2 className="w-3 h-3" /> Remove
              </button>
            </motion.li>
          ))}
        </motion.ul>
      )}

      <p className="text-[0.6875rem] text-primary/45 mt-4">
        Total subscribers: <span className="font-medium text-primary/70">{items.length}</span>
      </p>
    </div>
  )
}
