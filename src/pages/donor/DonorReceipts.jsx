import { useEffect, useState } from "react"
import { Download, Eye, Heart } from "lucide-react"
import { donorApi, getDonorToken } from "../../lib/donorAuth"
import DonorEmptyState from "../../components/donor/DonorEmptyState"

export default function DonorReceipts() {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    donorApi.myDonations()
      .then((data) => { if (!controller.signal.aborted) setDonations(data.filter(d => d.paymentStatus === "succeeded")) })
      .catch(() => {})
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [])

  if (loading) return <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 rounded-sm bg-primary/5 animate-pulse" />)}</div>

  const years = [...new Set(donations.map(d => new Date(d.createdAt).getFullYear()))].sort((a, b) => b - a)

  return (
    <div>
      <h2 className="text-base text-primary tracking-tight mb-6" style={{ fontFamily: "var(--font-display)" }}>Receipts & Tax Statements</h2>

      {years.length > 0 && (
        <div className="mb-8">
          <h3 className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/45 mb-3">Annual Tax Statements</h3>
          <div className="flex flex-wrap gap-3">
            {years.map(year => (
              <a key={year} href={`${donorApi.downloadTaxStatement(year)}?token=${getDonorToken()}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-primary/10 rounded-sm text-sm text-primary hover:border-secondary-terra/40 hover:shadow-md transition-all">
                <Download className="w-3.5 h-3.5 text-secondary-terra" /> {year} Statement
              </a>
            ))}
          </div>
        </div>
      )}

      <h3 className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/45 mb-3">Individual Receipts</h3>
      {donations.length === 0 ? (
        <DonorEmptyState
          art="receipt"
          title="No receipts yet"
          description="Receipts are generated automatically for every successful donation. Make your first gift and it'll appear here."
          action={{ label: "Make a Donation", href: "/donate/checkout", icon: Heart }}
        />
      ) : (
        <div className="bg-white border border-primary/10 rounded-sm overflow-hidden">
          <ul className="divide-y divide-primary/6">
            {donations.map(d => (
              <li key={d._id} className="flex items-center justify-between px-6 py-3.5 hover:bg-accent-cream/60 transition-colors">
                <div>
                  <p className="text-sm font-medium text-primary">{d.receiptNumber}</p>
                  <p className="text-[0.6875rem] text-primary/45">${(d.amount / 100).toFixed(2)} — {new Date(d.createdAt).toLocaleDateString("en-AU")}</p>
                </div>
                <div className="flex items-center gap-5">
                  <a href={`${donorApi.downloadReceipt(d._id)}?token=${getDonorToken()}&disposition=inline`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[0.625rem] tracking-[0.18em] uppercase text-primary/60 hover:text-secondary-terra transition-colors">
                    <Eye className="w-3 h-3" /> View
                  </a>
                  <a href={`${donorApi.downloadReceipt(d._id)}?token=${getDonorToken()}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[0.625rem] tracking-[0.18em] uppercase text-secondary-terra hover:text-secondary-rust transition-colors">
                    <Download className="w-3 h-3" /> Download
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
