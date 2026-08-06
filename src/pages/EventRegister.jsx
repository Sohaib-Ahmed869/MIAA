import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import { loadStripe } from "@stripe/stripe-js"
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js"
import {
  Lock,
  ArrowLeft,
  Check,
  Calendar,
  MapPin,
  Minus,
  Plus,
  Ticket,
  ImageDown,
  Download,
} from "lucide-react"
import { toPng } from "html-to-image"
import { api } from "../lib/api"
import { getDonorUser } from "../lib/donorAuth"
import { fadeInUp } from "../lib/motion"
import Dropdown from "../components/ui/Dropdown"
import GatePass from "../components/events/GatePass"
import SignupConfirmationModal from "../components/ui/SignupConfirmationModal"

const money = (cents) => `$${((cents || 0) / 100).toFixed(2)}`

const STRIPE_APPEARANCE = {
  theme: "night",
  variables: {
    colorPrimary: "#C15C45",
    colorBackground: "#2b565f",
    colorText: "#F3EFEB",
    colorTextSecondary: "#F3EFEBb3",
    colorDanger: "#fb7185",
    borderRadius: "8px",
    fontSizeBase: "15px",
  },
}

const inputClass =
  "w-full py-3 px-4 bg-white/[0.06] text-accent-cream border border-white/10 rounded-lg text-sm placeholder:text-accent-cream/30 focus:border-secondary-terra focus:ring-2 focus:ring-secondary-terra/25 focus:outline-none transition-colors"

function SectionHead({ children }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <span className="h-1.5 w-1.5 rounded-full bg-secondary-terra" />
      <h2 className="text-[0.7rem] tracking-[0.2em] uppercase text-accent-wheat/90 font-semibold">
        {children}
      </h2>
    </div>
  )
}

// Page chrome shared by every render state (loading / error / wizard / done).
function Shell({ children }) {
  return (
    <section className="relative bg-bg-deep min-h-screen overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] opacity-70"
        style={{
          background:
            "radial-gradient(70% 60% at 50% 0%, rgba(193,92,69,0.16), transparent 70%)",
        }}
      />
      <div className="relative max-w-[1120px] mx-auto px-6 md:px-10 pt-28 md:pt-32 pb-20">
        {children}
      </div>
    </section>
  )
}

