import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Download, Heart } from "lucide-react"
import { donorApi, getDonorToken } from "../../lib/donorAuth"

export default function DonorDonations() {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    donorApi.myDonations()
      .then((data) => { if (!controller.signal.aborted) setDonations(data) })
      .catch(() => {})
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [])

  if (loading) return <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 rounded-sm bg-primary/5 animate-pulse" />)}</div>

  if (donations.length === 0) {
    return (
      <div className="text-center py-16">
        <Heart className="w-10 h-10 text-primary/15 mx-auto mb-4" />
        <p className="text-primary/40 text-sm">No donations yet.</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-base text-primary tracking-tight mb-6" style={{ fontFamily: "var(--font-display)" }}>
        Donation History
      </h2>
      <motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.03 } } }} className="bg-white border border-primary/10 rounded-sm overflow-hidden">
        {/* Desktop header */}
        <div className="hidden md:grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-6 py-3 border-b border-primary/8 text-[0.5625rem] tracking-[0.2em] uppercase text-primary/40">
          <span>Cause</span><span>Amount</span><span>Status</span><span>Date</span><span>Receipt</span>
        </div>
        <ul className="divide-y divide-primary/6">
          {donations.map((d) => (
            <motion.li key={d._id} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
              {/* Desktop row */}
              <div className="hidden md:grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-6 py-3.5 hover:bg-accent-cream/60 transition-colors">
                <div>
                  <p className="text-sm font-medium text-primary">{d.product?.name || "General Fund"}</p>
                  <p className="text-[0.6875rem] text-primary/45">{d.receiptNumber} · {d.type}</p>
                </div>
                <p className="text-sm font-medium text-primary min-w-[5rem] text-right">${(d.amount / 100).toFixed(2)}</p>
                <span className={`text-[0.5625rem] tracking-[0.18em] uppercase px-2 py-1 rounded-sm min-w-[5rem] text-center ${d.paymentStatus === "succeeded" ? "bg-emerald-500/15 text-emerald-600" : d.paymentStatus === "refunded" ? "bg-amber-500/15 text-amber-600" : "bg-primary/10 text-primary/50"}`}>{d.paymentStatus}</span>
                <span className="text-[0.6875rem] text-primary/45 min-w-[5rem] text-right">{new Date(d.createdAt).toLocaleDateString("en-AU")}</span>
                <a href={`${donorApi.downloadReceipt(d._id)}?token=${getDonorToken()}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[0.625rem] tracking-[0.18em] uppercase text-secondary-terra hover:text-secondary-rust transition-colors">
                  <Download className="w-3 h-3" /> PDF
                </a>
              </div>
              {/* Mobile card */}
              <div className="md:hidden px-4 py-3.5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-primary">{d.product?.name || "General Fund"}</p>
                    <p className="text-[0.625rem] text-primary/40 mt-0.5">{d.receiptNumber}</p>
                  </div>
                  <p className="text-base font-medium text-primary">${(d.amount / 100).toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-primary/6">
                  <div className="flex items-center gap-2">
                    <span className={`text-[0.5rem] tracking-[0.15em] uppercase px-2 py-0.5 rounded-sm ${d.paymentStatus === "succeeded" ? "bg-emerald-500/15 text-emerald-600" : "bg-primary/10 text-primary/50"}`}>{d.paymentStatus}</span>
                    <span className="text-[0.625rem] text-primary/40">{new Date(d.createdAt).toLocaleDateString("en-AU")}</span>
                  </div>
                  <a href={`${donorApi.downloadReceipt(d._id)}?token=${getDonorToken()}`} target="_blank" rel="noreferrer" className="text-[0.5625rem] tracking-[0.15em] uppercase text-secondary-terra">
                    <Download className="w-3 h-3 inline mr-0.5" /> Receipt
                  </a>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  )
}
