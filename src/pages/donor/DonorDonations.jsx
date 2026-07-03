import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Download } from "lucide-react"
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

  if (loading) return <p className="text-primary/40 text-sm">Loading…</p>

  if (donations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-primary/40 text-sm">No donations yet.</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-lg font-medium text-primary mb-6">Donation History</h2>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.03 } } }}
        className="flex flex-col gap-2"
      >
        {/* Header */}
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-4 py-2 text-[0.625rem] tracking-[0.2em] uppercase text-primary/50">
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
            className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-4 py-3 bg-white border border-primary/8 rounded-sm"
          >
            <div>
              <p className="text-sm font-medium text-primary">
                {d.product?.name || "General Fund"}
              </p>
              <p className="text-[0.6875rem] text-primary/50">
                {d.receiptNumber} · {d.type}
              </p>
            </div>
            <p className="text-sm font-medium text-primary min-w-[5rem] text-right">
              ${(d.amount / 100).toFixed(2)}
            </p>
            <span
              className={`text-[0.5625rem] tracking-[0.2em] uppercase px-2 py-1 rounded-sm min-w-[5rem] text-center ${
                d.paymentStatus === "succeeded"
                  ? "bg-emerald-500/15 text-emerald-600"
                  : d.paymentStatus === "refunded"
                  ? "bg-amber-500/15 text-amber-600"
                  : "bg-primary/10 text-primary/50"
              }`}
            >
              {d.paymentStatus}
            </span>
            <span className="text-[0.6875rem] text-primary/50 min-w-[5rem] text-right">
              {new Date(d.createdAt).toLocaleDateString("en-AU")}
            </span>
            <a
              href={`${donorApi.downloadReceipt(d._id)}?token=${getDonorToken()}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[0.625rem] tracking-[0.2em] uppercase text-secondary-terra hover:text-secondary-rust transition-colors"
            >
              <Download className="w-3 h-3" /> PDF
            </a>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
