import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Check } from "lucide-react"
import CTAButton from "../../ui/Button"
import { fadeInLeft, fadeInRight } from "../../../lib/motion"
import { api } from "../../../lib/api"
import Text from "../../../content/Text"
import { useText } from "../../../content/context"

import heroBgPattern from "../../../assets/images/GalaDinner/herobgpattern.png"
import bgMask from "../../../assets/images/Ticketing/bgmask.png"

const DIETARY = [
  "No dietary requirements",
  "Vegetarian",
  "Vegan",
  "Gluten-free",
  "Allergies (please specify in notes)",
]

const DONATION_AMOUNTS = [10, 20, 50, 100, 200]

const INITIAL_FORM = {
  title: "",
  firstName: "",
  surname: "",
  postNominals: "",
  email: "",
  phone: "",
  dietary: "",
  hasGuest: false,
  guestCount: 1,
  accessRequirements: "",
  donation: null,
  customDonation: "",
  buyTable: false,
}

export default function TicketHeroSection() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [submitted] = useState(false)
  const [error, setError] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const t = useText()

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const donationVal =
    form.donation === "other" ? Number(form.customDonation) || 0 : form.donation || 0
  const ticketPrice = form.buyTable ? 2000 : 250
  const total = ticketPrice + donationVal

  const handleFormSubmit = (e) => {
    e.preventDefault()
    setShowConfirm(true)
  }

  const handleConfirm = async () => {
    setShowConfirm(false)
    setSubmitting(true)
    setError(null)

    // Buy a table = 10 seats; otherwise primary attendee + (optional) 1 guest
    const quantity = form.buyTable
      ? 10
      : 1 + (form.hasGuest ? Math.max(1, Number(form.guestCount) || 1) : 0)

    const notesParts = []
    if (form.title) notesParts.push(`Title: ${form.title}`)
    if (form.postNominals) notesParts.push(`Post-nominals: ${form.postNominals}`)
    if (form.accessRequirements) notesParts.push(`Access: ${form.accessRequirements}`)
    if (donationVal) notesParts.push(`Additional donation: $${donationVal}`)
    const notes = notesParts.join(" · ")

    try {
      // Hand the form data to our backend which talks to Tickets Tailor.
      // It returns the hosted-checkout URL with buyer details prefilled —
      // we then redirect the customer there to complete payment on TT.
      const { checkoutUrl } = await api.galaCheckout({
        firstName: form.firstName,
        lastName: form.surname,
        email: form.email,
        phone: form.phone,
        quantity,
        dietary: form.dietary,
        notes,
      })
      if (!checkoutUrl) throw new Error("Could not start checkout")
      // Hard-redirect to Tickets Tailor's hosted checkout
      window.location.href = checkoutUrl
    } catch (err) {
      setError(err.message || "Could not start checkout. Please try again.")
      setSubmitting(false)
    }
  }

  return (
    <section className="relative bg-primary overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0">
        <img
          src={heroBgPattern}
          alt=""
          className="w-full h-full object-cover opacity-60"
        />
      </div>

      {/* Background mask at bottom-left — extends into next section */}
      <div className="absolute -bottom-32 md:-bottom-48 lg:-bottom-64 left-0 w-[400px] md:w-[31.25rem] lg:w-[37.5rem] 3xl:w-[25vw] pointer-events-none z-[5]">
        <img
          src={bgMask}
          alt=""
          className="w-full h-auto opacity-80"
        />
      </div>

      <div className="relative z-10 max-w-[1400px] 3xl:max-w-[3200px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24 pt-28 md:pt-32 pb-16 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-10 lg:gap-16 items-start">
          {/* Left — heading + pricing */}
          <motion.div {...fadeInLeft}>
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] 3xl:text-[4.5rem] font-normal text-accent-cream tracking-tight leading-snug mb-5 uppercase">
              <Text k="galatickets.heading" />
            </h1>
            <p className="text-base 3xl:text-xl text-accent-cream leading-relaxed max-w-md 3xl:max-w-lg mb-10">
              <Text k="galatickets.intro" />
            </p>

            <div className="border-t border-accent-wheat/25 pt-6">
              <p className="text-sm md:text-base 3xl:text-lg tracking-[0.25em] uppercase text-white font-medium mb-2">
                <Text k="galatickets.pricingLabel" />
              </p>
              <div className="flex items-baseline gap-1">
                <p className="text-4xl md:text-5xl 3xl:text-6xl font-medium text-accent-wheat tracking-tight leading-none">
                  $250
                </p>
                <p className="text-sm 3xl:text-base text-accent-wheat">/person</p>
              </div>
            </div>
          </motion.div>

          {/* Right — Booking form */}
          <motion.div {...fadeInRight}>
            {submitted ? (
              <div className="py-12 text-center">
                <p className="text-xl 3xl:text-2xl font-semibold text-white">
                  <Text k="galatickets.successTitle" />
                </p>
                <p className="text-sm 3xl:text-base text-white mt-2">
                  <Text k="galatickets.successBody" />
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
                {/* Personal Information */}
                <h2 className="text-lg 3xl:text-xl font-semibold text-white">
                  Personal Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[0.6875rem] 3xl:text-sm font-semibold text-white mb-2 uppercase tracking-wider">
                      Title
                    </label>
                    <div className="relative">
                      <select
                        value={form.title}
                        onChange={(e) => update("title", e.target.value)}
                        className="w-full bg-transparent field-dotted-line text-sm 3xl:text-base text-white/50 focus:text-white focus:outline-none appearance-none cursor-pointer pr-6"
                      >
                        <option value="" disabled>Select</option>
                        <option className="bg-primary text-white" value="Mr">Mr</option>
                        <option className="bg-primary text-white" value="Mrs">Mrs</option>
                        <option className="bg-primary text-white" value="Ms">Ms</option>
                        <option className="bg-primary text-white" value="Dr">Dr</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 absolute right-0 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[0.6875rem] 3xl:text-sm font-semibold text-white mb-2 uppercase tracking-wider">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.firstName}
                      onChange={(e) => update("firstName", e.target.value)}
                      className="w-full bg-transparent field-dotted-line text-sm 3xl:text-base text-white placeholder:text-white/30 focus:outline-none"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.6875rem] 3xl:text-sm font-semibold text-white mb-2 uppercase tracking-wider">
                      Surname
                    </label>
                    <input
                      type="text"
                      required
                      value={form.surname}
                      onChange={(e) => update("surname", e.target.value)}
                      className="w-full bg-transparent field-dotted-line text-sm 3xl:text-base text-white placeholder:text-white/30 focus:outline-none"
                      placeholder="Enter surname"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.6875rem] 3xl:text-sm font-semibold text-white mb-2 uppercase tracking-wider">
                      Post Nominals
                    </label>
                    <input
                      type="text"
                      value={form.postNominals}
                      onChange={(e) => update("postNominals", e.target.value)}
                      className="w-full bg-transparent field-dotted-line text-sm 3xl:text-base text-white placeholder:text-white/30 focus:outline-none"
                      placeholder="Enter"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.6875rem] 3xl:text-sm font-semibold text-white mb-2 uppercase tracking-wider">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      className="w-full bg-transparent field-dotted-line text-sm 3xl:text-base text-white placeholder:text-white/30 focus:outline-none"
                      placeholder="email address"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.6875rem] 3xl:text-sm font-semibold text-white mb-2 uppercase tracking-wider">
                      Mobile Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      className="w-full bg-transparent field-dotted-line text-sm 3xl:text-base text-white placeholder:text-white/30 focus:outline-none"
                      placeholder="04xx xxx xxx"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[0.6875rem] 3xl:text-sm font-semibold text-white mb-2 uppercase tracking-wider">
                    Dietary Requirements
                  </label>
                  <div className="relative">
                    <select
                      value={form.dietary}
                      onChange={(e) => update("dietary", e.target.value)}
                      className="w-full bg-transparent field-dotted-line text-sm 3xl:text-base text-white/50 focus:text-white focus:outline-none appearance-none cursor-pointer pr-6"
                    >
                      <option value="" disabled>Select Dietary</option>
                      {DIETARY.map((d) => (
                        <option key={d} value={d} className="bg-primary text-white">
                          {d}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 absolute right-0 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none" />
                  </div>
                </div>

                <p className="text-[0.6875rem] 3xl:text-sm text-white/70 leading-relaxed">
                  Note: All dishes are halal and alcohol free. For other dietary requirements please select from the following
                  options.
                </p>

                {/* Guest */}
                <div className="border-t border-accent-wheat/20 pt-6">
                  <h2 className="text-lg 3xl:text-xl font-semibold text-white mb-4">
                    Guest
                  </h2>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <span
                      onClick={() => update("hasGuest", !form.hasGuest)}
                      className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${
                        form.hasGuest
                          ? "bg-secondary-terra border-secondary-terra"
                          : "border-accent-cream/30 group-hover:border-accent-cream"
                      }`}
                    >
                      {form.hasGuest && <Check className="w-3.5 h-3.5" strokeWidth={3} className="text-white" />}
                    </span>
                    <span className="text-sm 3xl:text-base text-white">Add guest(s)</span>
                  </label>
                  {form.hasGuest && (
                    <div className="flex items-center gap-4 mt-4">
                      <button
                        type="button"
                        onClick={() => update("guestCount", Math.max(1, form.guestCount - 1))}
                        className="w-8 h-8 rounded-full border border-accent-cream/30 text-white flex items-center justify-center hover:border-accent-cream transition-colors"
                      >
                        −
                      </button>
                      <span className="text-white text-lg font-medium w-6 text-center">
                        {form.guestCount}
                      </span>
                      <button
                        type="button"
                        onClick={() => update("guestCount", form.guestCount + 1)}
                        className="w-8 h-8 rounded-full border border-accent-cream/30 text-white flex items-center justify-center hover:border-accent-cream transition-colors"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>

                {/* Access Requirements */}
                <div className="border-t border-accent-wheat/20 pt-6">
                  <h2 className="text-lg 3xl:text-xl font-semibold text-white mb-2">
                    Access Requirements
                  </h2>
                  <p className="text-[0.6875rem] 3xl:text-sm text-white/80 leading-relaxed mb-3">
                    Accessibility Information
                  </p>
                  <p className="text-[0.6875rem] 3xl:text-sm text-white/70 leading-relaxed mb-4">
                    The AGNSW is a fully accessible building. Please visit the AGNSW Physical Access and Facility page for
                    more details. If you have any further access requirements or need to be present, please specify below.
                  </p>
                  <textarea
                    rows={2}
                    value={form.accessRequirements}
                    onChange={(e) => update("accessRequirements", e.target.value)}
                    className="w-full bg-transparent field-dotted-line text-sm 3xl:text-base text-white placeholder:text-white/30 focus:outline-none resize-none"
                    placeholder="Access requirements..."
                  />
                </div>

                {/* Donation */}
                <div className="border-t border-accent-wheat/20 pt-6">
                  <p className="text-[0.6875rem] 3xl:text-sm font-semibold text-white uppercase tracking-wider mb-1">
                    Donation
                  </p>
                  <p className="text-[0.6875rem] 3xl:text-sm text-white/70 mb-4">
                    Support the building of MIAA by adding a Donation
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {DONATION_AMOUNTS.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => update("donation", form.donation === amt ? null : amt)}
                        className={`px-4 py-2 text-sm 3xl:text-base font-medium rounded border transition-colors ${
                          form.donation === amt
                            ? "bg-secondary-terra border-secondary-terra text-white"
                            : "bg-transparent border-accent-cream/30 text-white hover:border-accent-cream"
                        }`}
                      >
                        ${amt}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => update("donation", form.donation === "other" ? null : "other")}
                      className={`px-4 py-2 text-sm 3xl:text-base font-medium rounded border transition-colors ${
                        form.donation === "other"
                          ? "bg-secondary-terra border-secondary-terra text-white"
                          : "bg-transparent border-accent-cream/30 text-white hover:border-accent-cream"
                      }`}
                    >
                      Other
                    </button>
                  </div>
                  {form.donation === "other" && (
                    <input
                      type="number"
                      min={1}
                      placeholder="Enter amount"
                      value={form.customDonation}
                      onChange={(e) => update("customDonation", e.target.value)}
                      className="mt-3 w-40 bg-transparent field-dotted-line text-sm 3xl:text-base text-white placeholder:text-white/30 focus:outline-none"
                    />
                  )}
                </div>

                {/* Buy a Table */}
                <div className="border-t border-accent-wheat/20 pt-6">
                  <p className="text-[0.6875rem] 3xl:text-sm font-semibold text-white uppercase tracking-wider mb-1">
                    Buy a Table
                  </p>
                  <p className="text-[0.6875rem] 3xl:text-sm text-white/70">
                    8 or more tickets? KDare support the museum funds.
                  </p>
                  <button
                    type="button"
                    onClick={() => update("buyTable", !form.buyTable)}
                    className={`mt-2 px-4 py-2 text-sm 3xl:text-base font-medium rounded border transition-colors ${
                      form.buyTable
                        ? "bg-secondary-terra border-secondary-terra text-white"
                        : "bg-transparent border-accent-cream/30 text-white hover:border-accent-cream"
                    }`}
                  >
                    $2,000
                  </button>
                </div>

                {/* Ticket Summary */}
                <div className="border-t border-accent-wheat/20 pt-6">
                  <h2 className="text-lg 3xl:text-xl font-semibold text-white mb-4">
                    Ticket
                  </h2>
                  <div className="flex flex-col gap-2 text-sm 3xl:text-base text-white">
                    <div className="flex justify-between">
                      <span>{form.buyTable ? "Buy a Table" : "1 Person"}</span>
                      <span>${ticketPrice}</span>
                    </div>
                    {donationVal > 0 && (
                      <div className="flex justify-between">
                        <span>Donation</span>
                        <span>${donationVal}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-accent-wheat/20 pt-2 font-semibold">
                      <span>Total</span>
                      <span>${total}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs 3xl:text-sm text-white/60 leading-relaxed">
                  • For other Sponsorship Opportunities please see the <a href="https://drive.google.com/file/d/1072ktfGFYxJMQHalRFTKSyhICR5ONtEo/view?usp=sharing" target="_blank" rel="noreferrer noopener" className="text-accent-wheat underline hover:text-white transition-colors">MIAA Inaugural Gala Sponsors downloadable pdf</a>.
                  <br />
                  • The Gala ticket is non-transferable and non-refundable. For enquiries, please contact the MIAA team directly.
                </p>

                {error && (
                  <p className="text-sm 3xl:text-base text-red-400">{error}</p>
                )}

                <div className="flex justify-start mt-2">
                  <CTAButton type="submit" disabled={submitting} showArrow={!submitting} className="px-6 py-3 disabled:opacity-50">{submitting ? "Processing..." : t("galatickets.cta")}</CTAButton>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6"
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-primary border border-accent-wheat/20 rounded-lg p-8 max-w-md w-full"
            >
              <h3 className="text-xl 3xl:text-2xl font-medium text-white mb-3">
                Confirm Your Booking
              </h3>
              <p className="text-sm 3xl:text-base text-white mb-2">
                {form.firstName} {form.surname}
              </p>
              <div className="flex justify-between text-sm 3xl:text-base text-white mb-1">
                <span>{form.buyTable ? "Table" : "1 Person"}</span>
                <span>${ticketPrice}</span>
              </div>
              {donationVal > 0 && (
                <div className="flex justify-between text-sm 3xl:text-base text-white mb-1">
                  <span>Donation</span>
                  <span>${donationVal}</span>
                </div>
              )}
              <div className="flex justify-between text-sm 3xl:text-base text-white font-semibold border-t border-accent-wheat/20 pt-2 mt-2">
                <span>Total</span>
                <span>${total}</span>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 px-4 py-2.5 border border-accent-cream/30 text-white text-xs 3xl:text-sm font-semibold tracking-wider uppercase rounded hover:border-accent-cream transition-colors"
                >
                  Cancel
                </button>
                <CTAButton onClick={handleConfirm} disabled={submitting} showArrow={!submitting} className="flex-1 justify-center px-4 disabled:opacity-50">{submitting ? "Processing..." : "Confirm"}</CTAButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
