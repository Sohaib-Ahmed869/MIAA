import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { RefreshCw } from "lucide-react"
import { donorApi } from "../../lib/donorAuth"

const STATUS_COLORS = {
  active: "bg-emerald-500/15 text-emerald-400",
  paused: "bg-amber-500/15 text-amber-400",
  cancelled: "bg-white/8 text-accent-cream/40",
  past_due: "bg-rose-500/15 text-rose-400",
}

export default function DonorSubscriptions() {
  const [subs, setSubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState("")

  const load = () => {
    setLoading(true)
    donorApi
      .mySubscriptions()
      .then(setSubs)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleAction = async (id, action) => {
    if (action === "cancel" && !confirm("Cancel this subscription?")) return
    setBusy(id)
    try {
      if (action === "cancel") await donorApi.cancelSubscription(id)
      else if (action === "pause") await donorApi.pauseSubscription(id)
      else if (action === "resume") await donorApi.resumeSubscription(id)
      load()
    } catch { /* silent */ } finally { setBusy("") }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-28 rounded-xl bg-white/[0.03] animate-pulse" />
        ))}
      </div>
    )
  }

  if (subs.length === 0) {
    return (
      <div className="text-center py-16">
        <RefreshCw className="w-10 h-10 text-accent-cream/15 mx-auto mb-4" />
        <p className="text-accent-cream/35 text-sm">No recurring donations.</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-lg font-medium text-accent-cream font-display mb-6">
        Recurring Donations
      </h2>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
        className="flex flex-col gap-3"
      >
        {subs.map((s) => (
          <motion.div
            key={s._id}
            variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
            className="bg-white/[0.03] border border-white/6 rounded-xl p-5 hover:bg-white/[0.06] transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-base font-medium text-accent-cream">
                  ${(s.amount / 100).toFixed(2)} / {s.frequency}
                </p>
                <p className="text-[0.6875rem] text-accent-cream/40">
                  {s.product?.name || "General Fund"}
                </p>
              </div>
              <span className={`text-[0.5625rem] tracking-[0.18em] uppercase px-2.5 py-1 rounded-lg ${STATUS_COLORS[s.status] || "bg-white/8 text-accent-cream/40"}`}>
                {s.status}
              </span>
            </div>

            <div className="flex gap-4 text-[0.6875rem] text-accent-cream/35 mb-4">
              {s.nextPaymentDate && (
                <span>Next: {new Date(s.nextPaymentDate).toLocaleDateString("en-AU")}</span>
              )}
              <span>Total: ${((s.totalPaid || 0) / 100).toLocaleString()}</span>
              <span>{s.paymentCount || 0} payments</span>
            </div>

            <div className="flex gap-2">
              {s.status === "active" && (
                <>
                  <button
                    onClick={() => handleAction(s._id, "pause")}
                    disabled={busy === s._id}
                    className="px-3.5 py-1.5 text-[0.5625rem] tracking-[0.18em] uppercase border border-white/12 text-accent-cream/60 rounded-lg hover:border-white/25 transition-colors disabled:opacity-50"
                  >
                    Pause
                  </button>
                  <button
                    onClick={() => handleAction(s._id, "cancel")}
                    disabled={busy === s._id}
                    className="px-3.5 py-1.5 text-[0.5625rem] tracking-[0.18em] uppercase border border-rose-500/30 text-rose-400 rounded-lg hover:border-rose-500/50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </>
              )}
              {s.status === "paused" && (
                <button
                  onClick={() => handleAction(s._id, "resume")}
                  disabled={busy === s._id}
                  className="px-3.5 py-1.5 text-[0.5625rem] tracking-[0.18em] uppercase border border-emerald-500/30 text-emerald-400 rounded-lg hover:border-emerald-500/50 transition-colors disabled:opacity-50"
                >
                  Resume
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
