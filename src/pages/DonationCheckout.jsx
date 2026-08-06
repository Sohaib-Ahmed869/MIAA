import { useEffect, useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import { CreditCard, Heart, Lock, ChevronDown, ShieldCheck, ArrowLeft } from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js"
import { api } from "../lib/api"
import { getDonorUser } from "../lib/donorAuth"
import { fadeInUp } from "../lib/motion"

const PRESET_AMOUNTS = [2500, 5000, 10000, 25000, 50000, 100000]
const FREQUENCIES = [
  { value: "one-time", label: "One-time" },
  { value: "weekly", label: "Weekly" },
  { value: "fortnightly", label: "Fortnightly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "annually", label: "Annually" },
]

// Payment Element appearance tuned to the dark teal checkout.
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

// Small section heading with a terra marker dot.
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

// The embedded card form — rendered inside <Elements> once we have a
// client secret. Confirms the PaymentIntent (or subscription's first invoice)
// without leaving the page.
function CardPaymentForm({ amountLabel, isRecurring, freqLabel, onSuccess, onEdit }) {
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
      confirmParams: {
        return_url: `${window.location.origin}/donate/success`,
      },
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
      // Record the donation eagerly (idempotent server-side; the webhook is a
      // backup). Best-effort — never block the thank-you page on it.
      try {
        await api.confirmStripeDonation({ paymentIntentId: paymentIntent.id })
      } catch {
        // ignore — webhook will reconcile
      }
      onSuccess()
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
            Donate {amountLabel}
            {isRecurring ? ` / ${freqLabel.toLowerCase()}` : ""}
          </>
        )}
      </button>

      <button
        type="button"
        onClick={onEdit}
        className="w-full flex items-center justify-center gap-1.5 text-xs text-accent-cream/50 hover:text-accent-cream transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Edit amount or details
      </button>
    </form>
  )
}

