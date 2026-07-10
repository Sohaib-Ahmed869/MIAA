import { useEffect, useRef, useState } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  HandHeart,
} from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { api } from "../lib/api"
import { fadeInUp } from "../lib/motion"
import CTAButton from "../components/ui/Button"

// A burst of sparks fired outward once, at fixed angles around the badge.
const SPARK_ANGLES = Array.from({ length: 12 }, (_, i) => (i * Math.PI * 2) / 12)

// Success mark — a bold checkmark inside a custom drawn ring that springs in,
// with a soft glow and a one-shot spark burst.
function AnimatedTick() {
  return (
    <div className="relative mb-8 flex items-center justify-center w-24 h-24 3xl:w-28 3xl:h-28">
      {/* Soft glow */}
      <motion.span
        className="absolute inset-0 rounded-full bg-emerald-400/25 blur-2xl"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: [0.5, 1.15, 0.95], opacity: [0, 0.9, 0.5] }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      {/* Radiating pulse ring */}
      <motion.span
        className="absolute inset-1 rounded-full border border-emerald-400/40"
        initial={{ scale: 0.85, opacity: 0.5 }}
        animate={{ scale: 1.45, opacity: 0 }}
        transition={{ duration: 1.8, ease: "easeOut", repeat: Infinity, repeatDelay: 0.5, delay: 0.8 }}
      />

      {/* Spark burst */}
      {SPARK_ANGLES.map((ang, i) => (
        <motion.span
          key={i}
          className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -ml-[3px] -mt-[3px] rounded-full bg-emerald-300"
          initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
          animate={{
            x: Math.cos(ang) * 62,
            y: Math.sin(ang) * 62,
            opacity: [0, 1, 0],
            scale: [0, 1, 0.3],
          }}
          transition={{ duration: 0.9, delay: 0.5 + i * 0.015, ease: "easeOut" }}
        />
      ))}

      {/* Ring + checkmark */}
      <motion.svg
        viewBox="0 0 52 52"
        className="relative w-24 h-24 3xl:w-28 3xl:h-28 drop-shadow-[0_0_16px_rgba(52,211,153,0.5)]"
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 15 }}
      >
        {/* Faint filled disc */}
        <circle cx="26" cy="26" r="24" fill="rgba(52,211,153,0.10)" />
        {/* Drawn ring */}
        <motion.circle
          cx="26"
          cy="26"
          r="24"
          fill="none"
          stroke="#34d399"
          strokeWidth="2.5"
          strokeLinecap="round"
          transform="rotate(-90 26 26)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
        {/* Checkmark */}
        <motion.path
          d="M15.5 26.5 l6.5 6.5 l14 -15"
          fill="none"
          stroke="#6ee7b7"
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.5 }}
        />
      </motion.svg>
    </div>
  )
}

// Staggered reveal for the card's text/buttons.
const cardStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.25 } },
}
const cardItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
}

