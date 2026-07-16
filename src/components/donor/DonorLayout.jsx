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
  Flag,
  ChevronRight,
} from "lucide-react"
import { clearDonorSession, getDonorUser } from "../../lib/donorAuth"
import { ConfirmProvider } from "../ui/ConfirmDialog"
import smallLogo from "../../assets/images/Homepage/smalllogo.png"

const NAV = [
  { to: "/donor", label: "Dashboard", mobileLabel: "Home", icon: LayoutDashboard, end: true },
  { to: "/donor/donations", label: "My Donations", mobileLabel: "Donations", icon: Heart },
  { to: "/donor/subscriptions", label: "Subscriptions", mobileLabel: "Recurring", icon: RefreshCw },
  { to: "/donor/receipts", label: "Receipts & Statements", mobileLabel: "Receipts", icon: FileText },
  { to: "/donor/campaigns", label: "My Campaigns", mobileLabel: "Campaigns", icon: Flag },
  { to: "/donor/campaign-request", label: "Request Campaign", mobileLabel: "Request", icon: Megaphone },
  { to: "/donor/profile", label: "Profile", mobileLabel: "Profile", icon: User },
]

// Per-page header copy, keyed by exact pathname
const PAGE_META = {
  "/donor": {
    eyebrow: "Overview",
    title: "Dashboard",
    subtitle: "A snapshot of your giving and impact with MIAA.",
  },
  "/donor/donations": {
    eyebrow: "History",
    title: "My Donations",
    subtitle: "Every contribution you've made, all in one place.",
  },
  "/donor/subscriptions": {
    eyebrow: "Recurring",
    title: "Subscriptions",
    subtitle: "Manage your recurring gifts and payment schedules.",
  },
  "/donor/receipts": {
    eyebrow: "Documents",
    title: "Receipts & Statements",
    subtitle: "Download receipts and annual tax statements.",
  },
  "/donor/campaigns": {
    eyebrow: "Fundraising",
    title: "My Campaigns",
    subtitle: "Track the campaigns you've proposed and their status.",
  },
  "/donor/campaign-request": {
    eyebrow: "Fundraising",
    title: "Request a Campaign",
    subtitle: "Propose a cause for MIAA to champion on your behalf.",
  },
  "/donor/profile": {
    eyebrow: "Account",
    title: "Profile",
    subtitle: "Update your personal details and preferences.",
  },
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 18) return "Good afternoon"
  return "Good evening"
}

function initialsOf(donor) {
  const a = (donor?.firstName || "").trim()
  const b = (donor?.lastName || "").trim()
  const chars = `${a.charAt(0)}${b.charAt(0)}`.trim()
  return (chars || donor?.email?.charAt(0) || "D").toUpperCase()
}

function DonorHeader({ meta, donor }) {
  const isDashboard = meta.title === "Dashboard"
  return (
    <header className="sticky top-14 md:top-0 z-20 border-b border-primary/10 bg-accent-cream/85 backdrop-blur-xl">
      <div className="max-w-[90rem] 2xl:max-w-[110rem] 3xl:max-w-[130rem] 4xl:max-w-[170rem] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 py-4 md:py-5">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-[0.5625rem] tracking-[0.22em] uppercase text-primary/40 mb-1.5">
              <span>Donor Portal</span>
              <ChevronRight className="w-3 h-3 flex-shrink-0" strokeWidth={2} />
              <span className="text-secondary-terra truncate">{meta.eyebrow}</span>
            </div>

            <h1
              className="text-2xl md:text-[1.75rem] leading-none text-primary tracking-tight truncate"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {isDashboard ? `${greeting()}, ${donor?.firstName || "there"}` : meta.title}
            </h1>
            <p className="mt-1.5 text-xs md:text-[0.8125rem] text-primary/50 truncate">
              {meta.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              to="/donate/checkout"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-secondary-terra hover:bg-secondary-rust text-white text-[0.625rem] tracking-[0.18em] uppercase font-semibold shadow-sm shadow-secondary-terra/30 transition-colors"
            >
              <Heart className="w-3.5 h-3.5" strokeWidth={2.25} />
              <span className="hidden md:inline">Donate</span>
            </Link>

            <div className="grid place-items-center w-10 h-10 rounded-full bg-bg-deep text-accent-cream text-xs font-semibold tracking-wide ring-2 ring-secondary-terra/30">
              {initialsOf(donor)}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

function NavItem({ item }) {
  return (
    <NavLink to={item.to} end={item.end} className="block group">
      {({ isActive }) => (
        <div
          className={`relative flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-md text-[0.8125rem] transition-colors duration-200 ${
            isActive
              ? "text-accent-cream"
              : "text-accent-cream/60 hover:text-accent-cream"
          }`}
        >
          {/* Active pill background */}
          {isActive && (
            <motion.span
              layoutId="donor-nav-pill"
              className="absolute inset-0 rounded-md bg-gradient-to-r from-secondary-terra/25 to-secondary-terra/5 ring-1 ring-inset ring-secondary-terra/25"
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
            />
          )}

          {/* Active accent bar */}
          {isActive && (
            <motion.span
              layoutId="donor-nav-bar"
              className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[0.1875rem] rounded-full bg-secondary-terra"
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
            />
          )}

          {/* Icon chip */}
          <span
            className={`relative z-10 grid place-items-center w-7 h-7 rounded-md transition-all duration-200 ${
              isActive
                ? "bg-secondary-terra text-white shadow-sm shadow-secondary-terra/40"
                : "bg-white/[0.04] text-accent-cream/70 group-hover:bg-white/[0.08] group-hover:text-accent-cream"
            }`}
          >
            <item.icon strokeWidth={1.9} className="w-[0.9375rem] h-[0.9375rem]" />
          </span>

          <span
            className={`relative z-10 tracking-wide transition-[font-weight] ${
              isActive ? "font-semibold" : "font-normal"
            }`}
          >
            {item.label}
          </span>
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

  const meta = PAGE_META[location.pathname] || {
    eyebrow: "Donor Portal",
    title: "My Account",
    subtitle: "Manage your giving with MIAA.",
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

        {/* Quick donate CTA */}
        <div className="pt-4 px-4">
          <Link
            to="/donate/checkout"
            onClick={() => setMobileOpen(false)}
            className="group/donate flex items-center justify-center gap-2 py-2.5 rounded-md text-[0.8125rem] font-semibold tracking-wide text-white bg-secondary-terra/90 hover:bg-secondary-terra shadow-sm shadow-secondary-terra/30 transition-colors"
          >
            <Gift className="w-4 h-4 transition-transform group-hover/donate:-rotate-12" strokeWidth={2} />
            <span>Make a Donation</span>
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
    <ConfirmProvider>
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
          <DonorHeader meta={meta} donor={donor} />
          <div className="max-w-[90rem] 2xl:max-w-[110rem] 3xl:max-w-[130rem] 4xl:max-w-[170rem] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 py-6 md:py-10 pb-24 md:pb-10">
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
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-9 h-[0.1875rem] bg-secondary-terra rounded-full"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span
                      className={`grid place-items-center w-8 h-8 rounded-lg transition-colors ${
                        isActive ? "bg-secondary-terra/15 text-secondary-terra" : ""
                      }`}
                    >
                      <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.1 : 1.5} />
                    </span>
                    <span
                      className={`text-[0.5rem] tracking-[0.1em] uppercase leading-none ${
                        isActive ? "font-semibold" : ""
                      }`}
                    >
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
    </ConfirmProvider>
  )
}
