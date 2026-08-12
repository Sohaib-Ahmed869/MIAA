import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ACKNOWLEDGMENT_TEXT } from "../../lib/constants"
import { api } from "../../lib/api"
import { fadeInUp } from "../../lib/motion"
import { useMedia } from "../../content/context"
import SignupConfirmationModal from "../ui/SignupConfirmationModal"
import footerPattern from "../../assets/images/Homepage/Footer Pattern.png"

function TikTokIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="3xl:w-5 3xl:h-5">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78c.27 0 .54.04.8.1v-3.5a6.37 6.37 0 0 0-.8-.05A6.34 6.34 0 0 0 3.15 15.3 6.34 6.34 0 0 0 9.49 21.65a6.34 6.34 0 0 0 6.34-6.34V8.78a8.28 8.28 0 0 0 3.76.94V6.69z" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="3xl:w-5 3xl:h-5">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="3xl:w-5 3xl:h-5">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="3xl:w-5 3xl:h-5">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function YouTubeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="3xl:w-5 3xl:h-5">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  )
}

function DottedDivider() {
  return (
    <div
      className="w-full h-[0.125rem]"
      style={{
        backgroundImage: "radial-gradient(circle, #38717A50 0.09375rem, transparent 0.09375rem)",
        backgroundSize: "0.5rem 0.1875rem",
      }}
    />
  )
}

const footerLinks = [
  { label: "Islamic Art in Australia", path: "/islamic-art" },
  { label: "MIAA Off-Site Events", path: "/offsite-events" },
  { label: "Sydney Muslim Writers Festival", path: "/events" },
  { label: "Community Engagement & Education", path: "/community-engagement" },
  { label: "MIAA Timeline & Construction", path: "/timeline" },
  { label: "Contact Us", path: "/contact" },
]