// Cause card — matches the "Where Your Donation Goes" cards on the donate page.
function CauseCard({ p }) {
  const pct =
    p.goalAmount > 0
      ? Math.min(100, ((p.raisedAmount || 0) / p.goalAmount) * 100)
      : 0
  return (
    <div className="group flex flex-col h-full text-left bg-white border border-primary/10 rounded-sm overflow-hidden hover:border-secondary-terra/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="aspect-[16/10] overflow-hidden bg-bg-deep relative">
        {p.imageUrl ? (
          <img
            src={p.imageUrl}
            alt={p.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-accent-cream/30">
            <HandHeart className="w-10 h-10" strokeWidth={1.25} />
          </div>
        )}
        {p.category && (
          <span className="absolute top-3 left-3 text-[0.5625rem] tracking-[0.2em] uppercase text-white font-semibold bg-secondary-terra/90 px-2.5 py-1 rounded-sm backdrop-blur-sm">
            {p.category}
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-6">
        <h3 className="text-lg font-medium text-primary mb-2">{p.name}</h3>
        {p.description && (
          <p className="text-[0.8125rem] text-primary/70 leading-relaxed mb-4 line-clamp-3">
            {p.description}
          </p>
        )}

        <div className="mt-auto pt-2">
          {p.goalAmount > 0 && (
            <div className="mb-4">
              <div className="flex justify-between items-baseline text-[0.625rem] tracking-[0.15em] uppercase text-primary/55 mb-1.5">
                <span className="text-secondary-terra font-semibold">
                  ${((p.raisedAmount || 0) / 100).toLocaleString()} raised
                </span>
                <span>${(p.goalAmount / 100).toLocaleString()} goal</span>
              </div>
              <div className="h-1.5 bg-primary/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-secondary-terra rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
                />
              </div>
            </div>
          )}
          <CTAButton to={`/donate/checkout?product=${p._id}`}>Donate</CTAButton>
        </div>
      </div>
    </div>
  )
}

export default function DonationSuccess() {
  const [searchParams] = useSearchParams()
  const isPaypal = searchParams.get("paypal") === "1"
  // PayPal returns the approved order id as `token` in the redirect URL.
  const paypalOrderId = searchParams.get("token") || ""
  // Stripe appends these on a 3-D-Secure redirect back to the return_url.
  const stripePaymentIntent = searchParams.get("payment_intent") || ""
  const stripeRedirectStatus = searchParams.get("redirect_status") || ""
  const [upsellProducts, setUpsellProducts] = useState([])

  // Reconcile a Stripe payment that completed via a 3DS redirect (the inline
  // confirm on the checkout page is skipped in that case). Idempotent server-side.
  const stripeConfirmStarted = useRef(false)
  useEffect(() => {
    if (
      stripeConfirmStarted.current ||
      !stripePaymentIntent ||
      stripeRedirectStatus !== "succeeded"
    )
      return
    stripeConfirmStarted.current = true
    api
      .confirmStripeDonation({ paymentIntentId: stripePaymentIntent })
      .catch(() => {})
  }, [stripePaymentIntent, stripeRedirectStatus])

  // PayPal orders are only charged once we capture them on return.
  const captureStarted = useRef(false)
  const [capturing, setCapturing] = useState(isPaypal && !!paypalOrderId)
  const [captureError, setCaptureError] = useState("")

  useEffect(() => {
    if (!isPaypal || !paypalOrderId || captureStarted.current) return
    captureStarted.current = true
    setCapturing(true)
    api
      .capturePaypalOrder({ orderId: paypalOrderId })
      .then(() => setCapturing(false))
      .catch((err) => {
        // An already-captured order (e.g. a refresh) is effectively a success.
        const msg = (err?.message || "").toLowerCase()
        if (err?.status === 422 || msg.includes("already")) {
          setCapturing(false)
          return
        }
        setCaptureError(
          err?.message ||
            "We couldn't confirm your PayPal payment. Please contact us if you were charged.",
        )
        setCapturing(false)
      })
  }, [isPaypal, paypalOrderId])

  useEffect(() => {
    const controller = new AbortController()
    api.upsellProducts().then((prods) => {
      if (!controller.signal.aborted) setUpsellProducts(prods)
    }).catch(() => {})
    return () => controller.abort()
  }, [])

  // While the PayPal capture is in flight, show a confirming state.
  if (capturing) {
    return (
      <section className="bg-bg-deep min-h-screen">
        <div className="max-w-[800px] mx-auto px-6 md:px-10 pt-28 md:pt-32 pb-20 text-center">
          <motion.div {...fadeInUp} className="flex flex-col items-center">
            <Loader2 className="w-10 h-10 text-accent-wheat animate-spin mb-6" />
            <h1 className="text-2xl md:text-3xl font-medium text-accent-cream tracking-tight mb-3">
              Confirming your donation…
            </h1>
            <p className="text-base text-accent-cream/60 max-w-md">
              Please wait a moment while we finalise your PayPal payment. Don’t
              close this window.
            </p>
          </motion.div>
        </div>
      </section>
    )
  }

  // If the capture failed, surface it rather than pretending it succeeded.
  if (captureError) {
    return (
      <section className="bg-bg-deep min-h-screen">
        <div className="max-w-[800px] mx-auto px-6 md:px-10 pt-28 md:pt-32 pb-20 text-center">
          <motion.div {...fadeInUp} className="flex flex-col items-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-500/15 mb-6">
              <AlertCircle className="w-8 h-8 text-rose-400" />
            </div>
            <h1 className="text-2xl md:text-3xl font-medium text-accent-cream tracking-tight mb-4">
              We couldn’t confirm your payment
            </h1>
            <p className="text-base text-accent-cream/65 max-w-xl mb-8">
              {captureError}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <CTAButton to="/donate">Try Again</CTAButton>
              <Link
                to="/contact"
                className="text-sm text-accent-cream/60 hover:text-accent-cream transition-colors underline underline-offset-4"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-bg-deep min-h-screen">
      {/* Thank-you card */}
      <div className="max-w-[800px] 3xl:max-w-[1000px] mx-auto px-6 md:px-10 pt-28 md:pt-32 pb-14 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.015] px-6 py-12 md:px-14 md:py-16 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.75)]"
        >
          {/* Top glow */}
          <div className="pointer-events-none absolute inset-x-0 -top-20 h-48 bg-[radial-gradient(50%_100%_at_50%_100%,rgba(52,211,153,0.18),transparent)]" />

          <motion.div
            variants={cardStagger}
            initial="hidden"
            animate="show"
            className="relative flex flex-col items-center"
          >
            <AnimatedTick />

            <motion.h1
              variants={cardItem}
              className="text-2xl md:text-3xl 3xl:text-4xl font-medium text-accent-cream tracking-tight mb-4"
            >
              Thank You for Your Generosity
            </motion.h1>
            <motion.p
              variants={cardItem}
              className="text-base md:text-lg text-accent-cream/65 max-w-xl mx-auto mb-8"
            >
              Your donation has been received. A receipt will be sent to your email
              shortly. Your contribution makes a real difference in preserving and
              celebrating Islamic art and culture in Australia.
            </motion.p>

            <motion.div
              variants={cardItem}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <CTAButton to="/donate">Make Another Donation</CTAButton>
              <Link
                to="/donor/login"
                className="text-sm text-accent-cream/60 hover:text-accent-cream transition-colors underline underline-offset-4"
              >
                Sign in to Donor Portal
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Upsell carousel */}
      {upsellProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="max-w-[1240px] mx-auto px-6 md:px-10 lg:px-16 pb-24"
        >
          <div className="border-t border-accent-cream/15 pt-12 text-center">
            <p className="text-[0.6875rem] tracking-[0.25em] uppercase text-accent-wheat font-semibold mb-2">
              Continue Making an Impact
            </p>
            <h2 className="text-xl md:text-2xl 3xl:text-3xl font-medium text-accent-cream mb-8">
              Other Causes You Can Support
            </h2>

            <div className="relative">
              {/* Prev / next arrows (desktop) */}
              <button
                aria-label="Previous"
                className="cause-prev hidden md:flex absolute -left-3 lg:-left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-white/10 border border-white/20 text-accent-cream hover:bg-secondary-terra hover:text-white hover:border-secondary-terra transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                aria-label="Next"
                className="cause-next hidden md:flex absolute -right-3 lg:-right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-white/10 border border-white/20 text-accent-cream hover:bg-secondary-terra hover:text-white hover:border-secondary-terra transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={24}
                slidesPerView={1.1}
                centerInsufficientSlides
                breakpoints={{
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                navigation={{ prevEl: ".cause-prev", nextEl: ".cause-next" }}
                pagination={{ clickable: true }}
                className="cause-swiper !pb-14 text-left"
              >
                {upsellProducts.map((p) => (
                  <SwiperSlide key={p._id} className="!h-auto">
                    <CauseCard p={p} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </motion.div>
      )}
    </section>
  )
}
