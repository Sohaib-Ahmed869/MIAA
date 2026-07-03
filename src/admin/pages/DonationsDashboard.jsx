import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  DollarSign,
  TrendingUp,
  Users,
  BarChart3,
  RefreshCw,
  ArrowUpRight,
  CreditCard,
  Heart,
} from "lucide-react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { adminApi } from "../auth"
import PageHeader from "../components/PageHeader"
import { SkeletonStatCards } from "../components/Skeleton"

const TERRA = "#C15C45"
const TEAL = "#214952"
const WHEAT = "#D7B893"
const SAGE = "#A3B8B9"
const WINE = "#7A3A42"
const CREAM = "#F3EFEB"
const COLORS = [TERRA, TEAL, WHEAT, WINE, SAGE, "#995A36"]

function AnimatedNumber({ value, prefix = "", suffix = "" }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    if (value == null) return
    const target = Number(value)
    if (Number.isNaN(target)) return
    const start = performance.now()
    const duration = 800
    let raf
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(target * eased))
      if (t < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [value])
  return (
    <span>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  )
}

function KPICard({ icon: Icon, label, value, prefix, suffix, to, delay = 0 }) {
  const inner = (
    <div className="flex flex-col h-full">
      <div className="flex items-start justify-between mb-5">
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-sm bg-accent-cream text-primary">
          <Icon className="w-[1.125rem] h-[1.125rem]" strokeWidth={1.75} />
        </span>
        {to && (
          <ArrowUpRight
            strokeWidth={2}
            className="w-3.5 h-3.5 text-primary/25 group-hover:text-secondary-terra transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        )}
      </div>
      <p
        className="text-[2.25rem] font-medium text-primary leading-none tracking-tight"
        style={{ fontFamily: "var(--font-display)" }}
      >
        <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
      </p>
      <p className="text-[0.6875rem] tracking-[0.18em] uppercase text-primary/50 mt-3">
        {label}
      </p>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {to ? (
        <Link
          to={to}
          className="group block bg-white border border-primary/10 rounded-sm p-6 hover:border-secondary-terra/50 hover:shadow-md transition-all duration-300 h-full"
        >
          {inner}
        </Link>
      ) : (
        <div className="bg-white border border-primary/10 rounded-sm p-6 h-full">
          {inner}
        </div>
      )}
    </motion.div>
  )
}

function ChartCard({ title, linkTo, linkLabel, delay = 0, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className="bg-white border border-primary/10 rounded-sm overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-primary/8 flex items-center justify-between">
        <p
          className="text-base text-primary tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </p>
        {linkTo && (
          <Link
            to={linkTo}
            className="group inline-flex items-center gap-1 text-[0.625rem] tracking-[0.2em] uppercase text-secondary-terra hover:text-secondary-rust transition-colors"
          >
            {linkLabel || "View all"}
            <ArrowUpRight
              strokeWidth={2.5}
              className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        )}
      </div>
      <div className="p-6">{children}</div>
    </motion.div>
  )
}

const customTooltipStyle = {
  backgroundColor: TEAL,
  border: "none",
  borderRadius: "2px",
  color: CREAM,
  fontSize: "0.75rem",
  padding: "8px 12px",
}

export default function DonationsDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let mounted = true
    setLoading(true)
    adminApi
      .getDonationStats()
      .then((data) => {
        if (mounted) setStats(data)
      })
      .catch((err) => {
        if (mounted) setError(err.message)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  // Transform monthly data for chart (reverse for chronological order)
  const monthlyData = (stats?.monthly || [])
    .slice()
    .reverse()
    .map((m) => ({
      month: m._id,
      label: new Date(m._id + "-01").toLocaleDateString("en-AU", {
        month: "short",
        year: "2-digit",
      }),
      total: m.total / 100,
      count: m.count,
    }))

  // Product breakdown for pie chart
  const productData = (stats?.byProduct || []).map((p) => ({
    name: p.product?.name || "Unallocated",
    value: p.total / 100,
    count: p.count,
  }))

  // Payment method breakdown
  const methodData = (stats?.byMethod || []).map((m) => ({
    name: m._id === "stripe" ? "Stripe" : m._id === "paypal" ? "PayPal" : m._id,
    value: m.total / 100,
    count: m.count,
  }))

  // Donation type breakdown
  const typeData = (stats?.byType || []).map((t) => ({
    name: t._id === "one-time" ? "One-time" : t._id === "recurring" ? "Recurring" : t._id,
    value: t.total / 100,
    count: t.count,
  }))

  return (
    <div>
      <PageHeader
        label="Donations"
        title="Donations Dashboard"
        subtitle="Key metrics, trends, and insights for your donation platform."
      />

      {error && <p className="text-rose-600 text-sm mb-4">{error}</p>}

      {loading ? (
        <SkeletonStatCards count={6} />
      ) : (
        <>
          {/* ── KPI Cards ──────────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <KPICard
              icon={DollarSign}
              label="Total Raised"
              value={(stats?.totalRaised || 0) / 100}
              prefix="$"
              to="/admin/donations"
              delay={0.05}
            />
            <KPICard
              icon={TrendingUp}
              label="Donations"
              value={stats?.donationCount || 0}
              to="/admin/donations"
              delay={0.1}
            />
            <KPICard
              icon={Users}
              label="Donors"
              value={stats?.donorCount || 0}
              to="/admin/donors"
              delay={0.15}
            />
            <KPICard
              icon={BarChart3}
              label="Avg. Donation"
              value={(stats?.averageDonation || 0) / 100}
              prefix="$"
              delay={0.2}
            />
            <KPICard
              icon={RefreshCw}
              label="Active Subscriptions"
              value={stats?.activeSubscriptions || 0}
              to="/admin/subscriptions"
              delay={0.25}
            />
            <KPICard
              icon={Heart}
              label="Products"
              value={productData.length}
              to="/admin/donation-products"
              delay={0.3}
            />
          </div>

          {/* ── Row 1: Revenue trend + Product breakdown ────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            <div className="lg:col-span-2">
              <ChartCard title="Monthly Revenue" linkTo="/admin/donations" delay={0.35}>
                {monthlyData.length === 0 ? (
                  <p className="text-sm text-primary/40 py-10 text-center">
                    No data yet
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={monthlyData}>
                      <defs>
                        <linearGradient id="gradTerra" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={TERRA} stopOpacity={0.25} />
                          <stop offset="95%" stopColor={TERRA} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#21495215"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="label"
                        tick={{ fontSize: 11, fill: "#21495280" }}
                        axisLine={{ stroke: "#21495215" }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: "#21495280" }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `$${v.toLocaleString()}`}
                      />
                      <Tooltip
                        contentStyle={customTooltipStyle}
                        formatter={(v) => [`$${Number(v).toLocaleString()}`, "Revenue"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="total"
                        stroke={TERRA}
                        strokeWidth={2.5}
                        fill="url(#gradTerra)"
                        dot={{ r: 4, fill: TERRA, strokeWidth: 0 }}
                        activeDot={{ r: 6, fill: TERRA, stroke: CREAM, strokeWidth: 2 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </ChartCard>
            </div>

            <ChartCard title="By Product" delay={0.4}>
              {productData.length === 0 ? (
                <p className="text-sm text-primary/40 py-10 text-center">
                  No data yet
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={productData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {productData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={customTooltipStyle}
                      formatter={(v) => [`$${Number(v).toLocaleString()}`, "Raised"]}
                    />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: "0.6875rem", color: "#21495280" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </ChartCard>
          </div>

          {/* ── Row 2: Donation count trend + Method + Type ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <ChartCard title="Donation Count by Month" delay={0.45}>
              {monthlyData.length === 0 ? (
                <p className="text-sm text-primary/40 py-10 text-center">
                  No data yet
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#21495215"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 10, fill: "#21495280" }}
                      axisLine={{ stroke: "#21495215" }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "#21495280" }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={customTooltipStyle}
                      formatter={(v) => [v, "Donations"]}
                    />
                    <Bar dataKey="count" fill={TEAL} radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            <ChartCard title="By Payment Method" delay={0.5}>
              {methodData.length === 0 ? (
                <p className="text-sm text-primary/40 py-10 text-center">
                  No data yet
                </p>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie
                        data={methodData}
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {methodData.map((_, i) => (
                          <Cell
                            key={i}
                            fill={i === 0 ? TERRA : TEAL}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={customTooltipStyle}
                        formatter={(v) => [`$${Number(v).toLocaleString()}`, ""]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-6 mt-2">
                    {methodData.map((m, i) => (
                      <div key={m.name} className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: i === 0 ? TERRA : TEAL }}
                        />
                        <span className="text-[0.6875rem] text-primary/60">
                          {m.name} ({m.count})
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </ChartCard>

            <ChartCard title="One-time vs Recurring" delay={0.55}>
              {typeData.length === 0 ? (
                <p className="text-sm text-primary/40 py-10 text-center">
                  No data yet
                </p>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie
                        data={typeData}
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {typeData.map((_, i) => (
                          <Cell
                            key={i}
                            fill={COLORS[i % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={customTooltipStyle}
                        formatter={(v) => [`$${Number(v).toLocaleString()}`, ""]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-6 mt-2">
                    {typeData.map((t, i) => (
                      <div key={t.name} className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: COLORS[i % COLORS.length] }}
                        />
                        <span className="text-[0.6875rem] text-primary/60">
                          {t.name} (${t.value.toLocaleString()})
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </ChartCard>
          </div>

          {/* ── Row 3: Recent donations ──────────────────────── */}
          <ChartCard
            title="Recent Donations"
            linkTo="/admin/donations"
            linkLabel="View all"
            delay={0.6}
          >
            {(stats?.recentDonations || []).length === 0 ? (
              <p className="text-sm text-primary/40 py-6 text-center">
                No donations yet
              </p>
            ) : (
              <ul className="divide-y divide-primary/6">
                {stats.recentDonations.map((d) => (
                  <li
                    key={d._id}
                    className="py-3 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-primary truncate">
                        {d.isAnonymous
                          ? "Anonymous"
                          : d.donorName ||
                            (d.donor
                              ? `${d.donor.firstName} ${d.donor.lastName}`
                              : "Guest")}
                      </p>
                      <p className="text-[0.6875rem] text-primary/50 truncate">
                        {d.product?.name || "General"} · {d.paymentMethod}
                      </p>
                    </div>
                    <p className="text-base font-medium text-primary whitespace-nowrap">
                      ${(d.amount / 100).toFixed(2)}
                    </p>
                    <span className="text-[0.6875rem] text-primary/40 whitespace-nowrap">
                      {new Date(d.createdAt).toLocaleDateString("en-AU", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </ChartCard>
        </>
      )}
    </div>
  )
}
