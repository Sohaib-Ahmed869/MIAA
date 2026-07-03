import { useEffect, useState } from "react"
import { Download } from "lucide-react"
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

  if (loading) return <p className="text-primary/40 text-sm">Loading…</p>

  // Group by year
  const years = [...new Set(donations.map((d) => new Date(d.createdAt).getFullYear()))].sort(
    (a, b) => b - a
  )

  return (
    <div>
      <h2 className="text-lg font-medium text-primary mb-6">
        Receipts & Tax Statements
      </h2>

      {/* Annual statements */}
      {years.length > 0 && (
        <div className="mb-8">
          <h3 className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/55 mb-3">
            Annual Tax Statements
          </h3>
          <div className="flex flex-wrap gap-3">
            {years.map((year) => (
              <a
                key={year}
                href={`${donorApi.downloadTaxStatement(year)}?token=${getDonorToken()}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-primary/15 rounded-sm text-sm text-primary hover:border-secondary-terra/40 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-secondary-terra" />
                {year} Statement
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Individual receipts */}
      <h3 className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/55 mb-3">
        Individual Receipts
      </h3>
      {donations.length === 0 ? (
        <p className="text-sm text-primary/40">No receipts available.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {donations.map((d) => (
            <div
              key={d._id}
              className="flex items-center justify-between px-4 py-3 bg-white border border-primary/8 rounded-sm"
            >
              <div>
                <p className="text-sm font-medium text-primary">
                  {d.receiptNumber}
                </p>
                <p className="text-[0.6875rem] text-primary/50">
                  ${(d.amount / 100).toFixed(2)} —{" "}
                  {new Date(d.createdAt).toLocaleDateString("en-AU")}
                </p>
              </div>
              <a
                href={`${donorApi.downloadReceipt(d._id)}?token=${getDonorToken()}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[0.625rem] tracking-[0.2em] uppercase text-secondary-terra hover:text-secondary-rust transition-colors"
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
