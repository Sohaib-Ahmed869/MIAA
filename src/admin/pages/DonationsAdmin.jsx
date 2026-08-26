import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { DollarSign, TrendingUp, Users, BarChart3 } from "lucide-react"
import { adminApi } from "../auth"
import PageHeader from "../components/PageHeader"
import Drawer from "../components/Drawer"
import EmptyState from "../components/EmptyState"
import { SkeletonCardGrid } from "../components/Skeleton"
import DateFilter from "../components/DateFilter"
import FilterTabs from "../components/FilterTabs"

const STATUS_COLORS = {
  succeeded: "bg-emerald-500/90 text-white",
  pending: "bg-amber-500/90 text-white",
  failed: "bg-rose-500/90 text-white",
  refunded: "bg-primary/60 text-white",
}

export default function DonationsAdmin() {
  const [donations, setDonations] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [stats, setStats] = useState(null)
  const [filter, setFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState({ preset: "all", startDate: "", endDate: "" })
  const [viewing, setViewing] = useState(null)
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
    Promise.all([adminApi.listDonations(params), adminApi.getDonationStats()])
      .then(([donationData, statsData]) => {
        if (active) {
          setDonations(donationData.items || [])
          setTotal(donationData.total || 0)
          setStats(statsData)
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

  const statCards = stats
    ? [
        {
          label: "Total Raised",
          value: `$${(stats.totalRaised / 100).toLocaleString()}`,
          icon: DollarSign,
        },
        { label: "Donations", value: stats.donationCount, icon: TrendingUp },
        { label: "Donors", value: stats.donorCount, icon: Users },
        {
          label: "Average",
          value: `$${(stats.averageDonation / 100).toFixed(0)}`,
          icon: BarChart3,
        },
      ]
    : []

  return (
    <div>
      <PageHeader
        label="Donations"
        title="All Donations"
        subtitle="View and manage all donation transactions."
      />

      {/* Stats row */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {statCards.map((s) => (
            <div
              key={s.label}
              className="bg-white border border-primary/10 rounded-sm p-3.5 sm:p-5 overflow-hidden"
            >
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                <s.icon className="w-4 h-4 text-secondary-terra flex-shrink-0" strokeWidth={1.75} />
                <span className="text-[0.5625rem] sm:text-[0.625rem] tracking-[0.12em] sm:tracking-[0.2em] uppercase text-primary/55 truncate">
                  {s.label}
                </span>
              </div>
              <p className="text-xl sm:text-2xl font-medium text-primary tabular-nums truncate">
                {s.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Date filter */}
      <div className="mb-4">
        <DateFilter value={dateFilter} onChange={(v) => { setDateFilter(v); setPage(1) }} />
      </div>

      {error && (
        <p className="text-sm text-rose-600 bg-rose-500/8 ring-1 ring-inset ring-rose-500/20 rounded-lg px-4 py-2.5 mb-4">
          {error}
        </p>
      )}

      {/* Status filter */}
      <div className="mb-6">
        <FilterTabs
          value={filter}
          onChange={(v) => { setFilter(v); setPage(1) }}
          options={[
            { value: "all", label: "All" },
            { value: "succeeded", label: "Succeeded", dot: "bg-emerald-500" },
            { value: "pending", label: "Pending", dot: "bg-amber-500" },
            { value: "failed", label: "Failed", dot: "bg-rose-500" },
            { value: "refunded", label: "Refunded", dot: "bg-slate-400" },
          ]}
        />
      </div>

      {loading ? (
        <SkeletonCardGrid count={6} />
      ) : donations.length === 0 ? (
        <EmptyState
          title="No donations yet"
          hint="Donations will appear here once donors start contributing."
        />
      ) : (
        <>
        {/* The desktop table has four fixed columns; below ~56rem the two
            flexible ones (donor, product) truncate to a few characters. Give it
            a floor and let it scroll sideways instead. Mobile cards unaffected. */}
        <div className="lg:overflow-x-auto lg:-mx-1 lg:px-1 lg:pb-1">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.03 } } }}
          className="flex flex-col gap-2 lg:min-w-[56rem]"
        >
          {/* Table header */}
          <div className="hidden lg:grid grid-cols-[1fr_1fr_auto_auto_auto_auto] gap-4 px-4 py-2 text-[0.625rem] tracking-[0.2em] uppercase text-primary/50">
            <span>Donor</span>
            <span>Product / Cause</span>
            <span>Amount</span>
            <span>Method</span>
            <span>Status</span>
            <span>Date</span>
          </div>
          {donations.map((d) => (
            <motion.div
              key={d._id}
              variants={{ hidden: { opacity: 0, y: 5 }, visible: { opacity: 1, y: 0 } }}
              onClick={() => setViewing(d)}
              className="grid grid-cols-[1fr_auto] lg:grid-cols-[1fr_1fr_auto_auto_auto_auto] gap-x-3 gap-y-0 lg:gap-4 items-start lg:items-center px-4 py-3.5 lg:py-3 bg-white border border-primary/8 rounded-lg lg:rounded-sm hover:border-secondary-terra/40 hover:shadow-sm transition-all cursor-pointer"
            >
              {/* Donor — always visible */}
              <div className="min-w-0">
                <p className="text-sm font-medium text-primary truncate">
                  {d.isAnonymous ? "Anonymous" : d.donorName || d.donor?.firstName ? `${d.donor?.firstName || ""} ${d.donor?.lastName || ""}`.trim() : "Guest"}
                </p>
                <p className="text-[0.6875rem] text-primary/50 truncate">
                  {d.donorEmail || d.donor?.email || "—"}
                </p>
              </div>

              {/* Product / Cause — desktop column */}
              <div className="hidden lg:block min-w-0">
                <p className="text-sm text-primary truncate">
                  {d.product?.name || d.event?.title || "—"}
                </p>
                {d.campaign?.title && (
                  <p className="text-[0.6875rem] text-primary/50 truncate">
                    {d.campaign.title}
                  </p>
                )}
                {d.event?.title && d.product?.name && (
                  <p className="text-[0.6875rem] text-primary/50 truncate">
                    Event · {d.event.title}
                  </p>
                )}
              </div>

              {/* Amount — top-right on mobile, column 3 on desktop */}
              <p className="text-[0.9375rem] lg:text-sm font-semibold lg:font-medium text-primary min-w-[5rem] text-right whitespace-nowrap">
                ${(d.amount / 100).toFixed(2)}
              </p>

              {/* Method — desktop column */}
              <span className="hidden lg:block text-[0.5625rem] tracking-[0.2em] uppercase text-primary/60 min-w-[4rem] text-center">
                {d.paymentMethod}
              </span>

              {/* Status — desktop column */}
              <span
                className={`hidden lg:block text-[0.5625rem] tracking-[0.2em] uppercase px-2 py-1 rounded-sm min-w-[5rem] text-center ${
                  STATUS_COLORS[d.paymentStatus] || "bg-primary/20 text-primary"
                }`}
              >
                {d.paymentStatus}
              </span>

              {/* Date — desktop column */}
              <span className="hidden lg:block text-[0.6875rem] text-primary/50 min-w-[5rem] text-right">
                {new Date(d.createdAt).toLocaleDateString("en-AU")}
              </span>

              {/* Mobile meta — product/cause + method/status/date */}
              <div className="col-span-2 flex lg:hidden flex-col gap-2 mt-3 pt-3 border-t border-primary/[0.07]">
                <p className="text-[0.8125rem] text-primary/70 truncate">
                  {d.product?.name || d.event?.title || "General"}
                  {d.campaign?.title ? ` · ${d.campaign.title}` : ""}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-[0.5625rem] tracking-[0.18em] uppercase px-2 py-0.5 rounded-full ${
                      STATUS_COLORS[d.paymentStatus] || "bg-primary/20 text-primary"
                    }`}
                  >
                    {d.paymentStatus}
                  </span>
                  <span className="text-[0.5625rem] tracking-[0.15em] uppercase px-2 py-0.5 rounded-full bg-accent-cream text-primary/70">
                    {d.paymentMethod}
                  </span>
                  <span className="text-[0.6875rem] text-primary/45 ml-auto whitespace-nowrap">
                    {new Date(d.createdAt).toLocaleDateString("en-AU")}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        </div>

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

      {/* Detail drawer */}
      <Drawer
        open={viewing !== null}
        onClose={() => setViewing(null)}
        title="Donation Detail"
        subtitle={viewing?.receiptNumber || ""}
      >
        {viewing && (
          <div className="flex flex-col gap-4">
            {[
              ["Receipt", viewing.receiptNumber],
              ["Donor", viewing.isAnonymous ? "Anonymous" : viewing.donorName || "Guest"],
              ["Email", viewing.donorEmail || "—"],
              ["Amount", `$${(viewing.amount / 100).toFixed(2)} ${viewing.currency}`],
              ["Type", viewing.type],
              ["Payment Method", viewing.paymentMethod],
              ["Status", viewing.paymentStatus],
              ["Product", viewing.product?.name || "—"],
              ["Campaign", viewing.campaign?.title || "—"],
              ["Event", viewing.event?.title || "—"],
              ["Message", viewing.message || "—"],
              ["Date", new Date(viewing.createdAt).toLocaleString("en-AU")],
              ["Stripe Session", viewing.stripeSessionId || "—"],
              ["PayPal Order", viewing.paypalOrderId || "—"],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between border-b border-primary/8 pb-2">
                <span className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/55">{label}</span>
                <span className="text-sm text-primary text-right max-w-[60%] truncate">{value}</span>
              </div>
            ))}
          </div>
        )}
      </Drawer>
    </div>
  )
}
