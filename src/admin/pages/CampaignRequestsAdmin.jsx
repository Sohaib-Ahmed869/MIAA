import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Check, X, Pause, Play, RotateCcw, Mail, Calendar } from "lucide-react"
import { adminApi } from "../auth"
import PageHeader from "../components/PageHeader"
import EmptyState from "../components/EmptyState"
import { useToast } from "../components/Toast"
import { SkeletonCardGrid } from "../components/Skeleton"
import FilterTabs from "../components/FilterTabs"

const STATUS_META = {
  draft: { label: "Pending", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  active: { label: "Live", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  paused: { label: "Paused", cls: "bg-slate-100 text-slate-600 border-slate-200" },
  completed: { label: "Completed", cls: "bg-sky-50 text-sky-700 border-sky-200" },
  rejected: { label: "Rejected", cls: "bg-rose-50 text-rose-700 border-rose-200" },
  cancelled: { label: "Closed", cls: "bg-slate-100 text-slate-500 border-slate-200" },
}

const FILTERS = [
  { value: "all", label: "All" },
  { value: "draft", label: "Pending" },
  { value: "active", label: "Live" },
  { value: "paused", label: "Paused" },
  { value: "rejected", label: "Rejected" },
]

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.draft
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[0.625rem] font-semibold tracking-[0.1em] uppercase border ${meta.cls}`}>
      {meta.label}
    </span>
  )
}

const btnBase =
  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[0.6875rem] font-semibold tracking-[0.08em] uppercase transition-colors disabled:opacity-50"

export default function CampaignRequestsAdmin() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [busyId, setBusyId] = useState(null)
  const [rejecting, setRejecting] = useState(null) // id being rejected
  const [rejectReason, setRejectReason] = useState("")
  const { notify } = useToast()

  useEffect(() => {
    let alive = true
    adminApi
      .listCampaignRequests()
      .then((data) => {
        if (alive) setItems(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        if (alive) setItems([])
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [])

  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((c) => c.status === filter)),
    [items, filter],
  )

  const pendingCount = items.filter((c) => c.status === "draft").length

  const setStatus = async (id, status, reviewNote) => {
    setBusyId(id)
    try {
      const updated = await adminApi.updateCampaignStatus(id, { status, reviewNote })
      setItems((prev) => prev.map((c) => (c._id === id ? { ...c, ...updated } : c)))
      const msg = {
        active: "Campaign approved and published",
        paused: "Campaign paused",
        rejected: "Request rejected",
        draft: "Request re-opened",
      }
      notify(msg[status] || "Updated")
      setRejecting(null)
      setRejectReason("")
      // Refresh the sidebar pending-requests badge.
      window.dispatchEvent(new Event("miaa:campaign-requests-changed"))
    } catch (err) {
      notify(err.message || "Action failed", "error")
    } finally {
      setBusyId(null)
    }
  }

  const requesterName = (c) =>
    c.requestedBy
      ? `${c.requestedBy.firstName || ""} ${c.requestedBy.lastName || ""}`.trim()
      : ""
  const requesterEmail = (c) => c.requestedBy?.email || c.requestedByEmail || "—"

  return (
    <div>
      <PageHeader
        label="Donations"
        title="Campaign Requests"
        subtitle="Review campaigns suggested by donors. Approving one publishes it to the donations page; the requester is notified of the outcome by email."
      />

      {/* Filter chips */}
      <div className="mb-6">
        <FilterTabs
          value={filter}
          onChange={setFilter}
          options={FILTERS.map((f) =>
            f.value === "draft" && pendingCount > 0
              ? { ...f, count: pendingCount }
              : f,
          )}
        />
      </div>

      {loading ? (
        <SkeletonCardGrid count={3} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No campaign requests"
          hint="Donor-submitted campaign suggestions will appear here for review."
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((c) => (
            <motion.div
              key={c._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-primary/10 rounded-sm overflow-hidden"
            >
              <div className="flex flex-col md:flex-row gap-5 p-5">
                {c.imageUrl ? (
                  <img
                    src={c.imageUrl}
                    alt={c.title}
                    className="w-full md:w-44 h-32 object-cover rounded-sm flex-shrink-0"
                  />
                ) : (
                  <div className="w-full md:w-44 h-32 rounded-sm bg-primary/5 flex-shrink-0" />
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-medium text-primary">{c.title}</h3>
                    <StatusBadge status={c.status} />
                  </div>

                  <p className="text-sm text-primary/60 mt-1.5 leading-relaxed">
                    {c.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-3 text-[0.75rem] text-primary/50">
                    <span className="inline-flex items-center gap-1.5">
                      {requesterName(c) && (
                        <span className="font-medium text-primary/70">
                          {requesterName(c)}
                        </span>
                      )}
                      <Mail className="w-3 h-3" /> {requesterEmail(c)}
                    </span>
                    {c.goalAmount > 0 && (
                      <span className="font-semibold text-secondary-terra">
                        Goal ${(c.goalAmount / 100).toLocaleString()}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      {new Date(c.createdAt).toLocaleDateString("en-AU")}
                    </span>
                  </div>

                  {c.status === "rejected" && c.reviewNote && (
                    <p className="mt-3 text-[0.8125rem] text-rose-700 bg-rose-50 border border-rose-100 rounded-sm px-3 py-2">
                      <span className="font-semibold">Rejection note:</span> {c.reviewNote}
                    </p>
                  )}

                  {/* Reject reason input */}
                  {rejecting === c._id ? (
                    <div className="mt-4 space-y-2">
                      <textarea
                        autoFocus
                        rows={2}
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Optional note to the donor explaining why…"
                        className="w-full py-2 px-3 bg-white border border-primary/15 rounded-sm text-sm placeholder:text-primary/30 focus:border-secondary-terra focus:outline-none"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setStatus(c._id, "rejected", rejectReason)}
                          disabled={busyId === c._id}
                          className={`${btnBase} bg-rose-600 text-white hover:bg-rose-700`}
                        >
                          <X className="w-3.5 h-3.5" /> Confirm Reject
                        </button>
                        <button
                          onClick={() => {
                            setRejecting(null)
                            setRejectReason("")
                          }}
                          className={`${btnBase} bg-primary/5 text-primary/60 hover:bg-primary/10`}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2 mt-4">
                      {(c.status === "draft" || c.status === "paused" || c.status === "rejected") && (
                        <button
                          onClick={() => setStatus(c._id, "active")}
                          disabled={busyId === c._id}
                          className={`${btnBase} bg-emerald-600 text-white hover:bg-emerald-700`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          {c.status === "paused" ? "Resume" : "Approve & Publish"}
                        </button>
                      )}
                      {c.status === "active" && (
                        <button
                          onClick={() => setStatus(c._id, "paused")}
                          disabled={busyId === c._id}
                          className={`${btnBase} bg-slate-200 text-slate-700 hover:bg-slate-300`}
                        >
                          <Pause className="w-3.5 h-3.5" /> Pause
                        </button>
                      )}
                      {c.status !== "rejected" && (
                        <button
                          onClick={() => {
                            setRejecting(c._id)
                            setRejectReason(c.reviewNote || "")
                          }}
                          disabled={busyId === c._id}
                          className={`${btnBase} bg-white border border-rose-200 text-rose-600 hover:bg-rose-50`}
                        >
                          <X className="w-3.5 h-3.5" /> Reject
                        </button>
                      )}
                      {c.status === "rejected" && (
                        <button
                          onClick={() => setStatus(c._id, "draft")}
                          disabled={busyId === c._id}
                          className={`${btnBase} bg-primary/5 text-primary/70 hover:bg-primary/10`}
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Re-open
                        </button>
                      )}
                      {c.status === "active" && (
                        <a
                          href={`/campaign/${c.slug || c._id}`}
                          target="_blank"
                          rel="noreferrer"
                          className={`${btnBase} bg-primary/5 text-primary/70 hover:bg-primary/10`}
                        >
                          <Play className="w-3.5 h-3.5" /> View Live
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
