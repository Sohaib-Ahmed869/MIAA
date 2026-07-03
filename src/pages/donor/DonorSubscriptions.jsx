import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { RefreshCw } from "lucide-react"
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
    donorApi.mySubscriptions().then(setSubs).catch(() => {}).finally(() => setLoading(false))
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

  if (loading) return <div className="space-y-3">{[1,2].map(i => <div key={i} className="h-28 rounded-sm bg-primary/5 animate-pulse" />)}</div>

  if (subs.length === 0) {
    return (
      <div className="text-center py-16">
        <RefreshCw className="w-10 h-10 text-primary/15 mx-auto mb-4" />
        <p className="text-primary/40 text-sm">No recurring donations.</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-base text-primary tracking-tight mb-6" style={{ fontFamily: "var(--font-display)" }}>Recurring Donations</h2>
      <motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }} className="flex flex-col gap-3">
        {subs.map((s) => (
          <motion.div key={s._id} variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }} className="bg-white border border-primary/10 rounded-sm p-5 hover:border-secondary-terra/40 hover:shadow-md transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-base font-medium text-primary">${(s.amount / 100).toFixed(2)} / {s.frequency}</p>
                <p className="text-[0.6875rem] text-primary/50">{s.product?.name || "General Fund"}</p>
              </div>
              <span className={`text-[0.5625rem] tracking-[0.18em] uppercase px-2 py-1 rounded-sm ${STATUS_COLORS[s.status] || "bg-primary/10 text-primary/50"}`}>{s.status}</span>
            </div>
            <div className="flex flex-wrap gap-4 text-[0.6875rem] text-primary/45 mb-4">
              {s.nextPaymentDate && <span>Next: {new Date(s.nextPaymentDate).toLocaleDateString("en-AU")}</span>}
              <span>Total: ${((s.totalPaid || 0) / 100).toLocaleString()}</span>
              <span>{s.paymentCount || 0} payments</span>
            </div>
            <div className="flex gap-2">
              {s.status === "active" && (
                <>
                  <button onClick={() => handleAction(s._id, "pause")} disabled={busy === s._id} className="px-3 py-1.5 text-[0.625rem] tracking-[0.18em] uppercase border border-primary/20 text-primary rounded-sm hover:border-primary/40 transition-colors disabled:opacity-50">Pause</button>
                  <button onClick={() => handleAction(s._id, "cancel")} disabled={busy === s._id} className="px-3 py-1.5 text-[0.625rem] tracking-[0.18em] uppercase border border-rose-300 text-rose-600 rounded-sm hover:border-rose-400 transition-colors disabled:opacity-50">Cancel</button>
                </>
              )}
              {s.status === "paused" && (
                <button onClick={() => handleAction(s._id, "resume")} disabled={busy === s._id} className="px-3 py-1.5 text-[0.625rem] tracking-[0.18em] uppercase border border-emerald-300 text-emerald-600 rounded-sm hover:border-emerald-400 transition-colors disabled:opacity-50">Resume</button>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
