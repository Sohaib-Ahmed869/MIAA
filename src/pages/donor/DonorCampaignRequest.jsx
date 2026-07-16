import { useState } from "react"
import { Link } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import {
  CheckCircle2,
  Check,
  ImagePlus,
  X,
  Loader2,
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  Type,
  Image as ImageIcon,
  FileText,
  Target,
  Send,
  Megaphone,
  Sparkles,
} from "lucide-react"
import { donorApi, uploadDonorImage } from "../../lib/donorAuth"
import ContentBuilder from "../../components/campaign/ContentBuilder"

const STEPS = [
  { key: "basics", label: "Basics", desc: "Name & summary", icon: Type },
  { key: "details", label: "Details", desc: "Image & goal", icon: ImageIcon },
  { key: "story", label: "Story", desc: "Full content", icon: FileText },
  { key: "review", label: "Review", desc: "Confirm & submit", icon: CheckCircle2 },
]

const inputCls =
  "w-full py-3 pl-11 pr-4 bg-white border border-primary/12 text-primary rounded-lg text-sm placeholder:text-primary/30 focus:border-secondary-terra focus:shadow-[0_0_0_3px_rgba(193,92,69,0.08)] focus:outline-none transition-all"
const labelCls =
  "block text-[0.625rem] tracking-[0.2em] uppercase text-primary/50 mb-2 font-barlow font-semibold"

const panelVariants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 42 : -42 }),
  center: { opacity: 1, x: 0 },
  exit: (dir) => ({ opacity: 0, x: dir > 0 ? -42 : 42 }),
}

function FieldIcon({ icon: Icon }) {
  return (
    <Icon
      className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/30 pointer-events-none"
      strokeWidth={1.8}
    />
  )
}

