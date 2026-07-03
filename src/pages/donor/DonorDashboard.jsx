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
          <div key={i} className="h-28 rounded-xl bg-white/[0.03] animate-pulse" />
        ))}
      </div>
    )
  }

  const activeSubs = subscriptions.filter((s) => s.status === "active")
  const recentDonations = donations.slice(0, 5)
  const lastDonation = donations[0]

  const stats = [
    {
      icon: Heart,
      label: "Total Donated",
      value: `$${((profile?.totalDonated || 0) / 100).toLocaleString()}`,
    },
    { icon: RefreshCw, label: "Active Subscriptions", value: activeSubs.length },
    {
      icon: Calendar,
      label: "Last Donation",
      value: lastDonation
        ? new Date(lastDonation.createdAt).toLocaleDateString("en-AU")
        : "—",
    },
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
            className="bg-white/[0.05] border border-white/8 rounded-xl p-6 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 mb-3">
              <s.icon className="w-4 h-4 text-secondary-terra" strokeWidth={1.75} />
              <span className="text-[0.625rem] tracking-[0.2em] uppercase text-accent-cream/45">
                {s.label}
              </span>
            </div>
            <p className="text-2xl font-medium text-accent-cream font-display">
              {s.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Quick links */}
      <div className="flex flex-wrap gap-3 mb-10">
        <Link
          to="/donate/checkout"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary-terra hover:bg-secondary-rust text-white text-[0.6875rem] tracking-[0.15em] uppercase rounded-lg transition-colors"
        >
          <Heart className="w-3.5 h-3.5" /> Make a Donation
        </Link>
        <Link
          to="/donor/receipts"
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/12 text-accent-cream/70 text-[0.6875rem] tracking-[0.15em] uppercase rounded-lg hover:border-white/25 hover:text-accent-cream transition-all"
        >
          View Receipts
        </Link>
      </div>

      {/* Recent donations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[0.625rem] tracking-[0.2em] uppercase text-accent-cream/40">
            Recent Donations
          </h3>
          {donations.length > 0 && (
            <Link
              to="/donor/donations"
              className="group inline-flex items-center gap-1 text-[0.625rem] tracking-[0.18em] uppercase text-secondary-terra hover:text-secondary-rust transition-colors"
            >
              View all
              <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2.5} />
            </Link>
          )}
        </div>
        {recentDonations.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-8 h-8 text-accent-cream/15 mx-auto mb-3" />
            <p className="text-sm text-accent-cream/35">No donations yet.</p>
            <Link to="/donate" className="text-[0.6875rem] text-secondary-terra hover:text-secondary-rust mt-2 inline-block transition-colors">
              Start giving →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {recentDonations.map((d) => (
              <motion.div
                key={d._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between px-5 py-3.5 bg-white/[0.03] border border-white/6 rounded-xl hover:bg-white/[0.06] transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-accent-cream">
                    ${(d.amount / 100).toFixed(2)} — {d.product?.name || "General"}
                  </p>
                  <p className="text-[0.6875rem] text-accent-cream/40">
                    {new Date(d.createdAt).toLocaleDateString("en-AU")}
                  </p>
                </div>
                <span
                  className={`text-[0.5625rem] tracking-[0.18em] uppercase px-2.5 py-1 rounded-lg ${
                    d.paymentStatus === "succeeded"
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-white/8 text-accent-cream/40"
                  }`}
                >
                  {d.paymentStatus}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
