import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { donorApi } from "../../lib/donorAuth"

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

  if (loading) return <div className="space-y-4 max-w-lg">{[1,2,3,4].map(i => <div key={i} className="h-14 rounded-sm bg-primary/5 animate-pulse" />)}</div>

  const inputCls = "w-full py-3 px-4 bg-white border border-primary/12 text-primary rounded-sm text-sm placeholder:text-primary/30 focus:border-secondary-terra focus:shadow-[0_0_0_3px_rgba(193,92,69,0.08)] focus:outline-none transition-all"

  return (
    <div className="max-w-lg">
      <h2 className="text-base text-primary tracking-tight mb-6" style={{ fontFamily: "var(--font-display)" }}>Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <p className="text-xs text-rose-600 bg-rose-50 px-3 py-2 rounded-sm">{error}</p>}
        {success && <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-emerald-600 bg-emerald-50 px-3 py-2 rounded-sm flex items-center gap-1.5"><Check className="w-3 h-3" /> {success}</motion.p>}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[0.625rem] tracking-[0.2em] uppercase text-primary/50 mb-2 font-barlow font-semibold">First Name</label>
            <input type="text" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className="block text-[0.625rem] tracking-[0.2em] uppercase text-primary/50 mb-2 font-barlow font-semibold">Last Name</label>
            <input type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className={inputCls} />
          </div>
        </div>
        <div>
          <label className="block text-[0.625rem] tracking-[0.2em] uppercase text-primary/50 mb-2 font-barlow font-semibold">Email</label>
          <input type="email" value={profile?.email || ""} disabled className={`${inputCls} opacity-50 cursor-not-allowed`} />
        </div>
        <div>
          <label className="block text-[0.625rem] tracking-[0.2em] uppercase text-primary/50 mb-2 font-barlow font-semibold">Phone</label>
          <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} />
        </div>
        <div className="border-t border-primary/10 pt-5">
          <p className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/50 mb-3 font-barlow font-semibold">Address</p>
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
        <button type="submit" disabled={busy} className="px-6 py-3 bg-secondary-terra hover:bg-secondary-rust text-white text-[0.6875rem] font-medium tracking-[0.15em] uppercase rounded-sm transition-colors disabled:opacity-50">
          {busy ? "Saving…" : "Save Profile"}
        </button>
      </form>
    </div>
  )
}
