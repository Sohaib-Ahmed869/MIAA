import { ExternalLink } from "lucide-react"

const money = (cents) => `$${((cents || 0) / 100).toFixed(2)}`

// Read-only detail view for one event registration. Shared by the Registrations
// admin drawer and the event Analytics attendee roster.
export default function RegistrationDetail({ registration: r }) {
  if (!r) return null

  const rows = [
    ["Registration No.", r.registrationNumber],
    ["Pass code", r.passCode || "—"],
    ["Event", r.event?.title || "—"],
    ["Name", r.name || "—"],
    ["Email", r.email || "—"],
    ["Phone", r.phone || "—"],
    ["Tickets", String(r.quantity || 1)],
    ["Amount", r.amount ? `${money(r.amount)} ${r.currency || ""}` : "Free"],
    ["Status", r.paymentStatus],
    [
      "Checked in",
      r.checkedIn
        ? `Yes — ${r.checkedInAt ? new Date(r.checkedInAt).toLocaleString("en-AU") : ""}`
        : "No",
    ],
    ["Date", new Date(r.createdAt).toLocaleString("en-AU")],
  ]

  if (r.checkedIn) {
    const by = r.checkedInBy
    rows.splice(rows.length - 1, 0, [
      "Checked in by",
      by?.name
        ? `${by.name}${by.role === "volunteer" ? " (volunteer)" : " (staff)"}${
            by.organization ? ` · ${by.organization}` : ""
          }`
        : "—",
    ])
  }

  return (
    <div className="flex flex-col gap-4">
      {rows.map(([label, value]) => (
        <div key={label} className="flex justify-between border-b border-primary/8 pb-2">
          <span className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/55">
            {label}
          </span>
          <span className="text-sm text-primary text-right max-w-[60%] truncate">
            {value}
          </span>
        </div>
      ))}

      {/* Ticket lines */}
      {Array.isArray(r.items) && r.items.length > 0 && (
        <div>
          <p className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/55 mb-2">
            Tickets
          </p>
          <div className="flex flex-col gap-1.5">
            {r.items.map((it, i) => (
              <div key={i} className="flex justify-between text-sm text-primary">
                <span>
                  {it.ticketTypeName} × {it.quantity}
                </span>
                <span>{money(it.unitPrice * it.quantity)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom answers */}
      {Array.isArray(r.answers) && r.answers.length > 0 && (
        <div>
          <p className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/55 mb-2">
            Responses
          </p>
          <div className="flex flex-col gap-2">
            {r.answers.map((a, i) => (
              <div
                key={i}
                className="flex justify-between gap-4 border-b border-primary/8 pb-2"
              >
                <span className="text-[0.75rem] text-primary/55">{a.label}</span>
                <span className="text-sm text-primary text-right max-w-[60%]">
                  {typeof a.value === "boolean" ? (a.value ? "Yes" : "No") : String(a.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {r.notes && (
        <div className="flex justify-between border-b border-primary/8 pb-2">
          <span className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/55">
            Notes
          </span>
          <span className="text-sm text-primary text-right max-w-[60%]">{r.notes}</span>
        </div>
      )}

      {/* Stripe receipt */}
      {r.stripeReceiptUrl && (
        <a
          href={r.stripeReceiptUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-secondary-terra hover:text-secondary-rust font-medium"
        >
          <ExternalLink className="w-3.5 h-3.5" /> View Stripe receipt
        </a>
      )}
    </div>
  )
}
