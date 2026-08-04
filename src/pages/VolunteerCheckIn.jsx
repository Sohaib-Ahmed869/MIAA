import { useCallback, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { Html5Qrcode } from "html5-qrcode"
import {
  Camera,
  CameraOff,
  Check,
  AlertTriangle,
  Clock,
  UserCheck,
  CalendarDays,
  MapPin,
  Link2Off,
  Users,
} from "lucide-react"
import { api } from "../lib/api"
import smallLogo from "../assets/images/Homepage/smalllogo.png"

const READER_ID = "volunteer-qr-reader"

const fmtTime = (d) =>
  d ? new Date(d).toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit" }) : ""

const fmtDateTime = (d) =>
  d ? new Date(d).toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" }) : ""

// Public door check-in for event volunteers. Reached through the private link
// emailed to them — no login. The backend refuses the token once the event
// date has passed, and this page shows that as a friendly dead end.
export default function VolunteerCheckIn() {
  const { token } = useParams()
  const [portal, setPortal] = useState(null)
  const [loadError, setLoadError] = useState(null) // { message, expired, disabled }
  const [loading, setLoading] = useState(true)

  const [scanning, setScanning] = useState(false)
  const [camError, setCamError] = useState("")
  const [result, setResult] = useState(null)
  const [recent, setRecent] = useState([])
  const [count, setCount] = useState(0)
  const [manual, setManual] = useState("")

  const scannerRef = useRef(null)
  const busyRef = useRef(false)
  const lockRef = useRef({ code: "", at: 0 })

  // ── Load the portal ────────────────────────────────────────
  useEffect(() => {
    let active = true
    api
      .volunteerPortal(token)
      .then((data) => {
        if (!active) return
        setPortal(data)
        setCount(data.totals?.mine || 0)
        setRecent(
          (data.recent || []).map((r) => ({
            reg: r,
            at: r.checkedInAt,
            alreadyCheckedIn: false,
          }))
        )
      })
      .catch((err) => {
        if (!active) return
        setLoadError({
          message: err.message,
          expired: !!err.data?.expired,
          disabled: !!err.data?.disabled,
          eventTitle: err.data?.event?.title || "",
        })
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [token])

  // ── Check someone in ───────────────────────────────────────
  const process = useCallback(
    async (text) => {
      const code = (text || "").trim()
      if (!code || busyRef.current) return
      const now = Date.now()
      // Ignore repeat reads of the same code within a short window.
      if (code === lockRef.current.code && now - lockRef.current.at < 4000) return
      lockRef.current = { code, at: now }
      busyRef.current = true
      setResult({ pending: true })
      try {
        const res = await api.volunteerCheckin(token, code)
        const entry = {
          ok: true,
          alreadyCheckedIn: res.alreadyCheckedIn,
          reg: res.registration,
          at: now,
        }
        setResult(entry)
        if (!res.alreadyCheckedIn) {
          setRecent((r) => [entry, ...r].slice(0, 20))
          setCount((c) => (typeof res.myCount === "number" ? res.myCount : c + 1))
        }
      } catch (err) {
        setResult({
          ok: false,
          error: err.message,
          reg: err.data?.registration,
          // The link can expire mid-shift — surface it rather than failing quietly.
          expired: !!err.data?.expired || !!err.data?.disabled,
        })
      } finally {
        busyRef.current = false
      }
    },
    [token]
  )

  // ── Camera ─────────────────────────────────────────────────
  const start = async () => {
    setCamError("")
    try {
      const scanner = new Html5Qrcode(READER_ID)
      scannerRef.current = scanner
      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          // Size the target box from the actual feed — a fixed 240px box fails
          // to start on narrow phones.
          qrbox: (w, h) => {
            const side = Math.max(140, Math.floor(Math.min(w, h) * 0.7))
            return { width: side, height: side }
          },
          aspectRatio: 1,
        },
        (decoded) => process(decoded),
        () => {} // per-frame decode errors — ignore
      )
      setScanning(true)
    } catch (err) {
      setCamError(
        err?.message ||
          "Could not start the camera. Check permissions, or type the pass code below."
      )
      setScanning(false)
    }
  }

  const stop = async () => {
    const s = scannerRef.current
    scannerRef.current = null
    setScanning(false)
    if (s) {
      try {
        await s.stop()
      } catch {
        // already stopped
      }
      try {
        s.clear()
      } catch {
        // ignore
      }
    }
  }

  // Stop the camera when leaving the page.
  useEffect(() => {
    return () => {
      const s = scannerRef.current
      if (s) {
        s.stop()
          .catch(() => {})
          .finally(() => {
            try {
              s.clear()
            } catch {
              // ignore
            }
          })
      }
    }
  }, [])

  const submitManual = (e) => {
    e.preventDefault()
    if (manual.trim()) {
      process(manual)
      setManual("")
    }
  }

  // ── States ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-bg-deep flex items-center justify-center px-6">
        <p className="text-accent-cream/60 text-sm tracking-[0.2em] uppercase">Loading…</p>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-bg-deep flex items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <img
            src={smallLogo}
            alt="MIAA"
            className="max-h-8 w-auto max-w-[9rem] mx-auto mb-8 opacity-80 object-contain"
          />
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 mb-5">
            {loadError.expired ? (
              <Clock className="w-6 h-6 text-accent-wheat" />
            ) : (
              <Link2Off className="w-6 h-6 text-accent-wheat" />
            )}
          </span>
          <h1
            className="text-2xl text-accent-cream mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {loadError.expired ? "This link has expired" : "Link not available"}
          </h1>
          {loadError.eventTitle && (
            <p className="text-[0.6875rem] tracking-[0.2em] uppercase text-accent-wheat mb-3">
              {loadError.eventTitle}
            </p>
          )}
          <p className="text-sm text-accent-cream/65 leading-relaxed">{loadError.message}</p>
          <p className="text-xs text-accent-cream/40 mt-6">
            Need help? Speak to a MIAA staff member at the door.
          </p>
        </div>
      </div>
    )
  }

  const { volunteer, event, expiresAt, totals } = portal

  return (
    <div className="min-h-screen bg-accent-cream overflow-x-hidden">
      {/* Header */}
      <header className="bg-bg-deep text-accent-cream px-4 sm:px-5 pt-5 sm:pt-6 pb-6 sm:pb-7">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between gap-3 mb-4 sm:mb-5">
            {/* max-h, not h — a global `img { height: auto }` rule sits outside
                Tailwind's cascade layer and would override h-* here. */}
            <img
              src={smallLogo}
              alt="MIAA"
              className="max-h-6 sm:max-h-7 w-auto max-w-[7.5rem] object-contain"
            />
            <span className="text-[0.5625rem] tracking-[0.2em] sm:tracking-[0.25em] uppercase text-accent-wheat whitespace-nowrap flex-shrink-0">
              Door Check-in
            </span>
          </div>
          <h1
            className="text-xl sm:text-3xl leading-tight mb-2 break-words"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {event.title}
          </h1>
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-y-1 sm:gap-x-4 text-[0.75rem] text-accent-cream/65">
            {event.date && (
              <span className="inline-flex items-center gap-1.5 min-w-0">
                <CalendarDays className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">
                  {event.date}
                  {event.time ? ` · ${event.time}` : ""}
                </span>
              </span>
            )}
            {event.location && (
              <span className="inline-flex items-center gap-1.5 min-w-0">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{event.location}</span>
              </span>
            )}
          </div>
          <div className="mt-4 sm:mt-5 pt-3.5 sm:pt-4 border-t border-white/10 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[0.5625rem] tracking-[0.2em] uppercase text-accent-wheat/70">
                Volunteer
              </p>
              <p className="text-sm text-accent-cream truncate">
                {volunteer.name}
                {volunteer.organization ? ` · ${volunteer.organization}` : ""}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-2xl font-semibold leading-none text-accent-cream tabular-nums">
                {count}
              </p>
              <p className="text-[0.5625rem] tracking-[0.2em] uppercase text-accent-wheat/70 mt-1">
                by you
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-5 py-5 sm:py-6 flex flex-col gap-4 pb-16 safe-area-pb">
        {/* Scanner */}
        <section className="bg-white border border-primary/10 rounded-sm p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3 mb-4">
            <p className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/55">
              Scanner
            </p>
            <button
              onClick={scanning ? stop : start}
              className={`inline-flex items-center justify-center gap-1.5 min-h-11 px-4 py-2.5 text-[0.6875rem] font-semibold tracking-[0.15em] uppercase rounded-sm transition-colors flex-shrink-0 ${
                scanning
                  ? "bg-transparent text-primary border border-primary/20 hover:border-primary/50"
                  : "bg-secondary-terra text-white hover:bg-secondary-rust"
              }`}
            >
              {scanning ? (
                <>
                  <CameraOff className="w-3.5 h-3.5" /> Stop
                </>
              ) : (
                <>
                  <Camera className="w-3.5 h-3.5" /> Start camera
                </>
              )}
            </button>
          </div>

          <div className="relative w-full aspect-square max-w-sm mx-auto overflow-hidden rounded-sm bg-primary/5">
            <div id={READER_ID} className="w-full h-full [&_video]:object-cover" />
            {!scanning && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-xs text-primary/40 px-6 text-center">
                  Tap “Start camera”, then point it at the attendee&apos;s pass QR code.
                </p>
              </div>
            )}
          </div>

          {camError && (
            <p className="mt-3 text-xs text-rose-600 bg-rose-50 px-3 py-2 rounded-sm">
              {camError}
            </p>
          )}

          {/* Manual fallback — stacks on phones so neither field is cramped */}
          <form
            onSubmit={submitManual}
            className="mt-4 flex flex-col sm:flex-row sm:items-end gap-2"
          >
            <label className="flex-1 block min-w-0">
              <span className="block text-[0.625rem] tracking-[0.2em] uppercase text-primary/55 mb-1.5">
                Or enter pass code
              </span>
              <input
                value={manual}
                onChange={(e) => setManual(e.target.value)}
                placeholder="MIA-3BD086"
                autoCapitalize="characters"
                autoCorrect="off"
                autoComplete="off"
                enterKeyHint="done"
                // 16px keeps iOS Safari from zooming in when the field is tapped.
                className="block w-full px-3 py-2.5 text-base sm:text-sm text-primary bg-white border border-primary/15 rounded-sm placeholder:text-primary/35 focus:outline-none focus:border-secondary-terra/70 focus:ring-1 focus:ring-secondary-terra/30"
              />
            </label>
            <button
              type="submit"
              className="w-full sm:w-auto min-h-11 px-5 py-2.5 text-[0.6875rem] font-semibold tracking-[0.15em] uppercase rounded-sm bg-primary text-white hover:bg-primary/85 transition-colors flex-shrink-0"
            >
              Check in
            </button>
          </form>
        </section>

        {/* Result */}
        <ResultCard result={result} />

        {/* Recent */}
        {recent.length > 0 && (
          <section className="bg-white border border-primary/10 rounded-sm p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3 mb-3">
              <p className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/55 flex-shrink-0">
                Your check-ins
              </p>
              <p className="text-[0.625rem] text-primary/45 text-right">
                {totals.checkedIn} of {totals.confirmed} in
              </p>
            </div>
            <div className="flex flex-col divide-y divide-primary/8 max-h-[60vh] overflow-y-auto">
              {recent.map((r, i) => (
                <div
                  key={`${r.reg?._id}-${i}`}
                  className="flex items-center justify-between gap-3 py-2"
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="min-w-0">
                      <span className="block text-sm text-primary truncate">
                        {r.reg?.name || "Guest"}
                      </span>
                      <span className="block text-[0.625rem] text-primary/45 truncate">
                        {r.reg?.passCode}
                      </span>
                    </span>
                  </span>
                  <span className="text-[0.6875rem] text-primary/45 flex-shrink-0">
                    {fmtTime(r.at)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        <p className="text-[0.6875rem] text-primary/45 text-center px-2 text-balance">
          {expiresAt
            ? `This link works until ${fmtDateTime(expiresAt)}.`
            : "This link stays active until MIAA turns it off."}{" "}
          Please keep it private.
        </p>
      </main>
    </div>
  )
}

function ResultCard({ result }) {
  if (!result) {
    return (
      <div className="border border-dashed border-primary/15 rounded-sm p-8 text-center">
        <p className="text-sm text-primary/40">Scan a pass to see the result here.</p>
      </div>
    )
  }
  if (result.pending) {
    return (
      <div className="border border-primary/10 rounded-sm p-8 text-center bg-white">
        <p className="text-sm text-primary/50">Checking…</p>
      </div>
    )
  }

  if (!result.ok) {
    return (
      <div className="rounded-sm border border-rose-200 bg-rose-50 p-4 sm:p-5">
        <div className="flex items-center gap-2.5 mb-1">
          <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <p className="font-semibold text-rose-800">Not checked in</p>
        </div>
        <p className="text-sm text-rose-700">{result.error}</p>
        {result.reg?.name && (
          <p className="text-xs text-rose-700/70 mt-1">{result.reg.name}</p>
        )}
        {result.expired && (
          <p className="text-xs text-rose-700/70 mt-2">
            Please ask a MIAA staff member to check this attendee in.
          </p>
        )}
      </div>
    )
  }

  const already = result.alreadyCheckedIn
  const reg = result.reg || {}
  const tickets = Array.isArray(reg.items)
    ? reg.items.map((i) => `${i.ticketTypeName} × ${i.quantity}`).join(", ")
    : ""
  // One pass can admit a whole family — call the number out so the volunteer
  // isn't counting heads off a small ticket line.
  const partySize = reg.quantity || 1

  return (
    <div
      className={`rounded-sm border p-4 sm:p-5 ${
        already ? "border-amber-200 bg-amber-50" : "border-emerald-200 bg-emerald-50"
      }`}
    >
      <div className="flex items-center gap-2.5 mb-3">
        {already ? (
          <Clock className="w-6 h-6 text-amber-600 flex-shrink-0" />
        ) : (
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600">
            <Check className="w-5 h-5 text-white" strokeWidth={3} />
          </span>
        )}
        <div className="min-w-0">
          <p className={`font-semibold ${already ? "text-amber-800" : "text-emerald-800"}`}>
            {already ? "Already checked in" : "Checked in!"}
          </p>
          {reg.checkedInAt && (
            <p className="text-xs text-primary/50">
              {new Date(reg.checkedInAt).toLocaleString("en-AU")}
              {already && reg.checkedInBy?.name ? ` · by ${reg.checkedInBy.name}` : ""}
            </p>
          )}
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-lg font-semibold text-primary break-words">
          {reg.name || "Guest"}
        </p>
        {reg.email && <p className="text-sm text-primary/60 break-all">{reg.email}</p>}
        {partySize > 1 && (
          <p
            className={`inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-sm font-semibold ${
              already ? "bg-amber-100 text-amber-900" : "bg-emerald-100 text-emerald-900"
            }`}
          >
            <Users className="w-4 h-4" /> Admits {partySize} people
          </p>
        )}
        {tickets && <p className="text-xs text-primary/55">{tickets}</p>}
        <p className="text-xs tracking-wide text-primary/45 pt-1">{reg.passCode}</p>
      </div>
    </div>
  )
}