// Small +/- quantity stepper.
function Stepper({ value, onChange, min = 0, max = 99 }) {
  return (
    <div className="inline-flex items-center rounded-lg border border-white/15 bg-white/[0.06] overflow-hidden">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="px-3 py-2 text-accent-cream/80 hover:bg-white/10 disabled:opacity-30"
        disabled={value <= min}
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className="w-10 text-center text-sm font-semibold text-accent-cream">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="px-3 py-2 text-accent-cream/80 hover:bg-white/10 disabled:opacity-30"
        disabled={value >= max}
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

// Embedded card form (Stripe Payment Element), shown once we have a client
// secret for the paid registration.
function CardForm({ amountLabel, returnUrl, onPaid, onEdit }) {
  const stripe = useStripe()
  const elements = useElements()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const submit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setSubmitting(true)
    setError("")

    const { error: err, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
      redirect: "if_required",
    })

    if (err) {
      setError(err.message || "Your payment could not be processed.")
      setSubmitting(false)
      return
    }
    if (
      paymentIntent &&
      (paymentIntent.status === "succeeded" || paymentIntent.status === "processing")
    ) {
      onPaid(paymentIntent.id)
      return
    }
    setSubmitting(false)
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
        <PaymentElement options={{ layout: "tabs" }} />
      </div>

      {error && (
        <p className="text-sm text-rose-300 bg-rose-500/10 border border-rose-500/20 px-4 py-2.5 rounded-lg">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!stripe || submitting}
        className="w-full py-4 bg-secondary-terra hover:bg-secondary-rust text-white text-sm font-semibold tracking-wide rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-secondary-terra/25"
      >
        {submitting ? (
          "Processing…"
        ) : (
          <>
            <Lock className="w-4 h-4" />
            Pay {amountLabel}
          </>
        )}
      </button>

      <button
        type="button"
        onClick={onEdit}
        className="w-full flex items-center justify-center gap-1.5 text-xs text-accent-cream/50 hover:text-accent-cream transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to review
      </button>
    </form>
  )
}

export default function EventRegister() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const donor = getDonorUser()
  const [event, setEvent] = useState(null)
  const [loadErr, setLoadErr] = useState("")
  const [config, setConfig] = useState(null)

  const [step, setStep] = useState(0) // 0 details · 1 review · 2 payment
  const [name, setName] = useState(
    donor ? [donor.firstName, donor.lastName].filter(Boolean).join(" ") : ""
  )
  const [email, setEmail] = useState(donor?.email || "")
  const [phone, setPhone] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [tierQ, setTierQ] = useState({}) // ticket type name -> qty
  const [answers, setAnswers] = useState({}) // questionId -> value

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [clientSecret, setClientSecret] = useState("")
  const [done, setDone] = useState(null) // { registration }
  const [signupModalOpen, setSignupModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const confirmedRef = useRef(false)
  const passRef = useRef(null)

  // Land on the success screen and pop the sign-up confirmation modal. Called
  // from every path that completes a registration (free RSVP, on-page card, or
  // Stripe redirect return).
  const finishRegistration = useCallback((registration) => {
    setDone({ registration })
    setSignupModalOpen(true)
  }, [])

  useEffect(() => {
    let active = true
    api
      .eventById(id)
      .then((e) => {
        if (active) setEvent(e)
      })
      .catch((e) => {
        if (active) setLoadErr(e.message)
      })
    api
      .donationConfig()
      .then((c) => {
        if (active) setConfig(c)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [id])

  // Handle a redirect return from Stripe (payment methods that need one).
  useEffect(() => {
    const pi = searchParams.get("payment_intent")
    const status = searchParams.get("redirect_status")
    if (pi && status === "succeeded" && !confirmedRef.current) {
      confirmedRef.current = true
      api
        .confirmEventRegistration({ paymentIntentId: pi })
        .then((res) => finishRegistration(res?.registration || null))
        .catch(() => finishRegistration(null))
    }
  }, [searchParams, finishRegistration])

  const paid = Boolean(event?.registrationEnabled && event?.paymentRequired)
  const mode = event?.pricingMode || "fixed"
  const types = useMemo(() => event?.ticketTypes || [], [event])

  // Whether the registrant chooses how many people they're bringing. This is
  // independent of payment — a free RSVP still needs a head count when families
  // come together, otherwise capacity and the door list only ever see one seat.
  const groupBooking = mode === "quantity" || mode === "tiers"

  // Build the order for display; the server re-computes authoritatively.
  // Ticket prices only apply when the event actually charges — an event switched
  // to free keeps its old prices on the record, so we zero them here exactly as
  // computeOrder() does server-side.
  const order = useMemo(() => {
    if (!event) return { items: [], quantity: 0, amount: 0 }
    const priceOf = (t) => (paid ? t?.price || 0 : 0)

    if (mode === "tiers") {
      const items = types
        .map((t) => ({
          ticketTypeName: t.name,
          unitPrice: priceOf(t),
          quantity: Math.max(0, Number(tierQ[t.name] || 0)),
        }))
        .filter((i) => i.quantity > 0)
      return {
        items,
        quantity: items.reduce((s, i) => s + i.quantity, 0),
        amount: items.reduce((s, i) => s + i.unitPrice * i.quantity, 0),
      }
    }
    const t = types[0] || { name: "General Admission", price: 0 }
    const qty = mode === "quantity" ? Math.max(1, Number(quantity) || 1) : 1
    return {
      items: [{ ticketTypeName: t.name, unitPrice: priceOf(t), quantity: qty }],
      quantity: qty,
      amount: priceOf(t) * qty,
    }
  }, [event, paid, mode, types, tierQ, quantity])

  const stripeKey = config?.stripePublishableKey
  const stripePromise = useMemo(
    () => (stripeKey ? loadStripe(stripeKey) : null),
    [stripeKey]
  )
  const returnUrl = `${window.location.origin}/event/${encodeURIComponent(
    id
  )}/register?paid=1`

  const maxPerReg = event?.maxQuantity > 0 ? event.maxQuantity : 20
  const amountLabel = money(order.amount)

  const buildPayload = () => ({
    eventId: event._id,
    name,
    email,
    phone,
    quantity: mode === "quantity" ? order.quantity : undefined,
    items:
      mode === "tiers"
        ? order.items.map((i) => ({
            ticketTypeName: i.ticketTypeName,
            quantity: i.quantity,
          }))
        : undefined,
    answers: Object.entries(answers).map(([questionId, value]) => ({
      questionId,
      value,
    })),
    donorId: donor?.id || undefined,
  })

  const validateDetails = () => {
    if (!name.trim()) return "Please enter your name"
    if (!email.trim()) return "Please enter your email"
    if (order.quantity < 1)
      return paid
        ? "Please select at least one ticket"
        : "Please add at least one person"
    for (const q of event.customQuestions || []) {
      if (!q.required) continue
      const v = answers[q.id]
      const empty =
        v === undefined ||
        v === null ||
        v === false ||
        (typeof v === "string" && v.trim() === "")
      if (empty) return `Please answer: ${q.label}`
    }
    return ""
  }

  const goReview = () => {
    const err = validateDetails()
    if (err) {
      setError(err)
      return
    }
    setError("")
    setStep(1)
  }

  const submitFree = async () => {
    setBusy(true)
    setError("")
    try {
      const res = await api.registerForEvent(buildPayload())
      finishRegistration(res.registration || null)
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  const startPayment = async () => {
    setBusy(true)
    setError("")
    try {
      const res = await api.registerForEvent(buildPayload())
      if (res.clientSecret) {
        setClientSecret(res.clientSecret)
        setStep(2)
      } else {
        // Amount resolved to 0 server-side — treat as a free registration.
        finishRegistration(res.registration || null)
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  const onPaid = async (paymentIntentId) => {
    let registration = null
    try {
      const res = await api.confirmEventRegistration({ paymentIntentId })
      registration = res?.registration || null
    } catch {
      // webhook will reconcile
    }
    finishRegistration(registration)
  }

  const savePng = async () => {
    if (!passRef.current) return
    setSaving(true)
    try {
      const opts = { pixelRatio: 2, cacheBust: true, backgroundColor: "#ffffff" }
      // The first render can miss late-loaded assets/fonts; a second pass is
      // reliable (documented html-to-image workaround).
      await toPng(passRef.current, opts)
      const dataUrl = await toPng(passRef.current, opts)
      const a = document.createElement("a")
      a.href = dataUrl
      a.download = `MIAA-Event-Pass-${done?.registration?.passCode || "pass"}.png`
      a.click()
    } catch {
      // ignore — user can still download the PDF
    } finally {
      setSaving(false)
    }
  }

  // ── Render states ──────────────────────────────────────────
  if (loadErr) {
    return (
      <Shell>
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-medium text-accent-cream mb-3">
            Event not found
          </h1>
          <p className="text-accent-cream/60 text-sm mb-6">{loadErr}</p>
          <button
            onClick={() => navigate("/offsite-events")}
            className="text-accent-wheat text-sm hover:text-accent-cream"
          >
            ← Back to events
          </button>
        </div>
      </Shell>
    )
  }

  if (!event) {
    return (
      <Shell>
        <p className="text-center text-accent-cream/60">Loading…</p>
      </Shell>
    )
  }

  if (!event.registrationEnabled) {
    return (
      <Shell>
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-medium text-accent-cream mb-3">
            Registration isn’t open
          </h1>
          <p className="text-accent-cream/60 text-sm mb-6">
            Registration for “{event.title}” isn’t available right now.
          </p>
          <button
            onClick={() => navigate(`/event/${event.slug || event._id}`)}
            className="text-accent-wheat text-sm hover:text-accent-cream"
          >
            ← Back to event
          </button>
        </div>
      </Shell>
    )
  }

  if (done) {
    const reg = done.registration
    return (
      <Shell>
        <SignupConfirmationModal
          open={signupModalOpen}
          onClose={() => setSignupModalOpen(false)}
        />
        <motion.div {...fadeInUp} className="max-w-[600px] mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-medium text-accent-cream mb-2">
              You’re registered!
            </h1>
            <p className="text-accent-cream/60 text-sm">
              Your confirmation and event pass have been emailed to you.
            </p>
          </div>

          {reg ? (
            <div className="flex justify-center">
              <GatePass ref={passRef} registration={reg} event={event} />
            </div>
          ) : (
            <p className="text-center text-accent-cream/60">
              Your registration is confirmed — check your email for the pass.
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {reg && (
              <>
                <button
                  onClick={savePng}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-secondary-terra hover:bg-secondary-rust text-white text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  <ImageDown className="w-4 h-4" />
                  {saving ? "Saving…" : "Save as image"}
                </button>
                <a
                  href={api.eventPassUrl(reg._id, reg.passCode)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/20 text-accent-cream text-sm font-semibold hover:bg-white/5 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </a>
              </>
            )}
          </div>
        </motion.div>
      </Shell>
    )
  }

  const steps = paid ? ["Details", "Review", "Payment"] : ["Details", "Confirm"]

  return (
    <Shell>
      <motion.div {...fadeInUp} className="text-center mb-8">
        <p className="text-[0.6875rem] tracking-[0.25em] uppercase text-accent-wheat font-semibold mb-3">
          Register
        </p>
        <h1 className="text-3xl md:text-4xl font-medium text-accent-cream tracking-tight mb-4">
          {event.title}
        </h1>
        <div className="flex items-center justify-center gap-5 text-sm text-accent-cream/60">
          {event.date && (
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> {event.date}
            </span>
          )}
          {event.location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> {event.location}
            </span>
          )}
        </div>
      </motion.div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <span
              className={`flex items-center gap-1.5 text-[0.6875rem] tracking-[0.15em] uppercase ${
                i === step
                  ? "text-secondary-terra font-semibold"
                  : i < step
                    ? "text-accent-cream/70"
                    : "text-accent-cream/35"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[0.625rem] ${
                  i <= step
                    ? "bg-secondary-terra text-white"
                    : "bg-white/10 text-accent-cream/50"
                }`}
              >
                {i < step ? <Check className="w-3 h-3" /> : i + 1}
              </span>
              {label}
            </span>
            {i < steps.length - 1 && <span className="w-8 h-px bg-white/15" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 lg:gap-8 items-start">
        {/* Left: form panel */}
        <motion.div
          {...fadeInUp}
          className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 md:p-8 space-y-8 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.6)]"
        >
          {error && (
            <p className="text-sm text-rose-300 bg-rose-500/10 border border-rose-500/20 px-4 py-2.5 rounded-lg">
              {error}
            </p>
          )}

          {/* STEP 0 — details */}
          {step === 0 && (
            <>
              <div>
                <SectionHead>Your Details</SectionHead>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                  />
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                  />
                  <input
                    type="tel"
                    placeholder="Phone (optional)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Tickets / head count — whenever there's something to choose */}
              {(paid || groupBooking) && (
                <div>
                  <SectionHead>{paid ? "Tickets" : "Who's Coming"}</SectionHead>
                  {mode === "tiers" ? (
                    <div className="space-y-3">
                      {types.map((t) => (
                        <div
                          key={t.name}
                          className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-accent-cream">
                              {t.name}
                            </p>
                            <p className="text-xs text-accent-cream/55">
                              {paid ? money(t.price) : "Free"}
                              {t.description ? ` · ${t.description}` : ""}
                            </p>
                          </div>
                          <Stepper
                            value={Number(tierQ[t.name] || 0)}
                            onChange={(v) => setTierQ({ ...tierQ, [t.name]: v })}
                            min={0}
                            max={maxPerReg}
                          />
                        </div>
                      ))}
                    </div>
                  ) : mode === "quantity" ? (
                    <div className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-accent-cream">
                          {types[0]?.name || "General Admission"}
                        </p>
                        <p className="text-xs text-accent-cream/55">
                          {paid
                            ? `${money(types[0]?.price || 0)} each`
                            : "Include yourself and everyone you're bringing"}
                        </p>
                      </div>
                      <Stepper
                        value={quantity}
                        onChange={setQuantity}
                        min={1}
                        max={maxPerReg}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3">
                      <p className="text-sm font-medium text-accent-cream inline-flex items-center gap-2">
                        <Ticket className="w-4 h-4 text-secondary-terra" />
                        {types[0]?.name || "General Admission"}
                      </p>
                      <p className="text-sm font-semibold text-accent-cream">
                        {money(types[0]?.price || 0)}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Custom questions */}
              {(event.customQuestions || []).length > 0 && (
                <div>
                  <SectionHead>A Few Questions</SectionHead>
                  <div className="space-y-4">
                    {event.customQuestions.map((q) => (
                      <div key={q.id}>
                        <label className="block text-[0.75rem] text-accent-cream/70 mb-1.5">
                          {q.label}
                          {q.required && (
                            <span className="text-secondary-terra"> *</span>
                          )}
                        </label>
                        {q.type === "textarea" ? (
                          <textarea
                            rows={3}
                            value={answers[q.id] || ""}
                            onChange={(e) =>
                              setAnswers({ ...answers, [q.id]: e.target.value })
                            }
                            className={`${inputClass} resize-none`}
                          />
                        ) : q.type === "select" ? (
                          <Dropdown
                            theme="dark"
                            fullWidth
                            value={answers[q.id] || ""}
                            onChange={(v) => setAnswers({ ...answers, [q.id]: v })}
                            placeholder="Select…"
                            options={(q.options || []).map((o) => ({
                              value: o,
                              label: o,
                            }))}
                          />
                        ) : q.type === "checkbox" ? (
                          <label className="flex items-center gap-2.5 text-sm text-accent-cream/75 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={!!answers[q.id]}
                              onChange={(e) =>
                                setAnswers({ ...answers, [q.id]: e.target.checked })
                              }
                              className="w-4 h-4 accent-secondary-terra"
                            />
                            Yes
                          </label>
                        ) : (
                          <input
                            type={q.type === "number" ? "number" : "text"}
                            value={answers[q.id] || ""}
                            onChange={(e) =>
                              setAnswers({ ...answers, [q.id]: e.target.value })
                            }
                            className={inputClass}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={goReview}
                className="w-full py-4 bg-secondary-terra hover:bg-secondary-rust text-white text-sm font-semibold tracking-wide rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-secondary-terra/25"
              >
                Continue
              </button>
            </>
          )}

          {/* STEP 1 — review */}
          {step === 1 && (
            <>
              <div>
                <SectionHead>Review</SectionHead>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-accent-cream/55">Name</dt>
                    <dd className="text-accent-cream font-medium">{name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-accent-cream/55">Email</dt>
                    <dd className="text-accent-cream font-medium">{email}</dd>
                  </div>
                  {phone && (
                    <div className="flex justify-between">
                      <dt className="text-accent-cream/55">Phone</dt>
                      <dd className="text-accent-cream font-medium">{phone}</dd>
                    </div>
                  )}
                  {(paid || groupBooking) &&
                    order.items.map((i) => (
                      <div key={i.ticketTypeName} className="flex justify-between">
                        <dt className="text-accent-cream/55">
                          {i.ticketTypeName} × {i.quantity}
                        </dt>
                        <dd className="text-accent-cream font-medium">
                          {paid ? money(i.unitPrice * i.quantity) : "Free"}
                        </dd>
                      </div>
                    ))}
                  {(event.customQuestions || [])
                    .filter((q) => answers[q.id] !== undefined && answers[q.id] !== "")
                    .map((q) => (
                      <div key={q.id} className="flex justify-between gap-4">
                        <dt className="text-accent-cream/55">{q.label}</dt>
                        <dd className="text-accent-cream font-medium text-right">
                          {typeof answers[q.id] === "boolean"
                            ? answers[q.id]
                              ? "Yes"
                              : "No"
                            : String(answers[q.id])}
                        </dd>
                      </div>
                    ))}
                </dl>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="flex-1 py-3.5 rounded-lg border border-white/15 text-accent-cream/80 text-sm font-medium hover:bg-white/5 transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={paid ? startPayment : submitFree}
                  disabled={busy}
                  className="flex-[2] py-3.5 bg-secondary-terra hover:bg-secondary-rust text-white text-sm font-semibold tracking-wide rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-secondary-terra/25"
                >
                  {busy
                    ? "Please wait…"
                    : paid
                      ? `Continue to payment · ${amountLabel}`
                      : "Confirm registration"}
                </button>
              </div>
            </>
          )}

          {/* STEP 2 — payment */}
          {step === 2 && (
            <div>
              <SectionHead>Payment</SectionHead>
              {clientSecret && stripePromise ? (
                <Elements
                  stripe={stripePromise}
                  options={{ clientSecret, appearance: STRIPE_APPEARANCE }}
                >
                  <CardForm
                    amountLabel={amountLabel}
                    returnUrl={returnUrl}
                    onPaid={onPaid}
                    onEdit={() => setStep(1)}
                  />
                </Elements>
              ) : (
                <p className="text-sm text-accent-cream/50">Preparing payment…</p>
              )}
            </div>
          )}
        </motion.div>

        {/* Right: summary */}
        <motion.aside
          {...fadeInUp}
          className="lg:sticky lg:top-28 rounded-2xl border border-white/10 bg-white/[0.05] p-6 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.6)]"
        >
          <h2 className="text-lg font-medium text-accent-cream mb-5 flex items-center gap-2">
            <Ticket className="w-4 h-4 text-secondary-terra" />
            Summary
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-accent-cream/55">Event</dt>
              <dd className="text-accent-cream font-medium text-right max-w-[60%]">
                {event.title}
              </dd>
            </div>
            {(paid || groupBooking) && (
              <div className="flex justify-between">
                <dt className="text-accent-cream/55">
                  {paid ? "Tickets" : "Attending"}
                </dt>
                <dd className="text-accent-cream font-medium">{order.quantity}</dd>
              </div>
            )}
          </dl>

          <div className="my-5 h-px bg-white/10" />

          <div className="flex items-end justify-between">
            <span className="text-[0.7rem] tracking-[0.2em] uppercase text-accent-cream/50">
              {paid ? "Total" : "Admission"}
            </span>
            <span className="text-2xl font-semibold text-accent-cream leading-none">
              {paid ? amountLabel : "Free"}
            </span>
          </div>

          <p className="mt-5 flex items-center gap-2 text-xs text-accent-cream/50">
            {paid ? (
              <>
                <Lock className="w-3.5 h-3.5 text-accent-wheat/70 flex-shrink-0" />
                Secure, encrypted checkout via Stripe
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5 text-accent-wheat/70 flex-shrink-0" />
                A confirmation is emailed instantly
              </>
            )}
          </p>

          {config?.paymentMode === "sandbox" && paid && (
            <p className="mt-4 text-center text-[0.625rem] tracking-[0.15em] uppercase text-accent-cream/40">
              Sandbox mode — no real charges
            </p>
          )}
        </motion.aside>
      </div>
    </Shell>
  )
}
