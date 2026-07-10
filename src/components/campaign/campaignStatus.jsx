import { useState } from "react"
import { ExternalLink, Copy, Check } from "lucide-react"

// Donor-facing status labels + colors for a requested campaign.
const STATUS_META = {
  draft: { label: "Pending Review", dot: "bg-amber-500", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  active: { label: "Live", dot: "bg-emerald-500", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  paused: { label: "Paused", dot: "bg-slate-400", cls: "bg-slate-100 text-slate-600 border-slate-200" },
  completed: { label: "Completed", dot: "bg-sky-500", cls: "bg-sky-50 text-sky-700 border-sky-200" },
  rejected: { label: "Not Approved", dot: "bg-rose-500", cls: "bg-rose-50 text-rose-700 border-rose-200" },
  cancelled: { label: "Closed", dot: "bg-slate-300", cls: "bg-slate-100 text-slate-500 border-slate-200" },
}

export function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.draft
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.625rem] font-semibold tracking-[0.1em] uppercase border ${meta.cls}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  )
}

// Shareable public URL for a live campaign, with open + copy.
export function LiveCampaignLink({ campaign }) {
  const [copied, setCopied] = useState(false)
  const path = `/campaign/${campaign.slug || campaign._id}`
  const url = `${window.location.origin}${path}`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // clipboard unavailable — the link is still usable
    }
  }

  return (
    <div className="mt-2.5">
      <p className="text-[0.5625rem] tracking-[0.18em] uppercase text-primary/40 mb-1">
        Live campaign link
      </p>
      <div className="flex items-center gap-2 flex-wrap">
        <a
          href={path}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 min-w-0 max-w-full px-2.5 py-1.5 rounded-sm bg-secondary-terra/8 border border-secondary-terra/20 text-[0.75rem] text-secondary-terra hover:bg-secondary-terra/12 transition-colors"
        >
          <ExternalLink className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{url.replace(/^https?:\/\//, "")}</span>
        </a>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1 text-[0.625rem] tracking-[0.1em] uppercase text-primary/45 hover:text-primary transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-600" /> Copied
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" /> Copy
            </>
          )}
        </button>
      </div>
    </div>
  )
}
