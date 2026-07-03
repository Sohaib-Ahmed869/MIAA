import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { donorApi, setDonorSession } from "../../lib/donorAuth"
import { fadeInUp } from "../../lib/motion"

export default function DonorRegister() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  })
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError("")
    try {
      const { token, donor } = await donorApi.register(form)
      setDonorSession(token, donor)
      navigate("/donor", { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  return (
    <section className="bg-bg-deep min-h-screen flex items-center justify-center px-6 py-20">
      <motion.div {...fadeInUp} className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="text-[0.6875rem] tracking-[0.25em] uppercase text-accent-wheat font-semibold mb-2">
            Donor Portal
          </p>
          <h1 className="text-2xl md:text-3xl font-medium text-accent-cream tracking-tight">
            Create Account
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <p className="text-sm text-rose-400 bg-rose-500/10 px-4 py-2 rounded-sm">
              {error}
            </p>
          )}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder="First Name"
              value={form.firstName}
              onChange={set("firstName")}
              className="w-full py-3 px-4 bg-white/10 text-accent-cream border border-accent-cream/20 rounded-sm text-sm placeholder:text-accent-cream/30 focus:border-secondary-terra focus:outline-none transition-colors"
            />
            <input
              type="text"
              required
              placeholder="Last Name"
              value={form.lastName}
              onChange={set("lastName")}
              className="w-full py-3 px-4 bg-white/10 text-accent-cream border border-accent-cream/20 rounded-sm text-sm placeholder:text-accent-cream/30 focus:border-secondary-terra focus:outline-none transition-colors"
            />
          </div>
          <input
            type="email"
            required
            placeholder="Email Address"
            value={form.email}
            onChange={set("email")}
            className="w-full py-3 px-4 bg-white/10 text-accent-cream border border-accent-cream/20 rounded-sm text-sm placeholder:text-accent-cream/30 focus:border-secondary-terra focus:outline-none transition-colors"
          />
          <input
            type="password"
            required
            minLength={8}
            placeholder="Password (min 8 characters)"
            value={form.password}
            onChange={set("password")}
            className="w-full py-3 px-4 bg-white/10 text-accent-cream border border-accent-cream/20 rounded-sm text-sm placeholder:text-accent-cream/30 focus:border-secondary-terra focus:outline-none transition-colors"
          />
          <input
            type="tel"
            placeholder="Phone (optional)"
            value={form.phone}
            onChange={set("phone")}
            className="w-full py-3 px-4 bg-white/10 text-accent-cream border border-accent-cream/20 rounded-sm text-sm placeholder:text-accent-cream/30 focus:border-secondary-terra focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full py-3 bg-secondary-terra hover:bg-secondary-rust text-white text-sm font-medium tracking-wide rounded-sm transition-colors disabled:opacity-50"
          >
            {busy ? "Creating Account…" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-accent-cream/50 mt-6">
          Already have an account?{" "}
          <Link
            to="/donor/login"
            className="text-accent-cream/80 hover:text-accent-cream underline underline-offset-4 transition-colors"
          >
            Sign In
          </Link>
        </p>
      </motion.div>
    </section>
  )
}
