import { useEffect, useState } from "react"
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
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const setAddr = (key) => (e) =>
    setForm({ ...form, address: { ...form.address, [key]: e.target.value } })

  if (loading) return <p className="text-primary/40 text-sm">Loading…</p>

  const inputCls =
    "w-full py-3 px-4 bg-white border border-primary/15 text-primary rounded-sm text-sm placeholder:text-primary/30 focus:border-secondary-terra focus:outline-none transition-colors"

  return (
    <div className="max-w-lg">
      <h2 className="text-lg font-medium text-primary mb-6">Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <p className="text-sm text-rose-600 bg-rose-50 px-4 py-2 rounded-sm">
            {error}
          </p>
        )}
        {success && (
          <p className="text-sm text-emerald-600 bg-emerald-50 px-4 py-2 rounded-sm">
            {success}
          </p>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/55 block mb-1">
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
            <label className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/55 block mb-1">
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
          <label className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/55 block mb-1">
            Email
          </label>
          <input type="email" value={profile?.email || ""} disabled className={`${inputCls} opacity-50`} />
        </div>

        <div>
          <label className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/55 block mb-1">
            Phone
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={inputCls}
          />
        </div>

        <div className="border-t border-primary/10 pt-5">
          <p className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/55 mb-3">
            Address
          </p>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Street"
              value={form.address.street}
              onChange={setAddr("street")}
              className={inputCls}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="City"
                value={form.address.city}
                onChange={setAddr("city")}
                className={inputCls}
              />
              <input
                type="text"
                placeholder="State"
                value={form.address.state}
                onChange={setAddr("state")}
                className={inputCls}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Postcode"
                value={form.address.postcode}
                onChange={setAddr("postcode")}
                className={inputCls}
              />
              <input
                type="text"
                placeholder="Country"
                value={form.address.country}
                onChange={setAddr("country")}
                className={inputCls}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={busy}
          className="px-6 py-3 bg-secondary-terra hover:bg-secondary-rust text-white text-sm font-medium tracking-wide rounded-sm transition-colors disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save Profile"}
        </button>
      </form>
    </div>
  )
}
