import { useEffect, useState } from "react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  LabelList,
} from "recharts"
import { CheckCircle2, ChevronLeft } from "lucide-react"
import { adminApi } from "../auth"
import Drawer from "../components/Drawer"
import RegistrationDetail from "../components/RegistrationDetail"

// Brand tokens
const TEAL = "#214952"
const TERRA = "#C15C45"
const LINE = "#E7E1DA"
const MUTED = "#7A8890"
const INK_SOFT = "#3C6470"

// Reserved status palette (always shown with a label, never colour-alone).
const STATUS = {
  succeeded: { label: "Paid", color: "#2E7D5B" },
  free: { label: "Free", color: "#2F72A4" },
  pending: { label: "Pending", color: "#B7791F" },
  failed: { label: "Failed", color: "#B4433A" },
  refunded: { label: "Refunded", color: "#8A97A0" },
}

const money = (cents) => `$${((cents || 0) / 100).toLocaleString("en-AU")}`
const fmtDay = (d) =>
  new Date(d).toLocaleDateString("en-AU", { day: "numeric", month: "short" })

function Kpi({ label, value, sub }) {
  return (
    <div className="rounded-sm border border-primary/10 bg-white p-4">
      <p className="text-[0.5625rem] tracking-[0.2em] uppercase text-primary/50">{label}</p>
      <p className="mt-1 text-xl font-semibold text-primary leading-none">{value}</p>
      {sub && <p className="text-[0.6875rem] text-primary/50 mt-1.5">{sub}</p>}
    </div>
  )
}

function ChartCard({ title, children }) {
  return (
    <div className="rounded-sm border border-primary/10 bg-white p-4">
      <p className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/55 mb-3">{title}</p>
      {children}
    </div>
  )
}

function ChartTooltip({ active, payload, label, valueFormatter }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-sm border border-primary/10 bg-white px-3 py-2 shadow-md">
      <p className="text-[0.6875rem] font-medium text-primary">{label}</p>
      <p className="text-[0.6875rem] text-primary/60">
        {valueFormatter ? valueFormatter(payload[0].value) : payload[0].value}
      </p>
    </div>
  )
}

