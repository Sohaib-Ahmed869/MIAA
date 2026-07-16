import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { adminApi } from "../auth"
import PageHeader from "../components/PageHeader"
import EmptyState from "../components/EmptyState"
import { SkeletonCardGrid } from "../components/Skeleton"
import DateFilter from "../components/DateFilter"
import FilterTabs from "../components/FilterTabs"

const STATUS = {
  active: { label: "Active", dot: "bg-emerald-500", pill: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/25" },
  paused: { label: "Paused", dot: "bg-amber-500", pill: "bg-amber-500/10 text-amber-700 ring-amber-500/25" },
  cancelled: { label: "Cancelled", dot: "bg-primary/40", pill: "bg-primary/[0.07] text-primary/60 ring-primary/15" },
  past_due: { label: "Past Due", dot: "bg-rose-500", pill: "bg-rose-500/10 text-rose-700 ring-rose-500/25" },
  expired: { label: "Expired", dot: "bg-primary/30", pill: "bg-primary/[0.07] text-primary/50 ring-primary/15" },
}

const AVATAR_TINTS = [
  "bg-secondary-terra/12 text-secondary-terra",
  "bg-bg-teal/15 text-bg-teal",
  "bg-secondary-wine/12 text-secondary-wine",
  "bg-accent-caramel/20 text-secondary-amber",
]

function initials(name) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase()
}