export default function DonationCheckout() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const preselectedProduct = searchParams.get("product") || ""
  const preselectedCampaign = searchParams.get("campaign") || ""
  const preselectedEvent = searchParams.get("event") || ""

  // Prefill details from the logged-in donor session, if any.
  const donor = getDonorUser()
  const donorFullName = donor
    ? [donor.firstName, donor.lastName].filter(Boolean).join(" ")
    : ""

  const [products, setProducts] = useState([])
  const [campaign, setCampaign] = useState(null)
  const [event, setEvent] = useState(null)
  const [config, setConfig] = useState(null)
  const [amount, setAmount] = useState(5000)
  const [customAmount, setCustomAmount] = useState("")
  const [isCustom, setIsCustom] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(preselectedProduct)
  const [selectedCampaign] = useState(preselectedCampaign)
  const [selectedEvent] = useState(preselectedEvent)
  const [frequency, setFrequency] = useState("one-time")
  const [donorName, setDonorName] = useState(donorFullName)
  const [donorEmail, setDonorEmail] = useState(donor?.email || "")
  const [message, setMessage] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [clientSecret, setClientSecret] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("card")

  useEffect(() => {
    const controller = new AbortController()
    Promise.all([
      api.donationProducts(),
      api.donationConfig(),
    ]).then(([prods, cfg]) => {
      if (!controller.signal.aborted) {
        setProducts(prods)
        setConfig(cfg)
      }
    }).catch(() => {})
    return () => controller.abort()
  }, [])

  // Load the campaign the donor arrived to support, if any.
  useEffect(() => {
    if (!preselectedCampaign) return
    const controller = new AbortController()
    api
      .campaign(preselectedCampaign)
      .then((data) => {
        if (!controller.signal.aborted) setCampaign(data)
      })
      .catch(() => {})
    return () => controller.abort()
  }, [preselectedCampaign])

  // Load the event the donor arrived to support, if any (id or slug).
  useEffect(() => {
    if (!preselectedEvent) return
    const controller = new AbortController()
    api
      .eventById(preselectedEvent)
      .then((data) => {
        if (!controller.signal.aborted) setEvent(data)
      })
      .catch(() => {})
    return () => controller.abort()
  }, [preselectedEvent])

  const effectiveAmount = isCustom ? Math.round(parseFloat(customAmount || "0") * 100) : amount
  const isRecurring = frequency !== "one-time"

  const freqLabel = FREQUENCIES.find((f) => f.value === frequency)?.label || "One-time"
  const selectedProductName = selectedProduct
    ? products.find((p) => p._id === selectedProduct)?.name || "Selected cause"
    : "General Fund"
  // A campaign or event allocation takes precedence over the product dropdown.
  const allocationName = selectedCampaign
    ? campaign?.title || "Selected campaign"
    : selectedEvent
      ? event?.title || "Selected event"
      : selectedProductName
  const amountLabel =
    effectiveAmount > 0 ? `$${(effectiveAmount / 100).toFixed(2)}` : "—"

  // Lazily create the Stripe.js instance once we know the publishable key.
  const stripeKey = config?.stripePublishableKey
  const stripePromise = useMemo(
    () => (stripeKey ? loadStripe(stripeKey) : null),
    [stripeKey],
  )

  // A signature of the gift fields that affect the charge. If it changes after
  // a payment intent was created, the card form hides and the donor must
  // re-confirm (which mints a fresh intent) before paying — no stale amounts.
  const giftSignature = JSON.stringify({
    effectiveAmount,
    frequency,
    selectedProduct,
    selectedCampaign,
    selectedEvent,
    donorEmail,
    isAnonymous,
  })
  const [intentSignature, setIntentSignature] = useState("")

  const validate = () => {
    if (effectiveAmount < 100) {
      setError("Minimum donation is $1.00")
      return false
    }
    if (!donorEmail) {
      setError("Email is required")
      return false
    }
    setError("")
    return true
  }

  const buildPayload = () => ({
    amount: effectiveAmount,
    productId: selectedProduct || undefined,
    campaignId: selectedCampaign || undefined,
    // Send the resolved Mongo _id — the URL param may be a slug.
    eventId: event?._id || undefined,
    donorId: donor?.id || undefined,
    donorEmail,
    donorName,
    type: isRecurring ? "recurring" : "one-time",
    frequency: isRecurring ? frequency : undefined,
    isAnonymous,
    message,
  })

  // Stripe: create the payment intent and reveal the on-page card form.
  const handleContinueToPayment = async () => {
    if (!validate()) return
    setBusy(true)
    try {
      const { clientSecret: cs } = await api.createPaymentIntent(buildPayload())
      if (!cs) throw new Error("Could not start payment")
      setClientSecret(cs)
      setIntentSignature(giftSignature)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  // PayPal: create the order server-side and redirect to PayPal's approval
  // page. On return, DonationSuccess captures the order (?paypal=1&token=…).
  const handlePaypal = async () => {
    if (!validate()) return
    setBusy(true)
    try {
      const { approvalUrl } = await api.createPaypalOrder(buildPayload())
      if (!approvalUrl) throw new Error("Could not start PayPal checkout")
      window.location.href = approvalUrl
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  // PayPal here only supports one-time gifts — recurring falls back to card.
  useEffect(() => {
    if (isRecurring && paymentMethod === "paypal") setPaymentMethod("card")
  }, [isRecurring, paymentMethod])

  const paypalAvailable = Boolean(config?.paypalClientId) && !isRecurring

  const inputClass =
    "w-full py-3 px-4 bg-white/[0.06] text-accent-cream border border-white/10 rounded-lg text-sm placeholder:text-accent-cream/30 focus:border-secondary-terra focus:ring-2 focus:ring-secondary-terra/25 focus:outline-none transition-colors"

  const showCardForm =
    clientSecret &&
    intentSignature === giftSignature &&
    stripePromise

  return (
    <section className="relative bg-bg-deep min-h-screen overflow-hidden">
      {/* Soft decorative glow behind the content */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] opacity-70"
        style={{
          background:
            "radial-gradient(70% 60% at 50% 0%, rgba(193,92,69,0.16), transparent 70%)",
        }}
      />

      <div className="relative max-w-[1120px] 3xl:max-w-[1320px] mx-auto px-6 md:px-10 pt-28 md:pt-32 pb-20">
        <motion.div {...fadeInUp} className="text-center mb-10 md:mb-12">
          <p className="text-[0.6875rem] tracking-[0.25em] uppercase text-accent-wheat font-semibold mb-3">
            Donate to MIAA
          </p>
          <h1 className="text-3xl md:text-4xl 3xl:text-5xl font-medium text-accent-cream tracking-tight mb-4">
            Choose Your Gift
          </h1>
          <p className="text-sm md:text-base text-accent-cream/55 max-w-md mx-auto leading-relaxed">
            Your support helps preserve and share Islamic art and culture across
            Australia. Every gift makes a difference.
          </p>
        </motion.div>

        {/* Campaign context — shown when the donor arrived from a campaign */}
        {selectedCampaign && (
          <motion.div
            {...fadeInUp}
            className="mb-8 flex items-center gap-4 rounded-2xl border border-secondary-terra/25 bg-secondary-terra/10 p-4 md:p-5"
          >
            {campaign?.imageUrl ? (
              <img
                src={campaign.imageUrl}
                alt={campaign.title}
                className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-white/10 flex-shrink-0" />
            )}
            <div className="min-w-0">
              <p className="text-[0.625rem] tracking-[0.2em] uppercase text-accent-wheat font-semibold mb-1">
                You're supporting
              </p>
              <p className="text-lg md:text-xl font-medium text-accent-cream leading-tight truncate">
                {campaign?.title || "Loading campaign…"}
              </p>
              {campaign?.description && (
                <p className="text-[0.8125rem] text-accent-cream/55 line-clamp-1 mt-0.5">
                  {campaign.description}
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Event context — shown when the donor arrived from an event page */}
        {selectedEvent && !selectedCampaign && (
          <motion.div
            {...fadeInUp}
            className="mb-8 flex items-center gap-4 rounded-2xl border border-secondary-terra/25 bg-secondary-terra/10 p-4 md:p-5"
          >
            {event?.imageUrl ? (
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-white/10 flex-shrink-0" />
            )}
            <div className="min-w-0">
              <p className="text-[0.625rem] tracking-[0.2em] uppercase text-accent-wheat font-semibold mb-1">
                You're supporting the event
              </p>
              <p className="text-lg md:text-xl font-medium text-accent-cream leading-tight truncate">
                {event?.title || "Loading event…"}
              </p>
              {(event?.date || event?.location) && (
                <p className="text-[0.8125rem] text-accent-cream/55 line-clamp-1 mt-0.5">
                  {[event.date, event.location].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] 3xl:grid-cols-[1fr_400px] gap-6 lg:gap-8 items-start">
          {/* ── Left column: the form panel ────────────────────────────── */}
          <motion.div
            {...fadeInUp}
            className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 md:p-8 3xl:p-10 space-y-8 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.6)]"
          >
            {/* Amount selection */}
            <div>
              <SectionHead>Amount (AUD)</SectionHead>
              <div className="grid grid-cols-3 gap-2.5 md:gap-3">
                {PRESET_AMOUNTS.map((a) => {
                  const active = !isCustom && amount === a
                  return (
                    <button
                      key={a}
                      type="button"
                      onClick={() => {
                        setAmount(a)
                        setIsCustom(false)
                      }}
                      className={`py-3.5 rounded-lg text-sm font-semibold transition-all ${
                        active
                          ? "bg-secondary-terra text-white shadow-lg shadow-secondary-terra/25 ring-2 ring-secondary-terra/40"
                          : "bg-white/[0.06] text-accent-cream/80 border border-white/10 hover:bg-white/10 hover:border-white/25"
                      }`}
                    >
                      ${(a / 100).toLocaleString()}
                    </button>
                  )
                })}
              </div>
              <div className="relative mt-3">
                <span
                  className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm transition-colors ${
                    isCustom ? "text-secondary-terra" : "text-accent-cream/40"
                  }`}
                >
                  $
                </span>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="Enter a custom amount"
                  value={customAmount}
                  onFocus={() => setIsCustom(true)}
                  onChange={(e) => {
                    setCustomAmount(e.target.value)
                    setIsCustom(true)
                  }}
                  className={`w-full py-3.5 pl-8 pr-4 bg-white/[0.06] text-accent-cream rounded-lg text-sm placeholder:text-accent-cream/30 focus:outline-none transition-all ${
                    isCustom
                      ? "border border-secondary-terra ring-2 ring-secondary-terra/25"
                      : "border border-white/10 hover:border-white/25"
                  }`}
                />
              </div>
            </div>

            {/* Frequency */}
            <div>
              <SectionHead>Frequency</SectionHead>
              <div className="flex flex-wrap gap-2">
                {FREQUENCIES.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setFrequency(f.value)}
                    className={`px-4 py-2.5 rounded-full text-[0.6875rem] font-medium tracking-wide transition-all ${
                      frequency === f.value
                        ? "bg-secondary-terra text-white shadow-md shadow-secondary-terra/25"
                        : "bg-white/[0.06] text-accent-cream/70 border border-white/10 hover:bg-white/10 hover:border-white/25"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Allocation — campaign / event (locked) or product selector */}
            {selectedCampaign ? (
              <div>
                <SectionHead>Allocated To</SectionHead>
                <div className="flex items-center gap-2.5 py-3 px-4 rounded-lg bg-white/[0.06] border border-white/10 text-sm text-accent-cream">
                  <Heart className="w-4 h-4 text-secondary-terra flex-shrink-0" />
                  <span>
                    Supporting the{" "}
                    <strong className="font-semibold">
                      {campaign?.title || "selected"}
                    </strong>{" "}
                    campaign
                  </span>
                </div>
              </div>
            ) : selectedEvent ? (
              <div>
                <SectionHead>Allocated To</SectionHead>
                <div className="flex items-center gap-2.5 py-3 px-4 rounded-lg bg-white/[0.06] border border-white/10 text-sm text-accent-cream">
                  <Heart className="w-4 h-4 text-secondary-terra flex-shrink-0" />
                  <span>
                    Supporting the{" "}
                    <strong className="font-semibold">
                      {event?.title || "selected"}
                    </strong>{" "}
                    event
                  </span>
                </div>
              </div>
            ) : (
              products.length > 0 && (
                <div>
                  <SectionHead>Allocate To (Optional)</SectionHead>
                  <div className="relative">
                    <select
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                      className={`${inputClass} appearance-none pr-10 cursor-pointer`}
                    >
                      <option value="" style={{ backgroundColor: "#214952", color: "#F3EFEB" }}>
                        General Fund
                      </option>
                      {products.map((p) => (
                        <option
                          key={p._id}
                          value={p._id}
                          style={{ backgroundColor: "#214952", color: "#F3EFEB" }}
                        >
                          {p.name} — {p.category}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-cream/40" />
                  </div>
                </div>
              )
            )}

            {/* Donor info */}
            <div>
              <SectionHead>Your Details</SectionHead>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className={inputClass}
                />
                <input
                  type="email"
                  required
                  placeholder="Email Address *"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  className={inputClass}
                />
                <textarea
                  placeholder="Leave a message (optional)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
                <label className="flex items-center gap-2.5 text-sm text-accent-cream/70 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-4 h-4 accent-secondary-terra"
                  />
                  Make my donation anonymous
                </label>
              </div>
            </div>

            {/* Payment method */}
            <div>
              <SectionHead>Payment Method</SectionHead>
              <div className={`grid gap-2.5 ${paypalAvailable ? "grid-cols-2" : "grid-cols-1"}`}>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`flex items-center justify-center gap-2 py-3.5 rounded-lg text-sm font-medium transition-all ${
                    paymentMethod === "card"
                      ? "bg-secondary-terra text-white shadow-lg shadow-secondary-terra/25 ring-2 ring-secondary-terra/40"
                      : "bg-white/[0.06] text-accent-cream/80 border border-white/10 hover:bg-white/10 hover:border-white/25"
                  }`}
                >
                  <CreditCard className="w-4 h-4" /> Card / Apple Pay
                </button>
                {paypalAvailable && (
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("paypal")}
                    className={`flex items-center justify-center gap-2 py-3.5 rounded-lg text-sm font-medium transition-all ${
                      paymentMethod === "paypal"
                        ? "bg-secondary-terra text-white shadow-lg shadow-secondary-terra/25 ring-2 ring-secondary-terra/40"
                        : "bg-white/[0.06] text-accent-cream/80 border border-white/10 hover:bg-white/10 hover:border-white/25"
                    }`}
                  >
                    PayPal
                  </button>
                )}
              </div>

              {/* On-page card fields (Stripe Payment Element) */}
              {paymentMethod === "card" ? (
                <div className="mt-4">
                  {showCardForm ? (
                    <Elements
                      stripe={stripePromise}
                      options={{ clientSecret, appearance: STRIPE_APPEARANCE }}
                    >
                      <CardPaymentForm
                        amountLabel={amountLabel}
                        isRecurring={isRecurring}
                        freqLabel={freqLabel}
                        onSuccess={() => navigate("/donate/success")}
                        onEdit={() => setClientSecret("")}
                      />
                    </Elements>
                  ) : (
                    <p className="text-xs text-accent-cream/45 leading-relaxed">
                      Card details are entered securely on this page. Press
                      “Continue to secure payment” to enter your card.
                    </p>
                  )}
                </div>
              ) : (
                <p className="mt-4 text-xs text-accent-cream/45 leading-relaxed">
                  You'll be redirected to PayPal to complete your donation
                  securely, then returned here.
                </p>
              )}
            </div>
          </motion.div>

          {/* ── Right column: sticky gift summary ──────────────────────── */}
          <motion.aside
            {...fadeInUp}
            className="lg:sticky lg:top-28 rounded-2xl border border-white/10 bg-white/[0.05] p-6 3xl:p-8 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.6)]"
          >
            <h2 className="text-lg font-medium text-accent-cream mb-5 flex items-center gap-2">
              <Heart className="w-4 h-4 text-secondary-terra" />
              Your Gift
            </h2>

            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-accent-cream/55">Gift amount</dt>
                <dd className="text-accent-cream font-medium">{amountLabel}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-accent-cream/55">Frequency</dt>
                <dd className="text-accent-cream font-medium">{freqLabel}</dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-accent-cream/55 flex-shrink-0">Allocated to</dt>
                <dd className="text-accent-cream font-medium text-right">
                  {allocationName}
                </dd>
              </div>
            </dl>

            <div className="my-5 h-px bg-white/10" />

            <div className="flex items-end justify-between mb-5">
              <span className="text-[0.7rem] tracking-[0.2em] uppercase text-accent-cream/50">
                Total {isRecurring ? "per gift" : "today"}
              </span>
              <span className="text-2xl 3xl:text-3xl font-semibold text-accent-cream leading-none">
                {amountLabel}
                {isRecurring && (
                  <span className="text-sm font-normal text-accent-cream/50">
                    {" "}
                    / {freqLabel.toLowerCase()}
                  </span>
                )}
              </span>
            </div>

            {isRecurring && (
              <p className="text-xs text-accent-cream/50 leading-relaxed mb-4 -mt-1">
                You'll be charged {amountLabel} {freqLabel.toLowerCase()}. Cancel
                anytime from your donor portal.
              </p>
            )}

            {error && (
              <p className="text-sm text-rose-300 bg-rose-500/10 border border-rose-500/20 px-4 py-2.5 rounded-lg mb-4">
                {error}
              </p>
            )}

            {/* Primary action. For card, this reveals the on-page card form;
                the final "Donate" button lives with the card fields. For
                PayPal, it redirects to PayPal's approval page. */}
            {paymentMethod === "paypal" ? (
              <button
                type="button"
                onClick={handlePaypal}
                disabled={busy}
                className="w-full py-4 bg-secondary-terra hover:bg-secondary-rust text-white text-sm font-semibold tracking-wide rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-secondary-terra/25"
              >
                {busy ? "Redirecting to PayPal…" : `Donate ${amountLabel} with PayPal`}
              </button>
            ) : showCardForm ? (
              <p className="text-center text-xs text-accent-cream/50">
                Complete your card details to finish your donation →
              </p>
            ) : (
              <button
                type="button"
                onClick={handleContinueToPayment}
                disabled={busy}
                className="w-full py-4 bg-secondary-terra hover:bg-secondary-rust text-white text-sm font-semibold tracking-wide rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-secondary-terra/25"
              >
                {busy ? (
                  "Preparing…"
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Continue to secure payment
                  </>
                )}
              </button>
            )}

            <div className="mt-4 space-y-2">
              <p className="flex items-center gap-2 text-xs text-accent-cream/50">
                <ShieldCheck className="w-3.5 h-3.5 text-accent-wheat/70 flex-shrink-0" />
                Secure, encrypted checkout via Stripe
              </p>
              <p className="flex items-center gap-2 text-xs text-accent-cream/50">
                <Heart className="w-3.5 h-3.5 text-accent-wheat/70 flex-shrink-0" />
                A receipt is emailed to you instantly
              </p>
            </div>

            {config?.paymentMode === "sandbox" && (
              <p className="mt-4 text-center text-[0.625rem] tracking-[0.15em] uppercase text-accent-cream/40">
                Sandbox mode — no real charges
              </p>
            )}
          </motion.aside>
        </div>
      </div>
    </section>
  )
}
