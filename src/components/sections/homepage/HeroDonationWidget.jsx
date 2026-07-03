import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Heart } from "lucide-react"
import { api } from "../../../lib/api"

export default function HeroDonationWidget() {
  const [widget, setWidget] = useState(null)
  const [selectedAmount, setSelectedAmount] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    api
      .siteSettings()
      .then((settings) => {
        if (!controller.signal.aborted && settings?.donationWidget?.enabled) {
          setWidget(settings.donationWidget)
          const amounts = settings.donationWidget.presetAmounts
          if (amounts?.length > 0) {
            setSelectedAmount(amounts[1] || amounts[0])
          }
        }
      })
      .catch(() => {})
    return () => controller.abort()
  }, [])

  if (!widget) return null

  const presets = widget.presetAmounts || [2500, 5000, 10000, 25000]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="w-full sm:w-[340px] lg:w-[360px] 3xl:w-[420px] bg-black/30 backdrop-blur-md border border-white/15 rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <p className="text-[0.5625rem] tracking-[0.25em] uppercase text-accent-wheat/90 font-semibold mb-1">
          {widget.headline || "Support MIAA"}
        </p>
        <p className="text-[0.75rem] text-white/60 leading-relaxed line-clamp-2">
          {widget.description}
        </p>
      </div>

      {/* Donate card body */}
      <div className="px-5 pb-5">
        <p className="text-[0.5rem] tracking-[0.2em] uppercase text-white/40 mb-2.5">
          Choose an amount
        </p>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {presets.slice(0, 4).map((amt) => (
            <button
              key={amt}
              onClick={() => setSelectedAmount(amt)}
              className={`py-2 rounded-lg text-[0.75rem] font-medium transition-all duration-200 ${
                selectedAmount === amt
                  ? "bg-secondary-terra text-white shadow-md shadow-secondary-terra/30"
                  : "bg-white/10 text-white/75 hover:bg-white/20"
              }`}
            >
              ${(amt / 100).toLocaleString()}
            </button>
          ))}
        </div>

        <Link
          to={`/donate/checkout${
            selectedAmount ? `?amount=${selectedAmount}` : ""
          }${
            widget.featuredProductId
              ? `${selectedAmount ? "&" : "?"}product=${widget.featuredProductId}`
              : ""
          }`}
          className="w-full py-3 bg-secondary-terra hover:bg-secondary-rust text-white text-[0.8125rem] font-medium tracking-wide rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <Heart className="w-3.5 h-3.5" />
          {widget.ctaLabel || "Donate Now"}
        </Link>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
          <Link
            to="/donate"
            className="text-[0.625rem] text-white/40 hover:text-white/70 transition-colors"
          >
            All causes
          </Link>
          <Link
            to="/donor/login"
            className="text-[0.625rem] text-white/40 hover:text-white/70 transition-colors"
          >
            Donor Portal
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
