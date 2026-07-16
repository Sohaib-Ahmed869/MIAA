import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Check,
  User,
  Mail,
  Phone,
  MapPin,
  Home,
  Building2,
  Hash,
  Globe,
  Heart,
  CalendarDays,
} from "lucide-react"
import { donorApi } from "../../lib/donorAuth"

function initials(f, l) {
  const a = (f || "").trim().charAt(0)
  const b = (l || "").trim().charAt(0)
  return `${a}${b}`.toUpperCase() || "D"
}

// Labelled field with an optional leading icon
function Field({ label, icon: Icon, className = "", children }) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-[0.625rem] tracking-[0.2em] uppercase text-primary/50 mb-2 font-barlow font-semibold">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/30 pointer-events-none"
            strokeWidth={1.8}
          />
        )}
        {children}
      </div>
    </div>
  )
}

export default function DonorProfile() {
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({
    firstName: "", lastName: "", phone: "",
    address: { street: "", city: "", state: "", postcode: "", country: "Australia" },
  })
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const controller = new AbortController()
    donorApi.getProfile()
      .then((data) => {
        if (!controller.signal.aborted) {
          setProfile(data)
          setForm({
            firstName: data.firstName || "", lastName: data.lastName || "", phone: data.phone || "",
            address: { street: data.address?.street || "", city: data.address?.city || "", state: data.address?.state || "", postcode: data.address?.postcode || "", country: data.address?.country || "Australia" },
          })
        }
      })
      .catch(() => {})
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true); setError(""); setSuccess("")
    try {
      await donorApi.updateProfile(form)
      setSuccess("Profile updated")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) { setError(err.message) } finally { setBusy(false) }
  }

  const setAddr = (key) => (e) => setForm({ ...form, address: { ...form.address, [key]: e.target.value } })

  if (loading) {
    return (
      <div className="max-w-2xl space-y-4">
        <div className="h-28 rounded-2xl bg-primary/5 animate-pulse" />
        <div className="h-96 rounded-2xl bg-primary/5 animate-pulse" />
      </div>
    )
  }

  const inputCls = "w-full py-3 pl-11 pr-4 bg-white border border-primary/12 text-primary rounded-lg text-sm placeholder:text-primary/30 focus:border-secondary-terra focus:shadow-[0_0_0_3px_rgba(193,92,69,0.08)] focus:outline-none transition-all"

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-AU", { month: "short", year: "numeric" })
    : null

  return (
    <div className="max-w-6xl grid grid-cols-1 lg:grid-cols-[19rem_1fr] gap-5 items-start">
      {/* ── Profile summary card ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative overflow-hidden rounded-2xl bg-bg-deep text-accent-cream p-6 md:p-7 lg:sticky lg:top-24"
      >
        {/* soft glow */}
        <div className="absolute -top-16 -right-10 w-56 h-56 bg-secondary-terra/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex items-center gap-4 lg:flex-col lg:items-start lg:gap-4">
          <div className="grid place-items-center w-16 h-16 md:w-[4.5rem] md:h-[4.5rem] rounded-full bg-secondary-terra text-white text-xl font-semibold shadow-lg shadow-black/20 flex-shrink-0 ring-4 ring-white/10">
            {initials(form.firstName, form.lastName)}
          </div>
          <div className="min-w-0 flex-1 lg:w-full">
            <h2 className="text-2xl md:text-[1.6rem] leading-none tracking-tight truncate" style={{ fontFamily: "var(--font-display)" }}>
              {`${form.firstName} ${form.lastName}`.trim() || "Your Profile"}
            </h2>
            <p className="text-xs md:text-sm text-accent-cream/60 truncate mt-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.8} />
              {profile?.email}
            </p>
          </div>
        </div>

        {/* Stat chips */}
        <div className="relative flex flex-wrap gap-2.5 mt-5 lg:flex-col">
          <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/[0.06] ring-1 ring-inset ring-white/10 text-xs lg:w-full">
            <Heart className="w-3.5 h-3.5 text-secondary-terra flex-shrink-0" strokeWidth={2} />
            <span className="text-accent-cream/60">Total donated</span>
            <span className="font-semibold text-accent-cream tabular-nums lg:ml-auto">
              ${((profile?.totalDonated || 0) / 100).toLocaleString()}
            </span>
          </span>
          {memberSince && (
            <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/[0.06] ring-1 ring-inset ring-white/10 text-xs lg:w-full">
              <CalendarDays className="w-3.5 h-3.5 text-accent-wheat flex-shrink-0" strokeWidth={2} />
              <span className="text-accent-cream/60">Member since</span>
              <span className="font-semibold text-accent-cream lg:ml-auto">{memberSince}</span>
            </span>
          )}
        </div>
      </motion.div>

      {/* ── Edit form card ───────────────────────────────── */}
      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08, ease: [0.25, 0.1, 0.25, 1] }}
        onSubmit={handleSubmit}
        className="bg-white border border-primary/10 rounded-2xl p-6 md:p-8 shadow-sm shadow-primary/5 space-y-6"
      >
        {error && (
          <p className="text-xs text-rose-600 bg-rose-500/8 ring-1 ring-inset ring-rose-500/20 px-3.5 py-2.5 rounded-lg">
            {error}
          </p>
        )}
        {success && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-emerald-700 bg-emerald-500/10 ring-1 ring-inset ring-emerald-500/25 px-3.5 py-2.5 rounded-lg flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" /> {success}
          </motion.p>
        )}

        {/* Personal */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="grid place-items-center w-7 h-7 rounded-lg bg-accent-cream text-secondary-terra">
              <User className="w-3.5 h-3.5" strokeWidth={2} />
            </span>
            <h3 className="text-sm font-semibold text-primary tracking-tight">Personal details</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="First Name" icon={User}>
              <input type="text" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Last Name" icon={User}>
              <input type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className={inputCls} />
            </Field>
          </div>
        </section>

        <div className="h-px bg-primary/8" />

        {/* Contact */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="grid place-items-center w-7 h-7 rounded-lg bg-accent-cream text-secondary-terra">
              <Phone className="w-3.5 h-3.5" strokeWidth={2} />
            </span>
            <h3 className="text-sm font-semibold text-primary tracking-tight">Contact</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Email" icon={Mail}>
              <input type="email" value={profile?.email || ""} disabled className={`${inputCls} bg-accent-cream/60 text-primary/50 cursor-not-allowed`} />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[0.5rem] tracking-[0.15em] uppercase text-primary/30 bg-white px-1.5 py-0.5 rounded">
                Locked
              </span>
            </Field>
            <Field label="Phone" icon={Phone}>
              <input type="tel" placeholder="+61 400 000 000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} />
            </Field>
          </div>
        </section>

        <div className="h-px bg-primary/8" />

        {/* Address */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="grid place-items-center w-7 h-7 rounded-lg bg-accent-cream text-secondary-terra">
              <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
            </span>
            <h3 className="text-sm font-semibold text-primary tracking-tight">Address</h3>
          </div>
          <div className="space-y-4">
            <Field icon={Home}>
              <input type="text" placeholder="Street address" value={form.address.street} onChange={setAddr("street")} className={inputCls} />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field icon={Building2}>
                <input type="text" placeholder="City" value={form.address.city} onChange={setAddr("city")} className={inputCls} />
              </Field>
              <Field icon={MapPin}>
                <input type="text" placeholder="State" value={form.address.state} onChange={setAddr("state")} className={inputCls} />
              </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field icon={Hash}>
                <input type="text" placeholder="Postcode" value={form.address.postcode} onChange={setAddr("postcode")} className={inputCls} />
              </Field>
              <Field icon={Globe}>
                <input type="text" placeholder="Country" value={form.address.country} onChange={setAddr("country")} className={inputCls} />
              </Field>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-primary/8 -mx-6 md:-mx-8 px-6 md:px-8 pt-5">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            type="submit"
            disabled={busy}
            className="inline-flex items-center gap-2 px-6 py-3 bg-secondary-terra hover:bg-secondary-rust text-white text-[0.6875rem] font-semibold tracking-[0.15em] uppercase rounded-lg shadow-sm shadow-secondary-terra/30 transition-colors disabled:opacity-50"
          >
            {busy ? "Saving…" : (<><Check className="w-3.5 h-3.5" strokeWidth={2.5} /> Save Profile</>)}
          </motion.button>
        </div>
      </motion.form>
    </div>
  )
}
