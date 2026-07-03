import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { DollarSign, TrendingUp, Users, BarChart3 } from "lucide-react"
import { adminApi } from "../auth"
import PageHeader from "../components/PageHeader"
import Drawer from "../components/Drawer"
import Button from "../components/Button"
import EmptyState from "../components/EmptyState"
import { useToast } from "../components/Toast"
import { SkeletonCardGrid } from "../components/Skeleton"
import DateFilter from "../components/DateFilter"

const STATUS_COLORS = {
  succeeded: "bg-emerald-500/90 text-white",
  pending: "bg-amber-500/90 text-white",
  failed: "bg-rose-500/90 text-white",
  refunded: "bg-primary/60 text-white",
}

export default function DonationsAdmin() {
  const [donations, setDonations] = useState([])
  const [stats, setStats] = useState(null)
  const [filter, setFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState({ preset: "all", startDate: "", endDate: "" })
  const [viewing, setViewing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { notify } = useToast()

  const load = async () => {
    setLoading(true)
    try {
      const params = {}
      if (filter !== "all") params.status = filter
      if (dateFilter.startDate) params.startDate = dateFilter.startDate
      if (dateFilter.endDate) params.endDate = dateFilter.endDate
      const [donationData, statsData] = await Promise.all([
        adminApi.listDonations(params),
        adminApi.getDonationStats(),
      ])
      setDonations(donationData.items || [])
      setStats(statsData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    load()
  }, [filter, dateFilter])

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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((s) => (
            <div
              key={s.label}
              className="bg-white border border-primary/10 rounded-sm p-5"
            >
              <div className="flex items-center gap-2 mb-2">
                <s.icon className="w-4 h-4 text-secondary-terra" strokeWidth={1.75} />
                <span className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/55">
                  {s.label}
                </span>
              </div>
              <p className="text-2xl font-medium text-primary">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Date filter */}
      <div className="mb-4">
        <DateFilter value={dateFilter} onChange={setDateFilter} />
      </div>

      {/* Status filter */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {[
          { value: "all", label: "All" },
          { value: "succeeded", label: "Succeeded" },
          { value: "pending", label: "Pending" },
          { value: "failed", label: "Failed" },
          { value: "refunded", label: "Refunded" },
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
      ) : donations.length === 0 ? (
        <EmptyState
          title="No donations yet"
          hint="Donations will appear here once donors start contributing."
        />
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.03 } } }}
          className="flex flex-col gap-2"
        >
          {/* Table header */}
          <div className="grid grid-cols-[1fr_1fr_auto_auto_auto_auto] gap-4 px-4 py-2 text-[0.625rem] tracking-[0.2em] uppercase text-primary/50">
            <span>Donor</span>
            <span>Product / Campaign</span>
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
              className="grid grid-cols-[1fr_1fr_auto_auto_auto_auto] gap-4 items-center px-4 py-3 bg-white border border-primary/8 rounded-sm hover:border-secondary-terra/40 hover:shadow-sm transition-all cursor-pointer"
            >
              <div>
                <p className="text-sm font-medium text-primary truncate">
                  {d.isAnonymous ? "Anonymous" : d.donorName || d.donor?.firstName ? `${d.donor?.firstName || ""} ${d.donor?.lastName || ""}`.trim() : "Guest"}
                </p>
                <p className="text-[0.6875rem] text-primary/50 truncate">
                  {d.donorEmail || d.donor?.email || "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-primary truncate">
                  {d.product?.name || "—"}
                </p>
                {d.campaign?.title && (
                  <p className="text-[0.6875rem] text-primary/50 truncate">
                    {d.campaign.title}
                  </p>
                )}
              </div>
              <p className="text-sm font-medium text-primary min-w-[5rem] text-right">
                ${(d.amount / 100).toFixed(2)}
              </p>
              <span className="text-[0.5625rem] tracking-[0.2em] uppercase text-primary/60 min-w-[4rem] text-center">
                {d.paymentMethod}
              </span>
              <span
                className={`text-[0.5625rem] tracking-[0.2em] uppercase px-2 py-1 rounded-sm min-w-[5rem] text-center ${
                  STATUS_COLORS[d.paymentStatus] || "bg-primary/20 text-primary"
                }`}
              >
                {d.paymentStatus}
              </span>
              <span className="text-[0.6875rem] text-primary/50 min-w-[5rem] text-right">
                {new Date(d.createdAt).toLocaleDateString("en-AU")}
              </span>
            </motion.div>
          ))}
        </motion.div>
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
