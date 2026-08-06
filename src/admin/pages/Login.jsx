import { useState, useEffect } from "react"
import { useLocation, useNavigate, Navigate } from "react-router-dom"
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion"
import { ArrowUpRight, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { adminApi, setSession, getToken } from "../auth"
import smallLogo from "../../assets/images/Homepage/smalllogo.png"
import Quatrefoil from "../components/Quatrefoil"
import DottedDivider from "../components/DottedDivider"

import float1 from "../../assets/images/About/float1.png"
import float2 from "../../assets/images/About/float2.png"
import ornament1 from "../../assets/images/Homepage/Ornament_1.png"

const floatingIcons = [
  { src: float2, top: "-4%", right: "-2%", size: "w-36 md:w-48 lg:w-64", parallaxFactor: 1.2, rotate: 0 },
  { src: ornament1, top: "35%", right: "2%", size: "w-20 md:w-28 lg:w-36", parallaxFactor: 0.8, rotate: 12 },
  { src: float2, bottom: "6%", right: "5%", size: "w-24 md:w-32 lg:w-44", parallaxFactor: 1.4, rotate: -15 },
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

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || "/admin"

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

  // Already authenticated → skip the login page and go to the CMS
  if (getToken()) {
    return <Navigate to={from} replace />
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError("")
    try {
      const { token, admin } = await adminApi.login(email, password)
      setSession(token, admin)
      // Volunteers can only use the door check-in screen — send them there
      // regardless of where they were headed.
      const dest = admin?.role === "volunteer" ? "/admin/event-checkin" : from
      navigate(dest, { replace: true })
    } catch (err) {
      setError(err.message || "Login failed")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-bg-deep text-accent-cream flex items-center justify-center px-4 overflow-hidden">
      {/* Subtle radial glow behind form */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[37.5rem] h-[37.5rem] bg-bg-teal/15 rounded-full blur-[120px]" />
      </div>

      {/* Floating ornament icons with cursor-follow parallax */}
      {floatingIcons.map((piece, i) => (
        <FloatingIcon key={i} piece={piece} springX={springX} springY={springY} delay={0.2 + i * 0.15} />
      ))}

      {/* Bottom-left small logo watermark */}
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
              CMS Admin
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
          Welcome back
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-sm text-accent-cream/60 mb-8"
        >
          Sign in to manage Museum of Islamic Art Australia content.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          onSubmit={onSubmit}
          className="bg-accent-cream rounded-md p-8 md:p-10 shadow-2xl shadow-black/30"
        >
          {/* Email field */}
          <div className="mb-6">
            <label className="block text-[0.625rem] tracking-[0.2em] uppercase text-primary/50 mb-2 font-barlow font-semibold">
              Email
            </label>
            <div
              className={`relative flex items-center gap-3 rounded-md px-4 py-3 border transition-all duration-300 ${
                focusedField === "email"
                  ? "border-secondary-terra bg-white shadow-[0_0_0_3px_rgba(193,92,69,0.08)]"
                  : "border-primary/12 bg-white/60 hover:border-primary/25"
              }`}
            >
              <Mail
                strokeWidth={1.8}
                className={`flex-shrink-0 w-4 h-4 transition-colors duration-300 ${
                  focusedField === "email" ? "text-secondary-terra" : "text-primary/30"
                }`}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                required
                autoComplete="username"
                placeholder="you@example.com"
                className="w-full bg-transparent text-sm text-primary placeholder:text-primary/30 focus:outline-none"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="mb-8">
            <label className="block text-[0.625rem] tracking-[0.2em] uppercase text-primary/50 mb-2 font-barlow font-semibold">
              Password
            </label>
            <div
              className={`relative flex items-center gap-3 rounded-md px-4 py-3 border transition-all duration-300 ${
                focusedField === "password"
                  ? "border-secondary-terra bg-white shadow-[0_0_0_3px_rgba(193,92,69,0.08)]"
                  : "border-primary/12 bg-white/60 hover:border-primary/25"
              }`}
            >
              <Lock
                strokeWidth={1.8}
                className={`flex-shrink-0 w-4 h-4 transition-colors duration-300 ${
                  focusedField === "password" ? "text-secondary-terra" : "text-primary/30"
                }`}
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full bg-transparent text-sm text-primary placeholder:text-primary/30 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                className="flex-shrink-0 text-primary/30 hover:text-primary/60 transition-colors duration-200"
              >
                {showPassword ? <EyeOff strokeWidth={1.8} className="w-4 h-4" /> : <Eye strokeWidth={1.8} className="w-4 h-4" />}
              </button>
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

          {/* CTA-style sign in button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            type="submit"
            disabled={busy}
            className="group relative w-full inline-flex items-center justify-center gap-1.5 px-6 py-3.5 bg-primary disabled:opacity-60 text-white font-barlow text-[0.6875rem] font-semibold tracking-[0.15em] uppercase rounded-sm overflow-hidden"
          >
            <span className="relative z-10">{busy ? "Signing in…" : "Sign in"}</span>
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
        </motion.form>
      </motion.div>
    </div>
  )
}
