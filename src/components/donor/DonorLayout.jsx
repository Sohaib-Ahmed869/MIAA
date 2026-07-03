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
} from "lucide-react"
import { clearDonorSession, getDonorUser } from "../../lib/donorAuth"
import smallLogo from "../../assets/images/Homepage/smalllogo.png"

const NAV = [
  { to: "/donor", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/donor/donations", label: "My Donations", icon: Heart },
  { to: "/donor/subscriptions", label: "Subscriptions", icon: RefreshCw },
  { to: "/donor/receipts", label: "Receipts & Statements", icon: FileText },
  { to: "/donor/profile", label: "Profile", icon: User },
]

export default function DonorLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const donor = getDonorUser()

  const onLogout = () => {
    clearDonorSession()
    navigate("/donor/login", { replace: true })
  }

  return (
    <div className="min-h-screen bg-bg-deep">
      {/* ── Sticky header ──────────────────────────────────── */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-bg-deep/80 border-b border-white/8">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Left: logo + portal label */}
            <div className="flex items-center gap-4">
              <Link to="/">
                <img src={smallLogo} alt="MIAA" className="h-7 w-auto opacity-80 hover:opacity-100 transition-opacity" />
              </Link>
              <div className="hidden sm:block h-5 w-px bg-white/15" />
              <p className="hidden sm:block text-[0.5625rem] tracking-[0.25em] uppercase text-accent-wheat/70 font-semibold">
                Donor Portal
              </p>
            </div>

            {/* Right: quick donate + user + logout */}
            <div className="flex items-center gap-3">
              <Link
                to="/donate/checkout"
                className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 bg-secondary-terra/15 hover:bg-secondary-terra/25 text-secondary-terra text-[0.5625rem] tracking-[0.18em] uppercase font-semibold rounded-lg transition-colors"
              >
                <Gift className="w-3 h-3" strokeWidth={2} /> Donate
              </Link>
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg">
                <div className="w-7 h-7 rounded-full bg-secondary-terra/20 flex items-center justify-center">
                  <span className="text-[0.6875rem] font-semibold text-secondary-terra">
                    {(donor?.firstName || "D")[0]}
                  </span>
                </div>
                <span className="text-[0.75rem] text-accent-cream/80">
                  {donor?.firstName || "Donor"}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-accent-cream/50 hover:text-accent-cream hover:bg-white/8 text-[0.5625rem] tracking-[0.15em] uppercase transition-all"
              >
                <LogOut className="w-3 h-3" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Tab navigation bar ─────────────────────────────── */}
      <div className="sticky top-16 md:top-18 z-30 backdrop-blur-lg bg-bg-deep/60 border-b border-white/6">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
          <nav className="flex gap-0.5 overflow-x-auto no-scrollbar -mb-px">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `group flex items-center gap-2 px-5 py-3.5 text-[0.625rem] tracking-[0.18em] uppercase whitespace-nowrap border-b-2 transition-all duration-200 ${
                    isActive
                      ? "border-secondary-terra text-secondary-terra"
                      : "border-transparent text-accent-cream/40 hover:text-accent-cream/70"
                  }`
                }
              >
                <item.icon className="w-3.5 h-3.5" strokeWidth={1.75} />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Main content ───────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-8 md:py-10">
        {/* Glassmorphism content card */}
        <div className="bg-white/[0.04] backdrop-blur-sm border border-white/8 rounded-2xl p-6 md:p-8 lg:p-10 min-h-[60vh]">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer links */}
        <div className="flex items-center justify-between mt-6 px-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-[0.625rem] text-accent-cream/30 hover:text-accent-cream/60 transition-colors"
          >
            <ExternalLink className="w-3 h-3" /> MIAA Website
          </Link>
          <p className="text-[0.5625rem] text-accent-cream/20">
            Museum of Islamic Art Australia
          </p>
        </div>
      </main>
    </div>
  )
}
