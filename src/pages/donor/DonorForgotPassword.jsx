import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion"
import { ArrowUpRight, Mail, Lock, Eye, EyeOff, KeyRound, CheckCircle } from "lucide-react"
import { donorApi, getDonorToken } from "../../lib/donorAuth"
import smallLogo from "../../assets/images/Homepage/smalllogo.png"
import Quatrefoil from "../../admin/components/Quatrefoil"
import DottedDivider from "../../admin/components/DottedDivider"

import float1 from "../../assets/images/About/float1.png"
import float2 from "../../assets/images/About/float2.png"
import ornament1 from "../../assets/images/Homepage/Ornament_1.png"

const floatingIcons = [
  { src: float2, top: "-4%", right: "-2%", size: "w-36 md:w-48 lg:w-64", parallaxFactor: 1.2, rotate: 0 },
  { src: ornament1, top: "35%", right: "2%", size: "w-20 md:w-28 lg:w-36", parallaxFactor: 0.8, rotate: 12 },
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
      style={{ top: piece.top, right: piece.right, bottom: piece.bottom, left: piece.left, x: mx, y: my, rotate: piece.rotate }}
    >
      <img src={piece.src} alt="" className="w-full h-auto drop-shadow-2xl" />
    </motion.div>
  )
}

// ── Step indicator ──────────────────────────────────────────────

function StepIndicator({ step }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center gap-2">
          <motion.div
            animate={{
              backgroundColor: step >= s ? "#C15C45" : "rgba(193,92,69,0.15)",
              scale: step === s ? 1.15 : 1,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="w-2 h-2 rounded-full"
          />
          {s < 3 && (
            <div
              className="w-8 h-[1.5px]"
              style={{
                background: step > s ? "#C15C45" : "rgba(33,73,82,0.12)",
                transition: "background 0.3s",
              }}
            />
          )}
        </div>
      ))}
      <span className="ml-2 text-[0.5625rem] tracking-[0.2em] uppercase text-primary/40">
        {step === 1 ? "Email" : step === 2 ? "Verify" : "Done"}
      </span>
    </div>
  )
}

// ── Code input (6 individual boxes) ─────────────────────────────

function CodeInput({ value, onChange }) {
  const inputsRef = useRef([])

  const handleChange = (i, char) => {
    if (!/^\d?$/.test(char)) return
    const arr = value.split("")
    arr[i] = char
    const next = arr.join("").slice(0, 6)
    onChange(next)
    if (char && i < 5) inputsRef.current[i + 1]?.focus()
  }

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !value[i] && i > 0) {
      inputsRef.current[i - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    onChange(pasted)
    const focusIdx = Math.min(pasted.length, 5)
    inputsRef.current[focusIdx]?.focus()
  }

  return (
    <div className="flex justify-center gap-2.5">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={i === 0 ? handlePaste : undefined}
          className="w-11 h-13 text-center text-xl font-medium text-primary bg-white/60 border border-primary/12 rounded-lg focus:border-secondary-terra focus:shadow-[0_0_0_3px_rgba(193,92,69,0.08)] focus:outline-none transition-all"
        />
      ))}
    </div>
  )
}

// ── Main Component ──────────────────────────────────────────────

