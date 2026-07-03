import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import { CreditCard, Heart } from "lucide-react"
import { api } from "../lib/api"
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

export default function DonationCheckout() {
  const [searchParams] = useSearchParams()
  const preselectedProduct = searchParams.get("product") || ""
  const preselectedCampaign = searchParams.get("campaign") || ""

  const [products, setProducts] = useState([])
  const [config, setConfig] = useState(null)
  const [amount, setAmount] = useState(5000)
  const [customAmount, setCustomAmount] = useState("")
  const [isCustom, setIsCustom] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(preselectedProduct)
  const [selectedCampaign] = useState(preselectedCampaign)
  const [frequency, setFrequency] = useState("one-time")
  const [donorName, setDonorName] = useState("")
  const [donorEmail, setDonorEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("stripe")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

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

  const effectiveAmount = isCustom ? Math.round(parseFloat(customAmount || "0") * 100) : amount
  const isRecurring = frequency !== "one-time"

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (effectiveAmount < 100) {
      setError("Minimum donation is $1.00")
      return
    }
    if (!donorEmail) {
      setError("Email is required")
      return
    }
    setBusy(true)
    setError("")

    try {
      const payload = {
        amount: effectiveAmount,
        productId: selectedProduct || undefined,
        campaignId: selectedCampaign || undefined,
        donorEmail,
        donorName,
        type: isRecurring ? "recurring" : "one-time",
        frequency: isRecurring ? frequency : undefined,
        isAnonymous,
        message,
      }

      if (paymentMethod === "stripe") {
        const { url } = await api.createStripeCheckout(payload)
        window.location.href = url
      } else {
        const { approvalUrl } = await api.createPaypalOrder(payload)
        window.location.href = approvalUrl
      }
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <section className="bg-bg-deep min-h-screen">
      <div className="max-w-[700px] 3xl:max-w-[900px] mx-auto px-6 md:px-10 pt-28 md:pt-32 pb-20">
        <motion.div {...fadeInUp}>
          <p className="text-[0.6875rem] tracking-[0.25em] uppercase text-accent-wheat font-semibold mb-2 text-center">
            Donate to MIAA
          </p>
          <h1 className="text-2xl md:text-3xl 3xl:text-4xl font-medium text-accent-cream tracking-tight text-center mb-10">
            Choose Your Gift
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Amount selection */}
            <div>
              <label className="text-[0.625rem] tracking-[0.2em] uppercase text-accent-cream/60 block mb-3">
                Amount (AUD)
              </label>
              <div className="grid grid-cols-3 gap-3">
                {PRESET_AMOUNTS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => {
                      setAmount(a)
                      setIsCustom(false)
                    }}
                    className={`py-3 rounded-sm text-sm font-medium transition-all ${
                      !isCustom && amount === a
                        ? "bg-secondary-terra text-white"
                        : "bg-white/10 text-accent-cream/80 hover:bg-white/15"
                    }`}
                  >
                    ${(a / 100).toLocaleString()}
                  </button>
                ))}
              </div>
              <div className="mt-3">
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="Custom amount"
                  value={customAmount}
                  onFocus={() => setIsCustom(true)}
                  onChange={(e) => {
                    setCustomAmount(e.target.value)
                    setIsCustom(true)
                  }}
                  className="w-full py-3 px-4 bg-white/10 text-accent-cream border border-accent-cream/20 rounded-sm text-sm placeholder:text-accent-cream/30 focus:border-secondary-terra focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Frequency */}
            <div>
              <label className="text-[0.625rem] tracking-[0.2em] uppercase text-accent-cream/60 block mb-3">
                Frequency
              </label>
              <div className="flex flex-wrap gap-2">
                {FREQUENCIES.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setFrequency(f.value)}
                    className={`px-4 py-2 rounded-sm text-[0.6875rem] tracking-wide transition-all ${
                      frequency === f.value
                        ? "bg-secondary-terra text-white"
                        : "bg-white/10 text-accent-cream/70 hover:bg-white/15"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Product / cause selector */}
            {products.length > 0 && (
              <div>
                <label className="text-[0.625rem] tracking-[0.2em] uppercase text-accent-cream/60 block mb-3">
                  Allocate To (Optional)
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full py-3 px-4 bg-white/10 text-accent-cream border border-accent-cream/20 rounded-sm text-sm focus:border-secondary-terra focus:outline-none transition-colors"
                >
                  <option value="">General Fund</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} — {p.category}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Donor info */}
            <div className="space-y-4">
              <label className="text-[0.625rem] tracking-[0.2em] uppercase text-accent-cream/60 block">
                Your Details
              </label>
              <input
                type="text"
                placeholder="Full Name"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="w-full py-3 px-4 bg-white/10 text-accent-cream border border-accent-cream/20 rounded-sm text-sm placeholder:text-accent-cream/30 focus:border-secondary-terra focus:outline-none transition-colors"
              />
              <input
                type="email"
                required
                placeholder="Email Address *"
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                className="w-full py-3 px-4 bg-white/10 text-accent-cream border border-accent-cream/20 rounded-sm text-sm placeholder:text-accent-cream/30 focus:border-secondary-terra focus:outline-none transition-colors"
              />
              <textarea
                placeholder="Leave a message (optional)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full py-3 px-4 bg-white/10 text-accent-cream border border-accent-cream/20 rounded-sm text-sm placeholder:text-accent-cream/30 focus:border-secondary-terra focus:outline-none transition-colors resize-none"
              />
              <label className="flex items-center gap-2 text-sm text-accent-cream/70 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 accent-secondary-terra"
                />
                Make my donation anonymous
              </label>
            </div>

            {/* Payment method */}
            <div>
              <label className="text-[0.625rem] tracking-[0.2em] uppercase text-accent-cream/60 block mb-3">
                Payment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("stripe")}
                  className={`flex items-center justify-center gap-2 py-3 rounded-sm text-sm transition-all ${
                    paymentMethod === "stripe"
                      ? "bg-secondary-terra text-white"
                      : "bg-white/10 text-accent-cream/70 hover:bg-white/15"
                  }`}
                >
                  <CreditCard className="w-4 h-4" /> Card / Apple Pay
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("paypal")}
                  className={`flex items-center justify-center gap-2 py-3 rounded-sm text-sm transition-all ${
                    paymentMethod === "paypal"
                      ? "bg-secondary-terra text-white"
                      : "bg-white/10 text-accent-cream/70 hover:bg-white/15"
                  }`}
                >
                  PayPal
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-rose-400 bg-rose-500/10 px-4 py-2 rounded-sm">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={busy}
              className="w-full py-4 bg-secondary-terra hover:bg-secondary-rust text-white text-sm font-medium tracking-wide rounded-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4" />
              {busy
                ? "Redirecting…"
                : `Donate $${(effectiveAmount / 100).toFixed(2)}${isRecurring ? ` / ${frequency}` : ""}`}
            </button>

            {config?.paymentMode === "sandbox" && (
              <p className="text-center text-[0.625rem] tracking-[0.15em] uppercase text-accent-cream/40">
                Sandbox mode — no real charges
              </p>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  )
}
