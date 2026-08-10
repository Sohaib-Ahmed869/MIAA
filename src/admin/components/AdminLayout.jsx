import { useEffect, useState } from "react"
import { NavLink, Outlet, useNavigate, Link, useLocation, Navigate } from "react-router-dom"
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
  Award,
  Heart,
  Target,
  RefreshCw,
  UserCheck,
  UserCog,
  HeartHandshake,
  ScrollText,
  Settings,
  BarChart3,
  Megaphone,
  ClipboardList,
  ScanLine,
  Menu,
  X,
  Type,
} from "lucide-react"
import { clearSession, getAdminUser, adminApi } from "../auth"
import { ToastProvider } from "./Toast"
import { ConfirmProvider } from "../../components/ui/ConfirmDialog"
import smallLogo from "../../assets/images/Homepage/smalllogo.png"
import Quatrefoil from "./Quatrefoil"

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/events", label: "Events", icon: Calendar },
  { to: "/admin/event-registrations", label: "Registrations", icon: ClipboardList },
  { to: "/admin/event-checkin", label: "Door Check-in", icon: ScanLine },
  { to: "/admin/previous-events", label: "Previous Events", icon: Archive },
  { to: "/admin/team", label: "Team", icon: Users },
  { to: "/admin/blog", label: "Blog Posts", icon: FileText },
  { to: "/admin/sponsors", label: "Sponsors", icon: Award },
  { to: "/admin/contact", label: "Contact Submissions", icon: Inbox },
  { to: "/admin/volunteer-applications", label: "Volunteer Applications", icon: HeartHandshake },
  { to: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { to: "/admin/event-lists", label: "Event Lists", icon: Ticket },
  { separator: true, label: "Donations" },
  { to: "/admin/donations-dashboard", label: "Dashboard", icon: BarChart3 },
  { to: "/admin/donation-products", label: "Products", icon: Heart },
  { to: "/admin/donations", label: "Donations", icon: Target },
  { to: "/admin/campaigns", label: "Campaigns", icon: Target },
  { to: "/admin/campaign-requests", label: "Campaign Requests", icon: Megaphone, badgeKey: "campaignRequests" },
  { to: "/admin/donors", label: "Donors", icon: UserCheck },
  { to: "/admin/subscriptions", label: "Subscriptions", icon: RefreshCw },
  { to: "/admin/audit-log", label: "Audit Log", icon: ScrollText },
  { separator: true, label: "Settings" },
  { to: "/admin/content", label: "Site Content", icon: Type },
  { to: "/admin/settings", label: "Site Settings", icon: Settings },
  { to: "/admin/staff", label: "Staff & Volunteers", icon: UserCog },
]

function NavItem({ item, badge = 0, onNavigate }) {
  return (
    <NavLink to={item.to} end={item.end} onClick={onNavigate} className="block">
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
          {badge > 0 && (
            <motion.span
              key={badge}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className="ml-auto min-w-[1.25rem] h-5 px-1.5 inline-flex items-center justify-center rounded-full bg-secondary-terra text-white text-[0.625rem] font-bold leading-none"
            >
              {badge > 99 ? "99+" : badge}
            </motion.span>
          )}
        </div>
      )}
    </NavLink>
  )
}

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const admin = getAdminUser()
  // Volunteers get a stripped-down CMS: only the Door Check-in screen, nothing
  // else in the nav, and any other admin URL bounces them back to check-in.
  const isVolunteer = admin?.role === "volunteer"
  const CHECKIN_PATH = "/admin/event-checkin"
  const navItems = isVolunteer ? NAV.filter((i) => i.to === CHECKIN_PATH) : NAV
  const [pendingRequests, setPendingRequests] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  // Lock body scroll + allow Escape-to-close while the mobile drawer is open.
  useEffect(() => {
    if (!sidebarOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (e) => {
      if (e.key === "Escape") setSidebarOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener("keydown", onKey)
    }
  }, [sidebarOpen])

  // Live count of pending campaign requests for the nav badge. Refetches on
  // navigation and when the requests page signals a change.
  useEffect(() => {
    if (isVolunteer) return // volunteers can't read campaign requests
    let alive = true
    const fetchCount = () => {
      adminApi
        .campaignRequestsCount()
        .then((d) => {
          if (alive) setPendingRequests(d?.pending || 0)
        })
        .catch(() => {})
    }
    fetchCount()
    window.addEventListener("miaa:campaign-requests-changed", fetchCount)
    return () => {
      alive = false
      window.removeEventListener("miaa:campaign-requests-changed", fetchCount)
    }
  }, [location.pathname, isVolunteer])

  const badgeFor = (item) =>
    item.badgeKey === "campaignRequests" ? pendingRequests : 0

  const onLogout = () => {
    clearSession()
    navigate("/admin/login", { replace: true })
  }

  // Keep volunteers on the check-in screen — they may not view any other page.
  if (isVolunteer && location.pathname !== CHECKIN_PATH) {
    return <Navigate to={CHECKIN_PATH} replace />
  }

  return (
    <ToastProvider>
      <ConfirmProvider>
      <div className="min-h-screen bg-accent-cream text-primary">
        {/* Mobile top bar — hamburger + logo, hidden on large screens */}
        <header className="lg:hidden fixed top-0 inset-x-0 h-14 bg-bg-deep text-accent-cream flex items-center gap-3 px-4 z-40">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            aria-expanded={sidebarOpen}
            className="p-2 -ml-2 rounded-sm text-accent-cream/80 hover:text-accent-cream hover:bg-white/5 transition-colors"
          >
            <Menu strokeWidth={1.75} className="w-5 h-5" />
          </button>
          <Link to="/admin" className="flex items-center gap-2">
            <img src={smallLogo} alt="MIAA" className="max-h-7 w-auto object-contain" />
          </Link>
        </header>

        {/* Backdrop — only on mobile while the drawer is open */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />
          )}
        </AnimatePresence>

        <div className="flex">
          {/* Sidebar — branded dark teal. Fixed on lg+, slide-in drawer below. */}
          <aside
            className={`fixed inset-y-0 left-0 w-64 max-w-[85vw] bg-bg-deep text-accent-cream flex flex-col z-50 transition-transform duration-300 ease-in-out lg:z-30 lg:translate-x-0 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="px-6 pt-7 pb-6 flex items-center justify-between">
              <Link to="/admin" className="flex items-center gap-3">
                <img src={smallLogo} alt="MIAA" className="h-8 w-auto" />
              </Link>
              {/* Close button — mobile drawer only */}
              <button
                onClick={() => setSidebarOpen(false)}
                aria-label="Close menu"
                className="lg:hidden p-2 -mr-2 rounded-sm text-accent-cream/70 hover:text-accent-cream hover:bg-white/5 transition-colors"
              >
                <X strokeWidth={1.75} className="w-5 h-5" />
              </button>
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
              {navItems.map((item) =>
                item.separator ? (
                  <div key={item.label} className="pt-4 pb-1.5 px-4">
                    <p className="text-[0.5625rem] tracking-[0.25em] uppercase text-accent-wheat/50">
                      {item.label}
                    </p>
                  </div>
                ) : (
                  <NavItem
                    key={item.to}
                    item={item}
                    badge={badgeFor(item)}
                    onNavigate={() => setSidebarOpen(false)}
                  />
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
          <main className="lg:ml-64 flex-1 min-h-screen w-full min-w-0">
            <div className="max-w-[90rem] 2xl:max-w-[110rem] 3xl:max-w-[130rem] 4xl:max-w-[170rem] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 pt-20 lg:pt-10 pb-10">
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
      </ConfirmProvider>
    </ToastProvider>
  )
}