export default function DonorForgotPassword() {
  const [step, setStep] = useState(1) // 1=email, 2=code+password, 3=done
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (getDonorToken()) navigate("/donor", { replace: true })
  }, [navigate])

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

  const sendCode = async (e) => {
    e.preventDefault()
    if (!email) return
    setBusy(true)
    setError("")
    try {
      await donorApi.forgotPassword(email)
      setStep(2)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const resetPassword = async (e) => {
    e.preventDefault()
    if (code.length !== 6 || !newPassword) return
    setBusy(true)
    setError("")
    try {
      await donorApi.resetPassword(email, code, newPassword)
      setStep(3)
    } catch (err) {
      setError(err.message)
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
    <div className="relative min-h-screen bg-bg-deep text-accent-cream flex items-center justify-center px-4 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[37.5rem] h-[37.5rem] bg-bg-teal/15 rounded-full blur-[120px]" />
      </div>

      {floatingIcons.map((piece, i) => (
        <FloatingIcon key={i} piece={piece} springX={springX} springY={springY} delay={0.2 + i * 0.15} />
      ))}

      <div className="absolute bottom-6 left-6 opacity-60 hidden md:block z-10">
        <img src={smallLogo} alt="" className="h-7 w-auto" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Label */}
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
          {step === 3 ? "All set" : "Reset password"}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-sm text-accent-cream/60 mb-8"
        >
          {step === 1 && "Enter your email and we'll send you a one-time verification code."}
          {step === 2 && `We sent a 6-digit code to ${email}. Enter it below with your new password.`}
          {step === 3 && "Your password has been reset. You can now sign in."}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="bg-accent-cream rounded-md p-8 md:p-10 shadow-2xl shadow-black/30"
        >
          <StepIndicator step={step} />

          <AnimatePresence mode="wait">
            {/* ── Step 1: Email ──────────────────────────── */}
            {step === 1 && (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={sendCode}
              >
                <div className="mb-8">
                  <label className="block text-[0.625rem] tracking-[0.2em] uppercase text-primary/50 mb-2 font-barlow font-semibold">
                    Email Address
                  </label>
                  <div className={fieldClass("email")}>
                    <Mail strokeWidth={1.8} className={iconClass("email")} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="you@example.com"
                      className="w-full bg-transparent text-sm text-primary placeholder:text-primary/30 focus:outline-none"
                    />
                  </div>
                </div>

                {error && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-secondary-terra mb-5 flex items-center gap-1.5">
                    <span className="inline-block w-1 h-1 rounded-full bg-secondary-terra" />
                    {error}
                  </motion.p>
                )}

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  type="submit"
                  disabled={busy}
                  className="group relative w-full inline-flex items-center justify-center gap-1.5 px-6 py-3.5 bg-primary disabled:opacity-60 text-white font-barlow text-[0.6875rem] font-semibold tracking-[0.15em] uppercase rounded-sm overflow-hidden"
                >
                  <span className="relative z-10">{busy ? "Sending…" : "Send code"}</span>
                  {!busy && (
                    <span className="relative z-10 inline-flex overflow-hidden w-3.5 h-3.5">
                      <ArrowUpRight strokeWidth={2.5} className="absolute inset-0 w-full h-full transition-transform duration-300 ease-out group-hover:translate-x-full group-hover:-translate-y-full" />
                      <ArrowUpRight strokeWidth={2.5} className="absolute inset-0 w-full h-full -translate-x-full translate-y-full transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0" />
                    </span>
                  )}
                  <span className="absolute inset-0 bg-secondary-terra origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                </motion.button>
              </motion.form>
            )}

            {/* ── Step 2: Code + New Password ────────────── */}
            {step === 2 && (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={resetPassword}
              >
                <div className="mb-6">
                  <label className="block text-[0.625rem] tracking-[0.2em] uppercase text-primary/50 mb-3 font-barlow font-semibold text-center">
                    Verification Code
                  </label>
                  <CodeInput value={code} onChange={setCode} />
                  <p className="text-center text-[0.6875rem] text-primary/40 mt-3">
                    Didn't receive it?{" "}
                    <button
                      type="button"
                      onClick={sendCode}
                      className="text-secondary-terra hover:text-secondary-rust font-medium transition-colors"
                    >
                      Resend
                    </button>
                  </p>
                </div>

                <div className="mb-8">
                  <label className="block text-[0.625rem] tracking-[0.2em] uppercase text-primary/50 mb-2 font-barlow font-semibold">
                    New Password
                  </label>
                  <div className={fieldClass("newPassword")}>
                    <Lock strokeWidth={1.8} className={iconClass("newPassword")} />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      onFocus={() => setFocusedField("newPassword")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Min. 8 characters"
                      className="w-full bg-transparent text-sm text-primary placeholder:text-primary/30 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      tabIndex={-1}
                      className="flex-shrink-0 text-primary/30 hover:text-primary/60 transition-colors"
                    >
                      {showPassword ? <EyeOff strokeWidth={1.8} className="w-4 h-4" /> : <Eye strokeWidth={1.8} className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-secondary-terra mb-5 flex items-center gap-1.5">
                    <span className="inline-block w-1 h-1 rounded-full bg-secondary-terra" />
                    {error}
                  </motion.p>
                )}

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  type="submit"
                  disabled={busy || code.length !== 6}
                  className="group relative w-full inline-flex items-center justify-center gap-1.5 px-6 py-3.5 bg-primary disabled:opacity-60 text-white font-barlow text-[0.6875rem] font-semibold tracking-[0.15em] uppercase rounded-sm overflow-hidden"
                >
                  <span className="relative z-10">{busy ? "Resetting…" : "Reset password"}</span>
                  {!busy && (
                    <span className="relative z-10 inline-flex overflow-hidden w-3.5 h-3.5">
                      <ArrowUpRight strokeWidth={2.5} className="absolute inset-0 w-full h-full transition-transform duration-300 ease-out group-hover:translate-x-full group-hover:-translate-y-full" />
                      <ArrowUpRight strokeWidth={2.5} className="absolute inset-0 w-full h-full -translate-x-full translate-y-full transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0" />
                    </span>
                  )}
                  <span className="absolute inset-0 bg-secondary-terra origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                </motion.button>
              </motion.form>
            )}

            {/* ── Step 3: Success ─────────────────────────── */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center py-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                  className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/15 mb-5"
                >
                  <CheckCircle className="w-7 h-7 text-emerald-500" />
                </motion.div>
                <p className="text-sm text-primary/70 mb-6">
                  Your password has been updated successfully.
                </p>
                <Link
                  to="/donor/login"
                  className="group relative inline-flex items-center justify-center gap-1.5 px-8 py-3.5 bg-primary text-white font-barlow text-[0.6875rem] font-semibold tracking-[0.15em] uppercase rounded-sm overflow-hidden"
                >
                  <span className="relative z-10">Sign in</span>
                  <span className="relative z-10 inline-flex overflow-hidden w-3.5 h-3.5">
                    <ArrowUpRight strokeWidth={2.5} className="absolute inset-0 w-full h-full transition-transform duration-300 ease-out group-hover:translate-x-full group-hover:-translate-y-full" />
                    <ArrowUpRight strokeWidth={2.5} className="absolute inset-0 w-full h-full -translate-x-full translate-y-full transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0" />
                  </span>
                  <span className="absolute inset-0 bg-secondary-terra origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Bottom links */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-6 flex items-center justify-between">
          <Link to="/donor/login" className="text-[0.6875rem] text-accent-cream/40 hover:text-accent-cream/70 transition-colors">
            ← Back to sign in
          </Link>
          <Link to="/" className="text-[0.6875rem] text-accent-cream/40 hover:text-accent-cream/70 transition-colors">
            MIAA website
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
