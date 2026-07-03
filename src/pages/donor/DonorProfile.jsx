import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { donorApi } from "../../lib/donorAuth"

export default function DonorProfile() {
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: { street: "", city: "", state: "", postcode: "", country: "Australia" },
  })
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const controller = new AbortController()
    donorApi
      .getProfile()
      .then((data) => {
        if (!controller.signal.aborted) {
          setProfile(data)
          setForm({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            phone: data.phone || "",
            address: {
              street: data.address?.street || "",
              city: data.address?.city || "",
              state: data.address?.state || "",
              postcode: data.address?.postcode || "",
              country: data.address?.country || "Australia",
            },
          })
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError("")
    setSuccess("")
    try {
      await donorApi.updateProfile(form)
      setSuccess("Profile updated")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const setAddr = (key) => (e) =>
    setForm({ ...form, address: { ...form.address, [key]: e.target.value } })

  if (loading) {
    return (
      <div className="space-y-4 max-w-lg">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-14 rounded-xl bg-white/[0.03] animate-pulse" />
        ))}
      </div>
    )
  }

  const inputCls =
    "w-full py-3 px-4 bg-white/[0.04] border border-white/10 text-accent-cream rounded-lg text-sm placeholder:text-accent-cream/25 focus:border-secondary-terra focus:shadow-[0_0_0_3px_rgba(193,92,69,0.1)] focus:outline-none transition-all"

  return (
    <div className="max-w-lg">
      <h2 className="text-lg font-medium text-accent-cream font-display mb-6">
        Profile
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <p className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 px-4 py-2.5 rounded-lg">
            {error}
          </p>
        )}
        {success && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 rounded-lg flex items-center gap-2"
          >
            <Check className="w-3.5 h-3.5" /> {success}
          </motion.p>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[0.5625rem] tracking-[0.2em] uppercase text-accent-cream/35 mb-1.5">
              First Name
            </label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-[0.5625rem] tracking-[0.2em] uppercase text-accent-cream/35 mb-1.5">
              Last Name
            </label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <label className="block text-[0.5625rem] tracking-[0.2em] uppercase text-accent-cream/35 mb-1.5">
            Email
          </label>
          <input type="email" value={profile?.email || ""} disabled className={`${inputCls} opacity-40 cursor-not-allowed`} />
        </div>

        <div>
          <label className="block text-[0.5625rem] tracking-[0.2em] uppercase text-accent-cream/35 mb-1.5">
            Phone
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={inputCls}
          />
        </div>

        <div className="border-t border-white/8 pt-5">
          <p className="text-[0.5625rem] tracking-[0.2em] uppercase text-accent-cream/35 mb-3">
            Address
          </p>
          <div className="space-y-3">
            <input type="text" placeholder="Street" value={form.address.street} onChange={setAddr("street")} className={inputCls} />
            <div className="grid grid-cols-2 gap-3">
              <input type="text" placeholder="City" value={form.address.city} onChange={setAddr("city")} className={inputCls} />
              <input type="text" placeholder="State" value={form.address.state} onChange={setAddr("state")} className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input type="text" placeholder="Postcode" value={form.address.postcode} onChange={setAddr("postcode")} className={inputCls} />
              <input type="text" placeholder="Country" value={form.address.country} onChange={setAddr("country")} className={inputCls} />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={busy}
          className="px-6 py-3 bg-secondary-terra hover:bg-secondary-rust text-white text-[0.6875rem] font-medium tracking-[0.15em] uppercase rounded-lg transition-colors disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save Profile"}
        </button>
      </form>
    </div>
  )
}
