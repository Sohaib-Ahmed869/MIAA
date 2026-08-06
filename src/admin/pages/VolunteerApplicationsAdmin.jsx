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

const STATUSES = ["new", "in_progress", "approved", "declined", "archived"]
const STATUS_STYLES = {
  new: "bg-secondary-terra/15 text-secondary-terra",
  in_progress: "bg-amber-500/15 text-amber-700",
  approved: "bg-emerald-500/15 text-emerald-700",
  declined: "bg-rose-500/15 text-rose-700",
  archived: "bg-primary/10 text-primary/60",
}

const AVATAR_TINTS = [
  "bg-secondary-terra/12 text-secondary-terra",
  "bg-primary/10 text-primary",
  "bg-secondary-amber/15 text-secondary-amber",
  "bg-accent-sage/30 text-primary",
]

const initials = (name) =>
  (name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "?"

export default function VolunteerApplicationsAdmin() {
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
      const data = await adminApi.listVolunteerApplications(filter ? { status: filter } : {})
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
    await adminApi.updateVolunteerApplication(id, { status })
    notify("Status updated")
    load()
  }
  const remove = async (id) => {
    if (!(await confirm({ title: "Delete this application?", confirmLabel: "Delete", danger: true })))
      return
    await adminApi.deleteVolunteerApplication(id)
    notify("Deleted")
    load()
  }

  return (
    <div>
      <PageHeader
        label="Inbox"
        title="Volunteer Applications"
        subtitle="Everyone who applied to volunteer via the Volunteer page."
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
        <EmptyState
          title="No applications yet"
          hint="They&apos;ll appear here as people apply to volunteer."
        />
      ) : (
        <motion.ul
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.03 } } }}
          className="bg-white border border-primary/10 rounded-sm divide-y divide-primary/8 overflow-hidden"
        >
          {items.map((s, i) => (
            <motion.li
              key={s._id}
              variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
            >
              <button
                onClick={() => setOpen(open === s._id ? null : s._id)}
                className="w-full text-left flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 sm:py-3 hover:bg-accent-cream/60 transition-colors"
              >
                <span
                  className={`grid place-items-center w-9 h-9 rounded-full text-[0.6875rem] font-semibold flex-shrink-0 ${
                    AVATAR_TINTS[i % AVATAR_TINTS.length]
                  }`}
                >
                  {initials(s.fullName)}
                </span>

                <div className="flex-1 min-w-0">
                  <p className="text-primary text-sm font-semibold truncate">{s.fullName}</p>
                  <p className="text-[0.75rem] text-primary/55 break-all sm:truncate">
                    {s.email}
                    {s.areasOfInterest?.length ? ` · ${s.areasOfInterest.join(", ")}` : ""}
                  </p>
                  <div className="flex sm:hidden items-center gap-2 mt-1.5">
                    <span
                      className={`text-[0.5625rem] tracking-[0.18em] uppercase px-2 py-0.5 rounded-full ${
                        STATUS_STYLES[s.status] || ""
                      }`}
                    >
                      {s.status.replace("_", " ")}
                    </span>
                    <span className="text-[0.625rem] tracking-[0.1em] uppercase text-primary/40 ml-auto">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <span
                  className={`hidden sm:inline-block text-[0.625rem] tracking-[0.2em] uppercase px-2 py-1 rounded-sm ${
                    STATUS_STYLES[s.status] || ""
                  }`}
                >
                  {s.status.replace("_", " ")}
                </span>
                <span className="hidden sm:block text-[0.625rem] tracking-[0.15em] uppercase text-primary/40 w-28 text-right">
                  {new Date(s.createdAt).toLocaleDateString()}
                </span>

                <ChevronDown
                  strokeWidth={2}
                  className={`w-4 h-4 flex-shrink-0 text-primary/40 transition-transform duration-200 ${
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
                    <div className="px-4 sm:px-5 py-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-4">
                        <Detail label="Phone" value={s.phone || "—"} />
                        <Detail label="Availability" value={s.availability || "—"} />
                        <Detail
                          label="Areas of Interest"
                          value={s.areasOfInterest?.length ? s.areasOfInterest.join(", ") : "—"}
                        />
                      </div>

                      {s.message && (
                        <>
                          <p className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/55 mb-1.5">
                            Message
                          </p>
                          <p className="whitespace-pre-wrap text-sm text-primary leading-relaxed">
                            {s.message}
                          </p>
                        </>
                      )}

                      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                        <div className="w-full sm:w-44">
                          <Select
                            value={s.status}
                            onChange={(e) => setStatus(s._id, e.target.value)}
                          >
                            {STATUSES.map((st) => (
                              <option key={st} value={st}>{st.replace("_", " ")}</option>
                            ))}
                          </Select>
                        </div>
                        <div className="flex items-center justify-between sm:contents">
                          <a
                            href={`mailto:${s.email}`}
                            className="inline-flex items-center gap-1 text-[0.625rem] tracking-[0.2em] uppercase text-secondary-terra hover:text-secondary-rust transition-colors"
                          >
                            Reply by email
                          </a>
                          <button
                            onClick={() => remove(s._id)}
                            className="inline-flex items-center gap-1 text-[0.625rem] tracking-[0.2em] uppercase text-primary/50 hover:text-rose-600 transition-colors sm:ml-auto"
                          >
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        </div>
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

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-[0.5625rem] tracking-[0.2em] uppercase text-primary/50 mb-0.5">
        {label}
      </p>
      <p className="text-sm text-primary">{value}</p>
    </div>
  )
}
