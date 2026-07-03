import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Download, Heart } from "lucide-react"
import { donorApi, getDonorToken } from "../../lib/donorAuth"

export default function DonorDonations() {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    donorApi
      .myDonations()
      .then((data) => {
        if (!controller.signal.aborted) setDonations(data)
      })
      .catch(() => {})
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [])

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 rounded-xl bg-white/[0.03] animate-pulse" />
        ))}
      </div>
    )
  }

  if (donations.length === 0) {
    return (
      <div className="text-center py-16">
        <Heart className="w-10 h-10 text-accent-cream/15 mx-auto mb-4" />
        <p className="text-accent-cream/35 text-sm">No donations yet.</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-lg font-medium text-accent-cream font-display mb-6">
        Donation History
      </h2>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.03 } } }}
        className="flex flex-col gap-2"
      >
        {/* Desktop header — hidden on mobile */}
        <div className="hidden md:grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-2 text-[0.5625rem] tracking-[0.2em] uppercase text-accent-cream/30">
          <span>Cause</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Date</span>
          <span>Receipt</span>
        </div>
        {donations.map((d) => (
          <motion.div
            key={d._id}
            variants={{ hidden: { opacity: 0, y: 5 }, visible: { opacity: 1, y: 0 } }}
            className="bg-white/[0.03] border border-white/6 rounded-xl hover:bg-white/[0.06] transition-colors"
          >
            {/* Desktop row */}
            <div className="hidden md:grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-5 py-3.5">
              <div>
                <p className="text-sm font-medium text-accent-cream">
                  {d.product?.name || "General Fund"}
                </p>
                <p className="text-[0.6875rem] text-accent-cream/35">
                  {d.receiptNumber} · {d.type}
                </p>
              </div>
              <p className="text-sm font-medium text-accent-cream min-w-[5rem] text-right">
                ${(d.amount / 100).toFixed(2)}
              </p>
              <span
                className={`text-[0.5625rem] tracking-[0.18em] uppercase px-2.5 py-1 rounded-lg min-w-[5rem] text-center ${
                  d.paymentStatus === "succeeded"
                    ? "bg-emerald-500/15 text-emerald-400"
                    : d.paymentStatus === "refunded"
                    ? "bg-amber-500/15 text-amber-400"
                    : "bg-white/8 text-accent-cream/40"
                }`}
              >
                {d.paymentStatus}
              </span>
              <span className="text-[0.6875rem] text-accent-cream/35 min-w-[5rem] text-right">
                {new Date(d.createdAt).toLocaleDateString("en-AU")}
              </span>
              <a
                href={`${donorApi.downloadReceipt(d._id)}?token=${getDonorToken()}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[0.625rem] tracking-[0.18em] uppercase text-secondary-terra hover:text-secondary-rust transition-colors"
              >
                <Download className="w-3 h-3" /> PDF
              </a>
            </div>

            {/* Mobile stacked card */}
            <div className="md:hidden p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-accent-cream">
                    {d.product?.name || "General Fund"}
                  </p>
                  <p className="text-[0.625rem] text-accent-cream/30 mt-0.5">
                    {d.receiptNumber}
                  </p>
                </div>
                <p className="text-base font-medium text-accent-cream">
                  ${(d.amount / 100).toFixed(2)}
                </p>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/6">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[0.5rem] tracking-[0.18em] uppercase px-2 py-0.5 rounded-md ${
                      d.paymentStatus === "succeeded"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : d.paymentStatus === "refunded"
                        ? "bg-amber-500/15 text-amber-400"
                        : "bg-white/8 text-accent-cream/40"
                    }`}
                  >
                    {d.paymentStatus}
                  </span>
                  <span className="text-[0.625rem] text-accent-cream/30">
                    {new Date(d.createdAt).toLocaleDateString("en-AU")}
                  </span>
                </div>
                <a
                  href={`${donorApi.downloadReceipt(d._id)}?token=${getDonorToken()}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[0.5625rem] tracking-[0.15em] uppercase text-secondary-terra"
                >
                  <Download className="w-3 h-3" /> Receipt
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
