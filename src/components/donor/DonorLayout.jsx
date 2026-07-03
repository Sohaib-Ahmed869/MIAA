import { useState } from "react"
import { NavLink, Outlet, useNavigate, Link, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import {
  LayoutDashboard,
  Heart,
  RefreshCw,
  FileText,
  User,
  LogOut,
  ExternalLink,
  Gift,
  Menu,
  X,
  Megaphone,
} from "lucide-react"
import { clearDonorSession, getDonorUser } from "../../lib/donorAuth"
import smallLogo from "../../assets/images/Homepage/smalllogo.png"

const NAV = [
  { to: "/donor", label: "Dashboard", mobileLabel: "Home", icon: LayoutDashboard, end: true },
  { to: "/donor/donations", label: "My Donations", mobileLabel: "Donations", icon: Heart },
  { to: "/donor/subscriptions", label: "Subscriptions", mobileLabel: "Recurring", icon: RefreshCw },
  { to: "/donor/receipts", label: "Receipts & Statements", mobileLabel: "Receipts", icon: FileText },
  { to: "/donor/campaign-request", label: "Request Campaign", mobileLabel: "Campaign", icon: Megaphone },
  { to: "/donor/profile", label: "Profile", mobileLabel: "Profile", icon: User },
]

function Quatrefoil({ className = "" }) {
  return (
    <svg
      width={10}
      height={10}
      viewBox="0 0 100 100"
      fill="#C15C45"
      className={`flex-shrink-0 ${className}`}
    >
      <circle cx="50" cy="22" r="25" />
      <circle cx="50" cy="78" r="25" />
      <circle cx="22" cy="50" r="25" />
      <circle cx="78" cy="50" r="25" />
      <rect x="22" y="22" width="56" height="56" rx="4" />
    </svg>
  )
}

function NavItem({ item }) {
  return (
    <NavLink to={item.to} end={item.end} className="block">
      {({ isActive }) => (
        <div
          className={`relative flex items-center gap-3 px-4 py-2.5 rounded-sm text-[0.8125rem] transition-colors duration-200 ${
            isActive
              ? "text-secondary-terra"
              : "text-accent-cream/70 hover:text-accent-cream"
          }`}
        >
          <AnimatePresence>
            {isActive && (
              <motion.span
                layoutId="donor-nav-marker"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                className="absolute -left-1"
              >
                <Quatrefoil className="w-2.5 h-2.5" />
              </motion.span>
            )}
          </AnimatePresence>
          <item.icon strokeWidth={1.75} className="w-4 h-4" />
          <span className="tracking-wide">{item.label}</span>
        </div>
      )}
    </NavLink>
  )
}

function DottedDivider() {
  return (
    <div
      className="h-[0.125rem]"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(215,184,147,0.35) 0.09375rem, transparent 0.09375rem)",
        backgroundSize: "0.5rem 0.1875rem",
      }}
    />
  )
}

export default function DonorLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const donor = getDonorUser()
  const [mobileOpen, setMobileOpen] = useState(false)

  const onLogout = () => {
    clearDonorSession()
    navigate("/donor/login", { replace: true })
  }

  const sidebar = (
    <>
      <div className="px-6 pt-7 pb-6">
        <Link to="/donor" className="flex items-center gap-3">
          <img src={smallLogo} alt="MIAA" className="h-8 w-auto" />
        </Link>
      </div>

      {/* Dotted divider */}
      <div className="mx-6">
        <DottedDivider />
      </div>

      {/* Portal label */}
      <div className="px-6 pt-4 pb-2">
        <p className="text-[0.5625rem] tracking-[0.25em] uppercase text-accent-wheat/50">
          Donor Portal
        </p>
      </div>

      <nav className="flex-1 py-2 px-3 flex flex-col gap-0.5 overflow-y-auto">
        {NAV.map((item) => (
          <div key={item.to} onClick={() => setMobileOpen(false)}>
            <NavItem item={item} />
          </div>
        ))}

        {/* Quick donate link */}
        <div className="pt-4 px-4">
          <Link
            to="/donate/checkout"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 text-[0.8125rem] text-accent-cream/50 hover:text-secondary-terra transition-colors"
          >
            <Gift className="w-4 h-4" strokeWidth={1.75} />
            <span className="tracking-wide">Make a Donation</span>
          </Link>
        </div>
      </nav>

      <div className="px-5 pb-6">
        <DottedDivider />
        <div className="mt-5">
          <p className="text-[0.625rem] tracking-[0.25em] uppercase text-accent-wheat mb-2">
            Signed in
          </p>
          <p className="text-xs text-accent-cream/85 truncate mb-1">
            {donor?.firstName} {donor?.lastName}
          </p>
          <p className="text-[0.625rem] text-accent-cream/50 truncate mb-4">
            {donor?.email}
          </p>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="group flex-1 inline-flex items-center justify-center gap-1.5 py-2 text-[0.625rem] tracking-[0.2em] uppercase text-accent-cream border border-accent-wheat/30 rounded-sm hover:border-accent-wheat transition-colors"
            >
              <ExternalLink className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              Site
            </Link>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm bg-secondary-terra hover:bg-secondary-rust text-white text-[0.625rem] tracking-[0.2em] uppercase transition-colors"
            >
              <LogOut className="w-3 h-3" /> Logout
            </button>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-accent-cream text-primary">
      <div className="flex">
        {/* ── Desktop sidebar ──────────────────────────────── */}
        <aside className="hidden md:flex fixed inset-y-0 left-0 w-64 bg-bg-deep text-accent-cream flex-col z-30">
          {sidebar}
        </aside>

        {/* ── Mobile header ────────────────────────────────── */}
        <header className="md:hidden fixed top-0 inset-x-0 z-40 bg-bg-deep/95 backdrop-blur-xl border-b border-white/8">
          <div className="flex items-center justify-between h-14 px-4">
            <Link to="/donor" className="flex items-center gap-2.5">
              <img src={smallLogo} alt="MIAA" className="h-6 w-auto" />
              <span className="text-[0.5625rem] tracking-[0.2em] uppercase text-accent-wheat/70 font-semibold">
                Donor
              </span>
            </Link>
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 text-accent-cream/70 hover:text-accent-cream transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* ── Mobile sidebar overlay ───────────────────────── */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden fixed inset-0 z-40 bg-black/50"
                onClick={() => setMobileOpen(false)}
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="md:hidden fixed inset-y-0 left-0 w-72 bg-bg-deep text-accent-cream flex flex-col z-50"
              >
                {/* Close button */}
                <button
                  onClick={() => setMobileOpen(false)}
                  className="absolute top-5 right-4 p-1 text-accent-cream/50 hover:text-accent-cream transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                {sidebar}
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* ── Content area ─────────────────────────────────── */}
        <main className="md:ml-64 flex-1 min-h-screen pt-14 md:pt-0">
          <div className="max-w-[75rem] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* ── Mobile bottom tab bar ────────────────────────── */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-bg-deep/95 backdrop-blur-xl border-t border-white/10 safe-area-pb">
          <div className="flex items-stretch">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex-1 flex flex-col items-center justify-center gap-1 py-2.5 transition-colors relative ${
                    isActive
                      ? "text-secondary-terra"
                      : "text-accent-cream/35 active:text-accent-cream/60"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="donor-mobile-tab"
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-secondary-terra rounded-full"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <item.icon className="w-5 h-5" strokeWidth={isActive ? 2 : 1.5} />
                    <span className="text-[0.5rem] tracking-[0.1em] uppercase leading-none">
                      {item.mobileLabel}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  )
}
