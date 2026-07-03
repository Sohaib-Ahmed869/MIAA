import { NavLink, Outlet, useNavigate, Link, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import {
  LogOut,
  Calendar,
  Archive,
  Users,
  Inbox,
  Mail,
  LayoutDashboard,
  ExternalLink,
  FileText,
  Ticket,
  Heart,
  Target,
  RefreshCw,
  UserCheck,
  ScrollText,
  Settings,
} from "lucide-react"
import { clearSession, getAdminUser } from "../auth"
import { ToastProvider } from "./Toast"
import smallLogo from "../../assets/images/Homepage/smalllogo.png"
import Quatrefoil from "./Quatrefoil"

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/events", label: "Events", icon: Calendar },
  { to: "/admin/previous-events", label: "Previous Events", icon: Archive },
  { to: "/admin/team", label: "Team", icon: Users },
  { to: "/admin/blog", label: "Blog Posts", icon: FileText },
  { to: "/admin/contact", label: "Contact Submissions", icon: Inbox },
  { to: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { to: "/admin/event-lists", label: "Event Lists", icon: Ticket },
  { separator: true, label: "Donations" },
  { to: "/admin/donation-products", label: "Products", icon: Heart },
  { to: "/admin/donations", label: "Donations", icon: Target },
  { to: "/admin/campaigns", label: "Campaigns", icon: Target },
  { to: "/admin/donors", label: "Donors", icon: UserCheck },
  { to: "/admin/subscriptions", label: "Subscriptions", icon: RefreshCw },
  { to: "/admin/audit-log", label: "Audit Log", icon: ScrollText },
  { separator: true, label: "Settings" },
  { to: "/admin/settings", label: "Site Settings", icon: Settings },
]

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
          {/* Animated quatrefoil marker for active item */}
          <AnimatePresence>
            {isActive && (
              <motion.span
                layoutId="nav-marker"
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

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const admin = getAdminUser()

  const onLogout = () => {
    clearSession()
    navigate("/admin/login", { replace: true })
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-accent-cream text-primary">
        <div className="flex">
          {/* Sidebar — branded dark teal */}
          <aside className="fixed inset-y-0 left-0 w-64 bg-bg-deep text-accent-cream flex flex-col z-30">
            <div className="px-6 pt-7 pb-6">
              <Link to="/admin" className="flex items-center gap-3">
                <img src={smallLogo} alt="MIAA" className="h-8 w-auto" />
                
              </Link>
            </div>

            {/* Dotted divider */}
            <div className="mx-6">
              <div
                className="h-[0.125rem]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(215,184,147,0.35) 0.09375rem, transparent 0.09375rem)",
                  backgroundSize: "0.5rem 0.1875rem",
                }}
              />
            </div>

            <nav className="flex-1 py-5 px-3 flex flex-col gap-0.5 overflow-y-auto">
              {NAV.map((item, i) =>
                item.separator ? (
                  <div key={item.label} className="pt-4 pb-1.5 px-4">
                    <p className="text-[0.5625rem] tracking-[0.25em] uppercase text-accent-wheat/50">
                      {item.label}
                    </p>
                  </div>
                ) : (
                  <NavItem key={item.to} item={item} />
                )
              )}
            </nav>

            <div className="px-5 pb-6">
              <div
                className="h-[0.125rem] mb-5"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(215,184,147,0.3) 0.09375rem, transparent 0.09375rem)",
                  backgroundSize: "0.5rem 0.1875rem",
                }}
              />
              <p
                className="text-[0.625rem] tracking-[0.25em] uppercase text-accent-wheat mb-2"
              >
                Signed in
              </p>
              <p className="text-xs text-accent-cream/85 truncate mb-4">{admin?.email}</p>
              <div className="flex items-center gap-2">
                <Link
                  to="/"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex-1 inline-flex items-center justify-center gap-1.5 py-2 text-[0.625rem] tracking-[0.2em] uppercase text-accent-cream border border-accent-wheat/30 rounded-sm hover:border-accent-wheat transition-colors"
                >
                  <ExternalLink
                    className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
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
          </aside>

          {/* Content area */}
          <main className="ml-64 flex-1 min-h-screen">
            <div className="max-w-[75rem] mx-auto px-8 lg:px-12 py-10">
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
        </div>
      </div>
    </ToastProvider>
  )
}
