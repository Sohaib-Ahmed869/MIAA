import { useState, useRef } from "react"
import { motion } from "framer-motion"
import ReCAPTCHA from "react-google-recaptcha"
import { fadeInLeft, fadeInRight } from "../../../lib/motion"
import CTAButton from "../../ui/Button"

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || ""

const TOPICS = [
  "General Inquiry",
  "Visitor Information",
  "Exhibition Information",
  "Partnership Opportunities",
  "Volunteering",
  "Membership",
]

function TikTokIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78c.27 0 .54.04.8.1v-3.5a6.37 6.37 0 0 0-.8-.05A6.34 6.34 0 0 0 3.15 15.3 6.34 6.34 0 0 0 9.49 21.65a6.34 6.34 0 0 0 6.34-6.34V8.78a8.28 8.28 0 0 0 3.76.94V6.69z" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

const SOCIALS = [
  { Icon: TikTokIcon, label: "TikTok", url: "#" },
  { Icon: XIcon, label: "X", url: "#" },
  { Icon: InstagramIcon, label: "Instagram", url: "https://www.instagram.com/" },
  { Icon: FacebookIcon, label: "Facebook", url: "https://www.facebook.com/" },
]

import { api } from "../../../lib/api"

export default function ContactPageSection() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const recaptchaRef = useRef(null)

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
      topic: data.get("topic") || "",
      message: data.get("message"),
      source: "contact-page",
      ...(captchaToken && { captchaToken }),
    }
    setSubmitting(true)
    try {
      await api.submitContact(payload)
      setSubmitted(true)
      form.reset()
    } catch (err) {
      setError(err.message || "Could not submit. Please try again.")
      recaptchaRef.current?.reset()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="relative bg-bg-deep pt-28 md:pt-32 pb-16 md:pb-20">
      <div className="max-w-[1400px] 3xl:max-w-[3200px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left — Heading + intro + connect */}
          <motion.div {...fadeInLeft}>
            <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] 3xl:text-[4.5rem] font-medium text-accent-cream tracking-tight leading-tight">
              Connect With the Museum
            </h1>
            <p className="mt-5 text-sm md:text-[0.9375rem] 3xl:text-lg text-accent-cream/85 leading-relaxed max-w-md 3xl:max-w-xl">
              We&apos;d love to hear from you. Whether you&apos;d like to learn
              more about the Museum of Islamic Art Australia, explore
              partnership opportunities, or support our journey, our team is
              here to connect.
            </p>

            {/* Connect / socials */}
            <div className="mt-10 md:mt-14">
              <p className="text-sm 3xl:text-base font-medium text-accent-wheat mb-2">
                Connect
              </p>
              <p className="text-sm 3xl:text-base text-accent-cream/75 leading-relaxed">
                Stay connected with MIAA via our socials
                <br />
                Instagram Facebook and YouTube
              </p>
              <div className="flex gap-2 mt-4">
                {SOCIALS.map(({ Icon, label, url }) => (
                  <a
                    key={label}
                    href={url}
                    aria-label={label}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="w-10 h-10 3xl:w-16 3xl:h-16 flex items-center justify-center bg-primary/40 border border-accent-wheat/20 text-accent-cream hover:bg-secondary-terra hover:border-secondary-terra transition-colors [&_svg]:3xl:w-6 [&_svg]:3xl:h-6"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div {...fadeInRight}>
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center h-full min-h-[320px]"
              >
                <div className="text-center">
                  <p className="text-xl 3xl:text-2xl font-semibold text-white">Thank you!</p>
                  <p className="text-sm 3xl:text-base text-white/60 mt-2">
                    Your submission has been received.
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

                <div>
                  <label className="block text-xs 3xl:text-sm font-semibold text-white/70 mb-2">
                    Topic
                  </label>
                  <select
                    name="topic"
                    defaultValue=""
                    required
                    className="w-full bg-transparent field-dotted-line text-sm 3xl:text-base text-white/30 focus:text-white focus:outline-none transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" disabled>
                      Select Topic
                    </option>
                    {TOPICS.map((topic) => (
                      <option
                        key={topic}
                        value={topic}
                        className="bg-bg-deep text-white"
                      >
                        {topic}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs 3xl:text-sm font-semibold text-white/70 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    placeholder="Enter your message"
                    rows={4}
                    required
                    className="w-full bg-transparent field-dotted-line text-sm 3xl:text-base text-white placeholder:text-white/30 focus:outline-none transition-colors resize-none"
                  />
                </div>

                {RECAPTCHA_SITE_KEY && (
                  <div className="3xl:scale-150 3xl:origin-top-left 3xl:mb-8">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={RECAPTCHA_SITE_KEY}
                      theme="dark"
                    />
                  </div>
                )}

                {error && (
                  <p className="text-sm 3xl:text-base text-secondary-terra" role="alert">{error}</p>
                )}
                <div>
                  <CTAButton type="submit" disabled={submitting} className="px-6 py-3 disabled:opacity-60">{submitting ? "Sending…" : "Send Message"}</CTAButton>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
