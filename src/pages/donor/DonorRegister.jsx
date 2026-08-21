import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion"
import { ArrowUpRight, User, Mail, Lock, Eye, EyeOff, Phone } from "lucide-react"
import { donorApi, setDonorSession, getDonorToken } from "../../lib/donorAuth"
import PolicyConsent from "../../components/ui/PolicyConsent"
import smallLogo from "../../assets/images/Homepage/smalllogo.png"
import Quatrefoil from "../../admin/components/Quatrefoil"
import DottedDivider from "../../admin/components/DottedDivider"

import float1 from "../../assets/images/About/float1.png"
import float2 from "../../assets/images/About/float2.png"
import ornament1 from "../../assets/images/Homepage/Ornament_1.png"

const floatingIcons = [
  { src: float2, top: "-4%", right: "-2%", size: "w-36 md:w-48 lg:w-64", parallaxFactor: 1.2, rotate: 0 },
  { src: ornament1, top: "40%", right: "2%", size: "w-20 md:w-28 lg:w-36", parallaxFactor: 0.8, rotate: 12 },
  { src: float1, bottom: "4%", left: "2%", size: "w-28 md:w-36 lg:w-48", parallaxFactor: 1.0, rotate: 0 },
  { src: float2, top: "8%", left: "3%", size: "w-16 md:w-20 lg:w-24", parallaxFactor: 0.6, rotate: 20, opacity: 0.5 },
]

function FloatingIcon({ piece, springX, springY, delay }) {
  const mx = useTransform(springX, (v) => -v * piece.parallaxFactor * 20)
  const my = useTransform(springY, (v) => -v * piece.parallaxFactor * 10)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: piece.opacity ?? 0.85, scale: 1 }}
      transition={{ duration: 1.2, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={`${piece.size} absolute pointer-events-none`}
      style={{
        top: piece.top,
        right: piece.right,
        bottom: piece.bottom,
        left: piece.left,
        x: mx,
        y: my,
        rotate: piece.rotate,
      }}
    >
      <img src={piece.src} alt="" className="w-full h-auto drop-shadow-2xl" />
    </motion.div>
  )
}

