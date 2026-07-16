import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Eye,
  EyeOff,
  Heart,
  Plus,
  X,
  Check,
  Monitor,
  Type,
  MousePointerClick,
  DollarSign,
  Package,
} from "lucide-react"
import { adminApi } from "../auth"
import PageHeader from "../components/PageHeader"
import Button from "../components/Button"
import { Field, TextInput, TextArea, Select } from "../components/Field"
import { useToast } from "../components/Toast"

export default function SettingsAdmin() {
  const [widget, setWidget] = useState({
    enabled: false,
    headline: "Support MIAA",
    description:
      "Your donation helps preserve and celebrate Islamic art and culture in Australia.",
    ctaLabel: "Donate Now",
    presetAmounts: [2500, 5000, 10000, 25000],
    featuredProductId: "",
  })
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")
  const [newAmount, setNewAmount] = useState("")
  const { notify } = useToast()

  useEffect(() => {
    let mounted = true
    Promise.all([
      adminApi.getSiteSettings(),
      adminApi.listDonationProducts(),
    ])
      .then(([settings, prods]) => {
        if (!mounted) return
        if (settings?.donationWidget) {
          setWidget((prev) => ({ ...prev, ...settings.donationWidget }))
        }
        setProducts(prods)
      })
      .catch((err) => setError(err.message))
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  const save = async () => {
    setBusy(true)
    setError("")
    setSaved(false)
    try {
      await adminApi.updateSiteSettings({ donationWidget: widget })
      notify("Settings saved")
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const addAmount = () => {
    const dollars = parseFloat(newAmount)
    if (!dollars || dollars <= 0) return
    const cents = Math.round(dollars * 100)
    if (widget.presetAmounts.includes(cents)) return
    setWidget({
      ...widget,
      presetAmounts: [...widget.presetAmounts, cents].sort((a, b) => a - b),
    })
    setNewAmount("")
  }

  const removeAmount = (cents) => {
    setWidget({
      ...widget,
      presetAmounts: widget.presetAmounts.filter((a) => a !== cents),
    })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 bg-white border border-primary/10 rounded-sm animate-pulse"
          />
        ))}
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        label="Settings"
        title="Site Settings"
        subtitle="Manage the homepage donation widget and site-wide configuration."
      />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6 items-start">
        {/* ── Left: Configuration ─────────────────────────── */}
        <div className="space-y-4">
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-rose-600 bg-rose-50 border border-rose-200 px-4 py-3 rounded-sm"
            >
              {error}
            </motion.p>
          )}

          {/* ── Toggle card ────────────────────────────── */}
          <div className="bg-white border border-primary/10 rounded-sm overflow-hidden">
            <button
              onClick={() => setWidget({ ...widget, enabled: !widget.enabled })}
              className="w-full flex items-center justify-between px-6 py-5 group transition-colors hover:bg-accent-cream/40"
            >
              <div className="flex items-center gap-4">
                <span
                  className={`inline-flex items-center justify-center w-10 h-10 rounded-sm transition-colors ${
                    widget.enabled
                      ? "bg-emerald-500/15 text-emerald-600"
                      : "bg-primary/8 text-primary/40"
                  }`}
                >
                  {widget.enabled ? (
                    <Eye className="w-[1.125rem] h-[1.125rem]" strokeWidth={1.75} />
                  ) : (
                    <EyeOff className="w-[1.125rem] h-[1.125rem]" strokeWidth={1.75} />
                  )}
                </span>
                <div className="text-left">
                  <p className="text-sm font-medium text-primary">
                    Homepage Donation Widget
                  </p>
                  <p className="text-[0.6875rem] text-primary/50">
                    {widget.enabled
                      ? "Visible on the homepage"
                      : "Hidden — enable to show on homepage"}
                  </p>
                </div>
              </div>
              <div
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  widget.enabled ? "bg-emerald-500" : "bg-primary/20"
                }`}
              >
                <motion.div
                  animate={{ x: widget.enabled ? 20 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                />
              </div>
            </button>
          </div>

          {/* ── Content section ─────────────────────────── */}
          <div className="bg-white border border-primary/10 rounded-sm">
            <div className="px-6 py-4 border-b border-primary/8 flex items-center gap-3">
              <Type className="w-4 h-4 text-secondary-terra" strokeWidth={1.75} />
              <p className="text-[0.6875rem] tracking-[0.18em] uppercase text-primary/55">
                Content
              </p>
            </div>
            <div className="px-6 py-5 space-y-5">
              <Field label="Headline" hint="Main heading shown above the donate card">
                <TextInput
                  value={widget.headline}
                  onChange={(e) =>
                    setWidget({ ...widget, headline: e.target.value })
                  }
                  placeholder="Support MIAA"
                />
              </Field>
              <Field
                label="Description"
                hint="Supporting text below the headline"
              >
                <TextArea
                  value={widget.description}
                  onChange={(e) =>
                    setWidget({ ...widget, description: e.target.value })
                  }
                  rows={3}
                  placeholder="Your donation helps preserve and celebrate…"
                />
              </Field>
            </div>
          </div>

          {/* ── Preset amounts ──────────────────────────── */}
          <div className="bg-white border border-primary/10 rounded-sm">
            <div className="px-6 py-4 border-b border-primary/8 flex items-center gap-3">
              <DollarSign
                className="w-4 h-4 text-secondary-terra"
                strokeWidth={1.75}
              />
              <p className="text-[0.6875rem] tracking-[0.18em] uppercase text-primary/55">
                Quick Donate Amounts
              </p>
            </div>
            <div className="px-6 py-5">
              <p className="text-[0.6875rem] text-primary/45 mb-4">
                These buttons appear in the widget for quick one-click
                donation selection.
              </p>

              {/* Current amounts as chips */}
              <div className="flex flex-wrap gap-2 mb-4">
                {widget.presetAmounts.map((cents) => (
                  <motion.span
                    key={cents}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="inline-flex items-center gap-1.5 pl-3.5 pr-2 py-1.5 bg-accent-cream border border-primary/10 rounded-sm text-sm font-medium text-primary"
                  >
                    ${(cents / 100).toLocaleString()}
                    <button
                      onClick={() => removeAmount(cents)}
                      className="p-0.5 rounded-full hover:bg-rose-100 hover:text-rose-600 text-primary/35 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.span>
                ))}
                {widget.presetAmounts.length === 0 && (
                  <p className="text-[0.6875rem] text-primary/35 italic">
                    No amounts — add at least one below
                  </p>
                )}
              </div>

              {/* Add new amount */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-[10rem]">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-primary/35">
                    $
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    placeholder="50"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addAmount()}
                    className="w-full py-2 pl-7 pr-3 bg-accent-cream/60 border border-primary/12 rounded-sm text-sm text-primary placeholder:text-primary/25 focus:border-secondary-terra focus:outline-none transition-colors"
                  />
                </div>
                <button
                  onClick={addAmount}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-[0.625rem] tracking-[0.18em] uppercase rounded-sm hover:bg-bg-deep transition-colors"
                >
                  <Plus className="w-3 h-3" strokeWidth={2.5} /> Add
                </button>
              </div>
            </div>
          </div>

          {/* ── CTA & Product ──────────────────────────── */}
          <div className="bg-white border border-primary/10 rounded-sm">
            <div className="px-6 py-4 border-b border-primary/8 flex items-center gap-3">
              <MousePointerClick
                className="w-4 h-4 text-secondary-terra"
                strokeWidth={1.75}
              />
              <p className="text-[0.6875rem] tracking-[0.18em] uppercase text-primary/55">
                Call to Action
              </p>
            </div>
            <div className="px-6 py-5 space-y-5">
              <Field label="Button Label">
                <TextInput
                  value={widget.ctaLabel}
                  onChange={(e) =>
                    setWidget({ ...widget, ctaLabel: e.target.value })
                  }
                  placeholder="Donate Now"
                />
              </Field>
              <Field
                label="Featured Product"
                hint="Pre-select a cause when donors click the widget. Leave empty for General Fund."
              >
                <Select
                  value={widget.featuredProductId || ""}
                  onChange={(e) =>
                    setWidget({
                      ...widget,
                      featuredProductId: e.target.value || null,
                    })
                  }
                >
                  <option value="">None — General Fund</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} ({p.category})
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
          </div>

          {/* ── Save ───────────────────────────────────── */}
          <div className="flex items-center gap-4 pt-2">
            <Button
              onClick={save}
              variant="primary"
              disabled={busy}
              withArrow
            >
              {busy ? "Saving…" : "Save Settings"}
            </Button>
            {saved && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-1.5 text-emerald-600 text-[0.6875rem]"
              >
                <Check className="w-3.5 h-3.5" /> Saved
              </motion.span>
            )}
          </div>
        </div>

        {/* ── Right: Live Preview ─────────────────────────── */}
        <div className="xl:sticky xl:top-28">
          <div className="flex items-center gap-2 mb-3">
            <Monitor className="w-3.5 h-3.5 text-primary/40" strokeWidth={1.75} />
            <p className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/45">
              Live Preview
            </p>
          </div>

          <div className="rounded-sm overflow-hidden border border-primary/15 shadow-lg">
            {/* Mini preview of the widget as it appears on the homepage */}
            <div className="bg-primary p-5">
              {!widget.enabled ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <EyeOff className="w-6 h-6 text-accent-cream/25 mb-3" />
                  <p className="text-[0.6875rem] text-accent-cream/40">
                    Widget is hidden
                  </p>
                  <p className="text-[0.625rem] text-accent-cream/25 mt-1">
                    Enable it to see the preview
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-[0.5rem] tracking-[0.25em] uppercase text-accent-wheat/80 font-semibold mb-1">
                    Support Our Mission
                  </p>
                  <p className="text-sm font-medium text-accent-cream tracking-tight leading-snug mb-1.5">
                    {widget.headline || "Support MIAA"}
                  </p>
                  <p className="text-[0.6rem] text-accent-cream/55 leading-relaxed mb-3 line-clamp-2">
                    {widget.description || "Your donation helps…"}
                  </p>

                  {/* Mini donate card */}
                  <div className="bg-white/8 border border-accent-cream/15 rounded-sm p-3">
                    <p className="text-[0.45rem] tracking-[0.2em] uppercase text-accent-cream/40 mb-2">
                      Choose an amount
                    </p>
                    <div className="flex gap-1.5 mb-3">
                      {(widget.presetAmounts.length > 0
                        ? widget.presetAmounts
                        : [2500, 5000, 10000, 25000]
                      )
                        .slice(0, 4)
                        .map((amt, i) => (
                          <span
                            key={amt}
                            className={`flex-1 py-1.5 text-center rounded-sm text-[0.55rem] font-medium ${
                              i === 1
                                ? "bg-secondary-terra text-white"
                                : "bg-white/10 text-accent-cream/70"
                            }`}
                          >
                            ${(amt / 100).toLocaleString()}
                          </span>
                        ))}
                    </div>
                    <div className="flex items-center justify-center gap-1.5 bg-secondary-terra text-white rounded-sm py-2">
                      <Heart className="w-2.5 h-2.5" />
                      <span className="text-[0.55rem] font-medium tracking-wide">
                        {widget.ctaLabel || "Donate Now"}
                      </span>
                    </div>
                    <div className="flex justify-between mt-2 pt-2 border-t border-accent-cream/8">
                      <span className="text-[0.4rem] text-accent-cream/35 underline">
                        View all causes
                      </span>
                      <span className="text-[0.4rem] text-accent-cream/35 underline">
                        Donor Portal
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
            {/* Footer label */}
            <div className="bg-accent-cream/60 px-4 py-2 flex items-center justify-between">
              <span className="text-[0.5rem] tracking-[0.15em] uppercase text-primary/40">
                Homepage Widget
              </span>
              <span
                className={`text-[0.5rem] tracking-[0.15em] uppercase font-medium ${
                  widget.enabled ? "text-emerald-600" : "text-primary/30"
                }`}
              >
                {widget.enabled ? "Visible" : "Hidden"}
              </span>
            </div>
          </div>

          {/* Product badge */}
          {widget.featuredProductId && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex items-center gap-2 px-3 py-2 bg-white border border-primary/10 rounded-sm"
            >
              <Package className="w-3 h-3 text-secondary-terra" strokeWidth={1.75} />
              <span className="text-[0.6875rem] text-primary/60">
                Linked to:{" "}
                <span className="text-primary font-medium">
                  {products.find((p) => p._id === widget.featuredProductId)
                    ?.name || "Unknown"}
                </span>
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
