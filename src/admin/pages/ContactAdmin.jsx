import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trash2, ChevronDown } from "lucide-react"
import { adminApi } from "../auth"
import PageHeader from "../components/PageHeader"
import EmptyState from "../components/EmptyState"
import { Select } from "../components/Field"
import { useToast } from "../components/Toast"
import { useConfirm } from "../../components/ui/ConfirmDialog"
import { SkeletonList } from "../components/Skeleton"

const STATUSES = ["new", "in_progress", "resolved", "archived"]
const STATUS_STYLES = {
  new: "bg-secondary-terra/15 text-secondary-terra",
  in_progress: "bg-amber-500/15 text-amber-700",
  resolved: "bg-emerald-500/15 text-emerald-700",
  archived: "bg-primary/10 text-primary/60",
}

export default function ContactAdmin() {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState("")
  const [open, setOpen] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { notify } = useToast()
  const confirm = useConfirm()

  const load = async () => {
    setLoading(true)
    try {
      const data = await adminApi.listContact(filter ? { status: filter } : {})
      setItems(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  const setStatus = async (id, status) => {
    await adminApi.updateContact(id, { status })
    notify("Status updated")
    load()
  }
  const remove = async (id) => {
    if (!(await confirm({ title: "Delete this submission?", confirmLabel: "Delete", danger: true }))) return
    await adminApi.deleteContact(id)
    notify("Deleted")
    load()
  }

  return (
    <div>
      <PageHeader
        label="Inbox"
        title="Contact Submissions"
        subtitle="Every message from the &lsquo;Connect With the Museum&rsquo; forms."
        actions={
          <div className="w-44">
            <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="">All statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s.replace("_", " ")}</option>
              ))}
            </Select>
          </div>
        }
      />

      {error && (
        <p className="text-xs text-rose-600 bg-rose-50 px-3 py-2 rounded-sm mb-4">{error}</p>
      )}

      {loading ? (
        <SkeletonList count={6} />
      ) : items.length === 0 ? (
        <EmptyState title="No submissions" hint="They&apos;ll appear here as visitors send messages." />
      ) : (
        <motion.ul
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.03 } } }}
          className="bg-white border border-primary/10 rounded-sm divide-y divide-primary/8 overflow-hidden"
        >
          {items.map((s) => (
            <motion.li
              key={s._id}
              variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
            >
              <button
                onClick={() => setOpen(open === s._id ? null : s._id)}
                className="w-full text-left flex items-center gap-4 px-5 py-3 hover:bg-accent-cream/60 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-primary text-sm font-medium truncate">{s.fullName}</p>
                  <p className="text-[0.75rem] text-primary/55 truncate">
                    {s.email}
                    {s.topic ? ` · ${s.topic}` : ""}
                  </p>
                </div>
                <span
                  className={`text-[0.625rem] tracking-[0.2em] uppercase px-2 py-1 rounded-sm ${
                    STATUS_STYLES[s.status] || ""
                  }`}
                >
                  {s.status.replace("_", " ")}
                </span>
                <span className="text-[0.625rem] tracking-[0.15em] uppercase text-primary/40 w-32 text-right">
                  {new Date(s.createdAt).toLocaleDateString()}
                </span>
                <ChevronDown
                  className="w-3.5 h-3.5"
                  strokeWidth={2}
                  className={`text-primary/40 transition-transform duration-200 ${
                    open === s._id ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {open === s._id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                    className="overflow-hidden bg-accent-cream/50 border-t border-primary/8"
                  >
                    <div className="px-5 py-4">
                      <p className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/55 mb-1">
                        Message
                      </p>
                      <p className="whitespace-pre-wrap text-sm text-primary leading-relaxed">
                        {s.message}
                      </p>
                      <div className="mt-4 flex items-center gap-3">
                        <div className="w-44">
                          <Select
                            value={s.status}
                            onChange={(e) => setStatus(s._id, e.target.value)}
                          >
                            {STATUSES.map((st) => (
                              <option key={st} value={st}>{st.replace("_", " ")}</option>
                            ))}
                          </Select>
                        </div>
                        <a
                          href={`mailto:${s.email}`}
                          className="inline-flex items-center gap-1 text-[0.625rem] tracking-[0.2em] uppercase text-secondary-terra hover:text-secondary-rust transition-colors"
                        >
                          Reply by email
                        </a>
                        <button
                          onClick={() => remove(s._id)}
                          className="ml-auto inline-flex items-center gap-1 text-[0.625rem] tracking-[0.2em] uppercase text-primary/50 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </div>
  )
}
