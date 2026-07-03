import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import {
  LayoutDashboard,
  Heart,
  RefreshCw,
  FileText,
  User,
  LogOut,
} from "lucide-react"
import { clearDonorSession, getDonorUser } from "../../lib/donorAuth"

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
    <div className="min-h-screen bg-bg pt-20">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-10">
        {/* Top nav bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[0.625rem] tracking-[0.25em] uppercase text-secondary-terra font-semibold">
              Donor Portal
            </p>
            <p className="text-lg font-medium text-primary">
              Welcome, {donor?.firstName || "Donor"}
            </p>
          </div>
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-primary hover:bg-bg-deep text-white text-[0.625rem] tracking-[0.2em] uppercase transition-colors"
          >
            <LogOut className="w-3 h-3" /> Logout
          </button>
        </div>

        {/* Tab navigation */}
        <nav className="flex gap-1 mb-8 border-b border-primary/10 overflow-x-auto">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 text-[0.6875rem] tracking-[0.15em] uppercase whitespace-nowrap border-b-2 transition-colors ${
                  isActive
                    ? "border-secondary-terra text-secondary-terra"
                    : "border-transparent text-primary/50 hover:text-primary"
                }`
              }
            >
              <item.icon className="w-3.5 h-3.5" strokeWidth={1.75} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Content */}
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
    </div>
  )
}
