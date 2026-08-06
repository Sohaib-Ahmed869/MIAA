import { useState, useRef } from "react"
import { motion } from "framer-motion"
import ReCAPTCHA from "react-google-recaptcha"
import { fadeInLeft, fadeInRight } from "../lib/motion"
import CTAButton from "../components/ui/Button"
import SignupConfirmationModal from "../components/ui/SignupConfirmationModal"
import { api } from "../lib/api"

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || ""

const AREAS = [
  "Events & Programs",
  "Front of House / Welcome",
  "Education & Tours",
  "Administration",
  "Marketing & Social Media",
  "Fundraising",
  "Other",
]

const AVAILABILITY = [
  "Weekdays",
  "Weekends",
  "Evenings",
  "Event days only",
  "Flexible",
]

export default function Volunteer() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [error, setError] = useState("")
  const [areas, setAreas] = useState([])
  const recaptchaRef = useRef(null)

  const toggleArea = (area) =>
    setAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    )

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return
    setError("")

    const captchaToken = recaptchaRef.current?.getValue()
    if (RECAPTCHA_SITE_KEY && !captchaToken) {
      setError("Please complete the CAPTCHA.")
      return
    }

    const form = e.currentTarget
    const data = new FormData(form)
    const payload = {
      fullName: data.get("fullName"),
      email: data.get("email"),
      phone: data.get("phone") || "",
      areasOfInterest: areas,
      availability: data.get("availability") || "",
      message: data.get("message") || "",
      source: "volunteer-page",
      ...(captchaToken && { captchaToken }),
    }

    setSubmitting(true)
    try {
      await api.submitVolunteerApplication(payload)
      setSubmitted(true)
      setModalOpen(true)
      form.reset()
      setAreas([])
    } catch (err) {
      setError(err.message || "Could not submit. Please try again.")
      recaptchaRef.current?.reset()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="relative bg-bg-deep pt-28 md:pt-32 pb-16 md:pb-20">
      <SignupConfirmationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Thank you for applying!"
      />
      <div className="max-w-[1400px] 3xl:max-w-[3200px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left — intro */}
          <motion.div {...fadeInLeft}>
            <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] 3xl:text-[4.5rem] font-medium text-accent-cream tracking-tight leading-tight">
              Volunteer With Us
            </h1>
            <p className="mt-5 text-sm md:text-[0.9375rem] 3xl:text-lg text-accent-cream/85 leading-relaxed max-w-md 3xl:max-w-xl">
              The Museum of Islamic Art Australia is built by its community. Whether
              you can spare a few hours at an event or lend an ongoing hand, we&apos;d
              love to have you on the team. Tell us a little about yourself and how
              you&apos;d like to help.
            </p>
          </motion.div>

          {/* Right — form */}
          <motion.div {...fadeInRight}>
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center h-full min-h-[320px]"
              >
                <div className="text-center">
                  <p className="text-xl 3xl:text-2xl font-semibold text-white">Thank you!</p>
                  <p className="text-sm 3xl:text-base text-white/60 mt-2 max-w-sm">
                    Your volunteer application has been received. Our team will be in
                    touch soon.
                  </p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs 3xl:text-sm font-semibold text-white/70 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Enter your full name"
                      required
                      className="w-full bg-transparent field-dotted-line text-sm 3xl:text-base text-white placeholder:text-white/30 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs 3xl:text-sm font-semibold text-white/70 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email address"
                      required
                      className="w-full bg-transparent field-dotted-line text-sm 3xl:text-base text-white placeholder:text-white/30 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs 3xl:text-sm font-semibold text-white/70 mb-2">
                      Phone <span className="text-white/30">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Enter your phone number"
                      className="w-full bg-transparent field-dotted-line text-sm 3xl:text-base text-white placeholder:text-white/30 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs 3xl:text-sm font-semibold text-white/70 mb-2">
                      Availability
                    </label>
                    <select
                      name="availability"
                      defaultValue=""
                      className="w-full bg-transparent field-dotted-line text-sm 3xl:text-base text-white/30 focus:text-white focus:outline-none transition-colors appearance-none cursor-pointer"
                    >
                      <option value="" disabled>
                        Select availability
                      </option>
                      {AVAILABILITY.map((a) => (
                        <option key={a} value={a} className="bg-bg-deep text-white">
                          {a}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs 3xl:text-sm font-semibold text-white/70 mb-3">
                    Areas of Interest
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {AREAS.map((area) => {
                      const active = areas.includes(area)
                      return (
                        <button
                          type="button"
                          key={area}
                          onClick={() => toggleArea(area)}
                          className={`text-xs 3xl:text-sm px-3.5 py-2 rounded-full border transition-colors ${
                            active
                              ? "bg-secondary-terra border-secondary-terra text-white"
                              : "bg-transparent border-accent-wheat/25 text-accent-cream/75 hover:border-accent-wheat/60"
                          }`}
                        >
                          {area}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs 3xl:text-sm font-semibold text-white/70 mb-2">
                    Message <span className="text-white/30">(optional)</span>
                  </label>
                  <textarea
                    name="message"
                    placeholder="Tell us anything else you'd like us to know"
                    rows={4}
                    className="w-full bg-transparent field-dotted-line text-sm 3xl:text-base text-white placeholder:text-white/30 focus:outline-none transition-colors resize-none"
                  />
                </div>

                {RECAPTCHA_SITE_KEY && (
                  <div className="3xl:scale-150 3xl:origin-top-left 3xl:mb-8">
                    <ReCAPTCHA ref={recaptchaRef} sitekey={RECAPTCHA_SITE_KEY} theme="dark" />
                  </div>
                )}

                {error && (
                  <p className="text-sm 3xl:text-base text-secondary-terra" role="alert">
                    {error}
                  </p>
                )}
                <div>
                  <CTAButton
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 disabled:opacity-60"
                  >
                    {submitting ? "Sending…" : "Submit Application"}
                  </CTAButton>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
