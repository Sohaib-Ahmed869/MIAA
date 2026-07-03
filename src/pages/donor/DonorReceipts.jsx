import { useEffect, useState } from "react"
import { Download, FileText } from "lucide-react"
import { donorApi, getDonorToken } from "../../lib/donorAuth"

export default function DonorReceipts() {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    donorApi
      .myDonations()
      .then((data) => {
        if (!controller.signal.aborted)
          setDonations(data.filter((d) => d.paymentStatus === "succeeded"))
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
          <div key={i} className="h-14 rounded-xl bg-white/[0.03] animate-pulse" />
        ))}
      </div>
    )
  }

  const years = [...new Set(donations.map((d) => new Date(d.createdAt).getFullYear()))].sort(
    (a, b) => b - a
  )

  return (
    <div>
      <h2 className="text-lg font-medium text-accent-cream font-display mb-6">
        Receipts & Tax Statements
      </h2>

      {/* Annual statements */}
      {years.length > 0 && (
        <div className="mb-8">
          <h3 className="text-[0.625rem] tracking-[0.2em] uppercase text-accent-cream/35 mb-3">
            Annual Tax Statements
          </h3>
          <div className="flex flex-wrap gap-3">
            {years.map((year) => (
              <a
                key={year}
                href={`${donorApi.downloadTaxStatement(year)}?token=${getDonorToken()}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 px-5 py-3 bg-white/[0.04] border border-white/8 rounded-xl text-sm text-accent-cream hover:bg-white/[0.08] hover:border-white/15 transition-all"
              >
                <Download className="w-3.5 h-3.5 text-secondary-terra" />
                {year} Statement
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Individual receipts */}
      <h3 className="text-[0.625rem] tracking-[0.2em] uppercase text-accent-cream/35 mb-3">
        Individual Receipts
      </h3>
      {donations.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-10 h-10 text-accent-cream/15 mx-auto mb-4" />
          <p className="text-sm text-accent-cream/35">No receipts available.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {donations.map((d) => (
            <div
              key={d._id}
              className="flex items-center justify-between px-5 py-3.5 bg-white/[0.03] border border-white/6 rounded-xl hover:bg-white/[0.06] transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-accent-cream">
                  {d.receiptNumber}
                </p>
                <p className="text-[0.6875rem] text-accent-cream/35">
                  ${(d.amount / 100).toFixed(2)} — {new Date(d.createdAt).toLocaleDateString("en-AU")}
                </p>
              </div>
              <a
                href={`${donorApi.downloadReceipt(d._id)}?token=${getDonorToken()}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[0.625rem] tracking-[0.18em] uppercase text-secondary-terra hover:text-secondary-rust transition-colors"
              >
                <Download className="w-3 h-3" /> Download
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