export default function DonorCampaignRequest() {
  const [form, setForm] = useState({ title: "", description: "", suggestedGoal: "" })
  const [contentBlocks, setContentBlocks] = useState([])
  const [imageKey, setImageKey] = useState("")
  const [imagePreview, setImagePreview] = useState("")
  const [uploading, setUploading] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [justSubmitted, setJustSubmitted] = useState(false)

  const [[step, direction], setStep] = useState([0, 0])
  const go = (next) => setStep([next, next > step ? 1 : -1])

  const canProceed = [
    form.title.trim() && form.description.trim(), // basics
    true, // details
    true, // story
    true, // review
  ]

  const handleImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.")
      return
    }
    setError("")
    setUploading(true)
    setImagePreview(URL.createObjectURL(file))
    try {
      const key = await uploadDonorImage(file)
      setImageKey(key)
    } catch (err) {
      setError(err.message)
      setImagePreview("")
    } finally {
      setUploading(false)
    }
  }

  const removeImage = () => {
    setImageKey("")
    setImagePreview("")
  }

  const handleSubmit = async () => {
    setBusy(true)
    setError("")
    try {
      await donorApi.requestCampaign({
        title: form.title,
        description: form.description,
        suggestedGoal: form.suggestedGoal
          ? Math.round(parseFloat(form.suggestedGoal) * 100)
          : 0,
        imageKey: imageKey || undefined,
        contentBlocks,
      })
      setForm({ title: "", description: "", suggestedGoal: "" })
      setContentBlocks([])
      removeImage()
      setJustSubmitted(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  // ── Success screen ────────────────────────────────────────
  if (justSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative overflow-hidden rounded-2xl bg-white border border-primary/10 shadow-sm shadow-primary/5 p-8 md:p-12 text-center"
        >
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
          <motion.span
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 18 }}
            className="relative grid place-items-center w-16 h-16 mx-auto rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 mb-5"
          >
            <Check className="w-8 h-8" strokeWidth={3} />
          </motion.span>
          <h2 className="relative text-2xl md:text-3xl text-primary tracking-tight mb-2" style={{ fontFamily: "var(--font-display)" }}>
            Request submitted
          </h2>
          <p className="relative text-sm text-primary/55 max-w-md mx-auto mb-7">
            Thank you — our team will review your campaign and email you once it's
            been approved and listed on the donations page.
          </p>
          <div className="relative flex items-center justify-center gap-3 flex-wrap">
            <Link
              to="/donor/campaigns"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-secondary-terra hover:bg-secondary-rust text-white text-[0.625rem] tracking-[0.18em] uppercase font-semibold shadow-sm shadow-secondary-terra/30 transition-colors"
            >
              Track in My Campaigns
              <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.5} />
            </Link>
            <button
              onClick={() => {
                setJustSubmitted(false)
                setStep([0, -1])
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-primary/15 text-primary text-[0.625rem] tracking-[0.18em] uppercase font-semibold hover:border-primary/35 transition-colors"
            >
              Request another
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  const progress = (step / (STEPS.length - 1)) * 100

  return (
    <div className="max-w-5xl">
      {/* Intro banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative overflow-hidden rounded-2xl bg-bg-deep text-accent-cream p-6 md:p-7 mb-6"
      >
        <div className="absolute -top-16 -right-8 w-56 h-56 bg-secondary-terra/25 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex items-start gap-4">
          <span className="grid place-items-center w-11 h-11 rounded-xl bg-secondary-terra text-white shadow-lg shadow-black/20 flex-shrink-0">
            <Megaphone className="w-5 h-5" strokeWidth={1.9} />
          </span>
          <div>
            <h2 className="text-xl md:text-2xl leading-tight tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              Start a Campaign
            </h2>
            <p className="text-xs md:text-sm text-accent-cream/60 mt-1 max-w-lg">
              Suggest a fundraising cause you care about. Once approved, it goes
              live on the donations page for others to support.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[15rem_1fr] gap-6 items-start">
        {/* ── Stepper rail (desktop) ─────────────────────── */}
        <aside className="hidden lg:block lg:sticky lg:top-24">
          <ol className="relative">
            {STEPS.map((s, i) => {
              const done = i < step
              const active = i === step
              return (
                <li key={s.key} className="relative flex gap-3.5 pb-8 last:pb-0">
                  {/* connector */}
                  {i < STEPS.length - 1 && (
                    <span className="absolute left-[1.05rem] top-9 bottom-1 w-px bg-primary/10">
                      <motion.span
                        className="absolute inset-x-0 top-0 bg-secondary-terra origin-top"
                        initial={false}
                        animate={{ scaleY: done ? 1 : 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        style={{ height: "100%" }}
                      />
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => i <= step && go(i)}
                    disabled={i > step}
                    className={`relative z-10 grid place-items-center w-[2.1rem] h-[2.1rem] rounded-full flex-shrink-0 transition-colors duration-300 ${
                      active
                        ? "bg-secondary-terra text-white shadow-md shadow-secondary-terra/30 ring-4 ring-secondary-terra/12"
                        : done
                        ? "bg-secondary-terra/90 text-white"
                        : "bg-white text-primary/40 border border-primary/15"
                    } ${i <= step ? "cursor-pointer" : "cursor-default"}`}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {done ? (
                        <motion.span key="c" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                          <Check className="w-4 h-4" strokeWidth={3} />
                        </motion.span>
                      ) : (
                        <motion.span key="i" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                          <s.icon className="w-4 h-4" strokeWidth={2} />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                  <div className="pt-1">
                    <p className={`text-[0.5rem] tracking-[0.2em] uppercase mb-0.5 ${active ? "text-secondary-terra" : "text-primary/35"}`}>
                      Step {i + 1}
                    </p>
                    <p className={`text-sm font-semibold leading-none ${active || done ? "text-primary" : "text-primary/45"}`}>
                      {s.label}
                    </p>
                    <p className="text-[0.6875rem] text-primary/40 mt-1">{s.desc}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </aside>

        {/* ── Step panel ─────────────────────────────────── */}
        <div className="bg-white border border-primary/10 rounded-2xl shadow-sm shadow-primary/5 overflow-hidden">
          {/* Mobile progress */}
          <div className="lg:hidden px-5 pt-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-primary">
                {STEPS[step].label}
              </p>
              <p className="text-[0.625rem] tracking-[0.15em] uppercase text-primary/40">
                Step {step + 1} / {STEPS.length}
              </p>
            </div>
            <div className="h-1.5 rounded-full bg-primary/8 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-secondary-terra"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              />
            </div>
          </div>

          <div className="p-5 md:p-8">
            {error && (
              <p className="text-xs text-rose-600 bg-rose-500/8 ring-1 ring-inset ring-rose-500/20 px-3.5 py-2.5 rounded-lg mb-5">
                {error}
              </p>
            )}

            <div className="relative min-h-[19rem]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={panelVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  {/* STEP 0 — Basics */}
                  {step === 0 && (
                    <div className="space-y-5">
                      <div>
                        <label className={labelCls}>Campaign Title</label>
                        <div className="relative">
                          <FieldIcon icon={Type} />
                          <input
                            type="text"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            placeholder="e.g. Education Fund for Young Artists"
                            className={inputCls}
                          />
                        </div>
                      </div>
                      <div>
                        <label className={labelCls}>Short Description</label>
                        <textarea
                          rows={6}
                          value={form.description}
                          onChange={(e) => setForm({ ...form, description: e.target.value })}
                          placeholder="Describe the purpose, who it helps, and why it matters…"
                          className={`${inputCls} pl-4 resize-none`}
                        />
                        <p className="text-[0.6875rem] text-primary/40 mt-1.5">
                          This appears as the summary on the campaign card.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* STEP 1 — Details */}
                  {step === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className={labelCls}>
                          Campaign Image{" "}
                          <span className="text-primary/30 normal-case tracking-normal">(optional)</span>
                        </label>
                        {imagePreview ? (
                          <div className="relative w-full">
                            <img
                              src={imagePreview}
                              alt="Campaign preview"
                              className="w-full aspect-[16/10] object-cover rounded-xl border border-primary/12"
                            />
                            {uploading && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
                                <Loader2 className="w-6 h-6 text-white animate-spin" />
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={removeImage}
                              className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-white/90 text-primary hover:bg-white shadow-sm"
                              aria-label="Remove image"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center gap-2 w-full aspect-[16/10] border-2 border-dashed border-primary/15 rounded-xl cursor-pointer hover:border-secondary-terra/50 hover:bg-primary/[0.02] transition-colors">
                            <ImagePlus className="w-6 h-6 text-primary/30" />
                            <span className="text-[0.75rem] text-primary/40">Click to upload</span>
                            <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
                          </label>
                        )}
                        <p className="text-[0.6875rem] text-primary/40 mt-2">
                          Landscape 16:9, ideally 1920×1080. JPG or PNG.
                        </p>
                      </div>

                      <div>
                        <label className={labelCls}>
                          Suggested Goal (AUD){" "}
                          <span className="text-primary/30 normal-case tracking-normal">(optional)</span>
                        </label>
                        <div className="relative">
                          <FieldIcon icon={Target} />
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={form.suggestedGoal}
                            onChange={(e) => setForm({ ...form, suggestedGoal: e.target.value })}
                            placeholder="10,000"
                            className={inputCls}
                          />
                        </div>
                        <div className="mt-4 p-4 rounded-xl bg-accent-cream/70 border border-primary/8">
                          <p className="text-[0.6875rem] text-primary/55 leading-relaxed flex gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-secondary-terra flex-shrink-0 mt-0.5" />
                            A clear goal helps supporters understand the impact. You
                            can leave this blank and our team will suggest one.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2 — Story */}
                  {step === 2 && (
                    <div>
                      <label className={labelCls}>
                        Campaign Content{" "}
                        <span className="text-primary/30 normal-case tracking-normal">(optional)</span>
                      </label>
                      <p className="text-[0.6875rem] text-primary/40 mb-3 -mt-1">
                        Tell the full story — add headings, paragraphs, images and
                        quotes. Sections appear on the campaign page once approved.
                      </p>
                      <ContentBuilder
                        value={contentBlocks}
                        onChange={setContentBlocks}
                        uploadImage={uploadDonorImage}
                      />
                    </div>
                  )}

                  {/* STEP 3 — Review */}
                  {step === 3 && (
                    <div className="space-y-4">
                      <p className="text-sm text-primary/55">
                        Review your campaign before submitting.
                      </p>
                      <div className="rounded-xl border border-primary/10 overflow-hidden">
                        {imagePreview && (
                          <img
                            src={imagePreview}
                            alt="Campaign"
                            className="w-full aspect-[16/7] object-cover"
                          />
                        )}
                        <div className="p-5 space-y-3">
                          <div>
                            <p className="text-[0.5625rem] tracking-[0.2em] uppercase text-primary/40 mb-1">Title</p>
                            <p className="text-base font-semibold text-primary">
                              {form.title || <span className="text-primary/30">Not set</span>}
                            </p>
                          </div>
                          <div>
                            <p className="text-[0.5625rem] tracking-[0.2em] uppercase text-primary/40 mb-1">Description</p>
                            <p className="text-sm text-primary/70 line-clamp-4">
                              {form.description || <span className="text-primary/30">Not set</span>}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2 pt-1">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-cream text-xs text-primary/70">
                              <Target className="w-3.5 h-3.5 text-secondary-terra" />
                              Goal:{" "}
                              <span className="font-semibold text-primary">
                                {form.suggestedGoal ? `$${Number(form.suggestedGoal).toLocaleString()}` : "TBC"}
                              </span>
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-cream text-xs text-primary/70">
                              <FileText className="w-3.5 h-3.5 text-secondary-terra" />
                              {contentBlocks.length} content block{contentBlocks.length === 1 ? "" : "s"}
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-cream text-xs text-primary/70">
                              <ImageIcon className="w-3.5 h-3.5 text-secondary-terra" />
                              {imagePreview ? "Image added" : "No image"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Footer nav */}
          <div className="flex items-center justify-between gap-3 px-5 md:px-8 py-4 border-t border-primary/8 bg-accent-cream/40">
            <button
              type="button"
              onClick={() => go(step - 1)}
              disabled={step === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[0.625rem] tracking-[0.18em] uppercase font-semibold text-primary/60 hover:text-primary hover:bg-primary/[0.04] transition-colors disabled:opacity-0 disabled:pointer-events-none"
            >
              <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2.5} /> Back
            </button>

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => canProceed[step] && go(step + 1)}
                disabled={!canProceed[step]}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-lg bg-primary hover:bg-bg-deep text-white text-[0.625rem] tracking-[0.18em] uppercase font-semibold shadow-sm shadow-primary/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
              </button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                type="button"
                onClick={handleSubmit}
                disabled={busy || uploading || !canProceed[0]}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-secondary-terra hover:bg-secondary-rust text-white text-[0.625rem] tracking-[0.18em] uppercase font-semibold shadow-sm shadow-secondary-terra/30 transition-colors disabled:opacity-50"
              >
                {busy ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Submitting…
                  </>
                ) : uploading ? (
                  "Uploading…"
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" strokeWidth={2.25} /> Submit Request
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Link out to the campaigns list */}
      <div className="mt-8 pt-6 border-t border-primary/8">
        <Link
          to="/donor/campaigns"
          className="group inline-flex items-center gap-1.5 text-[0.6875rem] tracking-[0.15em] uppercase text-secondary-terra hover:text-secondary-rust font-semibold transition-colors"
        >
          View all my campaigns &amp; their status
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2.5} />
        </Link>
      </div>
    </div>
  )
}