function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState("idle") // idle | submitting | success | error
  const [message, setMessage] = useState("")
  const [modalOpen, setModalOpen] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    if (status === "submitting" || !email) return
    setStatus("submitting")
    setMessage("")
    try {
      await api.subscribeNewsletter(email, "footer")
      setStatus("success")
      setMessage("Thanks — you're on the list.")
      setModalOpen(true)
      setEmail("")
    } catch (err) {
      setStatus("error")
      setMessage(err.message || "Could not subscribe.")
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {/* No confirmation email is sent for newsletter sign-ups, so that line is
          omitted here. */}
      <SignupConfirmationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Thank you for subscribing!"
        lines={[
          "As part of signing up, we’ve added you to our contact list, you can unsubscribe anytime.",
        ]}
      />
      <form onSubmit={onSubmit} className="flex gap-0">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          className="flex-1 md:flex-none md:w-44 3xl:w-52 px-3 3xl:px-4 py-2 3xl:py-2.5 bg-white border border-primary/20 border-r-0 rounded-l-md text-xs 3xl:text-sm text-primary placeholder:text-primary/40 focus:outline-none focus:border-primary/40 transition-colors"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="px-3 py-2 3xl:px-4 3xl:py-2.5 rounded-r-md hover:opacity-80 transition-colors disabled:opacity-60"
          style={{ backgroundColor: "#38717A" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="3xl:w-5 3xl:h-5">
            <polyline points="9 10 4 15 9 20" />
            <path d="M20 4v7a4 4 0 0 1-4 4H4" />
          </svg>
        </button>
      </form>
      {message && (
        <p
          className={`text-[0.6875rem] 3xl:text-sm ${status === "error" ? "text-secondary-terra" : "text-primary/70"}`}
          role="status"
        >
          {message}
        </p>
      )}
    </div>
  )
}

export default function Footer() {
  const logo = useMedia("brand.logo.footer")
  return (
    <footer className="relative bg-accent-cream overflow-hidden">
      {/* Large MIAA logo watermark — flush bottom-left, hidden on mobile */}
      <div className="absolute bottom-0 left-0 pointer-events-none z-20 hidden md:block">
        <img
          src={logo.src}
          alt=""
          className="md:w-[31.25rem] lg:w-[40.625rem] 3xl:w-[28vw] h-auto block"
        />
      </div>

      {/* Pattern background behind acknowledgment */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${footerPattern})`,
            backgroundSize: "700px",
            backgroundRepeat: "repeat",
            backgroundPosition: "center",
            WebkitMaskImage:
              "linear-gradient(to bottom, #000 0%, #000 40%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, #000 0%, #000 40%, transparent 100%)",
          }}
        />
        <motion.div {...fadeInUp} className="relative z-10 w-full px-6 md:px-10 lg:px-16 3xl:px-24 pt-10 pb-10 text-center">
          <div className="text-sm md:text-[0.9375rem] 3xl:text-base leading-[1.8] text-primary italic max-w-3xl 3xl:max-w-4xl mx-auto">
            <p className="font-medium">MIAA is proudly located on beautiful Dharug country in Granville, Western Sydney.</p>
            <p>The Museum of Islamic Art Australia (MIAA) respectfully acknowledges the Burramattagal people of the Dharug Nation as the Traditional Owners of the land on which the museum will be located. We pay our respects to Elders past, present and emerging. Sovereignty has never been ceded.</p>
          </div>
        </motion.div>
      </div>

      {/* Footer content */}
      <div className="relative z-10 max-w-[1400px] 3xl:max-w-[3200px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24 mt-10">
        {/* Desktop: 2-column grid / Mobile: single column */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16 3xl:gap-20">
          {/* ISRA info — on mobile shows after links, on desktop shows left */}
          <div className="order-2 lg:order-1 pt-2 pl-0 lg:pl-[42%]">
            <p className="text-sm 3xl:text-base text-primary leading-relaxed max-w-xs 3xl:max-w-sm">
              Museum of Islamic Art Australia is an initiative of
              the{" "}
              <a href="https://isra.org.au" target="_blank" rel="noopener noreferrer" className="underline">
                Islamic Sciences and Research Academy (ISRA)
              </a>
              . Funded by the Government of New South Wales WestInvest Program.
            </p>
          </div>

          {/* Right column — Links, Connect, Newsletter, Copyright */}
          <div className="order-1 lg:order-2 lg:max-w-[35rem] lg:ml-auto lg:mr-4">
            {/* Links — single column on mobile, 2 columns on sm+ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
              <ul className="flex flex-col gap-3">
                {footerLinks.slice(0, 3).map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm 3xl:text-base text-primary font-medium hover:text-secondary-terra transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="flex flex-col gap-3">
                {footerLinks.slice(3).map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm 3xl:text-base text-primary font-medium hover:text-secondary-terra transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="my-6 md:my-8 3xl:my-10"><DottedDivider /></div>

            {/* Connect + social */}
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-sm 3xl:text-base font-medium mb-2" style={{ color: "#38717A" }}>Connect</p>
                <p className="text-sm 3xl:text-base leading-relaxed" style={{ color: "#38717A" }}>
                  Stay connected with MIAA via our socials
                  <br />
                  Instagram FaceBook and You Tube
                </p>
              </div>
              <div className="flex gap-2">
                {[
                  { Icon: InstagramIcon, label: "Instagram", url: "https://www.instagram.com/museumofislamicartaustralia/" },
                  { Icon: FacebookIcon, label: "Facebook", url: "https://www.facebook.com/miaaustralia.org" },
                  { Icon: YouTubeIcon, label: "YouTube", url: "https://www.youtube.com/@MuseumofIslamicArtAustralia" },
                ].map(({ Icon, label, url }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={label}
                    className="w-9 h-9 3xl:w-11 3xl:h-11 rounded-full flex items-center justify-center text-white hover:opacity-80 transition-all duration-200"
                    style={{ backgroundColor: "#38717A" }}
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>

            <div className="my-6 md:my-8 3xl:my-10"><DottedDivider /></div>

            {/* Newsletter */}
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-sm 3xl:text-base font-medium text-primary mb-2">
                  Stay Connected
                </p>
                <p className="text-sm 3xl:text-base text-primary leading-relaxed">
                  Get news and updates from the Museum of Islamic Art Australia.
                </p>
              </div>
              <NewsletterForm />
            </div>

            <div className="my-6 md:my-8 3xl:my-10"><DottedDivider /></div>

            {/* Copyright */}
            <div className="flex flex-col gap-1 pb-4 lg:pb-8 3xl:pb-10">
              <p className="text-sm 3xl:text-base text-primary">
                &copy; 2026 Museum of Islamic Art Australia
              </p>
              <p className="text-sm 3xl:text-base text-primary">
                Website by{" "}
                <a
                  href="https://www.thinkstudio.com.au"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="underline hover:text-secondary-terra transition-colors"
                >
                  Think Studio
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile footer logo — bottom left */}
      <div className="relative z-10 md:hidden mt-6 pb-0">
        <img
          src={logo.src}
          alt=""
          className="w-[250px] h-auto block"
        />
      </div>
    </footer>
  )
}
