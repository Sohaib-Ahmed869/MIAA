import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Heart, RefreshCw, Calendar } from "lucide-react"
import { donorApi } from "../../lib/donorAuth"
import { fadeInUp } from "../../lib/motion"

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
    return <p className="text-primary/40 text-sm">Loading…</p>
  }

  const activeSubs = subscriptions.filter((s) => s.status === "active")
  const recentDonations = donations.slice(0, 5)
  const lastDonation = donations[0]

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <motion.div
          {...fadeInUp}
          className="bg-white border border-primary/10 rounded-sm p-6"
        >
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-secondary-terra" />
            <span className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/55">
              Total Donated
            </span>
          </div>
          <p className="text-2xl font-medium text-primary">
            ${((profile?.totalDonated || 0) / 100).toLocaleString()}
          </p>
        </motion.div>
        <motion.div
          {...fadeInUp}
          className="bg-white border border-primary/10 rounded-sm p-6"
        >
          <div className="flex items-center gap-2 mb-2">
            <RefreshCw className="w-4 h-4 text-secondary-terra" />
            <span className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/55">
              Active Subscriptions
            </span>
          </div>
          <p className="text-2xl font-medium text-primary">{activeSubs.length}</p>
        </motion.div>
        <motion.div
          {...fadeInUp}
          className="bg-white border border-primary/10 rounded-sm p-6"
        >
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-secondary-terra" />
            <span className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/55">
              Last Donation
            </span>
          </div>
          <p className="text-2xl font-medium text-primary">
            {lastDonation
              ? new Date(lastDonation.createdAt).toLocaleDateString("en-AU")
              : "—"}
          </p>
        </motion.div>
      </div>

      {/* Quick links */}
      <div className="flex gap-3 mb-10">
        <Link
          to="/donate/checkout"
          className="px-5 py-2.5 bg-secondary-terra hover:bg-secondary-rust text-white text-[0.6875rem] tracking-[0.15em] uppercase rounded-sm transition-colors"
        >
          Make a Donation
        </Link>
        <Link
          to="/donor/receipts"
          className="px-5 py-2.5 border border-primary/20 text-primary text-[0.6875rem] tracking-[0.15em] uppercase rounded-sm hover:border-primary/40 transition-colors"
        >
          View Receipts
        </Link>
      </div>

      {/* Recent donations */}
      <div>
        <h3 className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/55 mb-3">
          Recent Donations
        </h3>
        {recentDonations.length === 0 ? (
          <p className="text-sm text-primary/40">No donations yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {recentDonations.map((d) => (
              <div
                key={d._id}
                className="flex items-center justify-between px-4 py-3 bg-white border border-primary/8 rounded-sm"
              >
                <div>
                  <p className="text-sm font-medium text-primary">
                    ${(d.amount / 100).toFixed(2)} — {d.product?.name || "General"}
                  </p>
                  <p className="text-[0.6875rem] text-primary/50">
                    {new Date(d.createdAt).toLocaleDateString("en-AU")}
                  </p>
                </div>
                <span
                  className={`text-[0.5625rem] tracking-[0.2em] uppercase px-2 py-1 rounded-sm ${
                    d.paymentStatus === "succeeded"
                      ? "bg-emerald-500/15 text-emerald-600"
                      : "bg-primary/10 text-primary/50"
                  }`}
                >
                  {d.paymentStatus}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