export default function EventAnalyticsDrawer({ event, open, onClose }) {
  const [data, setData] = useState(null)
  const [attendees, setAttendees] = useState([])
  const [selectedReg, setSelectedReg] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!open || !event?._id) return
    let active = true
    const fetchData = async () => {
      setData(null)
      setAttendees([])
      setSelectedReg(null)
      setError("")
      setLoading(true)
      try {
        const [d, regs] = await Promise.all([
          adminApi.eventAnalytics(event._id),
          adminApi.listEventRegistrations({ event: event._id }),
        ])
        if (active) {
          setData(d)
          setAttendees(regs)
        }
      } catch (err) {
        if (active) setError(err.message)
      } finally {
        if (active) setLoading(false)
      }
    }
    fetchData()
    return () => {
      active = false
    }
  }, [open, event?._id])

  const t = data?.totals
  const paid = data?.event?.paymentRequired
  const metric = paid ? "revenue" : "quantity"
  const statusRows = data
    ? Object.entries(data.byStatus).map(([key, count]) => ({
        key,
        count,
        ...(STATUS[key] || { label: key, color: MUTED }),
      }))
    : []
  const statusMax = Math.max(1, ...statusRows.map((r) => r.count))
  const sortedAttendees = [...attendees].sort((a, b) =>
    (a.name || "").localeCompare(b.name || "")
  )

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Event Analytics"
      subtitle={event?.title || ""}
    >
      {loading ? (
        <p className="text-sm text-primary/50">Loading analytics…</p>
      ) : error ? (
        <p className="text-sm text-rose-600 bg-rose-50 px-3 py-2 rounded-sm">{error}</p>
      ) : selectedReg ? (
        <div>
          <button
            onClick={() => setSelectedReg(null)}
            className="inline-flex items-center gap-1 text-[0.6875rem] tracking-[0.15em] uppercase text-primary/60 hover:text-secondary-terra mb-4"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Back to analytics
          </button>
          <RegistrationDetail registration={selectedReg} />
        </div>
      ) : !data ? null : (
        <div className="flex flex-col gap-6">
          {/* KPI tiles */}
          <div className="grid grid-cols-2 gap-3">
            <Kpi
              label="Registrations"
              value={t.confirmed}
              sub={t.pending ? `${t.pending} pending` : "confirmed"}
            />
            <Kpi
              label="Seats"
              value={t.seats}
              sub={
                t.capacity > 0
                  ? `${t.remaining} left of ${t.capacity}`
                  : "no capacity limit"
              }
            />
            <Kpi label="Revenue" value={money(t.revenue)} sub={`${t.paidCount} paid`} />
            <Kpi label="Avg / paid" value={money(t.avg)} sub="per registration" />
          </div>

          {/* Capacity fill */}
          {t.capacity > 0 && (
            <div className="rounded-sm border border-primary/10 bg-white p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/55">
                  Capacity
                </p>
                <p className="text-sm font-semibold text-primary">{t.fillPct}%</p>
              </div>
              <div className="h-2.5 rounded-full bg-primary/10 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${t.fillPct}%`,
                    background: t.fillPct >= 100 ? "#2E7D5B" : TERRA,
                  }}
                />
              </div>
              <p className="text-[0.6875rem] text-primary/50 mt-1.5">
                {t.seats} of {t.capacity} seats filled
              </p>
            </div>
          )}

          {/* Checked-in */}
          {t.confirmed > 0 && (
            <div className="rounded-sm border border-primary/10 bg-white p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/55">
                  Checked in
                </p>
                <p className="text-sm font-semibold text-primary">{t.checkedInPct}%</p>
              </div>
              <div className="h-2.5 rounded-full bg-primary/10 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${t.checkedInPct}%`, background: "#2E7D5B" }}
                />
              </div>
              <p className="text-[0.6875rem] text-primary/50 mt-1.5">
                {t.checkedIn} of {t.confirmed} attendees checked in
              </p>
            </div>
          )}

          {/* Sales by ticket type */}
          {data.byTicketType.length > 0 && (
            <ChartCard title={paid ? "Revenue by ticket type" : "Seats by ticket type"}>
              <ResponsiveContainer
                width="100%"
                height={Math.max(120, data.byTicketType.length * 46)}
              >
                <BarChart
                  data={data.byTicketType}
                  layout="vertical"
                  margin={{ left: 0, right: 44, top: 4, bottom: 4 }}
                >
                  <CartesianGrid horizontal={false} stroke={LINE} />
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={92}
                    tick={{ fontSize: 11, fill: INK_SOFT }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(33,73,82,0.05)" }}
                    content={
                      <ChartTooltip
                        valueFormatter={(v) => (paid ? money(v) : `${v} seats`)}
                      />
                    }
                  />
                  <Bar dataKey={metric} fill={TERRA} radius={[0, 4, 4, 0]} barSize={16}>
                    <LabelList
                      dataKey={metric}
                      position="right"
                      formatter={(v) => (paid ? money(v) : v)}
                      style={{ fontSize: 11, fill: INK_SOFT, fontWeight: 600 }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          )}

          {/* Status breakdown */}
          {statusRows.length > 0 && (
            <ChartCard title="Registrations by status">
              <div className="flex flex-col gap-2.5">
                {statusRows.map((r) => (
                  <div key={r.key} className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 w-20 flex-shrink-0">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: r.color }}
                      />
                      <span className="text-[0.6875rem] text-primary/70">{r.label}</span>
                    </span>
                    <span className="flex-1 h-2 rounded-full bg-primary/8 overflow-hidden">
                      <span
                        className="block h-full rounded-full"
                        style={{
                          width: `${(r.count / statusMax) * 100}%`,
                          background: r.color,
                        }}
                      />
                    </span>
                    <span className="w-6 text-right text-xs font-semibold text-primary">
                      {r.count}
                    </span>
                  </div>
                ))}
              </div>
            </ChartCard>
          )}

          {/* Attendee roster */}
          {sortedAttendees.length > 0 && (
            <ChartCard title={`Attendees (${sortedAttendees.length})`}>
              <div className="flex items-center gap-3 pb-2 mb-1 border-b border-primary/10 text-[0.5625rem] tracking-[0.12em] uppercase text-primary/45">
                <span className="flex-1">Attendee</span>
                <span className="w-10 text-center shrink-0">Qty</span>
                <span className="w-16 text-right shrink-0">Price</span>
                <span className="w-16 text-center shrink-0 whitespace-nowrap">Check-in</span>
              </div>
              <div className="flex flex-col divide-y divide-primary/8 max-h-80 overflow-y-auto">
                {sortedAttendees.map((a) => (
                  <div
                    key={a._id}
                    onClick={() => setSelectedReg(a)}
                    className="flex items-center gap-3 py-2 px-2 -mx-2 rounded-sm cursor-pointer hover:bg-accent-cream/50 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-primary truncate">{a.name || "Guest"}</p>
                      <p className="text-[0.6875rem] text-primary/45 truncate">{a.email}</p>
                    </div>
                    <span className="w-10 text-center shrink-0 text-xs text-primary/70">
                      {a.quantity || 1}
                    </span>
                    <span className="w-16 text-right shrink-0 text-xs font-medium text-primary">
                      {a.amount ? money(a.amount) : "Free"}
                    </span>
                    <span className="w-16 shrink-0 flex justify-center">
                      {a.checkedIn ? (
                        <span className="inline-flex items-center gap-1 text-[0.5625rem] tracking-[0.1em] uppercase text-emerald-600 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> In
                        </span>
                      ) : (
                        <span className="text-primary/25">—</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </ChartCard>
          )}

          {/* Registrations over time */}
          {data.trend.length > 1 && (
            <ChartCard title="Registrations over time">
              <ResponsiveContainer width="100%" height={190}>
                <AreaChart data={data.trend} margin={{ left: -18, right: 8, top: 6, bottom: 0 }}>
                  <defs>
                    <linearGradient id="regTrend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={TEAL} stopOpacity={0.22} />
                      <stop offset="100%" stopColor={TEAL} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke={LINE} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={fmtDay}
                    tick={{ fontSize: 10, fill: MUTED }}
                    axisLine={false}
                    tickLine={false}
                    minTickGap={16}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 10, fill: MUTED }}
                    axisLine={false}
                    tickLine={false}
                    width={28}
                  />
                  <Tooltip
                    content={
                      <ChartTooltip valueFormatter={(v) => `${v} registration(s)`} />
                    }
                    labelFormatter={fmtDay}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke={TEAL}
                    strokeWidth={2}
                    fill="url(#regTrend)"
                    dot={{ r: 2, fill: TEAL }}
                    activeDot={{ r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          )}

          {/* Event donations */}
          <div className="rounded-sm border border-primary/10 bg-white p-4">
            <p className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/55 mb-2">
              Donations to this event
            </p>
            <div className="flex items-baseline gap-3">
              <p className="text-xl font-semibold text-primary">
                {money(data.donations.raised)}
              </p>
              <p className="text-[0.6875rem] text-primary/50">
                {data.donations.count} donation{data.donations.count === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          {t.registrations === 0 && (
            <p className="text-sm text-primary/50 text-center">
              No registrations yet — analytics will populate as people sign up.
            </p>
          )}
        </div>
      )}
    </Drawer>
  )
}
