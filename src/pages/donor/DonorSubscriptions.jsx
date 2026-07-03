import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { donorApi } from "../../lib/donorAuth"

const STATUS_COLORS = {
  active: "bg-emerald-500/15 text-emerald-600",
  paused: "bg-amber-500/15 text-amber-600",
  cancelled: "bg-primary/10 text-primary/50",
  past_due: "bg-rose-500/15 text-rose-600",
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

  useEffect(() => {
    load()
  }, [])

  const handleAction = async (id, action) => {
    if (action === "cancel" && !confirm("Cancel this subscription?")) return
    setBusy(id)
    try {
      if (action === "cancel") await donorApi.cancelSubscription(id)
      else if (action === "pause") await donorApi.pauseSubscription(id)
      else if (action === "resume") await donorApi.resumeSubscription(id)
      load()
    } catch {
      // silent
    } finally {
      setBusy("")
    }
  }

  if (loading) return <p className="text-primary/40 text-sm">Loading…</p>

  if (subs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-primary/40 text-sm">No recurring donations.</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-lg font-medium text-primary mb-6">
        Recurring Donations
      </h2>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.03 } } }}
        className="flex flex-col gap-3"
      >
        {subs.map((s) => (
          <motion.div
            key={s._id}
            variants={{ hidden: { opacity: 0, y: 5 }, visible: { opacity: 1, y: 0 } }}
            className="bg-white border border-primary/8 rounded-sm p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-base font-medium text-primary">
                  ${(s.amount / 100).toFixed(2)} / {s.frequency}
                </p>
                <p className="text-[0.6875rem] text-primary/50">
                  {s.product?.name || "General Fund"}
                </p>
              </div>
              <span
                className={`text-[0.5625rem] tracking-[0.2em] uppercase px-2 py-1 rounded-sm ${
                  STATUS_COLORS[s.status] || "bg-primary/10 text-primary/50"
                }`}
              >
                {s.status}
              </span>
            </div>

            <div className="flex gap-4 text-[0.6875rem] text-primary/50 mb-4">
              {s.nextPaymentDate && (
                <span>
                  Next: {new Date(s.nextPaymentDate).toLocaleDateString("en-AU")}
                </span>
              )}
              <span>
                Total paid: ${((s.totalPaid || 0) / 100).toLocaleString()}
              </span>
              <span>{s.paymentCount || 0} payments</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {s.status === "active" && (
                <>
                  <button
                    onClick={() => handleAction(s._id, "pause")}
                    disabled={busy === s._id}
                    className="px-3 py-1.5 text-[0.625rem] tracking-[0.2em] uppercase border border-primary/20 text-primary rounded-sm hover:border-primary/40 transition-colors disabled:opacity-50"
                  >
                    Pause
                  </button>
                  <button
                    onClick={() => handleAction(s._id, "cancel")}
                    disabled={busy === s._id}
                    className="px-3 py-1.5 text-[0.625rem] tracking-[0.2em] uppercase border border-rose-300 text-rose-600 rounded-sm hover:border-rose-400 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </>
              )}
              {s.status === "paused" && (
                <button
                  onClick={() => handleAction(s._id, "resume")}
                  disabled={busy === s._id}
                  className="px-3 py-1.5 text-[0.625rem] tracking-[0.2em] uppercase border border-emerald-300 text-emerald-600 rounded-sm hover:border-emerald-400 transition-colors disabled:opacity-50"
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