export default function DonorRegister() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  })
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 })

  useEffect(() => {
    function onMove(e) {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      mouseX.set(x)
      mouseY.set(y)
    }
    window.addEventListener("mousemove", onMove)
    return () => window.removeEventListener("mousemove", onMove)
  }, [mouseX, mouseY])

  useEffect(() => {
    if (getDonorToken()) navigate("/donor", { replace: true })
  }, [navigate])

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError("")
    try {
      const { token, donor } = await donorApi.register(form)
      setDonorSession(token, donor)
      navigate("/donor", { replace: true })
    } catch (err) {
      setError(err.message || "Registration failed")
    } finally {
      setBusy(false)
    }
  }

  const fieldClass = (name) =>
    `relative flex items-center gap-3 rounded-md px-4 py-3 border transition-all duration-300 ${
      focusedField === name
        ? "border-secondary-terra bg-white shadow-[0_0_0_3px_rgba(193,92,69,0.08)]"
        : "border-primary/12 bg-white/60 hover:border-primary/25"
    }`

  const iconClass = (name) =>
    `flex-shrink-0 w-4 h-4 transition-colors duration-300 ${
      focusedField === name ? "text-secondary-terra" : "text-primary/30"
    }`

  return (
    <div className="relative min-h-screen bg-bg-deep text-accent-cream flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[37.5rem] h-[37.5rem] bg-bg-teal/15 rounded-full blur-[120px]" />
      </div>

      {/* Floating ornament icons */}
      {floatingIcons.map((piece, i) => (
        <FloatingIcon key={i} piece={piece} springX={springX} springY={springY} delay={0.2 + i * 0.15} />
      ))}

      {/* Logo watermark */}
      <div className="absolute bottom-6 left-6 opacity-60 hidden md:block z-10">
        <img src={smallLogo} alt="" className="h-7 w-auto" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Section label */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Quatrefoil className="w-3 h-3" />
            <span className="text-[0.625rem] font-normal tracking-[0.25em] uppercase text-secondary-terra">
              Donor Portal
            </span>
          </div>
          <DottedDivider color="rgba(215,184,147,0.4)" />
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-3xl md:text-4xl font-display font-medium tracking-tight leading-[1.1] mb-2"
        >
          Create your account
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-sm text-accent-cream/60 mb-8"
        >
          Register to track your donations, download receipts, and manage subscriptions.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          onSubmit={onSubmit}
          className="bg-accent-cream rounded-md p-8 md:p-10 shadow-2xl shadow-black/30"
        >
          {/* Name fields */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-[0.625rem] tracking-[0.2em] uppercase text-primary/50 mb-2 font-barlow font-semibold">
                First Name
              </label>
              <div className={fieldClass("firstName")}>
                <User strokeWidth={1.8} className={iconClass("firstName")} />
                <input
                  type="text"
                  required
                  value={form.firstName}
                  onChange={set("firstName")}
                  onFocus={() => setFocusedField("firstName")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="First"
                  className="w-full bg-transparent text-sm text-primary placeholder:text-primary/30 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-[0.625rem] tracking-[0.2em] uppercase text-primary/50 mb-2 font-barlow font-semibold">
                Last Name
              </label>
              <div className={fieldClass("lastName")}>
                <User strokeWidth={1.8} className={iconClass("lastName")} />
                <input
                  type="text"
                  required
                  value={form.lastName}
                  onChange={set("lastName")}
                  onFocus={() => setFocusedField("lastName")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Last"
                  className="w-full bg-transparent text-sm text-primary placeholder:text-primary/30 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="block text-[0.625rem] tracking-[0.2em] uppercase text-primary/50 mb-2 font-barlow font-semibold">
              Email
            </label>
            <div className={fieldClass("email")}>
              <Mail strokeWidth={1.8} className={iconClass("email")} />
              <input
                type="email"
                required
                value={form.email}
                onChange={set("email")}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                placeholder="you@example.com"
                className="w-full bg-transparent text-sm text-primary placeholder:text-primary/30 focus:outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-[0.625rem] tracking-[0.2em] uppercase text-primary/50 mb-2 font-barlow font-semibold">
              Password
            </label>
            <div className={fieldClass("password")}>
              <Lock strokeWidth={1.8} className={iconClass("password")} />
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={form.password}
                onChange={set("password")}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                placeholder="Min. 8 characters"
                className="w-full bg-transparent text-sm text-primary placeholder:text-primary/30 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                className="flex-shrink-0 text-primary/30 hover:text-primary/60 transition-colors duration-200"
              >
                {showPassword ? (
                  <EyeOff strokeWidth={1.8} className="w-4 h-4" />
                ) : (
                  <Eye strokeWidth={1.8} className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Phone */}
          <div className="mb-8">
            <label className="block text-[0.625rem] tracking-[0.2em] uppercase text-primary/50 mb-2 font-barlow font-semibold">
              Phone <span className="text-primary/30 normal-case tracking-normal">(optional)</span>
            </label>
            <div className={fieldClass("phone")}>
              <Phone strokeWidth={1.8} className={iconClass("phone")} />
              <input
                type="tel"
                value={form.phone}
                onChange={set("phone")}
                onFocus={() => setFocusedField("phone")}
                onBlur={() => setFocusedField(null)}
                placeholder="+61 400 000 000"
                className="w-full bg-transparent text-sm text-primary placeholder:text-primary/30 focus:outline-none"
              />
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-secondary-terra mb-5 flex items-center gap-1.5"
              role="alert"
            >
              <span className="inline-block w-1 h-1 rounded-full bg-secondary-terra flex-shrink-0" />
              {error}
            </motion.p>
          )}

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            type="submit"
            disabled={busy}
            className="group relative w-full inline-flex items-center justify-center gap-1.5 px-6 py-3.5 bg-primary disabled:opacity-60 text-white font-barlow text-[0.6875rem] font-semibold tracking-[0.15em] uppercase rounded-sm overflow-hidden"
          >
            <span className="relative z-10">
              {busy ? "Creating account…" : "Create account"}
            </span>
            {!busy && (
              <span className="relative z-10 inline-flex overflow-hidden w-3.5 h-3.5">
                <ArrowUpRight
                  strokeWidth={2.5}
                  className="absolute inset-0 w-full h-full transition-transform duration-300 ease-out group-hover:translate-x-full group-hover:-translate-y-full"
                />
                <ArrowUpRight
                  strokeWidth={2.5}
                  className="absolute inset-0 w-full h-full -translate-x-full translate-y-full transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0"
                />
              </span>
            )}
            <span className="absolute inset-0 bg-secondary-terra origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
          </motion.button>

          <PolicyConsent
            action="creating an account"
            tone="light"
            className="mt-4 text-center"
          />

          {/* Login link */}
          <p className="text-center text-[0.8125rem] text-primary/50 mt-6">
            Already have an account?{" "}
            <Link
              to="/donor/login"
              className="text-secondary-terra hover:text-secondary-rust font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </motion.form>

        {/* Back to site */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-center"
        >
          <Link
            to="/"
            className="text-[0.6875rem] text-accent-cream/40 hover:text-accent-cream/70 transition-colors"
          >
            ← Back to MIAA website
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
