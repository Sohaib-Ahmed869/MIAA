import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Users, Ticket, DollarSign, CheckCircle2 } from "lucide-react"
import { adminApi } from "../auth"
import PageHeader from "../components/PageHeader"
import Button from "../components/Button"
import Drawer from "../components/Drawer"
import EmptyState from "../components/EmptyState"
import { SkeletonCardGrid } from "../components/Skeleton"
import FilterTabs from "../components/FilterTabs"
import Dropdown from "../../components/ui/Dropdown"
import RegistrationDetail from "../components/RegistrationDetail"
import { useToast } from "../components/Toast"
import { useConfirm } from "../../components/ui/ConfirmDialog"

const STATUS_COLORS = {
  succeeded: "bg-emerald-500/90 text-white",
  free: "bg-sky-500/90 text-white",
  pending: "bg-amber-500/90 text-white",
  failed: "bg-rose-500/90 text-white",
  refunded: "bg-primary/60 text-white",
}

const money = (cents) => `$${((cents || 0) / 100).toFixed(2)}`

export default function EventRegistrationsAdmin() {
  const [rows, setRows] = useState([])
  const [events, setEvents] = useState([])
  const [status, setStatus] = useState("all")
  const [eventId, setEventId] = useState("")
  const [checkin, setCheckin] = useState("all")
  const [viewing, setViewing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { notify } = useToast()
  const confirm = useConfirm()

  const load = () => {
    const params = {}
    if (status !== "all") params.status = status
    if (eventId) params.event = eventId
    if (checkin !== "all") params.checkedIn = checkin === "in" ? "true" : "false"
    return adminApi
      .listEventRegistrations(params)
      .then((data) => {
        setRows(data)
        setError("")
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    let active = true
    const params = {}
    if (status !== "all") params.status = status
    if (eventId) params.event = eventId
    if (checkin !== "all") params.checkedIn = checkin === "in" ? "true" : "false"
    Promise.all([
      adminApi.listEventRegistrations(params),
      adminApi.listEvents(),
    ])
      .then(([regs, evs]) => {
        if (!active) return
        setRows(regs)
        setEvents(evs)
        setError("")
      })
      .catch((err) => {
        if (active) setError(err.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [status, eventId, checkin])

  const stats = useMemo(() => {
    const confirmed = rows.filter(
      (r) => r.paymentStatus === "succeeded" || r.paymentStatus === "free"
    )
    const seats = confirmed.reduce((s, r) => s + (r.quantity || 0), 0)
    const collected = rows
      .filter((r) => r.paymentStatus === "succeeded")
      .reduce((s, r) => s + (r.amount || 0), 0)
    return { registrations: rows.length, seats, collected }
  }, [rows])

  const markRefunded = async (reg) => {
    if (
      !(await confirm({
        title: "Mark this registration refunded?",
        message: "This updates the record only. Issue the actual refund in Stripe.",
        confirmLabel: "Mark refunded",
        danger: true,
      }))
    )
      return
    try {
      await adminApi.updateEventRegistration(reg._id, { paymentStatus: "refunded" })
      notify("Registration marked refunded")
      setViewing(null)
      load()
    } catch (err) {
      notify(err.message, "error")
    }
  }

  const statCards = [
    { label: "Registrations", value: stats.registrations, icon: Users },
    { label: "Seats", value: stats.seats, icon: Ticket },
    { label: "Collected", value: money(stats.collected), icon: DollarSign },
  ]

  return (
    <div>
      <PageHeader
        label="Registrations"
        title="Event Registrations"
        subtitle="Attendees who registered for events — free RSVPs and paid tickets."
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white border border-primary/10 rounded-sm p-5">
            <div className="flex items-center gap-2 mb-2">
              <s.icon className="w-4 h-4 text-secondary-terra" strokeWidth={1.75} />
              <span className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/55">
                {s.label}
              </span>
            </div>
            <p className="text-2xl font-medium text-primary">{s.value}</p>
          </div>
        ))}
      </div>

      {error && (
        <p className="text-sm text-rose-600 bg-rose-500/8 ring-1 ring-inset ring-rose-500/20 rounded-lg px-4 py-2.5 mb-4">
          {error}
        </p>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <FilterTabs
          value={status}
          onChange={setStatus}
          options={[
            { value: "all", label: "All" },
            { value: "succeeded", label: "Paid", dot: "bg-emerald-500" },
            { value: "free", label: "Free", dot: "bg-sky-500" },
            { value: "pending", label: "Pending", dot: "bg-amber-500" },
            { value: "refunded", label: "Refunded", dot: "bg-slate-400" },
          ]}
        />
        <div className="flex flex-wrap items-center gap-3">
          <Dropdown
            value={checkin}
            onChange={setCheckin}
            className="w-full sm:w-44"
            options={[
              { value: "all", label: "All check-in" },
              { value: "in", label: "Checked in", dot: "bg-emerald-500" },
              { value: "out", label: "Not checked in", dot: "bg-slate-300" },
            ]}
          />
          <Dropdown
            value={eventId}
            onChange={setEventId}
            placeholder="All events"
            className="w-full sm:w-56"
            options={[
              { value: "", label: "All events" },
              ...events.map((ev) => ({ value: ev._id, label: ev.title })),
            ]}
          />
        </div>
      </div>

      {loading ? (
        <SkeletonCardGrid count={6} />
      ) : rows.length === 0 ? (
        <EmptyState
          title="No registrations yet"
          hint="Registrations appear here once attendees sign up for an event."
        />
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.03 } } }}
          className="flex flex-col gap-2"
        >
          <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1.2fr)_4rem_5.5rem_6rem_5rem_5.5rem] gap-4 px-4 py-2 text-[0.625rem] tracking-[0.2em] uppercase text-primary/50">
            <span>Attendee</span>
            <span>Event</span>
            <span className="text-center">Tickets</span>
            <span className="text-right">Amount</span>
            <span className="text-center">Status</span>
            <span className="text-center">Check-in</span>
            <span className="text-right">Date</span>
          </div>
          {rows.map((r) => (
            <motion.div
              key={r._id}
              variants={{ hidden: { opacity: 0, y: 5 }, visible: { opacity: 1, y: 0 } }}
              onClick={() => setViewing(r)}
              className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1.2fr)_4rem_5.5rem_6rem_5rem_5.5rem] gap-4 items-center px-4 py-3 bg-white border border-primary/8 rounded-sm hover:border-secondary-terra/40 hover:shadow-sm transition-all cursor-pointer"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-primary truncate">
                  {r.name || "Guest"}
                </p>
                <p className="text-[0.6875rem] text-primary/50 truncate">
                  {r.email || "—"}
                </p>
              </div>
              <p className="text-sm text-primary truncate">{r.event?.title || "—"}</p>
              <p className="text-sm text-primary text-center">{r.quantity || 1}</p>
              <p className="text-sm font-medium text-primary text-right">
                {r.amount ? money(r.amount) : "Free"}
              </p>
              <span
                className={`justify-self-center text-[0.5625rem] tracking-[0.2em] uppercase px-2 py-1 rounded-sm text-center ${
                  STATUS_COLORS[r.paymentStatus] || "bg-primary/20 text-primary"
                }`}
              >
                {r.paymentStatus}
              </span>
              <span
                className="justify-self-center"
                title={
                  r.checkedIn && r.checkedInAt
                    ? `Checked in ${new Date(r.checkedInAt).toLocaleString("en-AU")}`
                    : "Not checked in"
                }
              >
                {r.checkedIn ? (
                  <span className="inline-flex items-center gap-1 text-[0.5625rem] tracking-[0.15em] uppercase text-emerald-600 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> In
                  </span>
                ) : (
                  <span className="text-primary/25">—</span>
                )}
              </span>
              <span className="text-[0.6875rem] text-primary/50 text-right">
                {new Date(r.createdAt).toLocaleDateString("en-AU")}
              </span>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Detail drawer */}
      <Drawer
        open={viewing !== null}
        onClose={() => setViewing(null)}
        title="Registration Detail"
        subtitle={viewing?.registrationNumber || ""}
        footer={
          viewing?.paymentStatus === "succeeded" ? (
            <Button variant="ghost" onClick={() => markRefunded(viewing)}>
              Mark refunded
            </Button>
          ) : null
        }
      >
        {viewing && <RegistrationDetail registration={viewing} />}
      </Drawer>
    </div>
  )
}
