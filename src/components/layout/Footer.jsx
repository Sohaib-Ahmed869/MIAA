import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { api } from "../../lib/api"
import { fadeInUp } from "../../lib/motion"
import { useSocialLinks } from "../../lib/socials"
import { useMedia, useText } from "../../content/context"
import Text from "../../content/Text"
import { splitParagraphs } from "../../content/format"
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

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="3xl:w-5 3xl:h-5">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05a3.75 3.75 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  )
}

function ThreadsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="3xl:w-5 3xl:h-5">
      <path d="M16.2 11.13c-.1-.05-.2-.09-.3-.13-.18-3.24-1.95-5.1-4.92-5.12h-.04c-1.78 0-3.25.76-4.16 2.14l1.63 1.12c.68-1.03 1.75-1.25 2.53-1.25h.03c.97 0 1.7.29 2.17.84.35.4.58.96.69 1.67a12.4 12.4 0 0 0-2.78-.13c-2.8.16-4.6 1.79-4.48 4.05.06 1.15.63 2.13 1.62 2.77.83.54 1.9.8 3.02.74 1.47-.08 2.63-.64 3.43-1.67.61-.78.99-1.79 1.16-3.06.7.42 1.21.97 1.5 1.63.48 1.13.51 2.98-1 4.49-1.33 1.32-2.92 1.9-5.32 1.91-2.66-.02-4.67-.87-5.98-2.53C4.78 16.95 4.15 14.7 4.13 12c.02-2.7.65-4.94 1.87-6.6C7.3 3.74 9.32 2.89 11.98 2.87c2.68.02 4.73.87 6.09 2.54.67.82 1.17 1.85 1.5 3.05l1.9-.51c-.4-1.48-1.04-2.76-1.9-3.82C17.83 2 15.2.9 11.98.88h-.01C8.77.9 6.18 2 4.29 4.15 2.62 6.06 1.75 8.72 1.72 12v.02c.03 3.27.9 5.93 2.57 7.84 1.89 2.15 4.48 3.25 7.7 3.27h.01c2.86-.02 4.87-.77 6.53-2.42 2.18-2.17 2.11-4.9 1.39-6.57-.51-1.2-1.5-2.17-2.85-2.82zm-4.94 5.7c-1.24.07-2.53-.49-2.6-1.65-.04-.86.62-1.82 2.67-1.94l.5-.01c.72 0 1.4.07 2.01.2-.23 2.87-1.58 3.34-2.58 3.4z" />
    </svg>
  )
}

/** The glyph for each account in `SOCIAL_ACCOUNTS`. */
const SOCIAL_ICONS = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  youtube: YouTubeIcon,
  linkedin: LinkedInIcon,
  tiktok: TikTokIcon,
  x: XIcon,
  threads: ThreadsIcon,
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

// Destinations are fixed in code; only the wording is editable.
const footerLinks = [
  { key: "footer.links.islamicArt", path: "/islamic-art" },
  { key: "footer.links.offsite", path: "/offsite-events" },
  { key: "footer.links.events", path: "/events" },
  { key: "footer.links.community", path: "/community-engagement" },
  { key: "footer.links.timeline", path: "/timeline" },
  { key: "footer.links.contact", path: "/contact" },
]

function NewsletterForm() {
  const t = useText()
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
      setMessage(t("footer.newsletter.success"))
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
        title={t("footer.newsletter.modalTitle")}
        lines={splitParagraphs(t("footer.newsletter.modalBody"))}
      />
      <form onSubmit={onSubmit} className="flex gap-0">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("footer.newsletter.placeholder")}
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
  const t = useText()
  const socials = useSocialLinks()
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
            <p className="font-medium"><Text k="footer.acknowledgement.lead" /></p>
            {splitParagraphs(t("footer.acknowledgement.body")).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
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
              <Text k="footer.about.lead" />{" "}
              <a href={t("footer.about.linkUrl")} target="_blank" rel="noopener noreferrer" className="underline">
                <Text k="footer.about.linkLabel" />
              </a>
              . <Text k="footer.about.funding" />
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
                      <Text k={link.key} />
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
                      <Text k={link.key} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="my-6 md:my-8 3xl:my-10"><DottedDivider /></div>

            {/* Connect + social */}
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-sm 3xl:text-base font-medium mb-2" style={{ color: "#38717A" }}>
                  <Text k="footer.connect.label" />
                </p>
                <p className="text-sm 3xl:text-base leading-relaxed" style={{ color: "#38717A" }}>
                  <Text k="footer.connect.text" />
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {socials.map(({ id, label, url }) => {
                  const Icon = SOCIAL_ICONS[id]
                  return (
                    <a
                      key={id}
                      href={url}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={label}
                      className="w-9 h-9 3xl:w-11 3xl:h-11 rounded-full flex items-center justify-center text-white hover:opacity-80 transition-all duration-200"
                      style={{ backgroundColor: "#38717A" }}
                    >
                      <Icon />
                    </a>
                  )
                })}
              </div>
            </div>

            <div className="my-6 md:my-8 3xl:my-10"><DottedDivider /></div>

            {/* Newsletter */}
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-sm 3xl:text-base font-medium text-primary mb-2">
                  <Text k="footer.newsletter.heading" />
                </p>
                {splitParagraphs(t("footer.newsletter.body")).map((para, i) => (
                  <p key={i} className="text-sm 3xl:text-base text-primary leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
              <NewsletterForm />
            </div>

            <div className="my-6 md:my-8 3xl:my-10"><DottedDivider /></div>

            {/* Copyright */}
            <div className="flex flex-col gap-1 pb-4 lg:pb-8 3xl:pb-10">
              <p className="text-sm 3xl:text-base text-primary">
                <Text k="footer.legal.copyright" />
              </p>
              <p className="text-sm 3xl:text-base text-primary">
                <Text k="footer.legal.creditLead" />{" "}
                <a
                  href={t("footer.legal.creditUrl")}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="underline hover:text-secondary-terra transition-colors"
                >
                  <Text k="footer.legal.creditLabel" />
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
