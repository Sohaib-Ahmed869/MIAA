import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ArrowUpRight } from "lucide-react"
import CTAButton from "../ui/Button"
import { NAV_LINKS } from "../../lib/constants"
import smallLogo from "../../assets/images/Homepage/smalllogo.png"
import topRightSpheres from "../../assets/images/Homepage/herotoprightelement.png"

const MotionLink = motion.create(Link)

const SOCIALS = [
  { label: "Tiktok", url: "#" },
  { label: "Twitter/X", url: "#" },
  { label: "Facebook", url: "https://www.facebook.com/" },
  { label: "YouTube", url: "https://www.youtube.com/" },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  return (
    <>
      {/* Dotted divider at bottom of nav area */}
      <div
        className="absolute top-20 md:top-24 3xl:top-28 left-6 md:left-10 lg:left-16 3xl:left-24 right-4 sm:right-6 md:right-10 lg:right-16 3xl:right-24 h-[2px] z-40 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #6CA1AA50 0.09375rem, transparent 0.09375rem)",
          backgroundSize: "0.5rem 0.1875rem",
        }}
      />

      {/* Top-of-page CTAs (Gala + Follow) — absolute so they scroll away with the page */}
      <div className="absolute top-0 right-0 z-40 px-4 sm:px-6 md:px-10 lg:px-16 3xl:px-24 pointer-events-none">
        <div className="flex items-center justify-end h-20 md:h-24 3xl:h-28 gap-3 md:gap-5">
          {!location.pathname.startsWith("/gala-dinner") && (
            <MotionLink
              to="/gala-dinner"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="group pointer-events-auto hidden lg:inline-flex items-center gap-1.5 3xl:gap-1.5 px-4 py-3 3xl:px-4 3xl:py-2.5 bg-white/15 backdrop-blur-sm text-white font-barlow text-[0.6875rem] 3xl:text-[0.6875rem] font-semibold tracking-[0.15em] uppercase rounded-sm overflow-hidden relative transition-colors duration-200 border border-white/20"
            >
              <span className="relative z-10 inline-block" style={{ transform: "scaleY(1.15)", transformOrigin: "center" }}>Gala Dinner</span>
              <span className="relative z-10 inline-flex overflow-hidden w-[13px] h-[13px] 3xl:w-4 3xl:h-4">
                <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.5} className="absolute inset-0 w-full h-full transition-transform duration-300 ease-out group-hover:translate-x-full group-hover:-translate-y-full" />
                <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.5} className="absolute inset-0 w-full h-full -translate-x-full translate-y-full transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0" />
              </span>
              <span className="absolute inset-0 bg-primary/80 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
            </MotionLink>
          )}
          <CTAButton to="/support-us" className="pointer-events-auto !hidden lg:!inline-flex !px-4 !py-3 3xl:!px-4 3xl:!py-2.5 !text-[0.6875rem] 3xl:!text-[0.6875rem]">
            Support Us
          </CTAButton>
          <CTAButton to="/donate" className="pointer-events-auto !hidden lg:!inline-flex !px-4 !py-3 3xl:!px-4 3xl:!py-2.5 !text-[0.6875rem] 3xl:!text-[0.6875rem]">
            Donate
          </CTAButton>
          {/* Reserve the hamburger slot here so the CTAs sit left of it at the top of the page */}
          <span className="w-[80px] h-[48px] 3xl:w-28 3xl:h-16" aria-hidden="true" />
        </div>
      </div>

      {/* Hamburger — always sticky, sits in the same top-right corner */}
      <div className="fixed top-0 right-0 z-50 px-4 sm:px-6 md:px-10 lg:px-16 3xl:px-24">
        <div className="flex items-center justify-end h-20 md:h-24 3xl:h-28">
          <button
            onClick={() => setMenuOpen(true)}
            className="bg-accent-cream rounded-xl px-7 py-3 3xl:px-9 3xl:py-2.5 shadow-md hover:bg-white transition-colors"
            aria-label="Open menu"
          >
            <svg
              width="34"
              height="14"
              viewBox="0 0 34 14"
              fill="none"
              aria-hidden="true"
              className="3xl:w-10 3xl:h-5"
            >
              <rect x="0" y="1" width="34" height="3" rx="1.5" fill="#C15C45" />
              <rect x="0" y="10" width="34" height="3" rx="1.5" fill="#C15C45" />
            </svg>
          </button>
        </div>
      </div>

      {/* Full-screen overlay nav */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-bg-deep overflow-y-auto overflow-x-hidden"
          >
            {/* Spheres ornament — top right decorative */}
            <div className="absolute top-0 right-0 w-[35%] md:w-[30%] lg:w-[24%] max-h-[50%] pointer-events-none">
              <img
                src={topRightSpheres}
                alt=""
                className="w-full h-auto opacity-90"
              />
            </div>

            {/* Top bar — logo left + CTA & close right */}
            <div className="relative z-10 w-full px-4 sm:px-6 md:px-10 lg:px-16 3xl:px-24">
              <div className="flex items-center justify-between h-20 md:h-24 3xl:h-28">
                <Link to="/" onClick={() => setMenuOpen(false)}>
                  <img
                    src={smallLogo}
                    alt="MIAA"
                    className="h-auto"
                    style={{ width: "clamp(60px, 5vw, 200px)" }}
                  />
                </Link>

                <div className="flex items-center gap-3">
                  <CTAButton to="/support-us" onClick={() => setMenuOpen(false)} className="!hidden lg:!inline-flex !px-4 !py-3 3xl:!px-4 3xl:!py-2.5 !text-[0.6875rem] 3xl:!text-[0.6875rem]">
                    Support Us
                  </CTAButton>
                  <CTAButton to="/donate" onClick={() => setMenuOpen(false)} className="!hidden lg:!inline-flex !px-4 !py-3 3xl:!px-4 3xl:!py-2.5 !text-[0.6875rem] 3xl:!text-[0.6875rem]">
                    Donate
                  </CTAButton>
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="bg-accent-cream rounded-xl px-7 py-3 3xl:px-9 3xl:py-2.5 shadow-md hover:bg-white transition-colors"
                    aria-label="Close menu"
                  >
                    <svg
                      width="34"
                      height="14"
                      viewBox="0 0 34 14"
                      fill="none"
                      aria-hidden="true"
                      className="3xl:w-10 3xl:h-5"
                    >
                      <line
                        x1="2"
                        y1="2"
                        x2="32"
                        y2="12"
                        stroke="#C15C45"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <line
                        x1="2"
                        y1="12"
                        x2="32"
                        y2="2"
                        stroke="#C15C45"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Dotted divider line */}
            <div
              className="relative z-10 mx-4 sm:mx-6 md:mx-10 lg:mx-16 3xl:mx-24 h-[2px] 3xl:h-[3px]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(255,255,255,0.25) 0.09375rem, transparent 0.09375rem)",
                backgroundSize: "0.5rem 0.1875rem",
              }}
            />

            {/* Body — nav links left, socials right */}
            <div className="relative z-10 w-full px-4 sm:px-6 md:px-10 lg:px-16 3xl:px-24 pt-10 md:pt-14 3xl:pt-16">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10">
                {/* Left column — nav links + donor portal */}
                <div className="flex flex-col">
                <nav className="flex flex-col">
                  {NAV_LINKS.map((link, i) => {
                    const isActive = location.pathname === link.path
                    return (
                      <motion.div
                        key={link.path}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.05 * i }}
                      >
                        <motion.div
                          whileHover={{ x: 12 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <Link
                            to={link.path}
                            onClick={() => setMenuOpen(false)}
                            className={`nav-link group relative flex items-center gap-3 py-1.5 md:py-2.5 text-xl sm:text-2xl md:text-3xl lg:text-[2.125rem] 3xl:text-[2.625rem] font-normal tracking-tight transition-colors duration-200 ${
                              isActive
                                ? "text-secondary-terra"
                                : "text-white/85 hover:text-secondary-terra"
                            }`}
                          >
                            {/* Quatrefoil marker — visible on hover or when active */}
                            <span
                              className={`flex-shrink-0 transition-opacity duration-200 ${
                                isActive
                                  ? "opacity-100"
                                  : "opacity-0 group-hover:opacity-100"
                              }`}
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 100 100"
                                fill="#C15C45"
                                className="3xl:w-5 3xl:h-5"
                              >
                                <circle cx="50" cy="22" r="25" />
                                <circle cx="50" cy="78" r="25" />
                                <circle cx="22" cy="50" r="25" />
                                <circle cx="78" cy="50" r="25" />
                                <rect
                                  x="22"
                                  y="22"
                                  width="56"
                                  height="56"
                                  rx="4"
                                />
                              </svg>
                            </span>
                            {link.label}
                          </Link>
                        </motion.div>
                      </motion.div>
                    )
                  })}
                </nav>

                {/* Donor portal link — styled identically to the main nav items */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * NAV_LINKS.length + 0.15 }}
                >
                  <motion.div
                    whileHover={{ x: 12 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Link
                      to="/donor/login"
                      onClick={() => setMenuOpen(false)}
                      className={`nav-link group relative flex items-center gap-3 py-1.5 md:py-2.5 text-xl sm:text-2xl md:text-3xl lg:text-[2.125rem] 3xl:text-[2.625rem] font-normal tracking-tight transition-colors duration-200 ${
                        location.pathname === "/donor/login"
                          ? "text-secondary-terra"
                          : "text-white/85 hover:text-secondary-terra"
                      }`}
                    >
                      {/* Quatrefoil marker — visible on hover or when active */}
                      <span
                        className={`flex-shrink-0 transition-opacity duration-200 ${
                          location.pathname === "/donor/login"
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100"
                        }`}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 100 100"
                          fill="#C15C45"
                          className="3xl:w-5 3xl:h-5"
                        >
                          <circle cx="50" cy="22" r="25" />
                          <circle cx="50" cy="78" r="25" />
                          <circle cx="22" cy="50" r="25" />
                          <circle cx="78" cy="50" r="25" />
                          <rect x="22" y="22" width="56" height="56" rx="4" />
                        </svg>
                      </span>
                      Donor Portal
                    </Link>
                  </motion.div>
                </motion.div>
                </div>

                {/* Social links — text only, right aligned */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="hidden md:flex flex-col items-end gap-2 self-center pr-2 lg:pr-6"
                >
                  {SOCIALS.map((s) => (
                    <a
                      key={s.label}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-sm md:text-[0.9375rem] 3xl:text-lg text-white/85 hover:text-accent-wheat transition-colors"
                    >
                      {s.label}
                    </a>
                  ))}
                </motion.div>
              </div>

              {/* Socials — mobile (inline below nav) */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="md:hidden mt-10 flex flex-wrap gap-x-5 gap-y-2"
              >
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-sm text-white/85 hover:text-accent-wheat transition-colors"
                  >
                    {s.label}
                  </a>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
