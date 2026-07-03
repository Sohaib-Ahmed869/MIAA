import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle, Megaphone } from "lucide-react"
import { donorApi } from "../../lib/donorAuth"

export default function DonorCampaignRequest() {
  const [form, setForm] = useState({ title: "", description: "", suggestedGoal: "" })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError("")
    try {
      await donorApi.requestCampaign({
        ...form,
        suggestedGoal: form.suggestedGoal ? Math.round(parseFloat(form.suggestedGoal) * 100) : 0,
      })
      setSubmitted(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const inputCls =
    "w-full py-3 px-4 bg-white border border-primary/12 text-primary rounded-sm text-sm placeholder:text-primary/30 focus:border-secondary-terra focus:shadow-[0_0_0_3px_rgba(193,92,69,0.08)] focus:outline-none transition-all"

  if (submitted) {
    return (
      <div className="text-center py-16 max-w-md mx-auto">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/15 mb-5"
        >
          <CheckCircle className="w-7 h-7 text-emerald-500" />
        </motion.div>
        <h2 className="text-lg font-medium text-primary mb-2" style={{ fontFamily: "var(--font-display)" }}>
          Request Submitted
        </h2>
        <p className="text-sm text-primary/50">
          Thank you for your suggestion. Our team will review your campaign
          request and get back to you. Once approved, it will appear on the
          donations page.
        </p>
        <button
          onClick={() => {
            setSubmitted(false)
            setForm({ title: "", description: "", suggestedGoal: "" })
          }}
          className="mt-6 px-5 py-2 text-[0.6875rem] tracking-[0.15em] uppercase text-secondary-terra border border-secondary-terra/30 rounded-sm hover:border-secondary-terra transition-colors"
        >
          Submit Another
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-lg">
      <h2
        className="text-base text-primary tracking-tight mb-2"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Request a Campaign
      </h2>
      <p className="text-sm text-primary/50 mb-6">
        Suggest a fundraising campaign for a cause you care about. Our team
        will review your request and, once approved, it will be listed on the
        donations page for others to support.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <p className="text-xs text-rose-600 bg-rose-50 px-3 py-2 rounded-sm">
            {error}
          </p>
        )}

        <div>
          <label className="block text-[0.625rem] tracking-[0.2em] uppercase text-primary/50 mb-2 font-barlow font-semibold">
            Campaign Title
          </label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Education Fund for Young Artists"
            className={inputCls}
          />
        </div>

        <div>
          <label className="block text-[0.625rem] tracking-[0.2em] uppercase text-primary/50 mb-2 font-barlow font-semibold">
            Description
          </label>
          <textarea
            required
            rows={5}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe the purpose, who it helps, and why it matters…"
            className={`${inputCls} resize-none`}
          />
        </div>

        <div>
          <label className="block text-[0.625rem] tracking-[0.2em] uppercase text-primary/50 mb-2 font-barlow font-semibold">
            Suggested Goal (AUD){" "}
            <span className="text-primary/30 normal-case tracking-normal">
              (optional)
            </span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-primary/30">
              $
            </span>
            <input
              type="number"
              min="0"
              step="1"
              value={form.suggestedGoal}
              onChange={(e) =>
                setForm({ ...form, suggestedGoal: e.target.value })
              }
              placeholder="10,000"
              className={`${inputCls} pl-8`}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={busy}
          className="px-6 py-3 bg-secondary-terra hover:bg-secondary-rust text-white text-[0.6875rem] font-medium tracking-[0.15em] uppercase rounded-sm transition-colors disabled:opacity-50"
        >
          {busy ? "Submitting…" : "Submit Request"}
        </button>
      </form>
    </div>
  )
}