export default function SubscriptionsAdmin() {
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState({ preset: "all", startDate: "", endDate: "" })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const PER_PAGE = 50
  const totalPages = Math.ceil(total / PER_PAGE)

  useEffect(() => {
    let active = true
    const params = { page, limit: PER_PAGE }
    if (filter !== "all") params.status = filter
    if (dateFilter.startDate) params.startDate = dateFilter.startDate
    if (dateFilter.endDate) params.endDate = dateFilter.endDate
    adminApi
      .listSubscriptions(params)
      .then((data) => {
        if (active) {
          setItems(data.items || [])
          setTotal(data.total || 0)
          setError("")
        }
      })
      .catch((err) => {
        if (active) setError(err.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [page, filter, dateFilter])

  return (
    <div>
      <PageHeader
        label="Donations"
        title="Subscriptions"
        subtitle="Manage recurring donation subscriptions."
      />

      {/* Date filter */}
      <div className="mb-4">
        <DateFilter value={dateFilter} onChange={(v) => { setDateFilter(v); setPage(1) }} />
      </div>

      {/* Status filter — segmented pills with status dots */}
      <div className="mb-6">
        <FilterTabs
          value={filter}
          onChange={(v) => { setFilter(v); setPage(1) }}
          options={[
            { value: "all", label: "All" },
            { value: "active", label: "Active", dot: STATUS.active.dot },
            { value: "paused", label: "Paused", dot: STATUS.paused.dot },
            { value: "cancelled", label: "Cancelled", dot: STATUS.cancelled.dot },
            { value: "past_due", label: "Past Due", dot: STATUS.past_due.dot },
          ]}
        />
      </div>

      {error && (
        <p className="text-sm text-rose-600 bg-rose-500/8 ring-1 ring-inset ring-rose-500/20 rounded-lg px-4 py-2.5 mb-4">
          {error}
        </p>
      )}

      {loading ? (
        <SkeletonCardGrid count={6} />
      ) : items.length === 0 ? (
        <EmptyState
          title="No subscriptions yet"
          hint="Recurring donations will appear here."
        />
      ) : (
        <>
          {/* Summary bar */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mb-5 px-1">
            <Summary label="Subscriptions" value={items.length} />
            <Summary
              label="Active"
              value={items.filter((s) => s.status === "active").length}
              accent
            />
            <Summary
              label="Total Collected"
              value={`$${(
                items.reduce((sum, s) => sum + (s.totalPaid || 0), 0) / 100
              ).toLocaleString()}`}
            />
          </div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.03 } } }}
            className="flex flex-col gap-2.5"
          >
            {/* Column header */}
            <div className="hidden md:grid grid-cols-[1.6fr_0.8fr_0.9fr_0.9fr_1fr_0.8fr] gap-4 px-5 text-[0.5625rem] tracking-[0.2em] uppercase text-primary/40">
              <span>Donor</span>
              <span className="text-right">Amount</span>
              <span className="text-center">Frequency</span>
              <span className="text-center">Status</span>
              <span className="text-right">Next Payment</span>
              <span className="text-right">Total Paid</span>
            </div>

            {items.map((s, i) => {
              const name =
                (s.donor
                  ? `${s.donor.firstName || ""} ${s.donor.lastName || ""}`.trim()
                  : s.donorName || "") || "Anonymous"
              const email = s.donor?.email || s.donorEmail || "—"
              const st = STATUS[s.status] || {
                label: s.status,
                dot: "bg-primary/30",
                pill: "bg-primary/[0.07] text-primary/60 ring-primary/15",
              }
              return (
                <motion.div
                  key={s._id}
                  variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
                  className="group grid grid-cols-[1fr_auto] md:grid-cols-[1.6fr_0.8fr_0.9fr_0.9fr_1fr_0.8fr] gap-3 md:gap-4 items-center px-4 md:px-5 py-3.5 bg-white border border-primary/8 rounded-xl hover:border-secondary-terra/30 hover:shadow-md hover:shadow-primary/5 transition-all duration-300"
                >
                  {/* Donor */}
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`grid place-items-center w-9 h-9 rounded-full text-[0.6875rem] font-semibold flex-shrink-0 ${
                        AVATAR_TINTS[i % AVATAR_TINTS.length]
                      }`}
                    >
                      {initials(name)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-primary truncate">
                        {name}
                      </p>
                      <p className="text-[0.6875rem] text-primary/50 truncate">
                        {email}
                      </p>
                    </div>
                  </div>

                  {/* Amount */}
                  <p className="text-sm font-semibold text-primary text-right tabular-nums md:order-none order-first">
                    ${(s.amount / 100).toFixed(2)}
                  </p>

                  {/* Frequency */}
                  <span className="hidden md:inline-flex items-center justify-center mx-auto px-2.5 py-1 text-[0.5625rem] tracking-[0.15em] uppercase text-primary/70 bg-accent-cream rounded-full">
                    {s.frequency}
                  </span>

                  {/* Status */}
                  <span
                    className={`hidden md:inline-flex items-center justify-center gap-1.5 mx-auto px-2.5 py-1 text-[0.5625rem] tracking-[0.15em] uppercase rounded-full ring-1 ring-inset ${st.pill}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                    {st.label}
                  </span>

                  {/* Next payment */}
                  <p className="hidden md:block text-[0.6875rem] text-primary/60 text-right tabular-nums">
                    {s.nextPaymentDate
                      ? new Date(s.nextPaymentDate).toLocaleDateString("en-AU")
                      : "—"}
                  </p>

                  {/* Total paid */}
                  <p className="hidden md:block text-sm text-primary/70 text-right tabular-nums font-medium">
                    ${((s.totalPaid || 0) / 100).toLocaleString()}
                  </p>

                  {/* Mobile meta row */}
                  <div className="col-span-2 flex md:hidden items-center gap-2 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[0.5625rem] tracking-[0.15em] uppercase rounded-full ring-1 ring-inset ${st.pill}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                      {st.label}
                    </span>
                    <span className="px-2.5 py-1 text-[0.5625rem] tracking-[0.15em] uppercase text-primary/70 bg-accent-cream rounded-full">
                      {s.frequency}
                    </span>
                    <span className="text-[0.6875rem] text-primary/50">
                      Paid ${((s.totalPaid || 0) / 100).toLocaleString()}
                    </span>
                  </div>
                </motion.div>
              )
            })}
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

function Summary({ label, value, accent = false }) {
  return (
    <div className="flex flex-col">
      <span
        className={`text-xl font-medium leading-none tabular-nums ${
          accent ? "text-secondary-terra" : "text-primary"
        }`}
        style={{ fontFamily: "var(--font-display)" }}
      >
        {value}
      </span>
      <span className="text-[0.5625rem] tracking-[0.2em] uppercase text-primary/45 mt-1.5">
        {label}
      </span>
    </div>
  )
}
