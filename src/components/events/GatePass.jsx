import { forwardRef, useEffect, useState } from "react"
import QRCode from "qrcode"
import { Check, Calendar, Clock, MapPin, Ticket, ScanLine } from "lucide-react"
import miaaLogo from "../../assets/images/Homepage/smalllogo.png"

// Each ticket type on its own line (falls back to a single line for free entry).
function ticketLines(reg) {
  if (!reg?.paymentRequired || !(reg.amount > 0)) return ["Free entry"]
  const items = Array.isArray(reg.items) ? reg.items : []
  if (!items.length) return [`${reg.quantity || 1} ticket(s)`]
  return items.map((i) => `${i.ticketTypeName} × ${i.quantity}`)
}

function DetailCell({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
        <Icon className="h-4 w-4" strokeWidth={2} />
      </span>
      <div className="min-w-0">
        <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.15em] text-primary/45">
          {label}
        </p>
        <div className="text-sm font-semibold leading-snug text-primary break-words">
          {value}
        </div>
      </div>
    </div>
  )
}

// The branded, exportable event pass. Parent passes a ref to capture it as PNG.
const GatePass = forwardRef(function GatePass({ registration, event }, ref) {
  const [qr, setQr] = useState("")
  const passCode = registration?.passCode || registration?.registrationNumber || ""

  useEffect(() => {
    if (!passCode) return
    QRCode.toDataURL(passCode, {
      margin: 1,
      width: 240,
      color: { dark: "#1F4A54", light: "#ffffff" },
    })
      .then(setQr)
      .catch(() => setQr(""))
  }, [passCode])

  const initial = (registration?.name || "G").trim().charAt(0).toUpperCase() || "G"

  return (
    <div
      ref={ref}
      className="w-[560px] max-w-full overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_24px_70px_-30px_rgba(0,0,0,0.55)]"
    >
      {/* Banner */}
      <div
        className="relative px-7 pt-7 pb-8"
        style={{ background: "linear-gradient(135deg, #214952 0%, #2c626d 100%)" }}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Rendered as a fixed-size background image so html-to-image (PNG
              export) sizes it reliably instead of using the intrinsic size. */}
          <div
            role="img"
            aria-label="Museum of Islamic Art Australia"
            className="flex-shrink-0"
            style={{
              height: "40px",
              width: "112px",
              backgroundImage: `url(${miaaLogo})`,
              backgroundSize: "contain",
              backgroundPosition: "left center",
              backgroundRepeat: "no-repeat",
            }}
          />
          <span className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.15em] text-white">
            <Ticket className="h-3 w-3" /> Event Pass
          </span>
        </div>
      </div>
      <div className="h-1 w-full bg-secondary-terra" />

      {/* Body */}
      <div className="px-6 pb-6 pt-6">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary text-white">
            <Check className="h-5 w-5" strokeWidth={3} />
          </span>
          <div className="min-w-0">
            <p className="text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-primary/60">
              You're registered
            </p>
            <h3 className="truncate text-lg font-semibold leading-tight text-primary">
              {event?.title || "Event"}
            </h3>
          </div>
        </div>
        <p className="mt-3 text-sm text-primary/55">You're all set — we can't wait to see you.</p>

        {/* Attendee card */}
        <div className="mt-5 flex items-center gap-4 rounded-xl bg-accent-cream/70 p-4">
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-white">
            {initial}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.15em] text-primary/45">
              Attendee
            </p>
            <p className="truncate text-sm font-semibold text-primary">
              {registration?.name || "Guest"}
            </p>
            <p className="truncate text-xs text-primary/55">{registration?.email || ""}</p>
          </div>
          <div className="flex-shrink-0 rounded-lg border border-accent-wheat px-3 py-2 text-center">
            <p className="text-[0.5rem] font-semibold uppercase tracking-[0.12em] text-primary/45">
              Pass Code
            </p>
            <p className="text-sm font-bold tracking-wide text-primary">{passCode || "—"}</p>
          </div>
        </div>

        {/* Dashed divider */}
        <div className="my-5 border-t border-dashed border-primary/20" />

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-4">
          <DetailCell icon={Calendar} label="Date" value={event?.date || "TBA"} />
          <DetailCell icon={Clock} label="Time" value={event?.time || "TBA"} />
          <DetailCell icon={MapPin} label="Location" value={event?.location || "MIAA"} />
          <DetailCell
            icon={Ticket}
            label="Tickets"
            value={ticketLines(registration).map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          />
        </div>

        {/* Dashed divider */}
        <div className="my-5 border-t border-dashed border-primary/20" />

        {/* QR / check-in */}
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 rounded-xl border border-primary/10 bg-white p-2">
            {qr ? (
              <img src={qr} alt="Check-in QR" className="h-24 w-24" />
            ) : (
              <div className="h-24 w-24 animate-pulse rounded bg-primary/5" />
            )}
          </div>
          <div className="min-w-0">
            <p className="inline-flex items-center gap-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.15em] text-primary/60">
              <ScanLine className="h-3.5 w-3.5" /> Check-in
            </p>
            <p className="mt-1 text-base font-semibold text-primary">Scan at the door</p>
            <p className="mt-0.5 text-xs tracking-wide text-primary/45">{passCode}</p>
          </div>
        </div>
      </div>
    </div>
  )
})

export default GatePass
