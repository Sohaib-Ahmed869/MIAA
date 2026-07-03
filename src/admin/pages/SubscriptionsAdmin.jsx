import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { adminApi } from "../auth"
import PageHeader from "../components/PageHeader"
import EmptyState from "../components/EmptyState"
import { SkeletonCardGrid } from "../components/Skeleton"

const STATUS_COLORS = {
  active: "bg-emerald-500/90 text-white",
  paused: "bg-amber-500/90 text-white",
  cancelled: "bg-primary/60 text-white",
  past_due: "bg-rose-500/90 text-white",
  expired: "bg-primary/40 text-white",
}

export default function SubscriptionsAdmin() {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = async () => {
    setLoading(true)
    try {
      const params = {}
      if (filter !== "all") params.status = filter
      const data = await adminApi.listSubscriptions(params)
      setItems(data.items || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    load()
  }, [filter])

  return (
    <div>
      <PageHeader
        label="Donations"
        title="Subscriptions"
        subtitle="Manage recurring donation subscriptions."
      />

      {/* Status filter */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {[
          { value: "all", label: "All" },
          { value: "active", label: "Active" },
          { value: "paused", label: "Paused" },
          { value: "cancelled", label: "Cancelled" },
          { value: "past_due", label: "Past Due" },
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`px-4 py-1.5 text-[0.625rem] tracking-[0.2em] uppercase rounded-sm border transition-colors ${
              filter === opt.value
                ? "bg-primary text-white border-primary"
                : "bg-white text-primary/70 border-primary/15 hover:border-primary/40"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {loading ? (
        <SkeletonCardGrid count={6} />
      ) : items.length === 0 ? (
        <EmptyState
          title="No subscriptions yet"
          hint="Recurring donations will appear here."
        />
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.03 } } }}
          className="flex flex-col gap-2"
        >
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 px-4 py-2 text-[0.625rem] tracking-[0.2em] uppercase text-primary/50">
            <span>Donor</span>
            <span>Amount</span>
            <span>Frequency</span>
            <span>Status</span>
            <span>Next Payment</span>
            <span>Total Paid</span>
          </div>
          {items.map((s) => (
            <motion.div
              key={s._id}
              variants={{ hidden: { opacity: 0, y: 5 }, visible: { opacity: 1, y: 0 } }}
              className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 items-center px-4 py-3 bg-white border border-primary/8 rounded-sm"
            >
              <div>
                <p className="text-sm font-medium text-primary truncate">
                  {s.donor
                    ? `${s.donor.firstName || ""} ${s.donor.lastName || ""}`.trim()
                    : "—"}
                </p>
                <p className="text-[0.6875rem] text-primary/50 truncate">
                  {s.donor?.email || "—"}
                </p>
              </div>
              <p className="text-sm font-medium text-primary min-w-[5rem] text-right">
                ${(s.amount / 100).toFixed(2)}
              </p>
              <span className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/60 min-w-[5rem] text-center">
                {s.frequency}
              </span>
              <span
                className={`text-[0.5625rem] tracking-[0.2em] uppercase px-2 py-1 rounded-sm min-w-[5rem] text-center ${
                  STATUS_COLORS[s.status] || "bg-primary/20 text-primary"
                }`}
              >
                {s.status}
              </span>
              <p className="text-[0.6875rem] text-primary/50 min-w-[5rem] text-right">
                {s.nextPaymentDate
                  ? new Date(s.nextPaymentDate).toLocaleDateString("en-AU")
                  : "—"}
              </p>
              <p className="text-sm text-primary/60 min-w-[5rem] text-right">
                ${((s.totalPaid || 0) / 100).toLocaleString()}
              </p>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
