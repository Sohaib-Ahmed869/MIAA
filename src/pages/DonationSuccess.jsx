import { useEffect, useState } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { CheckCircle, Heart } from "lucide-react"
import { api } from "../lib/api"
import { fadeInUp } from "../lib/motion"
import CTAButton from "../components/ui/Button"

export default function DonationSuccess() {
  const [searchParams] = useSearchParams()
  const isPaypal = searchParams.get("paypal") === "1"
  const [upsellProducts, setUpsellProducts] = useState([])

  useEffect(() => {
    const controller = new AbortController()
    api.upsellProducts().then((prods) => {
      if (!controller.signal.aborted) setUpsellProducts(prods)
    }).catch(() => {})
    return () => controller.abort()
  }, [])

  return (
    <section className="bg-bg-deep min-h-screen">
      <div className="max-w-[800px] 3xl:max-w-[1000px] mx-auto px-6 md:px-10 pt-28 md:pt-32 pb-20 text-center">
        <motion.div {...fadeInUp}>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 mb-6"
          >
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </motion.div>

          <h1 className="text-2xl md:text-3xl 3xl:text-4xl font-medium text-accent-cream tracking-tight mb-4">
            Thank You for Your Generosity
          </h1>
          <p className="text-base md:text-lg text-accent-cream/65 max-w-xl mx-auto mb-8">
            Your donation has been received. A receipt will be sent to your email
            shortly. Your contribution makes a real difference in preserving and
            celebrating Islamic art and culture in Australia.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <CTAButton to="/donate">Make Another Donation</CTAButton>
            <Link
              to="/donor/login"
              className="text-sm text-accent-cream/60 hover:text-accent-cream transition-colors underline underline-offset-4"
            >
              Sign in to Donor Portal
            </Link>
          </div>
        </motion.div>

        {/* Upsell section */}
        {upsellProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <div className="border-t border-accent-cream/15 pt-12">
              <p className="text-[0.6875rem] tracking-[0.25em] uppercase text-accent-wheat font-semibold mb-2">
                Continue Making an Impact
              </p>
              <h2 className="text-xl md:text-2xl font-medium text-accent-cream mb-8">
                Other Causes You Can Support
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {upsellProducts.map((p) => (
                  <div
                    key={p._id}
                    className="bg-white/5 border border-accent-cream/15 rounded-sm p-5 text-left hover:border-secondary-terra/40 transition-all"
                  >
                    <span className="text-[0.5625rem] tracking-[0.2em] uppercase text-secondary-terra font-semibold">
                      {p.category}
                    </span>
                    <h3 className="text-base font-medium text-accent-cream mt-1 mb-2">
                      {p.name}
                    </h3>
                    {p.description && (
                      <p className="text-[0.8125rem] text-accent-cream/55 line-clamp-2 mb-4">
                        {p.description}
                      </p>
                    )}
                    <div className="flex gap-2">
                      {[2500, 5000, 10000].map((amt) => (
                        <Link
                          key={amt}
                          to={`/donate/checkout?product=${p._id}&amount=${amt}`}
                          className="flex-1 py-2 text-center text-[0.6875rem] font-medium bg-white/10 text-accent-cream/80 rounded-sm hover:bg-secondary-terra hover:text-white transition-all"
                        >
                          ${amt / 100}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
