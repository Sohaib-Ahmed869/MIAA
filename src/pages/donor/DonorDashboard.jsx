import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Heart, RefreshCw, Calendar, ArrowUpRight } from "lucide-react"
import { donorApi } from "../../lib/donorAuth"

export default function DonorDashboard() {
  const [profile, setProfile] = useState(null)
  const [donations, setDonations] = useState([])
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    Promise.all([
      donorApi.getProfile(),
      donorApi.myDonations(),
      donorApi.mySubscriptions(),
    ])
      .then(([p, d, s]) => {
        if (!controller.signal.aborted) {
          setProfile(p)
          setDonations(d)
          setSubscriptions(s)
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 rounded-sm bg-primary/5 animate-pulse" />
        ))}
      </div>
    )
  }

  const activeSubs = subscriptions.filter((s) => s.status === "active")
  const recentDonations = donations.slice(0, 5)
  const lastDonation = donations[0]

  const stats = [
    { icon: Heart, label: "Total Donated", value: `$${((profile?.totalDonated || 0) / 100).toLocaleString()}` },
    { icon: RefreshCw, label: "Active Subscriptions", value: activeSubs.length },
    { icon: Calendar, label: "Last Donation", value: lastDonation ? new Date(lastDonation.createdAt).toLocaleDateString("en-AU") : "—" },
  ]

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 + i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
            className="bg-white border border-primary/10 rounded-sm p-6 hover:border-secondary-terra/40 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center gap-2 mb-3">
              <s.icon className="w-4 h-4 text-secondary-terra" strokeWidth={1.75} />
              <span className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/50">{s.label}</span>
            </div>
            <p className="text-2xl font-medium text-primary" style={{ fontFamily: "var(--font-display)" }}>
              {s.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Quick links */}
      <div className="flex flex-wrap gap-3 mb-10">
        <Link
          to="/donate/checkout"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary-terra hover:bg-secondary-rust text-white text-[0.6875rem] tracking-[0.15em] uppercase rounded-sm transition-colors"
        >
          <Heart className="w-3.5 h-3.5" /> Make a Donation
        </Link>
        <Link
          to="/donor/receipts"
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-primary/20 text-primary text-[0.6875rem] tracking-[0.15em] uppercase rounded-sm hover:border-primary/40 transition-colors"
        >
          View Receipts
        </Link>
      </div>

      {/* Recent donations */}
      <div className="bg-white border border-primary/10 rounded-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-primary/10 flex items-center justify-between">
          <p className="text-base text-primary tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            Recent Donations
          </p>
          {donations.length > 0 && (
            <Link
              to="/donor/donations"
              className="group inline-flex items-center gap-1 text-[0.625rem] tracking-[0.2em] uppercase text-secondary-terra hover:text-secondary-rust transition-colors"
            >
              View all
              <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2.5} />
            </Link>
          )}
        </div>
        {recentDonations.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-primary/40">No donations yet.</p>
        ) : (
          <ul className="divide-y divide-primary/8">
            {recentDonations.map((d) => (
              <li key={d._id} className="px-6 py-3 flex items-center justify-between gap-4 text-sm hover:bg-accent-cream/60 transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="text-primary font-medium truncate">
                    ${(d.amount / 100).toFixed(2)} — {d.product?.name || "General"}
                  </p>
                  <p className="text-primary/50 text-xs truncate">
                    {new Date(d.createdAt).toLocaleDateString("en-AU")}
                  </p>
                </div>
                <span
                  className={`text-[0.5625rem] tracking-[0.18em] uppercase px-2 py-1 rounded-sm ${
                    d.paymentStatus === "succeeded"
                      ? "bg-emerald-500/15 text-emerald-600"
                      : "bg-primary/10 text-primary/50"
                  }`}
                >
                  {d.paymentStatus}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
