import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { adminApi } from "../auth"
import PageHeader from "../components/PageHeader"
import EmptyState from "../components/EmptyState"
import { SkeletonCardGrid } from "../components/Skeleton"
import DateFilter from "../components/DateFilter"

const ACTION_COLORS = {
  "donation.succeeded": "text-emerald-600",
  "donation.failed": "text-rose-600",
  "donation.refunded": "text-amber-600",
  "subscription.created": "text-blue-600",
  "subscription.cancelled": "text-rose-500",
  "webhook.received": "text-primary/50",
}

export default function AuditLogAdmin() {
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState({ preset: "all", startDate: "", endDate: "" })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = async () => {
    setLoading(true)
    try {
      const params = { page, limit: 50 }
      if (filter !== "all") params.action = filter
      if (dateFilter.startDate) params.startDate = dateFilter.startDate
      if (dateFilter.endDate) params.endDate = dateFilter.endDate
      const data = await adminApi.listAuditLog(params)
      setItems(data.items || [])
      setTotal(data.total || 0)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    load()
  }, [page, filter, dateFilter])

  const totalPages = Math.ceil(total / 50)

  return (
    <div>
      <PageHeader
        label="Donations"
        title="Audit Log"
        subtitle="Immutable record of all donation-related transactions and events."
      />

      {/* Date filter */}
      <div className="mb-4">
        <DateFilter value={dateFilter} onChange={(v) => { setDateFilter(v); setPage(1) }} />
      </div>

      {/* Action filter */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {[
          { value: "all", label: "All" },
          { value: "donation.succeeded", label: "Donations" },
          { value: "subscription.created", label: "Subscriptions" },
          { value: "webhook.received", label: "Webhooks" },
          { value: "donation.refunded", label: "Refunds" },
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => {
              setFilter(opt.value)
              setPage(1)
            }}
            className={`px-4 py-1.5 text-[0.625rem] tracking-[0.2em] uppercase rounded-sm border transition-colors ${
              filter === opt.value
                ? "bg-primary text-white border-primary"
                : "bg-white text-primary/70 border-primary/15 hover:border-primary/40"
            }`}
          >
            {opt.label}
          </button>
        ))}
        <span className="text-[0.625rem] text-primary/40 ml-2">{total} entries</span>
      </div>

      {loading ? (
        <SkeletonCardGrid count={10} />
      ) : items.length === 0 ? (
        <EmptyState
          title="No audit entries"
          hint="Transaction logs will appear here as donations are processed."
        />
      ) : (
        <>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.02 } } }}
            className="flex flex-col gap-1"
          >
            {items.map((entry) => (
              <motion.div
                key={entry._id}
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                className="flex items-start gap-4 px-4 py-3 bg-white border border-primary/6 rounded-sm"
              >
                <span className="text-[0.6875rem] text-primary/40 min-w-[8rem] pt-0.5">
                  {new Date(entry.createdAt).toLocaleString("en-AU", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span
                  className={`text-[0.625rem] tracking-[0.15em] uppercase font-medium min-w-[10rem] pt-0.5 ${
                    ACTION_COLORS[entry.action] || "text-primary/60"
                  }`}
                >
                  {entry.action}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-primary/80">
                    {entry.actor?.email || entry.actor?.type || "system"}
                  </p>
                  {entry.details && Object.keys(entry.details).length > 0 && (
                    <p className="text-[0.6875rem] text-primary/40 mt-0.5 truncate">
                      {JSON.stringify(entry.details).slice(0, 120)}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 text-[0.625rem] tracking-[0.2em] uppercase rounded-sm border border-primary/15 hover:border-primary/40 disabled:opacity-30 transition-colors"
              >
                Previous
              </button>
              <span className="text-[0.625rem] text-primary/50">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 text-[0.625rem] tracking-[0.2em] uppercase rounded-sm border border-primary/15 hover:border-primary/40 disabled:opacity-30 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
