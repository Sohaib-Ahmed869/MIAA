import { useEffect, useRef, useState } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { Camera, CameraOff, Check, AlertTriangle, Clock, UserCheck } from "lucide-react"
import { adminApi } from "../auth"
import PageHeader from "../components/PageHeader"
import Button from "../components/Button"
import { Field, TextInput } from "../components/Field"

const READER_ID = "qr-reader"

export default function EventCheckInAdmin() {
  const [scanning, setScanning] = useState(false)
  const [camError, setCamError] = useState("")
  const [result, setResult] = useState(null)
  const [recent, setRecent] = useState([])
  const [manual, setManual] = useState("")

  const scannerRef = useRef(null)
  const busyRef = useRef(false)
  const lockRef = useRef({ code: "", at: 0 })

  const process = async (text) => {
    const code = (text || "").trim()
    if (!code || busyRef.current) return
    const now = Date.now()
    // Ignore repeat reads of the same code within a short window.
    if (code === lockRef.current.code && now - lockRef.current.at < 4000) return
    lockRef.current = { code, at: now }
    busyRef.current = true
    setResult({ pending: true })
    try {
      const res = await adminApi.checkinRegistration(code)
      const entry = {
        ok: true,
        alreadyCheckedIn: res.alreadyCheckedIn,
        reg: res.registration,
        at: now,
      }
      setResult(entry)
      setRecent((r) => [entry, ...r].slice(0, 8))
    } catch (err) {
      setResult({ ok: false, error: err.message, reg: err.data?.registration })
    } finally {
      busyRef.current = false
    }
  }

  const start = async () => {
    setCamError("")
    try {
      const scanner = new Html5Qrcode(READER_ID)
      scannerRef.current = scanner
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (decoded) => process(decoded),
        () => {} // per-frame decode errors — ignore
      )
      setScanning(true)
    } catch (err) {
      setCamError(
        err?.message ||
          "Could not start the camera. Check permissions, or use manual entry below."
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

  return (
    <div>
      <PageHeader
        label="Check-in"
        title="Door Check-in"
        subtitle="Scan an attendee's event pass QR to check them in automatically."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Scanner */}
        <div className="bg-white border border-primary/10 rounded-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/55">
              Scanner
            </p>
            {scanning ? (
              <Button variant="ghost" onClick={stop}>
                <CameraOff className="w-3.5 h-3.5 mr-1" /> Stop
              </Button>
            ) : (
              <Button variant="primary" onClick={start}>
                <Camera className="w-3.5 h-3.5 mr-1" /> Start camera
              </Button>
            )}
          </div>

          <div className="relative w-full aspect-square overflow-hidden rounded-sm bg-primary/5">
            <div id={READER_ID} className="w-full h-full [&_video]:object-cover" />
            {!scanning && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-xs text-primary/40 px-6 text-center">
                  Press “Start camera” and point it at the pass QR code.
                </p>
              </div>
            )}
          </div>

          {camError && (
            <p className="mt-3 text-xs text-rose-600 bg-rose-50 px-3 py-2 rounded-sm">
              {camError}
            </p>
          )}

          {/* Manual fallback */}
          <form onSubmit={submitManual} className="mt-4 flex items-end gap-2">
            <div className="flex-1">
              <Field label="Or enter pass code manually">
                <TextInput
                  value={manual}
                  onChange={(e) => setManual(e.target.value)}
                  placeholder="MIA-3BD086"
                />
              </Field>
            </div>
            <Button variant="dark" onClick={submitManual}>
              Check in
            </Button>
          </form>
        </div>

        {/* Result + recent */}
        <div className="flex flex-col gap-4">
          <ResultCard result={result} />

          {recent.length > 0 && (
            <div className="bg-white border border-primary/10 rounded-sm p-5">
              <p className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/55 mb-3">
                Recent check-ins
              </p>
              <div className="flex flex-col gap-2">
                {recent.map((r, i) => (
                  <div
                    key={`${r.reg?._id}-${i}`}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span className="truncate text-primary">{r.reg?.name || "Guest"}</span>
                    </span>
                    <span className="text-[0.6875rem] text-primary/45 flex-shrink-0">
                      {r.alreadyCheckedIn ? "already in" : "checked in"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
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
      <div className="rounded-sm border border-rose-200 bg-rose-50 p-5">
        <div className="flex items-center gap-2.5 mb-1">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          <p className="font-semibold text-rose-800">Not checked in</p>
        </div>
        <p className="text-sm text-rose-700">{result.error}</p>
        {result.reg && (
          <p className="text-xs text-rose-700/70 mt-1">
            {result.reg.name} · {result.reg.paymentStatus}
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

  return (
    <div
      className={`rounded-sm border p-5 ${
        already ? "border-amber-200 bg-amber-50" : "border-emerald-200 bg-emerald-50"
      }`}
    >
      <div className="flex items-center gap-2.5 mb-3">
        {already ? (
          <Clock className="w-6 h-6 text-amber-600" />
        ) : (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600">
            <Check className="w-5 h-5 text-white" strokeWidth={3} />
          </span>
        )}
        <div>
          <p
            className={`font-semibold ${already ? "text-amber-800" : "text-emerald-800"}`}
          >
            {already ? "Already checked in" : "Checked in!"}
          </p>
          {reg.checkedInAt && (
            <p className="text-xs text-primary/50">
              {new Date(reg.checkedInAt).toLocaleString("en-AU")}
            </p>
          )}
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-lg font-semibold text-primary break-words">{reg.name || "Guest"}</p>
        <p className="text-sm text-primary/60 break-all">{reg.email}</p>
        {reg.event?.title && (
          <p className="text-sm text-primary/70 mt-1">{reg.event.title}</p>
        )}
        {tickets && <p className="text-xs text-primary/55">{tickets}</p>}
        <p className="text-xs tracking-wide text-primary/45 mt-1">{reg.passCode}</p>
      </div>
    </div>
  )
}
