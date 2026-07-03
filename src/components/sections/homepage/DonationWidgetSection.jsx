import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Heart } from "lucide-react"
import { api } from "../../../lib/api"
import { fadeInUp } from "../../../lib/motion"

export default function DonationWidgetSection() {
  const [widget, setWidget] = useState(null)
  const [selectedAmount, setSelectedAmount] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    api
      .siteSettings()
      .then((settings) => {
        if (!controller.signal.aborted && settings?.donationWidget?.enabled) {
          setWidget(settings.donationWidget)
          if (settings.donationWidget.presetAmounts?.length > 0) {
            setSelectedAmount(settings.donationWidget.presetAmounts[1] || settings.donationWidget.presetAmounts[0])
          }
        }
      })
      .catch(() => {})
    return () => controller.abort()
  }, [])

  if (!widget) return null

  const presets = widget.presetAmounts || [2500, 5000, 10000, 25000]

  return (
    <section className="py-16 md:py-24 3xl:py-32 bg-primary">
      <div className="max-w-[1400px] 3xl:max-w-[3200px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Text side */}
          <motion.div {...fadeInUp}>
            <p className="text-[0.6875rem] md:text-xs tracking-[0.25em] uppercase text-accent-wheat font-semibold mb-3">
              Support Our Mission
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl 3xl:text-5xl font-medium text-accent-cream tracking-tight leading-tight mb-4">
              {widget.headline}
            </h2>
            <p className="text-base md:text-lg 3xl:text-xl text-accent-cream/65 leading-relaxed max-w-lg">
              {widget.description}
            </p>
          </motion.div>

          {/* Quick donate card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="bg-white/8 border border-accent-cream/15 rounded-sm p-6 md:p-8 backdrop-blur-sm"
          >
            <p className="text-[0.625rem] tracking-[0.2em] uppercase text-accent-cream/50 mb-4">
              Choose an amount
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {presets.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setSelectedAmount(amt)}
                  className={`py-3 rounded-sm text-sm font-medium transition-all ${
                    selectedAmount === amt
                      ? "bg-secondary-terra text-white"
                      : "bg-white/10 text-accent-cream/80 hover:bg-white/15"
                  }`}
                >
                  ${(amt / 100).toLocaleString()}
                </button>
              ))}
            </div>

            <Link
              to={`/donate/checkout${
                selectedAmount ? `?amount=${selectedAmount}` : ""
              }${widget.featuredProductId ? `&product=${widget.featuredProductId}` : ""}`}
              className="w-full py-3.5 bg-secondary-terra hover:bg-secondary-rust text-white text-sm font-medium tracking-wide rounded-sm transition-colors flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4" />
              {widget.ctaLabel || "Donate Now"}
            </Link>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-accent-cream/10">
              <Link
                to="/donate"
                className="text-[0.6875rem] text-accent-cream/50 hover:text-accent-cream transition-colors underline underline-offset-4"
              >
                View all causes
              </Link>
              <Link
                to="/donor/login"
                className="text-[0.6875rem] text-accent-cream/50 hover:text-accent-cream transition-colors underline underline-offset-4"
              >
                Donor Portal
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
